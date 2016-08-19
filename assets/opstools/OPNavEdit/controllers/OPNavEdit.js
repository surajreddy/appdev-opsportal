
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



						initAreaPopups:function() {
							var _this = this;

							// for each area icon not already initialized.
							this.dom.area.find('.op-navbar-item-edit:not([op-navbar-init])').each(function(indx, icon) {
								
								// get it's area model
								var $icon = $(icon);
								var area = $icon.parent().data('area');

								// render popup view
								function myTitle () {
									return AD.lang.label.getLabelSpan(area.label) + ' <a class="close" href="#">&times;</a>'
								}

								$icon.popover({
						            placement: 'right',
						            title: myTitle(),
						            trigger: 'click',
						            html: true,
						            content: function () {
						                return _this.renderer.popupArea({area:area});
						            }

						        }).on('shown.bs.popover', function(e) {
						            //console.log('shown triggered');
						            // 'aria-describedby' is the id of the current popover
						            var current_popover = '#' + $(e.target).attr('aria-describedby');
						            var $cur_pop = $(current_popover);


						            // setup the form
						            var form = new AD.op.Form($cur_pop);
						            form.addField('label', 'string', { notEmpty:{} } );
						            form.addField('icon', 'string', { notEmpty:{} } );
						            form.attach();

						            

						          	// process close / cancel clicks
						            $cur_pop.find('.close').click(function(){
						                $icon.click();
						            });
						          
						            $cur_pop.find('.op-nav-button-cancel').click(function(){
						               $icon.click();
						            });

						            var iconData = $cur_pop.find('[name="icon"]');
						            iconData.change(function(ev){
						            	var $example = $cur_pop.find('.icon-example').removeClass().addClass('icon-example fa '+iconData.val())
						            })
						            
						            // process [save] click
						            var buttonSave = $cur_pop.find('.op-nav-button-save');
						            var busySave = new AD.op.ButtonBusy(buttonSave);
						            buttonSave.click(function(){
										if (form.isValid()) {

											busySave.busy();

											var values = form.values();
console.log('... values:', values);
											// if the label has changed:
											if (values.label != AD.lang.label.getLabel(area.label)) {
console.log('    ... updating label:', values.label);
												// update our UI label:
												AD.lang.label.setLabel(area.label, values.label);

												// tell our server about the new label update
												var params = {
													key: area.label,
													label: values.label
												}
												AD.comm.service.put({url:'/opnavedit/arealabel', params:params})
												.fail(function(err){
													AD.error.log('Error updating Area Label:', { error:err });
												})
												.then(function(response){
													// manually update the icon's text (since)
													$icon.parent().find('.ops-navbar-menuItem').html(values.label);
													$cur_pop.find('.popover-title').html(myTitle());
console.log('... update response:', response);
												})
											}


											area.attr('icon', values.icon);
											area.save()
											.fail(function(err){
												busySave.ready();
												AD.error.log('Error saving Area', {error:err});

											})
											.then(function(updatedArea){
												busySave.ready();
												$icon.click();
											})

										}
						            });
						        });


						        $icon.attr('op-navbar-init', true);
////// LEFT OFF HERE:

							

							});

							//
						},



						initDOM: function() {
							var _this = this;


							// prepare our Area Popup html renderer
							this.renderer = {}
							this.renderer.popupArea = can.view.render(this.options.templateDOMAreaForm);
//// LEFT OFF HERE:

// make sure the popups are attached to the current Areas in the list.
// replace icon selector with input and icon display.

// OPConfigArea route should be protected by our opsportal.opnavedit.view permission.

							var menuFooter = $(this.element.find('#op-menu-widget .op-widget-footer'));
							menuFooter.prepend([
'<div class="op-navbar-editbutton">',
'<i class="fa fa-pencil-square-o" aria-hidden="true"></i>' + AD.lang.label.getLabelSpan('opnavedit.Edit'),
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


									_this.initSort();
									_this.initAreaPopups();
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

	                            	// make sure our area is hidden:
	                            	_this.dom.area.hide();
	                            }

                            });

						},


						/**
						 * @function initSort
						 * setup the sortable menu area
						 * @return {deferred}
						 */
						initSort:function(){
							var _this = this;

							this.dom.area.find( ".sortableMenu" ).sortable({
								revert: true,
								handle: '.sort-handle',
								cursor: 'move', 
								axis: 'y',
								start:function(ev, ui) {
									// mark current position in list
									ui.item.data('start_pos', ui.item.index());
								},
								update:function(event, ui) {
									var start_pos = ui.item.data('start_pos');
									var index  = ui.item.index();

// 									var numItems = _this.dom.area.find('.sortableMenu li').length;
// 									for(var i=1;i <= numItems; i++){
// 							            var area = _this.dom.area.find('.sortableMenu li:nth-child(' + i + ')').data('area');
// 							            if (area) {
// 							            	area.attr('weight', i);
// console.log('    ... area:', area);
// 							            }
// 							        }

									if (start_pos < index) {

								        //update the items before the re-ordered item
								        for(var i=index; i >= 0; i--){
								            var area = _this.dom.area.find('.sortableMenu li:nth-child(' + (i+1) + ')').data('area');
								            if (area) {
								            	area.attr('weight', i);
								            	area.save()
								            	.fail(function(err){
								            		AD.error.log('Error updating Area Weight.', err);
								            	})
								            }
								        }

								    }else {

										var numItems = _this.dom.area.find('.sortableMenu li').length;

								        //update the items after the re-ordered item
								        for(var i=index;i <= numItems; i++){
								            var area = _this.dom.area.find('.sortableMenu li:nth-child(' + (i+1) + ')').data('area');
								            if (area) {
								            	area.attr('weight', i);
								            	area.save()
								            	.fail(function(err){
								            		AD.error.log('Error updating Area Weight.', err);
								            	})
								            }
								        }
								    }

								}
							});
						 //    this.dom.area.find( ".sortableMenu" ).disableSelection();
						},


						/**
						 * @function loadAreas
						 * load the defined areas from the server.
						 * @return {deferred}
						 */
						loadAreas: function() {
							var Areas = AD.Model.get('opstools.OPNavEdit.OPConfigArea');
							return Areas.findAll({ where:{}, sort:'weight'});
						},


						/**
						 * .op-navbar-editbutton click
						 * What happens when the edit button is clicked.
						 */
						'.op-navbar-editbutton click': function($el, ev) {
							
							// hide all other areas
							AD.comm.hub.publish('opsportal.area.show', { area: 'opnavedit' });

							// show our area
							this.dom.area.show('slide', {direction: 'left'}, 400);

							// close the slide in menu:
							AD.ui.jQuery.sidr('close', 'op-menu-widget');

							ev.preventDefault();
						},


						/**
						 * .op-navbar-save click
						 * What happens when the save button is clicked.
						 */
						'.op-navbar-save click' : function ($el, ev) {
							var _this = this;

							this.dom.area.hide('slide', {direction: 'left'}, 400, function(){ 
							
								// repost last recorded area.show (if exists)
								if (_this.events.lastArea) {
									AD.comm.hub.publish('opsportal.area.show', _this.events.lastArea);
								} else {

									// choose the first menu item, and click it:
									_this.element.find('.op-menu-widget li:first').click();
								}

								// close the slide in menu:
								AD.ui.jQuery.sidr('close', 'op-menu-widget');
							});

							ev.preventDefault();
						}


					});


					// alert the OPSPortal we are loaded.
					AD.comm.hub.publish('opsportal.admin.opnavedit', {});

				});
		});

	});