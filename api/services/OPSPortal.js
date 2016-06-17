/**
 * OPSPortal
 *
 * @module      :: Service
 * @description :: A collection of services related to the OpsPortal.
 *
 */


var AD = require('ad-utils');
var _ = require('lodash');


// import local files
var path  = require('path');
var View  = require(path.join(__dirname, 'opsportal', 'view.js'));


module.exports = {
    
    /*
     * View
     * 
     * a collection of routines that support dynamic OPView defintions.
     */
    View: View

}



