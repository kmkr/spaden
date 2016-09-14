'use strict';
const fs        = require('fs');
const pify      = require('pify');
const globby    = require('globby');
const fsp       = pify(fs);
const path      = require('path');
const marked    = require('marked');
const hbs       = require('handlebars');
const hljs      = require('highlight.js');
const pkg       = require('../package.json');

const projectRoot   = path.join(__dirname, '..');
const basePath      = path.join(projectRoot, 'src', 'styles');
const OUT_FOLDER    = process.argv[2] || 'out';

const spec = [
    {
        title: 'Core',
        id: 'core',
        output: false,
        rootPath: path.join(projectRoot, 'src', 'styles'),
        children: [
            {
                title: 'Layout',
                output: false,
                children: [
                    {
                        title: 'Template',
                        id: 'template',
                    },
                    {
                        title: 'Grid',
                        id: 'grid',
                    },
                    {
                        title: 'Module',
                        id: 'module',
                    },
                    {
                        title: 'Media',
                        id: 'media',
                    },
                    {
                        title: 'Spacing',
                        id: 'spacing',
                    },
                    {
                        title: 'Responsive helpers',
                        id: 'responsive',
                    },
                    {
                        title: 'Flex',
                        id: 'flex',
                    },
                ],
            },
            {
                title: 'Decoration',
                children: [
                    {
                        title: 'Color',
                        id: 'color',
                    },
                    {
                        title: 'Font/Text',
                        id: 'font',
                    },
                    {
                        title: 'Print',
                        id: 'print',
                    },
                    {
                        title: 'Border',
                        id: 'border',
                    },
                    {
                        title: 'Icon',
                        id: 'icon',
                    },
                    {
                        title: 'Logo',
                        id: 'logo',
                    },
                    {
                        title: 'Image',
                        id: 'image',
                    },
                    {
                        title: 'Form',
                        id: 'form',
                    },
                    {
                        title: 'List',
                        id: 'list',
                    },
                    {
                        title: 'Table',
                        id: 'table',
                    },
                ],
            },
        ],
    },
    {
        title: 'Components',
        id: 'components',
        rootPath: path.join(projectRoot, 'src', 'styles'),
        output: false,
        children: [
            {
                title: 'Basic',
                children: [
                    {
                        title: 'Blockquote',
                        id: 'stylizedblockquote',
                    },
                    {
                        title: 'Broadcast',
                        id: 'broadcast',
                    },
                    {
                        title: 'Context-box',
                        id: 'contextbox',
                    },
                    {
                        title: 'Conversations',
                        id: 'conversations',
                    },
                    {
                        title: 'Crumbs',
                        id: 'crumbs',
                    },
                    {
                        title: 'Detailssummary',
                        id: 'detailssummary',
                    },
                    {
                        title: 'Filters',
                        id: 'filters',
                    },
                    {
                        title: 'Notification',
                        id: 'notification',
                    },
                    {
                        title: 'OMGnew',
                        id: 'omgnew',
                    },
                    {
                        title: 'Paging',
                        id: 'paging',
                    },
                    {
                        title: 'Profiles',
                        id: 'profiles',
                    },
                    {
                        title: 'Ratings',
                        id: 'ratings',
                    },
                    {
                        title: 'Ribbons',
                        id: 'ribbons',
                    },
                    {
                        title: 'Speech bubbles',
                        id: 'speechbubbles',
                    },
                    {
                        title: 'Tabs',
                        id: 'tabs',
                    },
                ],
            },
        ],
    },
    {
        title: 'Examples',
        id: 'examples',
        rootPath: path.join(__dirname),
        output: false,
        children: [
            {
                title: 'Prototypes',
                children: [
                    {
                        title: 'Frontpage',
                        id: 'frontpage',
                    },
                    /*{
                        title: 'resultpage',
                        id: 'resultpage',
                    },
                    {
                        title: 'Detailpage',
                        id: 'detailpage',
                    },
                    {
                        title: 'market',
                        id: 'market',
                    },
                    {
                        title: 'AD Input',
                        id: 'adinput',
                    },
                    {
                        title: 'Color contrast',
                        id: 'colorcontrast',
                    },
                    {
                        title: 'Conversation',
                        id: 'conversation',
                    },

                    {
                        title: 'Flex grid',
                        id: 'flexgrid',
                    },
                    {
                        title: 'Flex toolbar',
                        id: 'flextoolbar',
                    },
                    {
                        title: 'Form Elements',
                        id: 'formelements',
                    },
                    {
                        title: 'Info',
                        id: 'info',
                    },
                    {
                        title: 'My Stuffs',
                        id: 'mystuffs',
                    },
                    {
                        title: 'New add',
                        id: 'newadd',
                    },
                    {
                        title: 'profile',
                        id: 'profile',
                    },
                    {
                        title: 'template',
                        id: 'template',
                    },*/
                ],
            },
        ],
    },
];

function createRef (ref) {
    return ref.replace(basePath, '').split('/')
        .filter(Boolean)
        .join('-');
}

function readFile (filePath, _contextPath) {
    if (path.extname(filePath) !== '') {
        return fsp.readFile(filePath, 'utf8').then(content => {
            return {
                ref: createRef(_contextPath),
                name: path.basename(filePath),
                id: path.basename(filePath, path.extname(filePath)),
                ext: path.extname(filePath).replace(/^\./, ''),
                filePath: filePath.replace(projectRoot, ''),
                content,
            };
        })
        .catch((e) => {
            console.error(e);
            return Promise.resolve(false);
        });
    }
    return Promise.resolve(false);
}

