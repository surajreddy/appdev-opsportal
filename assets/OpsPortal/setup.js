steal(
        // List your Page's dependencies here:
        'appdev/appdev.js'
).then(
//        'http://code.jquery.com/ui/1.10.1/jquery-ui.min.js'
        'js/jquery-ui.min.js',
		'bootstrap/css/bootstrap.min.css'
).then(
		'js/jquery.sidr.min.js',
        'styles/jquery.sidr.dark.css',
		'bootstrap/js/bootstrap-datepicker.js',

//        'http://cdn.wijmo.com/jquery.wijmo-open.all.3.20133.20.min.js',
        'js/jquery.wijmo-open.all.3.20133.20.min.js',

//        'http://cdn.wijmo.com/interop/bootstrap-wijmo.css',
        'styles/bootstrap-wijmo.css'

 ).then(
        '//OpsPortal/controllers/OpsPortal.js',
        '/site/labels/OpsPortal',
//        "http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css"
        'styles/font-awesome.css'
).then(function(){

});