
steal(
        // List your Controller's dependencies here:
        'appdev',
//        'OpsPortal/models/Projects.js',
//        'appdev/widgets/ad_delete_ios/ad_delete_ios.js',
        // '//OpsPortal/views/OpsButtonBusy/OpsButtonBusy.ejs',
function(){


    // The OpsPortal will define a global namespace for our added utilities:
    if (typeof AD.op == 'undefined') AD.op = {};
    
    /**
     * @class AD.op.Widget
     * @parent can.Control
     *
     * This is a generic Ops Widget controller that will handle resizing a section of
     * HTML that conforms to the standard op-widget specification.
     *
     */
    AD.op.Widget = can.Control.extend({
        // Static Properties
    },{

        // Instance Properties:

        init: function (element, options) {
            var _this = this;
            options = AD.defaults({
                    // // templateDOM: '//OpsPortal/views/OpsButtonBusy/OpsButtonBusy.ejs'
                    // selectorIcon: '.fa',        // jquery selector for the icon el
                    // classBusy: 'fa-spinner',    // the class to add for the spinner
                    // shouldDisable: true,        // auto disable on busy() ?
                    // onClick:function(ev) { }    // button.click() handler
            }, options);
            this.options = options;

            // Call parent init
            this._super(element, options);


            this.initDOM();
        },




        initDOM: function () {


        },


        resize: function( data ) {

            // the outer height of my widget should be: data.height
            this.element.css("height", data.height + "px");
                
                
            // the height of our body section  should be the height of our widget - mastHead - footer
             
            var footerHeight = this.element.find(".op-widget-footer").outerHeight(true);

            var mastheadHeight = this.element.find(".op-widget-masthead").outerHeight(true);

            this.element.find('.op-widget-body').css("height", (data.height - mastheadHeight - footerHeight) + "px");  
        }



        // '.ad-item-add click': function ($el, ev) {

        //     ev.preventDefault();
        // }


    });


});