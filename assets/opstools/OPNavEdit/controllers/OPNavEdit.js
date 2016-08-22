
steal(
	// List your Controller's dependencies here:
	// 'opstools/OPNavEdit/models/OPConfigArea.js',
	'opstools/OPNavEdit/views/OPNavEdit/OPNavEditAreas.ejs',
	'opstools/OPNavEdit/views/OPNavEdit/OPNavEditAreaForm.ejs',
	'opstools/OPNavEdit/views/OPNavEdit/OPNavEditTools.ejs',
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
								templateDOMTools: '/opstools/OPNavEdit/views/OPNavEdit/OPNavEditTools.ejs',
								resize_notification: 'OPNavEdit.resize',
								tool: null   // the parent opsPortal Tool() object
							}, options);
							this.options = options;

							// Call parent init
							this._super(element, options);

							this.data = {};
							this.data.listAreas = null;

							this.dom = {};
							this.dom.area = null;
							this.dom.tools = null;
							this.dom.subLinks = null;

							this.events = {};
							this.events.lastArea = null;

							this.initDOM();
							this.initEvents();

						},



						initAreaPopups:function() {
							var _this = this;


							function createAreaPopup( options) {
								
								// get it's area model
								var $icon = $(options.elIcon);
								var Model = AD.Model.get('opsportal.navigation.OPConfigArea');
								var area = $icon.parent().data('area');
								var isAdd = false;

								// in the case of the [+] Add  button, there is not a current area
								// so create a new empty one:
								if( typeof area == 'undefined') {
									area = new Model({label:'', icon:''});
									isAdd = true;
								}

								// render popup view
								function myTitle () {
									return '&nbsp;<a class="close" href="#">&times;</a>'
								}

								$icon.popover({
						            placement: 'right',
						            title: myTitle(),
						            trigger: 'click',
						            html: true,
						            content: function () {
						                return _this.renderer.popupArea({area:area, isAdd:isAdd});
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

											// if this is an Add operation,
											// make sure key and weight are also set.
											if (isAdd){
												values.key = values.label;
												values.weight = _this.data.listAreas.length;
											}

											area.attr(values);
											area.save()
											.fail(function(err){
												busySave.ready();
												AD.error.log('Error saving Area', {error:err});

											})
											.then(function(updatedArea){
												if (isAdd) {
													_this.data.listAreas.push(area);
													area = new Model({label:'', icon:''});
													// pushing to the list automatically updated the DOM
													// but we have to recreate the popups on the new elements:
													_this.initAreaPopups();
													_this.initSort();
												}
												busySave.ready();
												$icon.click();
											})

										}
						            });

						            // process [delete] click
						            var buttonDelete = $cur_pop.find('.op-nav-button-del');
						            var busyDelete = new AD.op.ButtonBusy(buttonDelete);
						            buttonDelete.click(function(){
						            	busyDelete.busy();

						            	area.destroy()
						            	.fail(function(err){
						            		busyDelete.ready();
						            		AD.error.log('Error destroying Area', {error:err});
						            	})
						            	.then(function(){
						            		
						            		_this.initAreaPopups();
											_this.initSort();
						            		busyDelete.ready();
						            	})
						            })
						        });


						        $icon.attr('op-navbar-init', true);

							}


							// for each area icon not already initialized.
							this.dom.area.find('.op-navbar-item-edit:not([op-navbar-init])').each(function(indx, icon) {
								
								createAreaPopup({
									elIcon:icon
								});
								
							});

							// make sure the [+] Add button is initialized if it hasn't already been
							this.dom.area.find('.op-navbar-add:not([op-navbar-init])').each(function(indx, el){
								createAreaPopup({
									elIcon:el
								})
							})

							
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
'<i class="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp;' + AD.lang.label.getLabelSpan('opnavedit.Edit'),
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

								can.view(_this.options.templateDOMTools, {areas:Areas}, function(frag){

									_this.element.find('#op-masthead-sublinks').after(frag);
									_this.dom.tools = _this.element.find('#op-navbar-edittools');
									_this.dom.tools.hide();

								})
							})

							this.dom.subLinks = this.element.find('#op-masthead-sublinks');



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
	                            	if(_this.dom.area) _this.resetDisplay();
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
							var dfd = AD.sal.Deferred();
							var _this = this;

							var Areas = AD.Model.get('opsportal.navigation.OPConfigArea');
							Areas.findAll({ where:{}, sort:'weight'})
							.fail(function(err){
								dfd.reject(err);
							})
							.then(function(list){
								list.forEach(function(l){
									if (l.translate) l.translate();
								})
								_this.data.listAreas = list;
								dfd.resolve(list);
							});

							return dfd;
						},


						resetDisplay:function() {
							this.dom.subLinks.show();
							this.dom.tools.hide();
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
							this.dom.subLinks.hide();
							this.dom.tools.show();
							this.dom.tools.find('[area-tools]').hide();
							this.element.find('.ops-navbar-AddNewTool').hide();

							// close the slide in menu:
							AD.ui.jQuery.sidr('close', 'op-menu-widget');

							ev.preventDefault();
						},


						/**
						 * .ops-navbar-menuItem
						 * clicking on the Area name in the Area List
						 */
						'.ops-navbar-menuItem click': function( $el, ev) {

							var area = $el.parent().data('area');
							if (area) {
								// hide all area-tools sections
								this.element.find('[area-tools]').hide();

								// only show the one related to this area:
								this.element.find('[area-tools="'+area.key+'"]').show();

								// make sure the add list is shown
								this.element.find('.ops-navbar-AddNewTool').show();
							}
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

								// show the original Tool List:
								_this.resetDisplay();

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