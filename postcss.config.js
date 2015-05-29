// exports all plugins to run when building
module.exports = [
    require('postcss-import'),
    require('postcss-nested'),
    require('postcss-css-variables'),
    require('autoprefixer-core')({ browsers: ['last 5 versions'] })
];
