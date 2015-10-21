var path = require('path');

// exports all plugins to run when building
module.exports = function(config) {
    var input = {
        postcss: {
            path: [
                process.cwd(),
                path.resolve(__dirname, 'src', 'styles')
            ]
        }
    };

    if (config && config.postcss) {
        // merge options
    }

    return [
        require('postcss-import')(input.postcss),
        require('postcss-custom-properties')(),
        // require('postcss-nested'),
        require('postcss-media-minmax')(),
        require('postcss-custom-media')(),
        require('autoprefixer')({ browsers: ['last 5 versions'] })
    ];
};
