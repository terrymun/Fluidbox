module.exports = {
    // Development settings
    dev: {
        options: {
            outputStyle: 'nested',
            sourceMap: true
        },
        files: [{
            expand: true,
            cwd: 'src/css',
            src: ['*.scss'],
            dest: 'dist/css',
            ext: '.css'
        }, {
            expand: true,
            cwd: 'demo/src/css',
            src: ['*.scss'],
            dest: 'demo/css',
            ext: '.css'
        }]
    },
    // Production settings
    prod: {
        options: {
            outputStyle: 'compressed',
            sourceMap: true
        },
        files: [{
            expand: true,
            cwd: 'src/css',
            src: ['*.scss'],
            dest: 'dist/css',
            ext: '.min.css'
        }, {
            expand: true,
            cwd: 'demo/src/css',
            src: ['*.scss'],
            dest: 'demo/css',
            ext: '.min.css'
        }]
    }
};