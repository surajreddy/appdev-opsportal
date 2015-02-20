module.exports={

    amd:false,

    // map: {
    //     "*": {
    //       "jquery/jquery.js" : "js/jquery.min.js"
    //     }
    // },
    paths: {
        
        "jquery-ui.js" : "js/jquery-ui.min.js",         // 'http://code.jquery.com/ui/1.11.0/jquery-ui.min.js' 
        
        "bootstrap.js" : "js/bootstrap/js/bootstrap.js",   // "bootstrap/js/bootstrap.min.js",  // for debugging: 'bootstrap/js/bootstrap.js'
        "bootstrap.css": "js/bootstrap/css/bootstrap.min.css",
        "bootstrap-datepicker.js" : "js/bootstrap/js/bootstrap-datepicker.js",
        "bootstrap-datepicker.css" : "styles/datepicker.css",
        
        "wijmo-open.js"   : "js/jquery.wijmo-open.all.3.20142.45.min.js",   // 'http://cdn.wijmo.com/jquery.wijmo-open.all.3.20142.45.min.js'
        "wijmo-pro.css": "styles/jquery.wijmo-pro.all.3.20142.45.min.css",  // 'http://cdn.wijmo.com/jquery.wijmo-pro.all.3.20142.45.min.css'
        "wijmo-pro.js" : "js/jquery.wijmo-pro.all.3.20142.45.min.js",       // 'http://cdn.wijmo.com/jquery.wijmo-pro.all.3.20142.45.min.js'
        "jquery-wijmo.css" : "styles/jquery-wijmo.css", // 'http://cdn.wijmo.com/themes/aristo/jquery-wijmo.css'
        
        "font-awesome.css" : "styles/font-awesome.css",  // "http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css"
        "GenericList.js"   : "js/GenericList.js",

        "dropzone.js"  : "js/dropzone/dropzone.min.js",
        "dropzone.css" : "js/dropzone/dropzone.min.css"
    },
    shim : {
        'jquery-ui.js' : { packaged:false },
        
        'bootstrap.js' : { packaged:false },
        // 'bootstrap.css' : { packaged:false },
        'bootstrap-datepicker.js': {packaged:false },
        'bootstrap-datepicker.css': {packaged:false },

        'wijmo-open.js' : { packaged:false },
        'wijmo-pro.css' : { packaged:false },
        'wijmo-pro.js' : { packaged:false },
        'jquery-wijmo.css' : { packaged:false },

        'font-awesome.css'  : { packaged:false },
        'js/jquery.sidr.min.js' : { packaged:false },

        'dropzone.js'  : { packaged:false },
        'dropzone.css' : { packaged:false },


        // this is a special call that configures which opstools are loaded:
        'opsportal/requirements.js' : { ignore:true },

        'site/labels/OpsPortal.js' : { packaged:false, ignore:true }
    },
    // ext: {
    //     js: "js",
    //     css: "css",
    //     less: "steal/less/less.js",
    //     coffee: "steal/coffee/coffee.js",
    //     ejs: "can/view/ejs/ejs.js"
    // }
};
