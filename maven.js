var maven = require('maven-deploy');
var pkg = require('./package');
var config = require('./maven-config');

/**
 * Special legacy deployment required to publish to maven repos.
 * Usage:
 *         node legacyDeploy.js true | false
 *
 * It will deploy the artifact to either a release or snapshot repo.
 **/
var VALID_COMMANDS = ['install', 'snapshot', 'deploy'];

var args = process.argv.slice(2);
var command = args[0];
if (!command) {
    error('command missing');
} else if (VALID_COMMANDS.indexOf(command) === -1) {
    error(command + ' is not a valid command');
}

if (pkg.version.indexOf('SNAPSHOT') > -1) {
    error('The version i package.json should not contain "SNAPSHOT"');
}

maven.config(config);

if (command === 'install') {
    maven.install();
} else if (command === 'snapshot') {
    maven.deploy('finntech-internal-snapshot', true);
} else if (command === 'deploy') {
    maven.deploy('finntech-internal-release');
}

function printUsage () {
    console.log('Usage: node maven.js command');
    console.log('Valid commands are: ' + VALID_COMMANDS.join(', '));
}

function error (msg) {
    console.error(msg);
    printUsage();
    process.exit(1);
}
