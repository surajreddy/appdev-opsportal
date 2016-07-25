/**
 * OPConfigTool.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  tableName:'op_config_tool',

//   connection:'appdev_default',
// migrate:'alter',

  attributes: {

    areas : {  collection: 'OPConfigArea', via: 'tools' },
    permissions : {  collection: 'PermissionAction', via: 'tools', dominant:true },

    key : {  type: 'string' },

    icon : { type: 'string' },

    isDefault : { 
      type: 'boolean',
      defaultsTo: false
    },

    label : { type: 'string' },

    context : { type: 'string' },

    controller : { type: 'string' },

    isController : { 
      type: 'boolean',
      defaultsTo : true
    },

    options : { type: 'json', defaultsTo:{} }
  }
};

