
var path = require('path');
var fs = require('fs');

var AD = require('ad-utils');
var async = require('async');


var sailsOBJ;	// the running sails instance


var CONST_SETUP_FILE = '.setup_install';

var QUESTION_ADMIN = "enter the name of the admin userid:";
var QUESTION_ADMIN_DEFAULT = "admin";

var QUESTION_ROLE = "enter the name of the System Admin Role:";
var QUESTION_ROLE_DEFAULT = "System Admin";

var QUESTION_SCOPE = "enter the name for the scope of all users:";
var QUESTION_SCOPE_DEFAULT = "All Users";


var Data = {};	// contains all our configuration info

var AdminUser  = null;	// the Admin User account;
var AdminRole  = null;	// the Admin Role account;
var AdminScope = null;	// the Admin Scope account;
var ActionKeys = null;  // the Action keys we are interested in.



var Main = function() {

	async.series([
		properStartDir,
		noRepeats,
	    loadSails,
	    questions,
	    createUser,
	    createRole,
	    createScope,
	    verifyActions,
	    associateRoleToActions,
	    createPermission,
	    markComplete

	], function(err, results) {

		if (sailsOBJ)  sailsOBJ.lower();

		if (err) {
//// TODO: clean up any newly created Entries: User, Role, Scope, Permissions!
			process.exit(1);
		} else {
			AD.log();
			AD.log();
			process.exit(0);
		}

		
		
	});
}



/**
 * @function reusePostProcess
 * 
 * a common fn() for our reuse question post processing.
 */
var reusePostProcess = function(data) { 
	var r = data.reuse.toLowerCase();
    if ((r == 'yes') || (r == 'y')) {
        data.reuse = true;
    } else {
        data.reuse = false;
    }
}



/**
 * @function loadSails
 * 
 * an async fn to load the sails environment so our sails models are available.
 */
var loadSails = function(done) {

	var origDir = process.cwd();

	AD.log('... loading sails <yellow>(please wait)</yellow>');
	AD.test.sails.load()
    .fail(function(err){
        AD.log.error('error loading sails: ', err);
        done(err);
    })
    .then(function(obj) {
        sailsOBJ = obj;
        process.chdir(origDir);
        done();
    });
}



/**
 * @function noRepeats
 * 
 * an async fn to make sure we have not run this before.
 */
var noRepeats = function(done) {


	fs.readFile(CONST_SETUP_FILE, function(err, data){

		if (err) {
// AD.log('... no repeats ok');
			// this is good, that means no file is here:
			done();
		} else {
			// not good.  We only want to do this 1x 
			AD.log();
			AD.log('<yellow>WARN:</yellow> This install routine is only intended to be run once.');
			AD.log('      If you need to make change to the roles and permissions, do that within ');
			AD.log('      the framework.');
			AD.log();

			var err = new Error('No Repeats.');
			done(err);
		}
	})
}



/**
 * @function properStartDir
 * 
 * an async fn to move us to the expected start directory.
 */
var properStartDir = function(done) {

	var currDir = process.cwd();
	var gotThere = AD.util.fs.moveToDirUP({ assets: 1, api:1, setup:1 });
	if (gotThere) {
// AD.log('... proper start dir:'+ process.cwd() );
		done();
	} else {
		var err = new Error('not able to move to proper start directory.');
		done(err);
	}

}



/**
 * @function questions
 * 
 * an async fn ask the user for our setup information.
 */
var questions = function(done) {

	AD.log();
	AD.log('We will attempt to setup an initial admin user and permissions that');
	AD.log('will be allowed to administrate system wide Roles and Permissions.');
	AD.log();
	AD.log('Keep in mind:');
	AD.log('   <green>userid:</green>   needs to match what is returned via your');
	AD.log('             chosen authentication system.  So if you choose "admin" ');
	AD.log('             as your userid, and you are using CAS authentication, ');
	AD.log('             you will need to be able to login as "admin" under CAS.');
	AD.log()

	var qset =  {
        question: QUESTION_ADMIN,
        data: 'adminUserID',
        def : QUESTION_ADMIN_DEFAULT,
        then: [
            {
                // cond: function(data) { return data.enableSSL; },
                question: QUESTION_ROLE,
                data: 'roleSystemAdmin',
                def: QUESTION_ROLE_DEFAULT,

            },
            {
                question: QUESTION_SCOPE,
                data: 'scopeName',
                def: QUESTION_SCOPE_DEFAULT,
                post: function(data) {}
            }
        ]
    };
    AD.cli.questions(qset, function(err, data) {

        if (err) {
             done(err);
        } else {

        	Data.admin = data.adminUserID;
        	Data.role  = data.roleSystemAdmin;
        	Data.scope = data.scopeName;

    		AD.log();

         	done();
         }

    });

}



