class Button {
    constructor(name, action) {
        this.name = name;
        this.action = action;
    }

    createElement() {
        this.element = document.createElement('button');
        this.element.classList.add('modal-button');
        this.element.addEventListener('click', this.action);
        this.element.insertAdjacentText('beforeend', this.name);

        return this.element;
    }
}

module.exports = Button;
