
steal(

        'appdev/appdev.js'
).then(

    function() {

        // now make sure our AD.ui.jQuery is $ for our application:
        (function($) {

            steal(

                function() {

                    // verify all these 3rd party libraries are loaded on our Web Page:
                    AD.ui.bootup.requireSeries([

                        [ 
                            { 
                                // return true if loaded
                                cond:function() { return ('undefined' != typeof window.jQuery ); },
                                // lib:'http://code.jquery.com/jquery-1.11.1.min.js'
lib:'js/jquery.min.js' 
                            } 
                        ],
                        [ 
                            {
                                cond:function() { return ((window.jQuery)&&(window.jQuery.ui)); },
                                // lib:'http://code.jquery.com/ui/1.11.0/jquery-ui.min.js' 
lib:'js/jquery-ui.min.js' 
                            }, 
                            { tag:'bootstrap.min.js',       lib:'bootstrap/js/bootstrap.min.js'},
//{ tag:'bootstrap.js',       lib:'bootstrap/js/bootstrap.js'},   
                            { tag:'bootstrap.min.css',      lib:'bootstrap/css/bootstrap.min.css' },
                            { tag:'jquery.sidr.dark',       lib:'styles/jquery.sidr.dark.css' }
                        ],
                        [ 
                            { tag:'jquery.sidr.min',        lib:'js/jquery.sidr.min.js' }, 
                            { tag:'bootstrap-datepicker',   lib:'bootstrap/js/bootstrap-datepicker.js' }, 
                            { tag:'bootstrap-wijmo',        lib:'styles/bootstrap-wijmo.css' }, 


                            //// Load Wijimo!  The monolithic UI Graphing Library for sweet Eye Candy!
// we really should use the cdn.
// but for dev purposes, we are currently using local copies:
                            // { tag:'jquery-wijmo.css',       lib:'http://cdn.wijmo.com/themes/aristo/jquery-wijmo.css' },
                            // { tag:'wijmo-pro.all.3.20142.45.min.css',       lib:'http://cdn.wijmo.com/jquery.wijmo-pro.all.3.20142.45.min.css'},
                            // { tag:'wijmo-open.all',         lib:'http://cdn.wijmo.com/jquery.wijmo-open.all.3.20142.45.min.js' }, 
                            // { tag:'wijmo-pro.all',          lib:'http://cdn.wijmo.com/jquery.wijmo-pro.all.3.20142.45.min.js' }, 
{ tag:'jquery-wijmo.css',       lib:'styles/jquery-wijmo.css' },
{ tag:'wijmo-pro.all.3.20142.45.min.css',       lib:'styles/jquery.wijmo-pro.all.3.20142.45.min.css'},
{ tag:'wijmo-open.all',         lib:'js/jquery.wijmo-open.all.3.20142.45.min.js' }
                        ],
                        [
{ tag:'wijmo-pro.all',          lib:'js/jquery.wijmo-pro.all.3.20142.45.min.js' }
                        ]

                    ]);
                }
            ).then(

                    '//OpsPortal/controllers/OpsPortal.js',
                    '/site/labels/OpsPortal',
                    // "http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css"
'styles/font-awesome.css'
            ).then(function(){


//// TODO: get the divID from the calling url:  /opsportal/bootup/[divID]:

                // attach our OpsPortal to this ID :
                new AD.controllers.OpsPortal.OpsPortal('#portal');


            });

        })(AD.ui.jQuery);

    }

);