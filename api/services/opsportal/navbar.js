/**
 * @class  OPSPortal.NavBar
 * @parent OPSPortal
 * 
 * the .NavBar object manages the interface for creating/updating any opsportal 
 * navigation components.  
 * 
 * 
 * ## Usage
 *
 */


var fs = require('fs');
var AD = require('ad-utils');
var _ = require('lodash');


var __cacheValues = {}; // hash of {  'user.guid' : opsportal.config }
						// this is a cache of each users computed opsportal 
						// layout.


var __cacheToolDefs = null;  // hash of { 'tooldef.key': true }
						// this is a cache of all the current 
						// OPConfigToolDefinition values that are defined in 
						// the DB.


var NavBar = module.exports = {

    /** 
	 * OPSPortal.NavBar.cache()
	 *
	 * An interface for loading a user's current computed OpsPortal layout.
	 *
	 * @codestart
	 *
	 * // get the user's current opsportal config settings:
	 * var user = req.AD.user();
	 * var currentConfig = OPSPortal.NavBar.cache(user.GUID()); 
	 *		// undefined if no config exists
	 * 		// {obj} describing opsportal config if it does
	 *
	 *
	 * // set the user's current opsportal config settings:
	 * var someConfig = { foo:'bar' };
	 * OPSPortal.NavBar.cache(user.GUID(), someConfig);
	 *
	 * @codeend
	 *
	 * @param {string} guid  the user's GUID, the key to look up.
	 * @param {obj} value    (optional) the config settings to save.
	 *					 if value is not given -> this is a get operation
	 *					 if value is given -> this updates the information. 
	 * @return {mixed} 
	 */
    cache: function(guid, value) {
        if (typeof value == 'undefined') {

            // this is a get operation:
            return __cacheValues[guid];
        } else {

        	// this is a set operation:
            __cacheValues[guid] = value;
        }
    },


    ToolDefinition: {




    	/** 
    	 * OPSPortal.NavBar.ToolDefinition.create()
    	 *
    	 * create the Tool Definition for the given def object.
    	 * 
    	 * this routine is to be used by external modules to define their
    	 * ToolDefinitions that are available to be loaded in the OpsPortal.
    	 *
    	 * @param {obj} def  the current tool def values to create.
    	 * 					 must include def.key 
    	 * @param {fn} cb    (optional) the callback function for when the 
    	 *					 update is complete.  
    	 *					 cb(err, createdDefinition);
    	 * @return {deferred} 
    	 */
    	create: function(def, cb) {
    		var dfd = AD.sal.Deferred();

    		function onError(err) {
    			if (cb) cb(err);
	    		dfd.reject(err);
	    		return null;
    		}

    		// make sure our cached list exists
    		loadToolDefs(function(err){

    			if (err) {
    				onError(err);
    			} else {

					OPSPortal.NavBar.ToolDefinition.exists(def.key, function(err, isThere){
						if (err) {
							onError(err);
						} else {

							if (!isThere) {

			    				// now create the new definition:
					    		OPConfigToolDefinition.create(def)
					    		.then(function(newDef){

					    			__cacheToolDefs[newDef.key] = newDef;

					    			if (cb) cb(null, newDef);
					    			dfd.resolve(newDef);
					    			return null;
					    		})
					    		.catch(function(err){
					    			return onError(err);
					    		});

							} else {

								// return existing definition
								var newDef = __cacheToolDefs[def.key];
								if (cb) cb(null, newDef);
					    		dfd.resolve(newDef);
							}
						}
					})

		    	}

	    	});

    		return dfd;
    	},


    	/** 
    	 * OPSPortal.NavBar.ToolDefinition.exists()
    	 *
    	 * Check to see if the current OPConfigToolDefinition.key exists in
    	 * the db yet.
    	 *
     	 * @param {string} key  the OPConfigToolDefinition.key to lookup.
    	 * @param {fn} cb    (optional) the callback function for when the 
    	 *					 update is complete.  
    	 *					 cb(err, isThere);
    	 * @return {deferred} 
    	 */
    	exists: function(key, cb) {
    		var dfd = AD.sal.Deferred();

    		loadToolDefs(function(err){
    			if (err) {
    				if (cb) cb(err);
    				dfd.reject(err);
    			} else {
    				var isThere = !_.isUndefined( __cacheToolDefs[key] );
    				if (cb) cb(null, isThere);
    				dfd.resolve( isThere );
    			}
    		})

    		return dfd;
    	},


    	/** 
    	 * OPSPortal.NavBar.ToolDefinition.setup()
    	 *
    	 * a routine that ensures a module's OPConfigToolDefinition is created.
    	 * 
    	 * it is intended to be run by the [module]/config/bootstrap.js 
    	 * routine.
    	 *
     	 * @param {array} defs  one or more Tool Definitions that need to be 
     	 *					 verified (created/updated).
     	 *					 [ { OPConfigToolDefinition }, {} ..., {} ]
    	 * @param {fn} cb    (optional) the callback function for when the 
    	 *					 update is complete.  
    	 *					 cb(err);
    	 * @return {deferred} 
    	 */
    	setup: function(defs, cb) {
    		var dfd = AD.sal.Deferred();

    		// make sure def is an array:
    		if (! _.isArray(defs)) {
    			defs = [defs];
    		}


			function onError(err) {
    			if (cb) cb(err);
	    		dfd.reject(err);
	    		return null;
    		}

    		function onDone() {
    			numDone++;
				if (numDone >= defs.length){
					if (cb) cb(null);
					dfd.resolve();
				}
    		}


    		var numDone = 0;

    		defs.forEach(function(def){
				OPSPortal.NavBar.ToolDefinition.exists(def.key, function(err, isThere){
					if (err) {
						onError(err);
					} else {

						if (!isThere) {
			    			OPSPortal.NavBar.ToolDefinition.create(def, function(err){
			    				if (err){
			    					onError(err);
			    				} else {
			    					onDone();
			    				}
			    			});

			    		} else {

			    			// is this definition a different version than our current?
			    			var currDef = __cacheToolDefs[def.key];
			    			if (currDef.version != def.version) {

			    				// different version so perform an update:
				    			OPSPortal.NavBar.ToolDefinition.update(def, function(err){
				    				if (err){
				    					onError(err);
				    				} else {
				    					onDone();
				    				}
				    			});

				    		} else {

				    			// same one, so move along... 
// console.log('... tool def ['+def.key+'] matches current definition');
				    			onDone();
				    		}

			    		}
			    	}
			    });
    		})

    		// if it was an empty array ... we're done too.
    		if (defs.length == 0) {
    			onDone();
    		}

    		return dfd;
    	},


    	/** 
    	 * OPSPortal.NavBar.ToolDefinition.setupPath()
    	 *
    	 * a routine that ensures a module's OPConfigToolDefinition is created.
    	 * 
    	 * it is intended to be run by the [module]/config/bootstrap.js 
    	 * routine and passed the full path to the tool definition file.
    	 *
    	 * @param {string} pathToDefinition  the full path to the opstool 
    	 *					 definition file.
    	 * @param {fn} cb    (optional) the callback function for when the 
    	 *					 update is complete.  
    	 *					 cb(err);
    	 */
    	setupPath: function(pathToDefinition, cb) {

    		// check if we can access the file
			fs.access(pathToDefinition, fs.R_OK | fs.F_OK, function(err) {

				if (err) {
					cb(err);
				} else {

					// if so, load the definitions and call .setup()
					var tools = require(pathToDefinition);
					OPSPortal.NavBar.ToolDefinition.setup(tools, cb);

				}
			});

    	},


    	/** 
    	 * OPSPortal.NavBar.ToolDefinition.update()
    	 *
    	 * update the Tool Definition for the given def object.
    	 * 
    	 * the tool definition will be updated based upon the given
    	 * def.key
    	 *
    	 * @param {obj} def  the current tool def values to update.
    	 * 					 must include def.key of tool definition to update
    	 * @param {fn} cb    (optional) the callback function for when the 
    	 *					 update is complete.  
    	 *					 cb(err, updatedDefinition);
    	 * @return {deferred} 
    	 */
    	update:function(def, cb) {

			var dfd = AD.sal.Deferred();

			// now create the new definition:
    		OPConfigToolDefinition.update({key:def.key}, def)
    		.then(function(newDef){

    			__cacheToolDefs[def.key] = newDef;

    			if (cb) cb(null, newDef);
    			dfd.resolve(newDef);
    			return null;
    		})
    		.catch(function(err){
    			if (cb) cb(err);
    			dfd.reject(err);
    			return null;
    		});

			return dfd;

    	}
    }

};



// flush
// remove all the values in our user opsportal config cache.
NavBar.cache.flush = function() {

    __cacheValues = {};
// console.log('... NavBar.Cache flushed!');

}



// loadToolDefs
// make sure we have our tool definitions loaded in our cache.
// @param {fn} cb  nodejs style callback for when all defs are loaded.
function loadToolDefs(cb) {
	if (__cacheToolDefs) {
		cb();
	} else {

		OPConfigToolDefinition.find()
		.catch(function(err){
			cb(err);
			return null;
		})
		.done(function(list){
			__cacheToolDefs = {};
			if ((list) && (list.length)) {

				list.forEach(function(def){
					__cacheToolDefs[def.key]=def;
				})
			}
			cb();
			return null;
		})
	}
}
