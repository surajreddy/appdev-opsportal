/*
 * build.appdev.js
 *
 * This file is intended to be used by the appdev build command line tool.
 *
 * This file exports the actual command() to run when trying to build this 
 * application/widget.
 *
 * Create your command() to run from the [root]/assets  directory.
 *
 */



var AD = require('ad-utils');
var path = require('path');
var fs = require('fs');
var async = require('async');
var transform = require("steal-tools").transform;

module.exports = {

    /* 
     * command()
     *
     * This is the actual command to execute.
     * 
     * This method is required.
     *
     * @param {obj} builder The appdev.build object that is running this command.
     * @param {fn} cb   The callback fn to run when command is complete.
     *                  The callback follows the usual node: cb(err) format.
     */
    command: function (builder, cb) {

        var self = this;
        var mainBuildModules = [path.join('OpsPortal', 'OpsPortal'),
                                'FilteredBootstrapTable',
                                'OpsButtonBusy',
                                'OpsPortal/controllers/OpsPortal'
                                ];

        //// NOTE:  this is expected to be running the /assets directory


        async.series([

            // step 1:  check to make sure appdev exists:
            function (next) {

                fs.exists(path.join(process.cwd(), 'appdev'), function (exists) {

                    if (exists) {
                        next();
                    } else {
                        AD.log('<red>error:</red> building OpsPortal requires appdev module to be installed as well.');
                        var err = new Error('building OpsPortal requires appdev module to be installed as well. ');
                        next(err);
                    }

                });

            }, 



            // step 2: build JS files
            function (next) {


                // 1) We are going to run the steal/buildjs against appdev and OpsPortal
                //    so that the OpsPortal doesn't package together the appdev library.

                AD.log();
                AD.log('<green>building</green> OpsPortal JS files');


                transform(
                    {
                        main: mainBuildModules,
                        config: 'stealconfig.js'
                    },
                    {
                        minify: true,
                        noGlobalShim: true,
                        ignore: [
                            /^.*(.css)+/, // Ignore css files
                            /^(?!(OpsPortal|opsportal).*)/, // Get only OpsPortal module files
                        ]
                    }).then(function (transform) {
                        // Get the main module and it's dependencies as a string
                        var main = transform();

                        fs.writeFile(path.join('OpsPortal', 'production.js'), main.code, "utf8", function (err) {
                            if (err) {
                                AD.log.error('<red>could not write minified OpsPortal JS file !</red>', err);
                                next(err);
                            }

                            next();
                        });
                    })
                    .catch(function (err) {
                        AD.log.error('<red>could not complete OpsPortal JS build!</red>', err);
                        next(err);
                    });

            },


            // step 3: build CSS files
            function (next) {
                AD.log('<green>building</green> OpsPortal CSS files');
                AD.log('<green>+++++++++++++++</green>');

                // Minify css files
                transform(
                    {
                        main: mainBuildModules,
                        config: 'stealconfig.js'
                    },
                    {
                        minify: true,
                        noGlobalShim: true,
                        ignore: [
                            /^(?!.*(.css)+)/, // Get only css files
                            /^(?!(OpsPortal|opsportal).*)/, // Get only OpsPortal module files
                        ]
                    }).then(function (transform) {
                        var main = transform();

                        fs.writeFile(path.join('OpsPortal', 'production.css'), main.code, "utf8", function (err) {
                            if (err) {
                                AD.log.error('<red>could not write minified OpsPortal CSS file !</red>', err);
                                next(err);
                            }

                            next();
                        });
                    })
                    .catch(function (err) {
                        AD.log.error('<red>could not complete OpsPortal CSS build!</red>', err);
                        next(err);
                    });
            },
            
            
            // step 4: cleanup the production.js file to point to 
            //         appdev/production.js
            function (next) {

                AD.log('<green>cleaning</green> the OpsPortal/production.js file');

                var patches = [
                    { file: path.join('OpsPortal', 'production.js'), tag: 'id:"packages/OpsPortal-appdev.js",', replace: 'id:"appdev/production.js",' }
                ];
                builder.patchFile(patches, next);

            }

        ], function (err, results) {
            if (cb) cb(err);
        });

    }

}