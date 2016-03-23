module.exports = {
    "map": {
        "FilteredBootstrapTable": "OpsPortal/controllers/FilteredBootstrapTable",
        "OpsButtonBusy": "OpsPortal/classes/OpsButtonBusy",
		"typeahead": "js/typeahead.jquery.min",
		"moment": "js/moment.min",
		"bootstrap-table": "js/bootstraptable/bootstrap-table",
		"bootstrapValidator": "js/bootstrapValidator.min",
		"bootbox": "js/bootbox.min",
		"webix": "js/webix/webix.js"
    },
    "paths": {
        "opstools/RBAC": "opstools/RBAC/RBAC.js",
        "jquery-ui": "js/jquery-ui.min.js",         // 'http://code.jquery.com/ui/1.11.0/jquery-ui.min.js' 

        "bootstrap": "js/bootstrap/js/bootstrap.min.js",  // for debugging: 'bootstrap/js/bootstrap.js'
        "bootstrap.css": "js/bootstrap/css/bootstrap.min.css",
        "bootstrap-datetimepicker": "js/bootstrap/js/bootstrap-datetimepicker.min.js",
        "bootstrap-datetimepicker.css": "styles/bootstrap-datetimepicker.min.css",

        // "wijmo-open"   : "js/jquery.wijmo-open.all.3.20142.45.min.js",   // 'http://cdn.wijmo.com/jquery.wijmo-open.all.3.20142.45.min.js'
        // "wijmo-pro.css": "styles/jquery.wijmo-pro.all.3.20142.45.min.css",  // 'http://cdn.wijmo.com/jquery.wijmo-pro.all.3.20142.45.min.css'
        // "wijmo-pro" : "js/jquery.wijmo-pro.all.3.20142.45.min.js",       // 'http://cdn.wijmo.com/jquery.wijmo-pro.all.3.20142.45.min.js'
        // "jquery-wijmo.css" : "styles/jquery-wijmo.css", // 'http://cdn.wijmo.com/themes/aristo/jquery-wijmo.css'


        "font-awesome.css": "styles/font-awesome.css",  // "http://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css"
        "GenericList": "js/GenericList.js",


        "dropzone": "js/dropzone/dropzone.min.js",
        "dropzone.css": "js/dropzone/dropzone.min.css",

        "bootstrap-table": "js/bootstraptable/bootstrap-table.js",
        "bootstrap-table.css": "js/bootstraptable/bootstrap-table.css",

        "bootstrapValidator": "js/bootstrapValidator.min.js",
        "bootstrapValidator.css": "styles/bootstrapValidator.min.css",

        "bootbox": "js/bootbox.min.js",

        "typeahead": "js/typeahead.jquery.min.js",

        "moment": "js/moment.min.js",


        // "notify" : "js/notify.min.js",

        "FilteredBootstrapTable": "OpsPortal/controllers/FilteredBootstrapTable.js",

        "OpsButtonBusy": "OpsPortal/classes/OpsButtonBusy.js",
        "OpsWebixDataCollection": "OpsPortal/classes/OpsWebixDataCollection.js",
        "OpsWebixSearch": "OpsPortal/classes/OpsWebixSearch.js",
        "OpsWebixForm": "OpsPortal/classes/OpsWebixForm.js",

        "webix": "js/webix/webix.js",
        "webix.css": "js/webix/webix.css",
        "webix-opsportal": "js/webix/opsportal-skin.js"
    },
    "bundle": ['opstools/RBAC'],
    "meta": {
		"js/jquery-ui.min": {
			"deps": ['js/jquery.min'],
			"format": "global",
			"sideBundle": true
		},
		"js/bootstrap/js/bootstrap.min": {
			"deps": ['js/bootstrap/css/bootstrap.min.css'],
			"format": "global",
			"sideBundle": true
		},
		"js/bootstrap/js/bootstrap-datetimepicker.min": {
			"deps": ['styles/bootstrap-datetimepicker.min.css'],
			"format": "global",
			"sideBundle": true
		},
		"styles/font-awesome.css": {
			"sideBundle": true
		},
		"js/jquery.sidr.min": {
			"deps": ['js/jquery.min'],
			"format": "global",
			"sideBundle": true
		},
		"js/dropzone/dropzone.min": {
			"deps": ['js/dropzone/dropzone.min.css'],
			"format": "global",
			"sideBundle": true
		},
		"js/typeahead.jquery.min": {
			"format": "global",
			"sideBundle": true
		},
		"js/moment.min": {
			"format": "global",
			"sideBundle": true
		},
		"js/bootstraptable/bootstrap-table": {
			"deps": ['js/bootstrap/js/bootstrap.min', 'js/bootstraptable/bootstrap-table.css'],
			"format": "global",
			"sideBundle": true
		},
		"js/bootstrapValidator.min": {
			"deps": ['js/bootstrap/js/bootstrap.min', 'styles/bootstrapValidator.min.css'],
			"format": "global",
			"sideBundle": true
		},
		"js/webix/webix.css": {
			"sideBundle": true
		},
		"js/webix/webix": {
			"deps": ['js/webix/webix.css'],
			"format": "global",
			"sideBundle": true
		},
		"js/webix/opsportal-skin": {
			"deps": ['js/webix/webix'],
			"format": "global",
			"sideBundle": true
		},
		"js/bootbox.min": {
			"exports": "bootbox",
			"format": "global",
			"sideBundle": true
		},
		"OpsPortal/OpsPortal": {
			"deps": [
				'jquery',
				'can',
				"typeahead",
				"moment",
				"bootstrap-table",
				"bootstrapValidator",
				"bootbox",
				"webix",

				'js/GenericList',

				"OpsPortal/classes/OpsButtonBusy",
				"OpsPortal/classes/OpsDialog",
				"OpsPortal/classes/OpsForm",
				"OpsPortal/classes/OpsTool",
				"OpsPortal/classes/OpsWidget",
				"OpsPortal/classes/ValidationDateGreaterThanField",
				"OpsPortal/classes/ValidationServer",

				"OpsPortal/controllers/FilteredBootstrapTable",
				"OpsPortal/controllers/MenuList",
				"OpsPortal/controllers/OpsPortal",
				"OpsPortal/controllers/SubLinks",
				"OpsPortal/controllers/Tool",
				"OpsPortal/controllers/ToolArea",
				"OpsPortal/controllers/WorkArea",

				"OpsPortal/models/base/OpsPortalConfig",
				"OpsPortal/models/OpsPortalConfig",
			]
		}
	}
};
