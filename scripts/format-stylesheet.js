require('colors');
var filewalker = require('filewalker');
var postcss = require('postcss');
var fs = require('fs');
var convertColor = require('css-color-converter');
var reSPACE_BETWEEN_RULES = /,(\S)/g;

function prettySelector(selector) {
    return selector && selector.replace(reSPACE_BETWEEN_RULES, ', $1');
}

function prettyDeclarationValue(value) {
    return value &&
        value
        .replace(/"/g, '\'')
        // upper case colors
        .replace(/\#[A-Z\d]{3,6}/ig, function(color) {
            try {
                color = convertColor(color).toHexString().toUpperCase();
            } catch (e) {}
            return color;
        });
}

function replaceTabs(str, indentLevel) {
    return str && str.replace(/\t/g, indentLevel);
}

function space(nr) {
    return (new Array(nr).join('    '));
}

var count = {
    important: 0,
    case: 0
};
function isPrefixed(prop) {
    return prop && prop.indexOf('-') === 0;
}

function getPrefixUnprefixed(prop) {
    return prop.replace(/(\-\w+\-)/, '');
}

function hasProp(nodes, prop) {
    return nodes.length > 0 && nodes.some(function(n) {
        return n.prop === prop;
    });
}

function iterator(depth, node, childIndex, list) {
    if (node.nodes) {

        // Sort declarations wanted?
        // see https://github.com/csscomb/csscomb.js/blob/master/lib/options/sort-order.js
        /*if (node.nodes[0] && node.nodes[0].type === 'decl') {
            node.nodes.sort();
        }*/

        node.nodes = node.nodes.filter(function(_node) {
            //console.log('isPrefixed(node.prop)', _node.prop, isPrefixed(_node.prop));
            if (isPrefixed(_node.prop) &&
                hasProp(node.nodes, getPrefixUnprefixed(_node.prop))) {
                console.warn('Removed declaration:'.red, _node.prop);
                return false
            }
            return true;
        });

        node.nodes.forEach(iterator.bind(null, depth + 1));

        if (node.nodes.length <= 1) {
            // make single declartions one-liners
            node.after = ' ';
        } else {
            // enfore formatting for multi decl.
            node.after = '\n' + space(depth);
        }
    }

    if (node.selector) {
        node.before = replaceTabs(node.before, space(depth));
        node.selector = prettySelector(node.selector);

        // allow single decl rules to be indented however
        if (!node.between || node.nodes.length > 1) {
            node.between = ' ';
        }
        node.semicolon = true;

        if (node.nodes.length === 0) {
            console.warn('$'.red, ('"' + node.selector + '"').blue.bold, 'is empty'.yellow);
        }

        if (/[A-Z]/g.test(node.selector)) {
            count.case ++;
            console.warn('$'.red, ('"'.blue + node.selector.blue.bold.replace(/[A-Z]/g, function(v) {
                return v.red;
            }) + '"'.blue), 'has uppercase chars!'.yellow);
        }
    }

    if (node.type === 'decl') {
        node.before = replaceTabs(node.before, space(depth));

        if (list.length <= 1) {
            // make single declartions one-liners
            node.before = ' ';
        } else {
            node.before = '\n' + space(depth);
        }

        if (node.important) {
            count.important ++;
            node._important = ' !important';
        }

        if (node.between === ':') {
            node.between = ': ';
        }

        node.value = prettyDeclarationValue(node.value)
    }
}


function formatFile(filename) {
    var content = fs.readFileSync(filename, 'utf8');

    var ast = postcss.parse(content);

    ast.nodes.forEach(iterator.bind(null, 1));

    fs.writeFileSync(__dirname + '/debug-css.json', JSON.stringify(ast, null, 4), 'utf8');
    fs.writeFileSync(filename.replace(/\.css$/i, '-edited.css'), ast.toString(), 'utf8');
}

// formatFile(__dirname + '/../src/styles/core/grid/grids.css');

function walk(dir) {
    return filewalker(dir)
        .on('dir', function(p) {
            console.log('dir:  %s', p);
        })
        .on('file', function(p, s) {
            if (/\.css$/i.test(p) &&
                p.indexOf('edited') === -1 &&
                p.indexOf('browsers/') === -1) {
                console.log('file: %s, %d bytes', p, s.size);
                formatFile(dir + '/' + p);
            }

        })
        .on('error', function(err) {
            console.error(err);
        })
        .on('done', function() {
            console.log('%d dirs, %d files, %d bytes', this.dirs, this.files, this.bytes);

            Object.keys(count).forEach(function(key){
                console.log('Count:'.red, key, 'usage:', count[key] + ''.yellow);
            });

        })
        .walk();
}

walk( __dirname + '/../src/styles');
