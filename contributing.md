# We would love your contribution!

This project's primary objective is to support anything that FINN.no builds. It was never intended to be a generic framework like Bootstrap or similar projects. It was put out as Open Source primarly to acomodate a need for other Open Source projects to use our standard framework.

# Pull requests
The best thing is to always file an issue before submitting a pull-request. This is not a requirement, but a general best practice. This makes it easier to discuss the issue before any code is written. Sometimes the issues might already be fixed or will be out of scope for the module.

* merge all commits into on single commit for the pull request
* do not alter the version number, this is done in the release process

### Adding new stuff

1. All new components should reside in separate folders
1. The component you created should be added to the CSS file which bundles everything in core/components/thirdparty


### Quality checklist

1. You CSS code must work for all screen-sizes
1. Your widget should work in all browsers
1. Follow design the [principles of Object Oriented CSS](http://www.smashingmagazine.com/2011/12/12/an-introduction-to-object-oriented-css-oocss/)

## Code Style Guide

If possible use the _.editorconfig_ file in the project as it automates the rule [see [EditorConfig.org](http://editorconfig.org/)]. Below is a summary:

* code should be indented with 4 spaces
* double quotes should be used where feasible

## Releasing

Spaden uses [semver](http://semver.org/). See the definitions on when to release patch, minor or major versions.

The release process has been simplified. It will change the version for you, tag, commit and push to git. Publish to npm
and Maven. NB! Do not use this for alpha- or beta-versions. They should be published to npm with a beta or alpha tag. If not they will automatically be tagged as the latest version.

To deploy a patch version:

    $ npm run release:patch

To deploy a minor version:

    $ npm run release:minor

To deploy a major version:

    $ npm run release:major
