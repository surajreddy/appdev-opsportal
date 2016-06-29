// Dependencies
steal(
    "opstools/OPTheme/controllers/OPTheme.js",
// Initialization
function(){

    // the div to attach the controller to
    var divID = 'test_OPTheme';

    // add the div to the window
    var buildHTML = function() {
        var html = [
                    '<div id="'+divID+'">',
                    '</div>'
                    ].join('\n');

        $('body').append($(html));
    }
    

    //Define the unit tests
    describe('testing controller AD.controllers.opstools.OPTheme.OPTheme ', function(){

        var testController = null;

        before(function(){

            buildHTML();

            // Initialize the controller
            testController = new AD.controllers.opstools.OPTheme.OPTheme($('#'+divID), { some:'data' });

        });



        it('controller definition exists ', function(){
            assert.isDefined(AD.controllers.opstools , ' :=> should have been defined ');
            assert.isDefined(AD.controllers.opstools.OPTheme , ' :=> should have been defined ');
            assert.isDefined(AD.controllers.opstools.OPTheme.OPTheme, ' :=> should have been defined ');
              assert.isNotNull(AD.Control.get('opstools.OPTheme.OPTheme'), ' :=> returns our controller. ');
        });


    });


});