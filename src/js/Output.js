/**
 * Handles the various file flattening operations for when file output happens
 */
class Output {
    /**
     * @param {string[]} imports
     * @param {string} container
     * @param {string[]} associations
     */
    constructor(imports = [], container = null, associations = []) {
        this.imports = imports;
        this.container = container;
        this.associations = associations;
    }

    /**
     * Returns the output that goes to the meta file
     *
     * @returns {string}
     */
    combined() {
        return this.imports.join('') + this.container + this.associations.join('');
    }

    /**
     * @returns {string[]}
     */
    get imports() {
        return this._imports;
    }

    /**
     * @param {string[]} value
     */
    set imports(value) {
        this._imports = value;
    }

    /**
     * @returns {string}
     */
    get container() {
        return this._container;
    }

    /**
     * @param {string} value
     */
    set container(value) {
        this._container = value;
    }

    /**
     * @returns {string[]}
     */
    get associations() {
        return this._associations;
    }

    /**
     * @param {string[]} value
     */
    set associations(value) {
        this._associations = value;
    }
}

module.exports = Output;