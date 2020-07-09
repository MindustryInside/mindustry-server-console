const { app } = require('electron').remote;
const fs = require('fs');
const path = require('path');
const Generator = require('../utils/generator');

class Translations {
    constructor(defaultLanguage = app.getLocale()) {
        this.elements = Array.from(document.getElementsByClassName('language-depend'));
        this.locales = {};
        this.lang = localStorage.getItem('menu-language') || defaultLanguage;

        this.initTranslations();
    }

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

    update() {
       this.elements.forEach((element) => {
            // eslint-disable-next-line no-param-reassign
            element.innerHTML = this.getValue(element.id);
       });

       localStorage.setItem('menu-language', this.lang);
    }

    setLang(language) {
        this.lang = language;
        this.update();
    }

    getValue(key) {
        return this.locales[this.lang][key];
    }

    nextLang() {
        this.setLang(this.generator.next());
    }
}

module.exports = Translations;
