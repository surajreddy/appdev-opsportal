module.exports = {
    "map": {
        "FilteredBootstrapTable": "OpsPortal/controllers/FilteredBootstrapTable",
        "OpsButtonBusy": "OpsPortal/classes/OpsButtonBusy",
		"bootbox": "js/bootbox.min"
    },
    "paths": {
        "opstools/RBAC": "opstools/RBAC/RBAC.js",
    },
    "bundle": ['opstools/RBAC'],
    "meta": {
		"js/bootbox.min": {
			"exports": "bootbox",
			"format": "global",
			"sideBundle": true
		},
        "OpsPortal/OpsPortal": {
            "deps": [
                'jquery',
				'can',
				"bootbox",

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

