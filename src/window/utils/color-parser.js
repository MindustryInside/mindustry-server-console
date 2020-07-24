/**
 * Regular expression for checking colored strings.
 * @type {RegExp}
 */
const colorRegex = /\[(\w)+]/g;

/**
 * Regular expression for checking HEX colors.
 * @type {RegExp}
 */
const hexRegex = /[0-9A-Fa-f]{6}/;

/**
 * Check is given color in a hex format.
 * @param {string} color - Color to be checked.
 * @returns {boolean} - Is given in a hex format.
 */
function isHex(color) {
    return !!color.match(hexRegex);
}

/**
 * Check is given string have colored symbols.
 * @param {string} name - String to be checked.
 * @returns {boolean} - Is colored symbols here.
 */
function isColored(name) {
    return !!name.match(colorRegex) || isHex(name);
}

/**
 * Get a html fragment of the color and string.
 * @param {string} str - Colored string.
 * @param {string} colorClassName - Name of the css color class.
 * @returns {string} - Html fragment.
 */
function getColoredString(str, colorClassName) {
    return `<span class='mindustry-${colorClassName}'>${str}</span>`;
}

/**
 * Get a html fragment of the hex color and string.
 * @param {string} str - Colored string.
 * @param {string} hexColor - Color in hex format.
 * @returns {string} - Html fragment.
 */
function getHexColoredString(str, hexColor) {
    return `<span style="color: ${hexColor.startsWith('#') ? hexColor : `#${hexColor}`}">${str}</span>`;
}

/**
 * Check color in the string.
 * @param {string} str - String to be checked.
 * @returns {{str: string, color: string}|string} - Object with string and color.
 */
function checkColor(str) {
    for (let i = 1; i < str.length; i++) {
        if (str.charAt(i) === ']') {
            const color = str.substring(1, i);
            return { str: str.substring(i + 1), color };
        }
    }
    return str;
}

/**
 * Parse a raw player name with colors.
 * @param {string} rawName - Name to be parsed.
 * @returns {string} - Html fragment.
 */
function parseName(rawName) {
    const name = rawName.trim();

    if (name === '[' || name === ']' || !isColored(name)) {
        return `<div class='colored'>${name}</div>`;
    }

    const coloredStrings = [];
    let coloring = false;

    for (let i = 0; i < name.length; i++) {
        if (name.charAt(i) === '[' && i !== name.length - 1 && name.charAt(i + 1) !== '[' && (i === 0 || name.charAt(i - 1) !== '[')) {
            coloring = true;
            const next = name.substring(i);
            const result = checkColor(next);
            for (let j = 0; j < result.str.length; j++) {
                if (result.str.split('')[j] === '[') {
                    result.str = result.str.split('').slice(0, j).join('');
                    break;
                }
            }
            result.str.replace(colorRegex, '');
            const coloredString = isHex(result.color)
                ? getHexColoredString(result.str, result.color)
                : getColoredString(result.str, result.color);
            coloredStrings.push(coloredString);
        } else if (!coloring) {
            const whiteString = getColoredString(name.charAt(i), 'white');
            coloredStrings.push(whiteString);
        }
    }
    return `<div class="colored">${coloredStrings.join('')}</div>`;
}

module.exports = parseName;
