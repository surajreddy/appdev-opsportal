/**
 * OPConfigArea.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  tableName:'op_config_area',

  connection:'appdev_default',
migrate:'alter',

  attributes: {

    tools : {  collection: 'OPConfigTool', via: 'areas' },

    key : { type: 'string' },

    icon : { type: 'string' },

    isDefault : { type: 'bool' },

    label : { type: 'string' },

    context : { type: 'string' }
  }
};

