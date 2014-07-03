
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
                                lib:'js/jquery.min.js' 
                            } 
                        ],
                        [ 
                            {
                                cond:function() { return ((window.jQuery)&&(window.jQuery.ui)); },
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
                            { tag:'wijmo-open',             lib:'js/jquery.wijmo-open.all.3.20133.20.min.js' }, 
                            { tag:'bootstrap-wijmo',        lib:'styles/bootstrap-wijmo.css' } 
                        ]

                    ]);
                }
            ).then(

                    '//OpsPortal/controllers/OpsPortal.js',
                    '/site/labels/OpsPortal',
            //        "http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css"
                    'styles/font-awesome.css'
            ).then(function(){

                // attach our OpsPortal to this ID :
                new AD.controllers.OpsPortal.OpsPortal('#portal');

            });

        })(AD.ui.jQuery);

    }

);