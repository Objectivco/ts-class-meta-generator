let walk = require('walk');
let path = require('path');
let fs = require('fs');

const pluginName = 'TypescriptClassMetaInfoGeneratorPlugin';
const extName = '.ts';
const encoding = 'utf8';

class TypescriptClassMetaInfoGeneratorPlugin {
    constructor(options) {
        if(options) {
            this.srcFolder = (options.srcFolder) ? options.srcFolder : './src/ts';
            this.siteName = (options.siteName) ? options.siteName : 'Site';
            this.siteMetaFileName = (options.siteMetaFileName) ? options.siteMetaFileName : 'site-meta.ts';
            this.siteMetaPath = (options.siteMetaPath) ? options.siteMetaPath : '.';
            this.ignoreFiles = (options.ignoreFiles) ? options.ignoreFiles : [];
        }

        this.files = [];
        this.output = {
            imports: [],
            container: null,
            associations: [],
            combined: () => this.output.imports.join('') + this.output.container + this.output.associations.join('')
        };
    }

    apply(compiler) {
        compiler.hooks.beforeRun.tap(pluginName, compilation => {
            // Walker options
            let walker  = walk.walk(this.srcFolder, { followLinks: false });

            walker.on('file', (root, stat, next) => {

                if(path.extname(stat.name) === extName) {
                    let nameWithoutExt = stat.name.substr(0, stat.name.length - extName.length);
                    let inIgnore = this.ignoreFiles.indexOf(nameWithoutExt) >= 0;

                    if(!inIgnore) {
                        // Add this file to the list of files
                        this.files.push({
                            name: nameWithoutExt,
                            path: root + `/${nameWithoutExt}`
                        });
                    }
                }

                next();
            });

            walker.on('end', () => {
                this.output.container = `\nexport let ${this.siteName}: any = {};\n`;

                this.files.forEach(file => {
                    this.output.imports.push(`import { ${file.name} } from "${file.path}";\n`);
                    this.output.associations.push(`\nMooreAndGiles.${file.name} = ${file.name};`);
                });

                fs.writeFileSync(this.siteMetaFullPath, this.output.combined(), encoding);
            });
        });
    }

    get siteMetaFullPath() {
        return `${this.siteMetaPath}/${this.siteMetaFileName}`;
    }

    get siteName() {
        return this._siteName;
    }

    set siteName(value) {
        this._siteName = value;
    }

    get srcFolder() {
        return this._srcFolder;
    }

    set srcFolder(value) {
        this._srcFolder = value;
    }

    get siteMetaPath() {
        return this._siteMetaPath;
    }

    set siteMetaPath(value) {
        this._siteMetaPath = value;
    }

    get siteMetaFileName() {
        return this._siteMetaFileName;
    }

    set siteMetaFileName(value) {
        this._siteMetaFileName = value;
    }

    get ignoreFiles() {
        return this._ignoreFiles;
    }

    set ignoreFiles(value) {
        this._ignoreFiles = value;
    }

    get files() {
        return this._files;
    }

    get output() {
        return this._output;
    }

    set output(value) {
        this._output = value;
    }

    set files(value) {
        this._files = value;
    }
}

module.exports = TypescriptClassMetaInfoGeneratorPlugin;