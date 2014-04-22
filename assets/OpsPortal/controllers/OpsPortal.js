
steal(
        // List your Controller's dependencies here:
        'appdev',
        'OpsPortal/portal-scratch.css',
		'OpsPortal/opsportal.css',
        'OpsPortal/controllers/MenuList.js',
        'OpsPortal/controllers/WorkArea.js',
        'OpsPortal/classes/OpsTool.js'
).then(
        'opsportal/requirements.js'
).then(
//        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
//        'OpsPortal/views/Portal/Portal.ejs',
function(){


    // create our opstools namespace for our tools.
    if (typeof AD.controllers.opstools == 'undefined') AD.controllers.opstools = {};

    // create our OpsPortal namespace for our controllers.
    if (typeof AD.controllers.OpsPortal == 'undefined') AD.controllers.OpsPortal = {};
    AD.controllers.OpsPortal.OpsPortal = can.Control.extend({


        init: function( element, options ) {
            var self = this;
            this.options = AD.defaults({
                    templateDOM: '//OpsPortal/views/OpsPortal/OpsPortal.ejs'
            }, options);

            this.dataSource = this.options.dataSource; // AD.models.Projects;

            this.initDOM();
            this.requestConfiguration();


            // make sure we resize our display to the document/window
            var sizeContent = function () {
                self.resize();
            };
            $(document).ready(sizeContent);
            $(window).resize(sizeContent);



            // OK, one of the problems with resizing our tools comes when
            // they are currently not displayed.  Some widgets (GenLists.js)
            // need to evaluate their layout based upon the size of their
            // existing headers.  But when that header isn't displayed, the
            // reported size is 0.
            // These tools need a chance to resize again once they are displayed
            // So, those tools being 'opsportal.area.show'n need to resize
            // now that they are displayed.
            // This will force a global resize which will do the trick.
            AD.comm.hub.subscribe('opsportal.area.show', function (key, data) {

                setTimeout(sizeContent,4);

            });

        },



        createTool: function( tool) {
            console.log(tool);
        },



        initDOM: function() {

            this.element.html(can.view(this.options.templateDOM, {} ));

            this.menu = new AD.controllers.OpsPortal.MenuList(this.element.find('.opsportal-menu-widget'));
            this.workArea = new AD.controllers.OpsPortal.WorkArea(this.element.find('.opsportal-content'));

            this.element.find('.opsportal-menu-trigger').sidr({name:'opsportal-menu-widget',side:'left'});
        },



        resize: function() {

            var newHeight = $(window).height()  - this.element.find(".opsportal-container-masthead").outerHeight(true);

            // notify of a resize action.
            // -1px to ensure sub tools don't cause page scrolling.
            AD.comm.hub.publish('opsportal.resize', { height: newHeight-1 });
        },



        requestConfiguration: function() {
            var self = this;
//// For debugging:
AD.comm.hub.subscribe('**', function(key, data){
    console.log('pub:'+key);
    console.log(data);
});
            AD.comm.service.get({ url:'/opsportal/config' }, function (err, data) {

                if (err) {
                    // what to do here?
                } else {

                    var defaultArea  = {};

                    // choose 1st area as default just in case none specified:
                    if (data.areas[0]) {
                        defaultArea = data.areas[0];
                    }

                    // create each area
                    for (var a=0; a < data.areas.length; a++) {
                        AD.comm.hub.publish('opsportal.area.new', data.areas[a]);
                        if(data.areas[a].isDefault) {
                            defaultArea = data.areas[a];
                        }
                    }


                    var defaultTool = {};

                    // assign 1st tool as our default to show
                    if (data.tools[0]) defaultTool[data.tools[0].area] = data.tools[0];

                    // create each tool
                    for (var t=0; t < data.tools.length; t++) {
                        AD.comm.hub.publish('opsportal.tool.new', data.tools[t]);
                        if (data.tools[t].isDefault) defaultTool[data.tools[t].area] = data.tools[t];
                    }


                    //// all tools should be created now

                    // make sure they all have resize()ed
                    self.resize();

                    // notify of our default Area:
                    // there can be only 1 ...
                    AD.comm.hub.publish('opsportal.area.show', {area:defaultArea.key});

                    // now notify all our default tools
                    for (var t in defaultTool) {
                        AD.comm.hub.publish('opsportal.tool.show', {
                            area:defaultTool[t].area,
                            tool:defaultTool[t].controller
                        });
                    }

                }

            });

        },



        '.ad-item-add click': function($el, ev) {

            ev.preventDefault();
        },


/*
        '.apd-portal-menu-trigger click': function($el, ev) {

            var width = this.menu.width();  //.toggle();
            AD.comm.hub.publish('opsportal.menu.toggle', { width: width });
        }
*/

    });


});