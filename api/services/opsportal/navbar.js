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



var AD = require('ad-utils');
var _ = require('lodash');

var __cacheValues = {}; // hash of {  'user.guid' : opsportal.config }

var NavBar = module.exports = {

    
    cache: function(key, value) {
        if (typeof value == 'undefined') {

            // this is a get operation:
            return __cacheValues[key];
        } else {

            __cacheValues[key] = value;
        }
    }


};



NavBar.cache.flush = function() {

    __cacheValues = {};
console.log('... NavBar.Cache flushed!');

}
