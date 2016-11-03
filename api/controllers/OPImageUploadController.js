/**
 * OPImageUploadController
 *
 * @description :: Server-side logic for managing Opconfigareas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var path = require('path');
var fs = require('fs');
var async = require('async');
var jimp = require('jimp');

module.exports = {


	/*
	 * @function create
	 *
	 * A system wide service to receive an image, store it locally, and send 
	 * back a uuid to reference this image.
	 *
	 * url:  	POST  /opsportal/image
	 * header:  X-CSRF-Token : [token]
	 * params:
	 *			image	: the image you are uploading
	 *			appKey	: a unique Application Key that this image belongs to
	 *			permission : the PermissionAction.action_key required for a user
	 *					  to access this file
	 *			isWebix : {bool} should I format the response for a Webix Uploader?
	 *			imageParam: {string} which parameter holds the file?
	 *
	 */
    create:function(req, res) {

    	var params = [ 'appKey', 'permission', 'isWebix', 'imageParam' ];
    	var options = {};
    	params.forEach(function(p){
    		options[p] = req.param(p) || '??';
    	})
console.log('... options:', options);

    	var missingParams = [];
    	var requiredParams = [ 'appKey', 'permission'];
    	requiredParams.forEach(function(r){
    		if (options[r] == '??') {
    			missingParams.push(r);
    		}
    	})

    	if (missingParams.length > 0) {
console.log('... missingParams:', missingParams);
    		var error = ADCore.error.fromKey('E_MISSINGPARAM');
    		error.missingParams = missingParams;
    		res.AD.error(error, 422);  // 422 for missing parameters ? (http://stackoverflow.com/questions/3050518/what-http-status-response-code-should-i-use-if-the-request-is-missing-a-required)
    		return;
    	}

    	// get the parameter of our image
    	// default : 'image'
    	var paramImage = 'image';  // look for the file under 'image'
		if (options.imageParam != '??') {
			paramImage = options.imageParam
		} 

		var destPath = destinationPath(options.appKey);
		var fileEntry = null;
		var fileRef  = null;
		var uuid     = null;

		async.series([

			// 1) make sure destination directory exists:
			function(next) {
				fs.stat(destPath, function(err, stat){
					if (err && err.code === 'ENOENT') {

						// create the directory!
console.log('---making opimageupload path:'+destPath);

						fs.mkdir(destPath, function(err){
							if (err) err.code = 500;
							next(err);
						})

					} else {

						next();
					}
				})
			},

			// 2) configure the download
			function(next) {
				req.file(paramImage).upload({

					// store the files in a directory under their appKey
					dirname : destPath,
					maxBytes: sails.config.opsportal.opimageupload.maxBytes

				}, function(err, list){

					if (err) {
						err.code = 500;
						next(err);
					} else {

						fileEntry = list[0];
						fileRef = fileEntry.fd;

						next();
// console.log('... list:', list);

					}
				})
			},

			// 3) get jimp to auto rotate the file based upon EXIF info:
			function(next) {

				jimp.read(fileRef)
                .then(function(image){
                    image.write(fileRef, function(err){

                        if (err) {
                        	err.code = 500;
                            next(err);
                        } else {
                            next()
                        }
                    });
                })
                .catch(function(err){
                	err.code = 500;
                    next(err);
                });
			},

			// 4) Save our OPImageUpload values:
			function(next) {

				var fileName = fileRef.split(path.sep).pop();
				uuid = fileName.split('.')[0];

				OPImageUpload.create({
					uuid:uuid, 
					app_key:options.appKey, 
					permission:options.permission, 
					image:fileName,
					size: fileEntry.size,
					type: fileEntry.type
				})
				.then(function(){
					next();
				})
				.catch(function(err){
					err.code = 500;
					next(err);
				})
			}

		], function(err, results){

			if (err) {
				res.AD.error(err, err.code);
			} else {

				// prepare our return data
				// { uuid: 'as;dlkfaslkdfjasdl;kfj' }
				var data = { 
					uuid : uuid
				}

				// if this was a Webix uploader:
				if ((options.isWebix != "??") 
					&& (options.isWebix != 'false')
					&& (options.isWebix != false)) {

					data.status = 'server';					
				}

				res.AD.success(data);

			}
		})

    },


	/*
	 * @function read
	 *
	 * A system wide service to return an image
	 *
	 * url:  	GET  /opsportal/image/:appKey/:uuid
	 * header:  X-CSRF-Token : [token]
	 * params:
	 *			uuid	: the unique reference for the image (was returned to you when you stored it)
	 *			appKey	: a unique Application Key that this image belongs to
	 *
	 */
    read:function(req, res) {

    	var params = [ 'appKey', 'uuid'];
    	var options = {};
    	params.forEach(function(p){
    		options[p] = req.param(p) || '??';
    	})

    	var missingParams = [];
    	params.forEach(function(r){
    		if (options[r] == '??') {
    			missingParams.push(r);
    		}
    	})

    	if (missingParams.length > 0) {

    		var error = ADCore.error.fromKey('E_MISSINGPARAM');
    		error.missingParams = missingParams;
    		res.AD.error(error, 422);  // 422 for missing parameters ? (http://stackoverflow.com/questions/3050518/what-http-status-response-code-should-i-use-if-the-request-is-missing-a-required)
    		return;
    	}

    	var destDir  = null;
    	var destFile = null;
    	var image    = null;

    	async.series([

    		// 1) lookup OPImageUpload by uuid
    		function(next) {

    			OPImageUpload.find({
					uuid:options.uuid
				})
				.then(function(opImage){
console.log('opImage:', opImage);
					if (opImage.length == 0) {

						var err = ADCore.error.fromKey('E_NOTFOUND');
						err.code = 404;
						next(err);
						return;
					}
					
					image = opImage[0];
					next();
				})
				.catch(function(err){
					err.code = 500;
					next(err);
				})
    		},

    		// 2) verify user currently has permission to access the image

    		// 3) verify file exists
    		function(next) {

    			destDir = destinationPath(image.app_key);
    			destFile = path.join(destDir, image.image);

    			fs.access(destFile, fs.constants.R_OK , function(err) {
					if (err) {
						var nError = new Error('cannot access image file.');
						nError.code = 500;
						next(err);
					} else {
						next();
					}
				});
    		}

    	], function(err, results){

    		if (err) {
    			res.AD.error(err, err.code);
    		} else {

    			// stream file to response on success
				fs.createReadStream(destFile)
			    .on('error', function (err) {
			      return res.AD.error(err, 500);
			    })
			    .pipe(res);
    		}
    		
    	})

    }
	
};


//
// Helper Fn()
// 
function destinationPath(appKey) {
	return path.join(sails.config.appPath, sails.config.opsportal.opimageupload.basePath, appKey);
}

