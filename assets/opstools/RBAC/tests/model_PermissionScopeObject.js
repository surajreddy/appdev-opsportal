// Dependencies
steal(
    "opstools/RBAC/models/PermissionScopeObject.js",
// Initialization
function(){


    //Define the unit tests
    describe('testing model AD.models.opstools.RBAC.PermissionScopeObject ', function(){


        before(function(){


        });


        it('model definition exists ', function(){
            assert.isDefined(AD.models.opstools, ' :=> should have been defined ');
            assert.isDefined(AD.models.opstools.RBAC, ' :=> should have been defined ');
            assert.isDefined(AD.models.opstools.RBAC.PermissionScopeObject, ' :=> should have been defined ');
            assert.isNotNull(AD.Model.get("opstools.RBAC.PermissionScopeObject"), ' :=> did not return null');
        });

    });


});