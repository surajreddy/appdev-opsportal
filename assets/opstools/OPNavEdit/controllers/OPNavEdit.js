
steal(
	// List your Controller's dependencies here:
	'opstools/OPNavEdit/models/OPConfigArea.js',
	'opstools/OPNavEdit/views/OPNavEdit/OPNavEditAreas.ejs',
	'opstools/OPNavEdit/views/OPNavEdit/OPNavEditAreaForm.ejs',
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
								templateDOMAreaForm: '/opstools/OPNavEdit/views/OPNavEdit/OPNavEditAreaForm.ejs',
								resize_notification: 'OPNavEdit.resize',
								tool: null   // the parent opsPortal Tool() object
							}, options);
							this.options = options;

							// Call parent init
							this._super(element, options);


							this.dom = {};
							this.dom.area = null;
							this.dom.tools = null;

							this.events = {};
							this.events.lastArea = null;

							this.initDOM();
							this.initEvents();

						},



						initDOM: function() {
							var _this = this;
//// LEFT OFF HERE:

// make sure the popups are attached to the current Areas in the list.
// replace icon selector with input and icon display.

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
							})
							.then(function(Areas){

								// Async view loading.
								can.view(_this.options.templateDOMAreas, {areas:Areas}, function(frag){
									
									_this.element.find('.op-stage').append(frag);
									_this.dom.area = _this.element.find('.op-navbar-lpanel');
									_this.dom.area.hide(); // make sure it is hidden.

								});
							})



						},


						/*
						 * @function initEvents
						 *
						 * prepare the event listeners
						 */
						initEvents: function() {

							var _this = this;

							// listen for area show notifications.
                            AD.comm.hub.subscribe('opsportal.area.show', function (key, data) {

                            	// we just passively keep track of the last area.show event
                            	// so we know which one to return to once we exit our 
                            	// tool.
                            	if (data.area != 'opnavedit') {
	                            	_this.events.lastArea = data;
	                            }

                            });

						},


						loadAreas: function() {
							var Areas = AD.Model.get('opstools.OPNavEdit.OPConfigArea');
							return Areas.findAll();
						},


						'.op-navbar-editbutton click': function($el, ev) {
console.error('*** Click! ***');
							
							// hide all other areas
							AD.comm.hub.publish('opsportal.area.show', { area: 'opnavedit' });

							// show our area
							this.dom.area.show();

							// close the slide in menu:
							AD.ui.jQuery.sidr('close', 'op-menu-widget');

							ev.preventDefault();
						}


					});


					// alert the OPSPortal we are loaded.
					AD.comm.hub.publish('opsportal.admin.opnavedit', {});

				});
		});

	});