'use strict';
const fs        = require('fs');
const pify      = require('pify');
const globby    = require('globby');
const fsp       = pify(fs);
const path      = require('path');
const hbs       = require('handlebars');
const hljs      = require('highlight.js');
const pkg       = require('../package.json');

const projectRoot   = path.join(__dirname, '..');
const basePath      = path.join(projectRoot, 'src', 'styles');
const OUT_FOLDER    = process.argv[2] || 'out';

const spec = [
	{
		title: "Core",
        id: 'core',
		path: 'core',
		children: [
			{
				title: "Layout",
				children: [
					{
						title: 'Template',
                        id: 'template'
					},
					{
						title: 'Grid',
						id: 'grid'
					},
					{
						title: 'Module',
						id: 'module'
					},
					{
						title: 'Media',
						id: 'media'
					},
					{
						title: 'Spacing',
						id: 'spacing'
					},
					{
						title: 'Responsive helpers',
						id: 'responsive'
					},
					{
						title: 'Flex',
						id: 'flex'
					}

				]
			},
			{
				title: "Decoration",
				children: [
					{
						title: 'Color',
						id: 'color'
					},
					{
						title: 'Font/Text',
						id: 'font'
					},
					{
						title: 'Form',
						id: 'form'
					},
					{
						title: 'Image',
						id: 'image'
					},
					{
						title: 'List',
						id: 'list'
					},
					{
						title: 'Table',
						id: 'table'
					}
				]
			}
		]
	},
    {
        title: 'Components',
        id: 'components',
        children: [
            {
                title: 'Basic',
                children: [
                    {
                        title: 'contextbox',
                        id: 'contextbox',
                        entry: true
                    },
										{
                        title: 'conversations',
                        id: 'conversations'
                    },
										{
                        title: 'crumbs',
                        id: 'crumbs'
                    },
										{
                        title: 'detailsummary',
                        id: 'detailsummary'
                    },
										{
                        title: 'filters',
                        id: 'filters'
                    },
										{
                        title: 'notification',
                        id: 'notification'
                    },
										{
                        title: 'omgnew',
                        id: 'omgnew'
                    },
										{
                        title: 'paging',
                        id: 'paging'
                    },
										{
                        title: 'Profiles',
                        id: 'profiles'
                    },
										{
                        title: 'ratings',
                        id: 'ratings'
                    },
										{
                        title: 'ribbons',
                        id: 'ribbons'
                    },
										{
                        title: 'Speech bubbles',
                        id: 'speech-bubbles'
                    }
                ]
            }
        ]
    }
];

function createRef(ref) {
    return ref.replace(basePath, '').split('/').filter(Boolean).join('-');
}

function readFile(filePath) {
    if (path.extname(filePath) !== '') {
        return fsp.readFile(filePath, 'utf8').then(content => {
            return {
                ref: createRef(filePath),
                name: path.basename(filePath),
                id: path.basename(filePath, path.extname(filePath)),
                ext: path.extname(filePath).replace(/^\./, ''),
                filePath: filePath.replace(projectRoot, ''),
                content
            };
        }).catch(e => Promise.resolve(false));
    }
    return Promise.resolve(false);
}

function renderHandlebars(fileObj, files) {
    // we need a hbs instance for files to be just scoped to this parent "template".
    const hbsInstance = hbs.create();
    let viewObj = {};

    files.forEach((_fileObj) => {
         if (_fileObj === fileObj) {
            return
        };
        if (_fileObj.ext === 'json' &&
                (_fileObj.id === fileObj.id || _fileObj.id === 'data')
            ) {
            viewObj = Object.assign({}, viewObj, JSON.parse(_fileObj.content));
            _fileObj.requested = true;
            return;
        }

        hbsInstance.registerPartial(_fileObj.name, _fileObj.content);

        // Somewhat funny solution to auto-include non included partials
        Object.defineProperty(viewObj, _fileObj.id, {
            get: function () {
                _fileObj.requested = true;
                return hljs.highlight(_fileObj.ext || 'html', _fileObj.content).value;
            }
        });

        // plain content
        Object.defineProperty(viewObj, _fileObj.id + '-plain', {
            get: function () {
                _fileObj.requested = true;
                return _fileObj.content;
            }
        });
    });

    fileObj.rendered = hbsInstance.compile(fileObj.content)(viewObj);
    return fileObj;
}

