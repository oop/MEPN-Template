module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            build: {
                src: 'core/frontend/site/main.js',
                dest: 'public/assets/site/js/bundle.js'
            },
            build2: {
                src: 'core/frontend/panel/main.js',
                dest: 'public/assets/panel/js/bundle.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-browserify');
    grunt.registerTask('default', 'browserify');
};