/**
 * @function createUser
 * 
 * an async fn to create or get the desired user account.
 */
var createUser = function(done) {



	SiteUser.find({ username:Data.admin })
	.then(function(user){

// AD.log('... user:', user);
		if (user.length == 0) {

			AD.log('<green>create:</green> user account: ', Data.admin);
			SiteUser.create({ username: Data.admin })
			.then(function(newUser) {
				AdminUser = newUser;
				done();
			})
			.catch(function(err){
				done(err);
			})

		} else {

			AD.log('<yellow>found  :</yellow> existing user account: <yellow>'+ user[0].username+ ' ('+user[0].guid+')</yellow>');
			// AD.log();

			var qset = {
		        question: 'do you want to use this account [yes, no]:',
		        data: 'reuse',
		        def : 'no',
		        post: reusePostProcess,
		        then:[
		            {
		                cond: function(data) { return !data.reuse; },
		                question: QUESTION_ADMIN,
				        data: 'adminUserID',
				        def : QUESTION_ADMIN_DEFAULT,
		            }
		        ]
		    };
		    AD.cli.questions(qset, function(err, data) {

		    	if (err) {
		    		done(err);
		    	} else {

			    	if (data.reuse) {
			    		AdminUser = user[0];
			    		done();
			    	} else {

			    		Data.admin = data.adminUserID;
			    		createUser(done);
			    	}
			    }

		    })

		}
	})
}



/**
 * @function createRole
 * 
 * an async fn to create or get the desired role entry.
 */
var createRole = function(done) {

	// AD.log();

	PermissionRoleTrans.find({ role_label:Data.role })
	.then(function(roleTrans){

// AD.log('... roleTrans:', roleTrans);

		if (roleTrans.length == 0) {

			var lang = Multilingual.languages.default();

			AD.log('... creating admin role: ', Data.role);
			Multilingual.model.create({
				model: PermissionRole,
				data: { role_label: Data.role, language_code: lang, role_description:"System Wide Administrator Role" }
			})
			.fail(function(err){
				done(err);
			})
			.then(function(newRole) {

				// now get this newRole populated
				AdminRole = newRole;
				done();
			});

		} else {

			AD.log('<yellow>found  :</yellow> existing role: <yellow>'+ roleTrans[0].role_label+' ('+roleTrans[0].role_description+')</yellow>');


			var qset =  {
		        question: 'do you want to use this role [yes, no]:',
		        data: 'reuse',
		        def : 'no',
		        post: reusePostProcess,
		        then:[
		            {
		                cond: function(data) { return !data.reuse; },
		                question: QUESTION_ROLE,
		                data: 'roleSystemAdmin',
		                def: QUESTION_ROLE_DEFAULT,
		            }
		        ]
		    };
		    AD.cli.questions(qset, function(err, data) {

		    	if (err) {
		    		done(err);
		    	} else {

			    	if (data.reuse) {

			    		PermissionRole.find({id: roleTrans[0].role})
			    		.populate('actions')
			    		.then(function( pRole ){
			    			AdminRole = pRole[0];
			    			done();
			    		})
			    		.catch(function(err){
			    			done(err)
			    		})
			    		
			    	} else {

			    		Data.role  = data.roleSystemAdmin;
			    		createRole(done);
			    	}
			    }

		    })

		}
	})
}



/**
 * @function createScope
 * 
 * an async fn to create or get the desired scope entry.
 */