function resolveEntry (entry, contextPath = '') {
    const _contextPath = path.join(contextPath, entry.path || entry.id || '');
    const entryProm = new Promise((resolve, reject) => {
        const base = path.basename(_contextPath);
        const currPath = _contextPath;

        const glob = globby([ '*.md', '*.mustache', '*.mu', '*.hbs', '*.html', '*.json'], { cwd: currPath })
        .then((result) => {
            Promise.all(
                result.map(p => readFile(path.join(_contextPath, p)))
                    .concat(
                    (new Array(10)).join(',').split(',').map((_, i) =>
                        readFile(path.join(_contextPath, `example-${i + 1}.md`))
                    )
            )
            ).then((res) => {
                entry.ref = createRef(_contextPath),
                entry.href = `./${createRef(_contextPath)}.html`
                entry.files = res.filter(Boolean);

                entry.files = entry.files.map((fileObj) => {
                    if (['mustache', 'mu', 'hbs'].includes(fileObj.ext)) {
                        renderHandlebars(fileObj, entry.files);
                    }
                    // fileObj.hl = hljs.highlight('html', fileObj.rendered || fileObj.content).value;
                    return fileObj;
                });

                resolve(entry);
            }).catch((e) => {
                console.log('E:', e);
            });
        });
    });

    return Promise.all(
        [entryProm]
            .concat(entry.children && resolveTree(entry.children, _contextPath))
            .filter(Boolean)
    );
}

function resolveTree(tree, contextPath = '') {
    return Promise.all(
        tree.map((entry) => resolveEntry(entry, contextPath))
    );
}

function getEntryPoints(spec) {
    const result = [{
        index: 'index',
        layout: 'base',
        out: 'index',
        data: spec
    }];

    function iterate(entry) {
        const copied = Object.assign({}, entry);
        delete copied.children;
        result.push({
            data: copied,
            index: 'standalone',
            layout: 'base',
            out: entry.ref
        });
        entry.children && entry.children.forEach(entry => iterate(entry));
    }

    spec.forEach(entry => iterate(entry));
    return result;
}

const baseData = {
    version: `v${pkg.version}`,
    sha: process.env.GIT_SHA || pkg.version
};
function render(template, layout, data) {
    const index = hbs.compile(template)(Object.assign({}, baseData, { data }));
    const result = hbs.compile(layout)(Object.assign({}, baseData, { data, content: index }));

    return result;
}


resolveTree(spec, basePath)
    .then((res) => {
        // DEBUG
        // fs.writeFileSync('./debug.json', JSON.stringify(spec, null, 4), 'utf8');

        const entries = getEntryPoints(spec);

        entries.forEach(({ out, layout, index, data }) => {
            const outputPath = path.join(__dirname, '..', OUT_FOLDER, `${out}.html`);
            const baseFileContent = fs.readFileSync(path.join(__dirname, 'templates', `${layout}.hbs`), 'utf8');
            const indexFileContent = fs.readFileSync(path.join(__dirname, 'templates', `${index}.hbs`), 'utf8');

            fs.writeFileSync(
                outputPath,
                render(indexFileContent, baseFileContent, data),
                'utf8'
            );

        });
    })
    .catch((err) => {
        console.error('err:', err);
    });



/*

* examples folder - filer injectes inn i base.hbs
* filer av alle seksjoner alene (krever filterert spec men kan kjøre i samme index.hbs)


* legge til støtte for .js og .md filer
* fixe touch/click på sidemenyen/body (skjul/vis)

* lokal utvikling med reload

*/
