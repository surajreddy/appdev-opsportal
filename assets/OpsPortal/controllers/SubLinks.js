
steal(
        'appdev',
function(){


    //
    // SubLinks 
    // 
    // This controller manages the sublinks that appear in the Masthead.
    //
    // For each Area defined in the OpsPortal, a new set of SubLinks will appear.
    //
    // Each Area of the OpsPortal can contain numerous Tools for the user to 
    // work with.  The SubLinks will allow the user to switch between tools
    // in the currently displyed Area.
    //
    // When the main OpsPortal controller receives it's configuration 
    // information from the server, the OpsPortal will fire off a 
    // 'opsportal.area.new' notification for each Area defined.
    //
    // This SubLinks controller listens for each of those notifications and
    // creates a new set of links for each Area it is told about.
    //
    // Clicking on one of the links will cause this SubLinks controller
    // to emit 'opsportal.tool.show', with the tool definition for that link.
    //
    AD.Control.extend('OpsPortal.SubLinks', { 

        init: function( element, options ) {
            var self = this;
            this.options = AD.defaults({
                    // templateDOM: '//OpsPortal/views/Sublinks/Sublinks.ejs',
                    // templateItem: '//OpsPortal/views/MenuList/menuItem.ejs'
            }, options);


            this.areaLinks = {};    // the DOM ul for each of our area links

            this.initDOM();


            // listen for new area notifications
            AD.comm.hub.subscribe('opsportal.area.new', function (key, data) {
                self.createArea(data);
            });


            // listen for new tool notifications.
            AD.comm.hub.subscribe('opsportal.tool.new', function(key, data) {

                self.createLink(data);                
            });


            // listen for area.show notifications.
            AD.comm.hub.subscribe('opsportal.area.show', function(key, data) {
                self.showArea(data);                
            });

        },



        createArea: function( area) {
            // console.log(area);

            this.element.append(can.view('OpsPortal_SubLinks_Area', {area:area}));

            this.areaLinks[area.key] = this.element.find('[area="'+area.key+'"]');


        },



        createLink: function( tool ) {

            var area = this.areaLinks[tool.area];
            if (area) {
                area.append(can.view('OpsPortal_SubLinks_Item', {tool:tool}));
            }

        },


        showArea: function( area ) {

            for (var k in this.areaLinks) {
                if (k == area.area) {
                    this.areaLinks[k].show();
                } else {
                    this.areaLinks[k].hide();
                }
            }
        },



        initDOM: function() {

            // this.element.html(can.view(this.options.templateDOM, {} ));

            // register template as :  'OpsPortal_SubLinks_Item'
            //  NOTE:  DON'T USE '.' as seperators here!!!  -> can.ejs thinks they are file names then... doh!
            var item =  this.domToTemplate(this.element.find('ul'));
            can.view.ejs('OpsPortal_SubLinks_Item', item);

            // remove the template from the DOM
            this.element.find('ul').html(' ');


            // create the area template
            var area = this.domToTemplate(this.element)
            can.view.ejs('OpsPortal_SubLinks_Area', area);


            // empty my contents.
            this.element.html(' ');

        },



        //  When a menu item is clicked
        '.opsportal-masthead-link click' : function($el, ev) {

            var tool = $el.data('tool');
            AD.comm.hub.publish('opsportal.tool.show', {area:tool.area, tool:tool.controller});
            ev.preventDefault();
        }


    });


});