var createScope = function(done) {

	// AD.log();

	PermissionScope.find({ label:Data.scope })
	.then(function(scope){

// AD.log('... roleTrans:', roleTrans);

		if (scope.length == 0) {

			AD.log('<green>create:</green> creating new scope: '+Data.scope);
			PermissionScope.create({ label: Data.scope })
			.then(function(newScope){
				AdminScope = newScope;
				done();
			})
			.catch(function(err){
				done(err);
			});

//// TODO: once we convert Scope to Multilingual:
			// var lang = Multilingual.languages.default();

			// AD.log('... creating admin role: ', Data.role);
			// Multilingual.model.create({
			// 	model: PermissionRole,
			// 	data: { role_label: Data.role, language_code: lang, role_description:"System Wide Administrator Role" }
			// })
			// .fail(function(err){
			// 	done(err);
			// })
			// .then(function(newRole) {
			// 	AdminRole = newRole;
			// 	done();
			// });

		} else {

			AD.log('<yellow>found  :</yellow> existing scope: <yellow>'+ scope[0].label+'</yellow>');


			var qset =  {
		        question: 'do you want to use this scope [yes, no]:',
		        data: 'reuse',
		        def : 'no',
		        post: reusePostProcess,
		        then:[
		            {
		                cond: function(data) { return !data.reuse; },
		                question: QUESTION_SCOPE,
		                data: 'scopeName',
		                def: QUESTION_SCOPE_DEFAULT,
		            }
		        ]
		    };
		    AD.cli.questions(qset, function(err, data) {

		    	if (err) {
		    		done(err);
		    	} else {

			    	if (data.reuse) {
			    		AdminScope = scope[0];
			    		done();
			    	} else {

			    		Data.scope  = data.scopeName;
			    		createScope(done);
			    	}
			    }

		    })

		}
	})
}



/**
 * @function verifyActions
 * 
 * an async fn to make sure our expected permission actions are installed.
 */
var verifyActions = function(done) {

	var actionKeys = ['opsportal.view', 'adcore.admin'];
	PermissionAction.find({ action_key: actionKeys })
	.then(function(actions) {
		if (actions.length < actionKeys.length) {

			for (var i = actions.length - 1; i >= 0; i--) {
				var a = actions[i];
				var indx = actionKeys.indexOf(a.action_key);
				actionKeys.splice(indx,1);
			};

			actionKeys.forEach(function(key){
				AD.log('<red>missing:</red> verifyActions(): could not find action key: <yellow>'+key+' </yellow>')
			})

			AD.log();
			AD.log('<yellow>Before you run this script, make sure you run:</yellow>');
			AD.log('    <green>npm install appdevdesigns/appdev-core</green>');
			AD.log('    <green>npm install appdevdesigns/appdev-opsportal</green>');
			AD.log()

			var err = new Error('missing action keys.');
			done(err);
		} else {
			AD.log('<green>confirm:</green> expected action keys are in place.');
			ActionKeys = actions;
			done();
		}
	})
}



/**
 * @function associateRoleToActions
 * 
 * an async fn to associate each permission actions to our admin role.
 */
var associateRoleToActions = function(done) {

	if (ActionKeys.length == 0) {
		AD.log('<yellow>warn:</yellow> no action keys to link to role.  that doesn\'t sound right.');
		done();
	} else {
// AD.log('... associate Role To Actions')
		ActionKeys.forEach(function(action){
			AdminRole.actions.add(action);
		})

		AdminRole.save()
		.then(function(newRole){
			AD.log('<green>linked :</green> action keys to role');
			done();
		})
		.catch(function(err){

			AD.log('<yellow>linked :</yellow> action keys already linked to role');
			done();	// <--- not actually a reason to stop the process.
		})

	}
	
}



/**
 * @function createPermission
 * 
 * an async fn to create the permission entry for our Admin User
 */
var createPermission = function(done) {

// AD.log('... create Permission')
	Permission.create({

		user: AdminUser.id,
		role: AdminRole.id,
		enabled:true
	})
	.then(function(perm){

		perm.scope.add(AdminScope);
		perm.save()
		.then(function(newPerm){
			AD.log('<green>created:</green> permission assignment for admin user + role + scope');
			done();
		})
		.catch(function(err){
			done(err);
		})

	})
	.catch(function(err){
		done(err);
	})
	
}



/**
 * @function markComplete
 * 
 * an async fn to mark that we have run this routine before.
 */
var markComplete = function(done) {
// AD.log('... mark complete')
// AD.log('... cwd:'+process.cwd() )

	fs.writeFile(CONST_SETUP_FILE, 'done', function (err) {
		if (err) {
			AD.log('<red>error  :</red> unable to write .setup_install file.');
			done(err);
		} else {
			AD.log('<green>marked :</green> complete.');
			done();
		}
	});
}




// Now run our Main();
Main();
