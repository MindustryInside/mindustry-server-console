// TODO: Finish modal window
class Modal {
    constructor(title) {
        this.title = title;
        this.buttons = [];
    }

    create() {
        this.element = document.createElement('div');
        this.element.classList.add('modal');
        this.element.insertAdjacentHTML('afterbegin', this.asHTML());
        this.createButtons();

        document.getElementById('modals').appendChild(this.element);
    }

    createButtons() {
        const buttonsElement = this.element.querySelector('.modal-buttons');
        this.buttons.forEach((button) => {
            buttonsElement.appendChild(button.createElement());
        });
    }

    asHTML() {
        return `
        <div class="modal">
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <p>${this.title}</p>
                <div class="modal-buttons"></div>
            </div>
        </div>`;
    }

    addButton(button) {
        this.buttons.push(button);
    }

    open() {
        this.element.style.display = 'block';
    }

    close() {
        this.element.style.display = 'none';
    }

    destroy() {
        this.element.remove();
    }
}


module.exports = Modal;
