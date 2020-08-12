module.exports = function(grunt) {
    grunt.initConfig({
        purifycss: {
            target: {
                src: ['public/*.html', 'src/components/*.js', 'src/components/layout/*.js', 'src/components/views/*.js'],
                css: ['src/assets/css/argon-dashboard-react.css'],
                dest: 'src/assets/css/index.css'
            }
        }
    });

    grunt.loadNpmTasks('grunt-purifycss')
}