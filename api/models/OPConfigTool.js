/**
 * OPConfigTool.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  tableName:'op_config_tool',

  connection:'appdev_default',
migrate:'alter',

  attributes: {

    areas : {  collection: 'OPConfigArea', via: 'tools' },
    permissions : {  collection: 'PermissionAction', via: 'tools' },

    icon : { type: 'string' },

    isDefault : { 
      type: 'bool',
      defaultsTo: false
    },

    label : { type: 'string' },

    context : { type: 'string' },

    isController : { 
      type: 'bool',
      defaultsTo:true
    },

    options : { type: 'json', defaultsTo:{} }
  }
};

