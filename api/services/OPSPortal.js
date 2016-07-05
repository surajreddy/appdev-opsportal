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
var NavBar = require(path.join(__dirname, 'opsportal', 'navbar.js'));
var View  = require(path.join(__dirname, 'opsportal', 'view.js'));


module.exports = {

	Events:{
		PERM_STALE:'opsportal.permission.stale', // event issued when any of the permission settings change
		NAV_STALE: 'opsportal.navigation.stale'	// event issued when any of the navigation config entries are changed.
	},
    

    /*
     * NavBar
     * 
     * a collection of routines that support interacting with the OpsPortal
     * navigation system.
     */
    NavBar: NavBar,


    /*
     * View
     * 
     * a collection of routines that support dynamic OPView defintions.
     */
    View: View

}



