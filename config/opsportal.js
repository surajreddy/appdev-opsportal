/**
 * Global adapter opsportal
 *
 * The Ops Portal configuration allows you to configure the installed ops tools
 * for the portal.
 *
 */
var path = require('path');

module.exports.opsportal = {

  // list out all the possible permissions listed by
  permissions: {
    'hris.profile' : 'this user can access their individual user profile',
    'hrisadmin.objects':'this user has permission to define/redefine new objects to track in HRIS.'
  },


  // Settings for the Feedback widget
  feedback: {
    enabled: false,
    
    // The filesystem location where screenshot images will be saved.
    // This should be somewhere that a webserver serves files from.
    // e.g. '/data/www/screenshots/'
    imageBasePath: '',
    
    // The public URL for accessing the saved screenshot image.
    // e.g. 'http://example.com/screenshots/'
    imageBaseURL: '',
    
    // The GitHub user account that the feedback will be posted from.
    githubUsername: '',
    githubPassword: '',
    
    // The GitHub repository that the feeback will be posted to.
    githubRepo: 'appdev-opsportal',
    // The GitHub repository owner.
    githubOwner: 'appdevdesigns'
  }, 
  

  opimageupload: {

    basePath: path.join('data', 'opimageupload'),
    maxBytes: 10000000 
  }
  
  
};
