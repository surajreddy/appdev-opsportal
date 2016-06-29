/**
 * OPThemeController
 *
 * @description :: Server-side logic for managing Opthemes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');
var path = require('path');
var pathToThemeFolder = path.join(__dirname, '..', '..', 'assets', 'opstools', 'OPTheme','themes');

var currentTheme = '';


var themeTemplate = [
'body { ',
'	background-color: [value1] !important;',
'}'
].join('\n');


module.exports = {

	  _config: {},


	  // post /optheme
	  create:function(req, res) {

	  	var params = req.allParams();
	  	var name = req.param('name');

console.log('... params:', params);

// TODO: do what you need to do here to run SASS and create a new theme in the pathToThemeFolder
// for now my simple test example:

// TODO: error checking on existing files and overwriting.

	  	if (name) {
	  		var currTemplate = themeTemplate;
	  		for (var p in params) {
	  			currTemplate = currTemplate.replace('['+p+']', params[p]);
	  		}

	  		var fileName = path.join(pathToThemeFolder, name+'.css');
	  		fs.writeFile(fileName, currTemplate, function(err){

	  			if (err) {
	  				ADCore.error.log('Error saving new theme', { error:err, name:fileName, contents:currTemplate });
	  				res.AD.error('Error writing file.');
	  			} else {
	  				res.AD.success('theme created.');
	  			}
	  		})

	  	} else {
	  		res.AD.error('name is required');
	  	}


	  },


	  // post /optheme/default
	  default:function(req, res) {
	  	// chosen theme file should be registered as the default opstheme
	  	var name = req.param('name');

// TODO: make this a permanent setting
// 
// but for now:
		currentTheme = name;

	  	res.AD.success('theme set.');

	  },


	  // get /optheme
	  list:function(req, res) {
	  	// return all the themes currently defined in the system.

	  	// read in the files in 
	  	fs.readdir(pathToThemeFolder, function(err, files){
	  		if (err) {
	  			ADCore.error.log('Error reading OPTheme.theme folder', {error:err, path:pathToThemeFolder });
	  			var newError = new Error('Unable to read themes on server.');
	  			newError.err = err;
	  			res.AD.error(newError);
	  		} else {

	  			var filesToIgnore = ['.DS_Store', '.gitkeep'];
	  			var themes = [];
	  			files.forEach(function(file){
	  				if (filesToIgnore.indexOf(file) == -1) {
		  				themes.push({ name: file });
		  			}
	  			});
// console.log('... themes:', themes);
	  			res.AD.success(themes);
	  		}
	  	})
	  },


	  	// get /optheme/theme
		theme: function(req, res) {
			// called by OpsPortal when loading.  if a theme is returned, it
			// will be loaded.
			// 
			// must return the pathToTheme as it relates to the [sails]/assets directory
			// 
			// if nothing then return {}
			// else
			// return { name: 'path/to/theme.css' }

			var result = {};

			if (currentTheme != '') {
				var theme = path.join(pathToThemeFolder, currentTheme);
				theme = theme.split('assets')[1];

				result.name = theme;
			}

			res.AD.success(result);
		}
	
};

