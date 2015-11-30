# Change log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [3.1.3] - 2015-11-30

### Breaking changes

* Removed third party/video styling

### Fixed

* Fix for file input buttons causing pages to jump to top

## [3.0.26] - 2015-11-20

### Added

* Stylized blockquote

## [3.0.25] - 2015-11-18

### Breaking changes

* Removed collapsible table styles

## [3.0.23] - 2015-11-11

### Fixed

* Un-broken mediaqueries for grid 

### Added

* Responsive filters
* Breakpoint-customizable responsive helperclasses for grid
* Flex-grid 
* Gallery
* Font size t5
* Opacity60 utility class

## [3.0.18] - 2015-10-21

### Added

* internal postcss.config.js exports function
* core packages imports variables

## [3.0.15] - 2015-10-15

### Fixed

* Simplified release process to npm run scripts

### Added

* Object status component to replace ribbons
* Add profileimg size xsmall

### Breaking changes

* Deprecated ribbons

## [3.0.11] - 2015-09-16

### Fixed

* Removed overflow visible by default on buttons
* Bring back text-size-adjust to fix orientation change issues
* Added missing space in breadcrumbs

### Added

* Flex support and upgraded responsive grid system
* Add verification icon to profile images

## [3.0.4] - 2015-08-31

### Fixed

* Removed default margin from elements to make r-margin work everywhere
* Fixed default legend styling
* Fix to make popovers work inside overflow hidden

### Added

* Added pop-under variant of popovers
* Added utility class to make grid columns snap to fullwidth when printing
* Added fullwidth class to labels

### Breaking changes

* Bugfix for popovers necessitates slightly different markup

## [3.0.1] - 2015-08-07

### Fixed

* Fix syntax error in the minified version
* Fix legend layout and behaviour for misc groups
* Fix better clearfix on print
* Fix font-weight and line-heigth to .h1-.h4 and .t1-.t4

## [3.0.0] - 2015-06-15 [YANKED]

### Added:

* Use PostCSS as packer and pre/postprocessor.
    * Add css-variables and custom-media queries
    * Add autoprefixer, and remove inline prefixed declarations and functions
    * Images optimized with imageoptim

### Changed

* Only *.min.css is minified

### Breaking changes

* Package does not include src directory. Use dist instead.
* Remove images (that are likely not in use)
* Remove third party css folder
* Do not generate dist/spaden-{version} anymore
