    // Dependencies
    steal(
//        "../../../../../../assets/appdev/appdev.js"
        "../../../../assets/appdev/appdev.js"
    )

    // Initialization
    .then(function(){

        mocha.setup({
            ui: 'bdd',
            timeout: 9000,
            reporter: 'html'
        });
        expect = chai.expect;
        assert = chai.assert;

    })
    .then(
        // [appdev-cli] : leave this next comment! 
        // load our tests here
        "opstools/RBAC/tests/controller_RoleAdd.js",
        "opstools/RBAC/tests/controller_UserAssignmentAdd.js",
        "opstools/RBAC/tests/controller_Roles.js",
        "opstools/RBAC/tests/controller_Users.js",
        "opstools/RBAC/tests/controller_RBAC.js",
        "opstools/RBAC/tests/app.js"
    )
    .then(function() {
        // Execute the tests
        if (window.mochaPhantomJS) {
            mochaPhantomJS.run();
        } else {
            mocha.run();
        }
    })