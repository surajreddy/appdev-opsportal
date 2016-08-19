/**
 * OPNavEditController
 *
 * @description :: Server-side logic for managing Opnavedits
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var _ = require('lodash');

module.exports = {
	

  /**
   * put /opnavedit/arealabel
   *
   * update the label associated with a given area's label.
   *
   * @param {integer} key  the area.id of the area to update
   * @param {string}  label the label of the new area.
   */
  arealabel:function(req, res) {
      
      var key = req.param('key');
      var label = req.param('label');

      var missing = [];
      if (_.isUndefined(key)) {
      	missing.push('key');
      } 
      if (_.isUndefined(label)) {
      	missing.push('label');
      }
      if (missing.length > 0) {

      	var err = new Error('Missing parameters:'+ missing.join(', '));
      	res.AD.error(err, 400);
      	return;
      }

      var code = req.param('language_code') || 

	  // updating an existing label:
	  Multilingual.label.update({
	  	label_key: key,
	  	label_label: label,
	  	label_context: 'opnavedit',
	  	language_code: code || req.AD.user().getLanguageCode()
	  })
	  .fail(function(err){
	  	ADCore.error.log('Error updating label ', {error: err});
	  	res.AD.error(err, 500);
	  })
	  .then(function(label){
	  	res.AD.success(label);
	  })
      
  },
};

