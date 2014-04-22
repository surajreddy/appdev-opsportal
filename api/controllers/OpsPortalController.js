/**
 * OpsPortalConfigController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to OpsPortalConfigController)
   */

  _config: {}

  // Fixture Data:
  // Use this for initial design and testing
  , config:function(req, res) {

      ADCore.comm.success(res, res.appdev.opsportalconfig);
  }




  , requirements:function(req, res) {


      res.setHeader('content-type', 'application/javascript');


      //// tools will be gathered from config/opsportal.js
      //// and matched against a user's permissions.
/*
      var tools = [
                   'HrisAdminObjects'
                   ];
*/
      var tools = [];
      var data = res.appdev.opsportalconfig;
      for (var d=0; d< data.tools.length; d++){
          tools.push( data.tools[d].controller)
      }


      res.view({
          listTools:tools,
          layout:false
      });
  }




};
