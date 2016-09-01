# Change log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [5.2.0] - 2016-09-01

### Added

* Omgnew: green circular thing to show off awsome new stuff

## [5.1.0] - 2016-08-25

### Added

* New font as default (new identity 2016)
* Version# printed out as a css-comment

## [5.0.0] - 2016-06-16

### Breaking changes

* Removed all traces of icon-font
* Removed old market icon Set
* Removed old logo
* Removed old sprites from m/innFinn (sprite_mFINN_14)
* Removed all traces of iconSet20px

## [4.4.10] - 2016-06-09

### Fixed

* Fixed component.css included itself instead of content.css

## [4.4.9] - 2016-06-09

### Fixed

* Fixed dd last element of multi-column definition list sliding to other column in IE

## [4.4.8] - 2016-05-31

### Added

* green skin for mods (Intended for new broadcast and misc messages to user)

## [4.4.3] - 2016-05-18

### Fixed

* Fixed new Identity colors for linked elements

## [4.4.1] - 2016-05-09

### Fixed

* Bug in the icon svg


## [4.4.0] - 2016-05-04

### Added

* Added new Identity icons for markets (icon-ni-...)

## [4.1.1] - 2016-02-26

### Fixed

* Topbar z-index issue

## [4.1.0] - 2016-02-24

### Added

* Misc changes for the upcoming Identity update
* Updated link colors
* Updated market icon colors
* Updated logo
* New topbar

## [4.0.0] - 2016-02-01

### Added

* New highly controllable grid-unit system (ref: styleguide > grid > .colsXupto[breakpoint])

### Breaking changes

* Rewritten flex support (.flex-area, .flex-unit no longer exists use .flex instead, ref: styleguide > flex )

## [3.1.14] - 2016-01-21

### Fixed

* Added max-width and max-height to thumb class to maintain aspect ratio in thumbnails

## [3.1.13] - 2016-01-20

### Fixed

* fix text overflow issue in large profiles at 768px
* Adjusted small button and fancy select styling

## [3.1.11] - 2016-01-13

### Added

* utility button

### Fixed

* renamed image cropping classes
* changed button group styling

## [3.1.10] - 2016-01-08

### Breaking changes

* Image holder classes changed from cropXbyX to formatXbyX

## [3.1.8] - 2016-01-04

### Breaking changes

* Image holder classes changed from XX-imageholder to cropXbyX

### Added

* Read more gradient truncating

## [3.1.7] - 2015-12-21

### Added

* Action feedback
* New pagination

## [3.1.5] - 2015-12-04

### Breaking changes

* Rewritten pagination styling

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
