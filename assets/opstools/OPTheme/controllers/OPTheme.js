
steal(
	// List your Controller's dependencies here:
	//'opstools/OPTheme/models/Projects.js',
	// '/opstools/OPTheme/views/OPTheme/OPTheme.ejs',
	function() {
        System.import('appdev').then(function() {
			steal.import('appdev/ad',
				'appdev/control/control').then(function() {
					//'appdev/widgets/ad_delete_ios/ad_delete_ios',			

					// Namespacing conventions:
					// AD.Control.extend('[application].[controller]', [{ static },] {instance} );
					AD.Control.OpsTool.extend('OPTheme', {


						init: function(element, options) {
							var self = this;
							options = AD.defaults({
								templateDOM: '/opstools/OPTheme/views/OPTheme/OPTheme.ejs'
							}, options);
							this.options = options;

							// Call parent init
							this._super(element, options);

							this.data = {};

							this.loadDOM();
						},



						loadDOM: function(){
							var _this = this;

							// Asynchronously Load the Template
							can.view(this.options.templateDOM, {}, function(frag) {
								_this.element.html(frag);

								// now that the HTML is in the DOM, attach our components:
								_this.initDOM();
							})
						},



						initDOM: function() {
							var _this = this;


							// Transform the encoded ejs template into an actual EJS template
							this.list = this.element.find('.optheme-list');		// attach to the list <select>
                            var listTemplate = this.domToTemplate(this.list);	// convert contents of list to an ejs template string
                            can.view.ejs('OPTHEME_LIST', listTemplate);			// convert string to actual EJS renderer 
                            this.list.html(''); 								// clear the list.
			

                            // attach our buttons
                            this.buttonDefault = new AD.op.ButtonBusy(this.element.find('.optheme-default'));
							this.buttonSave = new AD.op.ButtonBusy(this.element.find('.optheme-addTheme'));


							// now load our data:
							this.loadData();
						},



						loadData: function() {
							var _this = this;

							// request a list of themes from the server and display them:
							AD.comm.service.get({ url:'/optheme'})
							.fail(function(err){
								AD.error.log('Error loading OPTheme themes', {error:err});
							})
							.done(function(list){

								_this.data.themes = list;
								_this.list.html(can.view('OPTHEME_LIST', {themes:list}))

							})
						},



						isValid:function() {

							// do whatever you need to do to validate the form.
							var values = this.values();


							// if they are all valid
							return true;
						},



						values:function(){
							// scan the form elements and return a value hash:

							var values = {};
							$.each(this.element.find('#optheme-form').serializeArray(), function(i, field) {
							    values[field.name] = field.value;
							});
							return values;
						},



						'.optheme-addTheme click': function($el, ev) {
							var _this = this;

							if (this.isValid()) {

								var values = this.values();

								// indicate we are sending data to the server
								this.buttonSave.busy();

								AD.comm.service.post({url:'/optheme', params:values })
								.fail(function(err){

									_this.buttonSave.ready();
									AD.error.log("Error creating new OPTheme", {error:err, values:values });
								})
								.then(function(){

									// server transaction complete.
									_this.buttonSave.ready();


									// should now update your list of current themes
									_this.loadData();
									
								})

							}

							ev.preventDefault();
						},


						'.optheme-default click': function($el, ev) {
							// when the default theme button is clicked,
							// find which theme is selected, and then 
							// update the server with that info
							var _this = this;


							var name = '';
							var selectedTheme = this.list.find('option.selected');
							if (selectedTheme[0]) {
								name = $(selectedTheme[0]).val();
							}
							if (name != '') {
								this.buttonDefault.busy();
								AD.comm.service.post({url:'/optheme/default', params:{name:name}})
								.fail(function(err){
									_this.buttonDefault.ready();
									AD.error.log('Error setting OPTheme.default', {error:err, name:name});
								})
								.done(function(status){

									_this.buttonDefault.ready();

									// now try to load the selected theme:
									steal('opstools/OPTheme/themes/'+name);
								})
							}

						},


						'.optheme-list-item click': function($el, ev) {
							// when an item in the theme list is clicked
							// make sure only it has the .selected class assigned
					

							// all options remove selected class
							this.list.find('option').each(function(i, el){
								$(el).removeClass('selected');
							})

							$el.addClass('selected');
						}


					});

				});
		});

	});