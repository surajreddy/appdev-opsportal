/**
 * OPConfigArea.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var _ = require('lodash');

module.exports = {

  tableName:'op_config_area',

//   connection:'appdev_default',
// migrate:'alter',

  attributes: {

    tools : {  collection: 'OPConfigTool', via: 'areas' },

    key : { type: 'string' },

    icon : { type: 'string' },

    isDefault : { type: 'boolean', defaultsTo:false },

    label : { type: 'string' },

    context : { type: 'string' },

    weight  : { type: 'integer', defaultsTo:0 }
  },

  beforeCreate: function(values, cb) {

    // make sure there are no '.' in .key
    // and while we are at it, proper kebobCase()
    values.key = _.kebabCase(values.key);
    cb();
  },

  afterCreate: function(record, cb) {
    ADCore.queue.publish(OPSPortal.Events.NAV_STALE, {area:record, verb:'created'});
    cb();
  },

  afterUpdate: function(record, cb) {
    ADCore.queue.publish(OPSPortal.Events.NAV_STALE, {area:record, verb:'updated'});
    cb();
  },

  afterDestroy: function(record, cb) {
    ADCore.queue.publish(OPSPortal.Events.NAV_STALE, {area:record, verb:'destroyed'});
    cb();
  }
};

