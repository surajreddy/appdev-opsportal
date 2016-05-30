/**
 * Bootstrap
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */
var path = require('path');
var AD = require('ad-utils');
module.exports = function (cb) {

	AD.module.permissions(path.join(__dirname, '..', 'setup', 'permissions'), cb);

};

// Add CSRF route exclusion
if (sails.config.csrf) {
    
    var csrf = sails.config.csrf;
    csrf.routesDisabled = csrf.routesDisabled || '';
    
    if (csrf.routesDisabled == '-') {
        csrf.routesDisabled = '';
    }
    else if (csrf.routesDisabled) {
        csrf.routesDisabled += ',';
    }
    csrf.routesDisabled += '/opsportal/feedback';
    
}