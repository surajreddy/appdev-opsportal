
steal(
	// List your Controller's dependencies here:
	'opstools/OPNavEdit/models/OPConfigArea.js',
	'opstools/OPNavEdit/views/OPNavEdit/OPNavEditAreas.ejs',
	function() {
		System.import('appdev').then(function() {
			steal.import('appdev/ad',
				'appdev/control/control',
				'OpsPortal/classes/OpsTool',
				'site/labels/opstool-OPNavEdit').then(function() {

					// Namespacing conventions:
					// AD.Control.OpsTool.extend('[ToolName]', [{ static },] {instance} );
					AD.Control.OpsTool.extend('OPNavEdit', {

						init: function(element, options) {
							var self = this;
							options = AD.defaults({
								templateDOMAreas: '/opstools/OPNavEdit/views/OPNavEdit/OPNavEditAreas.ejs',
								resize_notification: 'OPNavEdit.resize',
								tool: null   // the parent opsPortal Tool() object
							}, options);
							this.options = options;

							// Call parent init
							this._super(element, options);

							this.initDOM();
						},



						initDOM: function() {
							var _this = this;
//// LEFT OFF HERE:

// verify newly added area list is hidden.
// clicking Edit will display the area list.
// OPConfigArea route should be protected by our opsportal.opnavedit.view permission.

							var menuFooter = $(this.element.find('#op-menu-widget .op-widget-footer'));
							menuFooter.prepend([
'<div class="op-navbar-editbutton">',
'<i class="fa fa-pencil-square-o" aria-hidden="true"></i><span>Edit</span>',
'</div>'
							].join('\n'));

// 
							// Build the Area List:
							this.loadAreas()
							.fail(function(err){
								AD.error.log("Error loading OPNavEdit.Areas", err);
								// console.error('!!! error loading Areas!');

							})
							.then(function(Areas){

								// Async view loading.
								can.view(_this.options.templateDOMAreas, {areas:Areas}, function(frag){
									
									_this.element.find('.op-stage').append(frag);

								});
							})



						},


						loadAreas: function() {
							var Areas = AD.Model.get('opstools.OPNavEdit.OPConfigArea');
							return Areas.findAll();
						},


						'.op-navbar-editbutton click': function($el, ev) {
console.error('*** Click! ***');

							ev.preventDefault();
						}


					});


					// alert the OPSPortal we are loaded.
					AD.comm.hub.publish('opsportal.admin.opnavedit', {});

				});
		});

	});