// exports all plugins to run when building
module.exports = [
    require('postcss-import'),
    require('postcss-custom-properties')(),
    require('postcss-nested'),
    require('postcss-media-minmax')(),
    require('postcss-custom-media')(),
    require('autoprefixer-core')({ browsers: ['last 5 versions'] })
];