function renderEntry (fileObj, files) {
    // we need a hbs instance for files to be just scoped to this parent 'template'.
    const hbsInstance = hbs.create();
    let viewObj = {};

    files.forEach((_fileObj) => {
        if (_fileObj === fileObj) {
            return;
        };
        if (_fileObj.ext === 'json' &&
                (_fileObj.id === fileObj.id || _fileObj.id === 'data')
            ) {
            viewObj = Object.assign({}, viewObj, JSON.parse(_fileObj.content));
            _fileObj.requested = true;
            return;
        }

        if (_fileObj.ext === 'hbs') {
            hbsInstance.registerPartial(_fileObj.name, _fileObj.content);
        }

        // Somewhat funny solution to auto-include non included partials
        Object.defineProperty(viewObj, _fileObj.id, {
            get () {
                _fileObj.requested = true;
                return hljs.highlight(_fileObj.ext || 'html', _fileObj.content).value;
            },
        });

        // plain / raw content
        Object.defineProperty(viewObj,  `${_fileObj.id}-plain`, {
            get () {
                _fileObj.requested = true;
                return _fileObj.content;
            },
        });
    });

    if (['mustache', 'mu', 'hbs'].includes(fileObj.ext)) {
        fileObj.rendered = hbsInstance.compile(fileObj.content)(viewObj);
    }

    if (['markdown', 'md'].includes(fileObj.ext)) {
        fileObj.rendered = hbsInstance.compile(marked(fileObj.content))(viewObj);
    }

    return fileObj;
}

function resolveEntry (entry, rootPath, contextPath = '') {
    const _contextPath = path.join(contextPath, entry.id || '');
    const _rootPath = entry.rootPath || rootPath;

    const currentFolderPath = path.join(_rootPath, _contextPath);
    const exist = fs.existsSync(currentFolderPath);
    if (!exist) {
        throw new Error(`Missing path ${_contextPath}: ${currentFolderPath}`);
    }

    const entryProm = new Promise((resolve) => {
        const globs = ['*.md', '*.mustache', '*.mu', '*.hbs', '*.html', '*.json'];
        globby(globs, { cwd: currentFolderPath })
            .then((result) => {
                Promise.all(
                    result.map(p => readFile(path.join(currentFolderPath, p), _contextPath))
                ).then((res) => {
                    entry.ref = createRef(_contextPath);
                    entry.href = `./${createRef(_contextPath)}.html`;
                    entry.files = res.filter(Boolean);

                    entry.files = entry.files.map((fileObj) => {
                        if (['mustache', 'mu', 'hbs'].includes(fileObj.ext)) {
                            renderEntry(fileObj, entry.files);
                        }

                        if (['markdown', 'md'].includes(fileObj.ext)) {
                            renderEntry(fileObj, entry.files);
                        }
                        return fileObj;
                    });

                    resolve(entry);
                })
                .catch((e) => {
                    console.error('E:', e);
                });
            });
    });

    return Promise.all(
        [entryProm]
            .concat(entry.children && resolveTree(entry.children, _rootPath, _contextPath))
            .filter(Boolean)
    );
}

function resolveTree (tree, rootPath, contextPath = '') {
    return Promise.all(
        tree.map((entry) => resolveEntry(entry, rootPath, contextPath))
    );
}

function getEntryPoints (data) {
    const result = [{
        index: 'index',
        layout: 'base',
        out: 'index',
        data,
    }];

    function iterate (entry) {
        const copied = Object.assign({}, entry);
        delete copied.children;

        if (entry.output !== false && entry.id) {
            result.push({
                data: copied,
                index: 'standalone',
                layout: 'base',
                out: entry.ref,
            });;
        } else {
            console.log('Did not process file from entry:', entry.title);
        }
        if (entry.children) {
            entry.children.forEach(child => iterate(child));
        }
    }

    data.forEach(entry => iterate(entry));

    return result;
}

const baseData = {
    version: `v${pkg.version}`,
    sha: process.env.GIT_SHA || pkg.version,
    icons: '',
};


function render (template, layout, data) {
    const index = hbs.compile(template)(Object.assign({}, baseData, { data }));
    const result = hbs.compile(layout)(Object.assign({}, baseData, { data, content: index }));

    return result;
}

function collectIcons () {
    const iconsDir = path.join(__dirname, '..', 'dist', 'icons');
    return fsp.readdir(iconsDir).then(content =>
        Promise.all(
            content.map(entry => fsp.readFile(path.join(iconsDir, entry), 'utf8'))
        ).then(results => {
            baseData.icons = results.join('\n');
        })
    );
}


resolveTree(spec, basePath)
    .then(collectIcons)
    .then(() => {
        // DEBUG
        // fs.writeFileSync('./debug.json', JSON.stringify(spec, null, 4), 'utf8');

        const entries = getEntryPoints(spec);

        entries.forEach(({ out, layout, index, data }) => {
            const outputPath = path.join(__dirname, '..', OUT_FOLDER, `${out}.html`);
            const baseFileContent = fs.readFileSync(path.join(__dirname, 'templates', `${layout}.hbs`), 'utf8');
            const indexFileContent = fs.readFileSync(path.join(__dirname, 'templates', `${index}.hbs`), 'utf8');

            try {
                fs.writeFileSync(
                    outputPath,
                    render(indexFileContent, baseFileContent, data),
                    'utf8'
                );
            } catch (e) {
                e += ` from file ${out}`;
                throw e;
            }

        });
    })
    .catch((err) => {
        console.error('err:', err);
    });



/*


* legge til støtte for .js og .md filer
* fixe touch/click på sidemenyen/body (skjul/vis)
* Ikke vis støff fra examples seksjonen i index scrollen?

* lokal utvikling med reload

*/
