
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


    // make sure $ is defined:
    if (typeof $ == 'undefined') var $ = AD.ui.jQuery;
    
    // create our opstools namespace for our tools.
    if (typeof AD.controllers.opstools == 'undefined') AD.controllers.opstools = {};

    // create our OpsPortal namespace for our controllers.
    if (typeof AD.controllers.OpsPortal == 'undefined') AD.controllers.OpsPortal = {};
    AD.controllers.OpsPortal.OpsPortal = can.Control.extend({


        init: function( element, options ) {
            var self = this;
            this.options = AD.defaults({
                    templateDOM: '//OpsPortal/views/OpsPortal/OpsPortal.ejs',
                    templateList: '//OpsPortal/views/OpsPortal/taskList.ejs'
            }, options);

            this.dataSource = this.options.dataSource; // AD.models.Projects;


            this.hiddenElements = [];           // used to track which elements we have hidden


            this.initDOM();                     // embedded list view
            this.initPortal();                  // popup portal view
            this.requestConfiguration();


            // make sure we resize our display to the document/window
            var sizeContent = function () {
                self.resize();
            };
            AD.ui.jQuery(document).ready(sizeContent);
            AD.ui.jQuery(window).resize(sizeContent);

			// display progress bar as tools load
			//this.progress(80, $('#opsportal-loading'));

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



        displayPortal: function() {

            var self = this;
            this.hiddenElements = [];

            // take all the body.children  && hide them.
            $('body').children().each(function(indx){
                var $el = $(this);
                if ($el != self.portalPopup) {
                    $el.hide();
                    self.hiddenElements.push($el);
                }
            });

            // Now show our Portal:
            this.portalPopup.show();

        },



        hidePortal: function() {

            var self = this;
            this.hiddenElements.forEach(function($el) {
                $el.show();
            });

            // Now show our Portal:
            this.portalPopup.hide();
        },



        initDOM: function() {

            this.element.html(can.view(this.options.templateList, {} ));


//// TODO: determine size of el
//// TODO: if large enough, display .list-content
//// TODO: create 'bootstrap' routine to insert resources into web page

//// FEATURE: Notifications : create mechanism for opstools to indicate how many tasks/todo's they want to register
//// FEATURE: SubMenu's : display additional tools in an area using SubMenu's


//            this.element.find('.opsportal-menu-trigger').sidr({name:'opsportal-menu-widget',side:'left'});
        },



        // this is the popup Ops Portal that takes over the page:
        initPortal:function() {

            this.portalPopup = AD.ui.jQuery('<div class="opsportal-portal-popup">');
            this.portalPopup.hide();
            this.portalPopup.html(can.view(this.options.templateDOM, {} ));

            this.menu = new AD.controllers.OpsPortal.MenuList(this.portalPopup.find('.opsportal-menu-widget'));
            this.workArea = new AD.controllers.OpsPortal.WorkArea(this.portalPopup.find('.opsportal-content'));
//            this.portalPopup.find('.opsportal-menu-trigger').sidr({name:'opsportal-menu-widget',side:'left'});


            AD.ui.jQuery('body').append(this.portalPopup);

        },



        resize: function() {

            var newHeight = $(window).height()  - this.portalPopup.find(".opsportal-container-masthead").outerHeight(true);

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


                    self.portalPopup.find('.opsportal-menu-trigger').sidr({name:'opsportal-menu-widget',side:'left'});

                }

            });

        },



        '.opsportal-menu-trigger-text click' : function( $el, ev) {

            // this should show the Portal Popup
            this.displayPortal();

            ev.preventDefault();
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
		'progress': function(percent, $element) {
		    var progressBarWidth = percent * $element.width() / 100;
			$element.find('div').animate({ width: progressBarWidth }, 500).html(percent + "%&nbsp;");
		}

    });


});