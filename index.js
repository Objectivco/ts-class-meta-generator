let walk = require('walk');
let path = require('path');
let fs = require('fs');
let Output = require('./src/js/Output');

const pluginName = 'TypescriptClassMetaInfoGeneratorPlugin';
const extName = '.ts';
const encoding = 'utf8';

/**
 * Webpack plugin that generates a container object and associates the class name with its reference for easy access
 */
class TypescriptClassMetaInfoGeneratorPlugin {
    /**
     * @param options - Object properties below
     *
     * srcFolder: string - The directory with ts source files you want walked
     *  [Default]: ./src/ts
     * siteName: string - The class name / namespace you want to use for your container name
     *  [Default]: Site
     * siteMetaFileName: string - The file name that holds all the meta information about the classes.
     *  [Default]: site-meta.ts
     * siteMetaPath: string - The location the meta file should be generated.
     *  [Default]: .
     * ignoreFiles: string[] - List of file names (case-sensitive) without the ts extension.
     *  [Default]: []
     * ignoreFolders: string[] - List of folder names (case-sensitive) to ignore.
     */
    constructor(options) {
        if(options) {
            this.srcFolder = (options.srcFolder) ? options.srcFolder : './src/ts';
            this.siteName = (options.siteName) ? options.siteName : 'Site';
            this.siteMetaFileName = (options.siteMetaFileName) ? options.siteMetaFileName : 'site-meta.ts';
            this.siteMetaPath = (options.siteMetaPath) ? options.siteMetaPath : '.';
            this.ignoreFiles = (options.ignoreFiles) ? options.ignoreFiles : [];
            this.ignoreFolders = (options.ignoreFolders) ? options.ignoreFolders: [];
        }

        this.files = [];
        this.output = new Output();
    }

    /**
     * Function called by webpack to kick off the plugin. Compiler hook entryOption is called and tap'ed so we can walk
     * the typescript files and generate what we need before watch/building
     *
     * @param compiler
     */
    apply(compiler) {
        compiler.hooks.entryOption.tap(pluginName, this.walkAndMake.bind(this));
    }

    /**
     * Walks the defined src folder and gets a file list based on files not in the ignore folders or files list. Once
     * the list has been gathered we export that data into a TS form where the classes are associated with their string
     * names and added to a container object to be accessed within the project scope
     */
    walkAndMake() {
        // Walker options
        let walker  = walk.walk(this.srcFolder, {
            followLinks: false,
            filters: this.ignoreFolders
        });

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
    }

    /**
     * Returns the siteMetaPath joined with the siteMetaFileName
     *
     * @returns {string}
     */
    get siteMetaFullPath() {
        return `${this.siteMetaPath}/${this.siteMetaFileName}`;
    }

    /**
     * @returns {string}
     */
    get siteName() {
        return this._siteName;
    }

    /**
     * @param {string} value
     */
    set siteName(value) {
        this._siteName = value;
    }

    /**
     * @returns {string}
     */
    get srcFolder() {
        return this._srcFolder;
    }

    /**
     * @param {string} value
     */
    set srcFolder(value) {
        this._srcFolder = value;
    }

    /**
     * @returns {string}
     */
    get siteMetaPath() {
        return this._siteMetaPath;
    }

    /**
     * @param {string} value
     */
    set siteMetaPath(value) {
        this._siteMetaPath = value;
    }

    /**
     * @returns {string}
     */
    get siteMetaFileName() {
        return this._siteMetaFileName;
    }

    /**
     * @param {string} value
     */
    set siteMetaFileName(value) {
        this._siteMetaFileName = value;
    }

    /**
     * @returns {string[]}
     */
    get ignoreFiles() {
        return this._ignoreFiles;
    }

    /**
     * @param {string[]} value
     */
    set ignoreFiles(value) {
        this._ignoreFiles = value;
    }

    /**
     * @returns {string[]}
     */
    get ignoreFolders() {
        return this._ignoreFolders;
    }

    /**
     * @param {string[]} value
     */
    set ignoreFolders(value) {
        this._ignoreFolders = value;
    }

    /**
     * @returns {string[]}
     */
    get files() {
        return this._files;
    }

    /**
     * @param {string[]} value
     */
    set files(value) {
        this._files = value;
    }

    /**
     * @returns {Output}
     */
    get output() {
        return this._output;
    }

    /**
     * @param {Output} value
     */
    set output(value) {
        this._output = value;
    }
}

module.exports = TypescriptClassMetaInfoGeneratorPlugin;