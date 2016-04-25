module.exports = {
    "map": {

    	"query-builder": "js/query-builder/query-builder.min"
    },
    "paths": {
        "opstools/RBAC": "opstools/RBAC/RBAC.js",
        "query-builder": "js/query-builder/query-builder.min.js",
        // "query-builder.css": "js/query-builder/query-builder.default.min.css",
    },
    "bundle": ['opstools/RBAC'],
    "meta": {

    	"js/query-builder/query-builder.min": {
            "exports": "Querybuilder",
			"deps": ['js/query-builder/query-builder.default.min.css'],
			"format": "global",
			"sideBundle": true
		}
        
    }
};
