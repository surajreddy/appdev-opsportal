/**
 * Routes
 *
 * Use this file to add any module specific routes to the main Sails
 * route object.
 */


module.exports = {

    'get /opsportal/requirements.js': 'appdev-opsportal/OpsPortalController.requirements',
    'get /opsportal/config': 'appdev-opsportal/OpsPortalController.config'

};

