module.exports = {

    options: {
        spawn: false,
        livereload: true
    },

    scripts: {
        files: [
            'src/js/*.js'
        ],
        tasks: [
            'jshint',
            'uglify'
        ]
    },

    styles: {
        files: [
            'src/css/*.scss',
            'demo/src/css/*.scss'
        ],
        tasks: [
            'sass:prod',
            'postcss:prod'
        ]
    },
};