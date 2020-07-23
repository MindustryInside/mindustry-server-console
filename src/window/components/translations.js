const { app } = require('electron').remote;
const fs = require('fs');
const path = require('path');
const Generator = require('../utils/generator');

/**
 * Class for operating with console translations.
 */
class Translations {
    /**
     * Translations.
     * @param {string} defaultLanguage - Default console language.
     */
    constructor(defaultLanguage = app.getLocale()) {
        this.elements = Array.from(document.getElementsByClassName('language-depend'));
        this.locales = {};
        this.lang = localStorage.getItem('menu-language') || defaultLanguage;

        this.initTranslations();
    }

    /**
     * Get all colors in {@code colors/} folder.
     */
    initTranslations() {
        const folder = path.join(__dirname, '..', 'translations');
        const files = fs.readdirSync(folder);
        files.forEach((file) => {
            const filename = file.replace('.json', '');
            const rawJson = fs.readFileSync(path.join(`${folder}/${file}`));
            this.locales[filename] = JSON.parse(rawJson.toString('utf-8'));
        });

        this.generator = new Generator(Object.keys(this.locales));
        this.update();
    }

    /**
     * Update console translations.
     */
    update() {
       this.elements.forEach((element) => {
           // eslint-disable-next-line no-param-reassign
           element.innerHTML = this.getValue(element.attributes.translation.value);
       });

       localStorage.setItem('menu-language', this.lang);
    }

    /**
     * Set console language.
     * @param {string} language - Language to be set.
     */
    setLang(language) {
        this.lang = language;
        this.update();
    }

    /**
     * Get translation of the given string.
     * @param {string} key - String to get translation.
     * @returns {string} - Translation.
     */
    getValue(key) {
        return this.locales[this.lang][key];
    }

    /**
     * Switch to the next language.
     */
    nextLang() {
        this.setLang(this.generator.next());
    }
}

module.exports = Translations;
