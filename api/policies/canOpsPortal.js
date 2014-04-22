/**
 * canHRIS
 *
 * @module      :: Policy
 * @description :: Verifies that the current user has permission to access hris
 *                 has actionKey: hris.*
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  return ADCore.hasPermission(req, res, next, 'opsportal');
};
