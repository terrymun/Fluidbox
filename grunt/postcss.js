module.exports = {
    // Development settings
    dev: {
        options: {
            map: true,
            processors: [
                require('autoprefixer')({browsers: '> 2.5%'})
            ]
        },
        files: [{
            expand: true,
            cwd: 'dist/css',
            src: ['*.css'],
            dest: 'dist/css',
            ext: '.css'
        }, {
            expand: true,
            cwd: 'demo/css',
            src: ['*.css'],
            dest: 'demo/css',
            ext: '.css'
        }]
    },
    // Production settings
    prod: {
        options: {
            map: true,
            processors: [
                require('autoprefixer')({browsers: '> 2.5%'}),
                require('cssnano')({zindex: false})
            ]
        },
        files: [{
            expand: true,
            cwd: 'dist/css',
            src: ['*.css'],
            dest: 'dist/css',
            ext: '.min.css'
        }, {
            expand: true,
            cwd: 'demo/css',
            src: ['*.css'],
            dest: 'demo/css',
            ext: '.min.css'
        }]
    }
};