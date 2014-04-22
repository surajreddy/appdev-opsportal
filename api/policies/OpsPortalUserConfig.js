/**
 * OpsPortalUserCofig
 *
 * @module      :: Policy
 * @description :: Scans the config/opsportal.js definition, and returns the
 *                 ops tool definitions the user is allowed to see.
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
    // only continue if current user has an actionKey in one of their
    // permissions.

    var areaHash = {};
    var tools = [];

    // our current user
    var user = ADCore.user.current(req);

    var config = sails.config.opsportal;


    // start decoding each area defined
    for (var a=0; a<config.areas.length; a++) {
        processArea(areaHash, tools, user, config.areas[a]);
    }


    // now compile the results:
    // convert areaHash => an array
    var areas = [];
    for (var a in areaHash) {
        areas.push(areaHash[a]);
    }

    var data = {
            areas:areas,
            tools:tools
    };


    // store this in the response object:
    // res.appdev.opsportalconfig
    if (!res.appdev) res.appdev = {};
    res.appdev.opsportalconfig = data;


    next();
};




function processPermission(user, permission) {
    // make a single 'permission'  string into an []
    if (!Array.isArray(permission)) {
        permission = [ permission ];
    }


    // each given permission setting must return true for this to work
    var ok = true;
    for (var p=0; p<permission.length; p++) {
        if (!user.hasPermission(permission[p])) {

            // if we missed one, then this set of permissions fails
            ok = false;
            break;
        }
    }

    return ok;
}
function processTool( areaHash, tools, user, area, tool ) {

    // for this tool, check each possible permission settings
    for (var p=0; p<tool.permissions.length; p++) {
        if (processPermission(user, tool.permissions[p])) {

            // once we return true, we don't have to process any more.
            // add area & tool to our list.

//// TODO: change the isDefault to lookup a user's last accessed
//// area/tool and make those the default


            // if area not already added then add it
            if (!areaHash[area.key]) {
                var areaInfo = {
                        icon: area.icon,
                        key: area.key,
                        label: area.label,
                        isDefault:area.isDefault || false
                };
                areaHash[area.key] = areaInfo;
            }

            // add the tool
            var toolInfo = {
                    area:area.key,
                    controller:tool.controller,
                    label:tool.label,
                    isDefault:tool.isDefault
            };
            tools.push(toolInfo);
            break;
        }
    }

}
function processArea( areaHash, tools, user, area ) {

    // evaluate each tool defined in this area
    for (var t=0; t<area.tools.length; t++){
        processTool(areaHash, tools, user, area, area.tools[t]);
    }
}

