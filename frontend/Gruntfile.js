module.exports = function(grunt) {

 // Load the plugin that provides the "uglify" task.
 grunt.loadNpmTasks('grunt-contrib-uglify');
 //grunt.loadNpmTasks('grunt-wiredep');
 grunt.loadNpmTasks('grunt-contrib-watch');
 grunt.loadNpmTasks('grunt-bower-concat');
 grunt.loadNpmTasks('grunt-contrib-cssmin');
 grunt.loadNpmTasks('grunt-contrib-concat');
 grunt.loadNpmTasks('grunt-contrib-copy');

  // Project configuration.
grunt.initConfig({
  bower_concat: {
    all: {
      dest: {
        js:'web/built/js/_bower.min.js',
        css: 'web/built/css/_bower.min.css'
      },
      include: [
        'jquery',
        'angular',
        'angular-cookies',
        'angular-jwt',
        'angular-sanitize',
        //'angular-touch',
        'angular-translate',
        'angular-ui-router',
        'angular-animate',
        'angular-ui-router-anim-in-out',
        'auth0-angular',
        'jquery-simplecolorpicker',
        'jssor-slider',
        'lightgallery',
        'masonry',
        'cropper',
        'underscore',
        'md5',
        'ngCordova',
        'angular-flippy',
        'angular-progress-button-styles',
    	 'tinymce',
        'tinymce-mention',
        'waypoints',
        'select2',
        'react',
        'ngReact',
        //'angular-lazy-img',
        //'tether',
        //'tether-drop',
        //'tether-tooltip'
      ],
      dependencies: {
        'angular': 'jquery',
        'cropper': 'jquery',
        'ngCordova': 'angular',
        'ionic': 'angular',
        'tinymce': 'jquery',
        'tinymce-mention':'tinymce',
        'select2':'jquery',
        'ngReact':'react',
        //'angular-lazy-img':'angular',
        //'tether-tooltip':['tether','tether-drop']
      },
      exclude: [
        'grunt',
        'tinymce-dist',
        'auth0.js',
        'auth0-lock',
        'angular-storage'
      ],
      mainFiles: {
        "angular-ui-router-anim-in-out": [
          "anim-in-out.js",
          "css/anim-in-out.css"
        ],
        "jquery": [
          "dist/jquery.min.js"
        ],
        "angular": [
          "angular.js"
        ],
        "angular-cookies": [
          "angular-cookies.min.js"
        ],
        "angular-jwt": [
          "dist/angular-jwt.min.js"
        ],
        "auth0-angular": [
          "build/auth0-angular.min.js"
        ],
        "font-awesome": [
          "css/font-awesome.min.css"
        ],
        "angular-sanitize": [
          "angular-sanitize.min.js"
        ],
        /*"angular-touch": [
          "angular-touch.min.js"
        ],*/
        "angular-translate": [
          "angular-translate.min.js"
        ],
        "angular-ui-router": [
          "release/angular-ui-router.min.js"
        ],
        "angular-animate": [
          "angular-animate.min.js"
        ],
        "lightgallery": [
          "dist/js/lightgallery.min.js",
          "dist/js/lg-fullscreen.min.js",
          "dist/js/lg-thumbnail.min.js",
          "dist/js/lg-video.min.js",
          "dist/js/lg-autoplay.min.js",
          "dist/js/lg-zoom.min.js",
          "dist/css/lightgallery.min.css"
        ],
        "masonry": [
          "dist/masonry.pkgd.min.js"
        ],
        "jquery-simplecolorpicker": [
          "jquery.simplecolorpicker.js",
          "jquery.simplecolorpicker.css"
        ],
        "cropper": ["dist/cropper.min.js","dist/cropper.min.css"],
        "ngCordova": ["dist/ng-cordova.min.js","dist/ng-cordova-mocks.min.js"],
        "angular-flippy": ["dist/js/angular-flippy.min.js","dist/css/angular-flippy.min.css"],
        'angular-progress-button-styles': ["dist/angular-progress-button-styles.min.js","dist/angular-progress-button-styles.min.css"],
        'tinymce': [
          "tinymce.min.js",
          "plugins/paste/plugin.min.js",
          "plugins/link/plugin.min.js",
          "plugins/code/plugin.min.js",
          "plugins/emoticons/plugin.min.js",
          "plugins/fullscreen/plugin.min.js",
          "themes/modern/theme.min.js"
        ],
        'tinymce-mention': ["mention/plugin.min.js"],
        'underscore': ["underscore-min.js"],
        'waypoints': ["lib/jquery.waypoints.min.js","lib/shortcuts/infinite.min.js"],
        'select2': ["dist/js/select2.min.js","dist/css/select2.min.css"],
        'react': ["react.min.js","react-dom.min.js","react-with-addons.min.js"],
        'ngReact': ["ngReact.min.js"],
        //'angular-lazy-img': ["release/angular-lazy-img.js"],
        //'tether': ["dist/js/tether.min.js"],
        //'tether-drop': ["dist/js/drop.min.js"],
        //'tether-tooltip': ["dist/js/tooltip.min.js"]
      },
      options: { separator : ';\n\n' }
    }
  },
  /*wiredep: {
      task: {
        src: ['app/Resources/views/base.html.twig'],
        fileTypes: {
          html: {
            replace: {
              js: '<script src="{{filePath}}"></script>'
            }
          }
        }
      }
  },*/
  uglify: {
    my_target: {
      files: {
        'web/built/js/iloveplatos-lib.min.js': [
          'web/lib/angular-storage/dist/angular-storage.js',
          'web/lib/ngMeta/dist/ngMeta.js',
          'web/lib/ng-videosharing-embed-master/src/angular-embedplayer.js',
          'web/lib/ng-videosharing-embed-master/src/filters/videosettings.js',
          'web/lib/ng-videosharing-embed-master/src/filters/whitelist.js',
          'web/lib/ng-videosharing-embed-master/src/directives/embedvideo.js',
          'web/js/custom/custom.js',
          'web/lib/material-refresh/build/js/material-refresh.js',
        ],
        'web/js/custom/lock.min.js': ['web/js/custom/lock.js','web/js/custom/lock-7.9-custom.js'],
        'web/built/js/iloveplatos.min.js': [
          'web/built/js/iloveplatos.js'
        ]
      }
    }
  },
  concat: {
    dist: {
      src: [
          'web/built/js/_bower.min.js',
          'web/js/i18n/es_ES.js',
          'web/js/i18n/en_EN.js',
          'web/js/custom/lock.min.js',
          'web/built/js/iloveplatos-lib.min.js',
          'web/built/js/iloveplatos.min.js'
      ],
      dest: 'web/built/js/iloveplatos-core.min.js'
    }
  },
  copy: {
    main: {
      files: [
        // includes files within path
        {expand: true, cwd: 'web/js/bower_components/lightgallery/dist/fonts/', src: ['*'], dest: 'web/built/fonts/'},
        {expand: true, cwd: 'web/js/bower_components/lightgallery/dist/img/', src: ['*'], dest: 'web/built/img/'},
        {expand: true, cwd: 'web/js/bower_components/font-awesome/fonts', src: ['*'], dest: 'web/built/fonts/'},
        {expand: true, cwd: 'web/js/bower_components/angular-animate/', src: ['angular-animate.min.js.map'], dest: 'web/built/js/'},
        {expand: true, cwd: 'web/js/bower_components/angular-sanitize/', src: ['angular-sanitize.min.js.map'], dest: 'web/built/js/'},
        {expand: true, cwd: 'web/js/bower_components/tinymce/', src: ['plugins/emoticons/img/*'], dest: 'web/built/js/'},
      ],
    },
  },
  cssmin: {
    target: {
      files: {
        'web/css/iloveplatos.min.css': [
          'web/css/styles.css',
          'web/lib/material-refresh/build/css/material-refresh.min.css'
        ]
      }
    }
  },
});

  // Default task(s).
  grunt.registerTask('default', ['bower_concat','cssmin','uglify','concat','copy']);

};
