/**
 * Custom gear HTML element.
 * @example
 * // Gear size is 100 px.
 * <gear-icon size="20px"></gear-icon>
 */
class GearIcon extends HTMLElement {
    /**
     * Gear icon.
     */
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'closed' });

        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'gear-icon');

        const center = document.createElement('div');
        center.setAttribute('class', 'gear-icon-center');

        wrapper.appendChild(center);

        for (let i = 0; i < 4; i++) {
            const currentGearTooth = document.createElement('div');

            currentGearTooth.setAttribute('class', 'gear-icon-tooth');
            wrapper.appendChild(currentGearTooth);
        }

        const style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', './custom-elements/gear-icon/gear-icon.css');

        shadow.appendChild(wrapper);
        shadow.appendChild(style);

        const size = this.getAttribute('size') || '0px';
        wrapper.setAttribute('style', `--icon-size: ${size};`);
    }
}

customElements.define('gear-icon', GearIcon);
