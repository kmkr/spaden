require('colors');
var filewalker = require('filewalker');
var postcss = require('postcss');
var fs = require('fs');
var convertColor = require('css-color-converter');
var reSPACE_BETWEEN_RULES = /,(\S)/g;
var del = require('del');

var stats = {
    important: 0,
    case: 0,
    colors: {}
};

function prettySelector(selector, indentLevel) {

    // ensure indent is same
    if (selector.indexOf('\n') !== -1) {
        selector = selector.split('\n').map(function(v){
            return v && v.trim();
        }).join('\n' + indentLevel);
    }

    // split long selectors
    if (selector.length > 120 && selector.indexOf('\n') === -1) {
        selector = selector.replace(/\n/g, '').split(',').map(function(entry){
            return entry && entry.trim();
        }).join(',\n' + indentLevel);
    }

    return selector && selector
        .replace(reSPACE_BETWEEN_RULES, ', $1')
        .replace(/"/gm, '\'')
        .replace(/(\s*\>\s*)/gm, ' > ')
        .replace(/(\s*\+\s*)/gm, ' + ');
}

function prettyDeclarationValue(value) {
    return value &&
        value
        .replace(/"/g, '\'')
        // upper case colors
        .replace(/\#[A-Z\d]{3,6}/ig, function(color) {
            try {
                color = convertColor(color).toHexString().toUpperCase();
                if (!stats.colors[color]) {
                    stats.colors[color] = 1;
                } else {
                    stats.colors[color]++;
                }
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



function isPrefixed(prop) {
    return prop && prop.match(/^\-\w+\-/);
}

function getPropUnprefixed(prop) {
    return prop.replace(/(\-\w+\-)/, '');
}

function hasProp(nodes, prop) {
    return nodes.length > 0 && nodes.some(function(n) {
        return n.prop === prop;
    });
}

function getValueFnName(value){
    return value && value.replace(/(\-\w+\-)/, '').replace(/\(.*$/, '');
}

function startsWithValue(nodes, value) {
    return nodes.length > 0 && nodes.some(function(n) {
        return n.value && n.value.indexOf(value) === 0;
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

            // remove e.g. background-color: -webkit-... if native is unprefixed is present
            if (isPrefixed(_node.value) &&
                startsWithValue(node.nodes, getValueFnName(_node.value))) {
                console.warn('Removed value:'.red, _node.prop + ': ' + _node.value);
                return false
            }

            if (isPrefixed(_node.prop) &&
                hasProp(node.nodes, getPropUnprefixed(_node.prop))) {
                console.warn('Removed declaration:'.red, _node.prop);
                return false
            }
            return true;
        });

        node.nodes.forEach(iterator.bind(null, depth + 1));

        if (node.type !== 'atrule') {
            if (node.nodes.length <= 1) {
                // make single declartions one-liners
                node.after = ' ';
            } else {
                // enfore formatting for multi decl.
                node.after = '\n' + space(depth);
            }
        }
    }

    if (node.selector) {

        var _space =  space(depth);
        node.before   = replaceTabs(node.before, _space);
        // if ((node.before +'').replace(/\n\r/m, '') < _space.length) {
        //     node.before = '\n' + _space;
        // }
        node.selector = prettySelector(node.selector, _space);

        // allow single decl rules to be indented however
        if (!node.between || node.nodes.length > 1) {
            node.between = ' ';
        }
        node.semicolon = true;

        if (node.nodes.length === 0) {
            console.warn('Selector'.red, ('"' + node.selector + '"').blue.bold, 'is empty'.yellow);
        }

        if (/[A-Z]/g.test(node.selector)) {
            stats.case ++;
            console.warn('Selector'.red, ('"'.blue + node.selector.italic.replace(/[A-Z]/g, function(v) {
                return v.red;
            }) + '"'.blue), 'has uppercase chars!'.yellow);
        }
    }

    if (node.type === 'comment') {
        if (node.before && node.before.trim() === '') {
            node.before = '\n' + space(depth);
        }
    }

    if (node.type === 'decl') {
        node.before = replaceTabs(node.before, space(depth));

        var _before = node.before.replace(/\s*/ig, '') ||'';
        if (list.length <= 1) {
            // make single declartions one-liners
            node.before = ' '+ _before;
        } else {
            node.before = '\n' + space(depth) + _before;
        }

        if (node.important) {
            stats.important ++;
            node._important = ' !important';
        }

        if (node.between === ':') {
            node.between = ': ';
        }

        node.value = prettyDeclarationValue(node.value)
    }
}


function copy(src){
    var res = {};

    if (src.nodes) {
        res.nodes = src.nodes.map(copy);
    }
    Object.keys(src).forEach(function(key){
        if (key === 'nodes' || key === 'source' || key === 'parent') {
            return;
        }
        res[key] = src[key];
    });
    return res;
}

function formatFile(filename) {
    var content = fs.readFileSync(filename, 'utf8');

    var ast = postcss.parse(content, { safe: true });

    ast.nodes.forEach(iterator.bind(null, 1));

    fs.writeFileSync(__dirname + '/debug-css-'+filename.match(/\w+.css$/)[0]+'.json', JSON.stringify(copy(ast), null, 4), 'utf8');
    if (process.env.REALLY_DO_IT) {
        fs.writeFileSync(filename, ast.toString(), 'utf8');
    } else {
        fs.writeFileSync(filename.replace(/\.css$/i, '-formatted-dry-run.css'), ast.toString(), 'utf8');
    }
}

// formatFile(__dirname + '/../src/styles/core/table/table.css');

function walk(dir) {
    return filewalker(dir)
        .on('dir', function(p) {
            console.log('dir:  %s', p);
        })
        .on('file', function(p, s) {
            if (/\.css$/i.test(p) &&
                p.indexOf('-formatted-dry-run') === -1 &&
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

            Object.keys(stats).forEach(function(key){
                var value = stats[key];
                if (key === 'colors') {
                    var _value = {};
                    Object.keys(value).sort(function(a, b){
                        return value[a] > value[b] ? -1 : 1;
                    }).filter(function(key){
                        if (value[key] > 1) {
                            _value[key] = value[key];
                        }
                    })
                    value = _value;
                }
                console.log('Count/Stats:'.red, key, 'usage:', value);
            });

        })
        .walk();
}

if (process.env.CLEAN){
    console.log('---------------- '.yellow.bold+'CLEANUP'.green+' -------------------'.yellow.bold);
    del( __dirname + '/../src/styles/**/*-formatted-dry-run.css');
    del( __dirname + '/debug*.json');
} else if (!process.env.REALLY_DO_IT) {
    console.log('---------------- '.yellow.bold+'DRY RUN'.green+' -------------------'.yellow.bold);
    console.log('Add ENV REALLY_DO_IT=1 to run on sourcefiles');
    console.log('---------------- '.yellow.bold+'DRY RUN'.green+' -------------------'.yellow.bold);
    walk( __dirname + '/../src/styles');
} else {
    del( __dirname + '/../src/styles/**/*-formatted-dry-run.css', function() {
        walk( __dirname + '/../src/styles');
    });
}
