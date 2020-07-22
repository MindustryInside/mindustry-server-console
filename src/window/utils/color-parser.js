const colorRegex = /\[(\w)+]/g;
const hexRegex = /[0-9A-Fa-f]{6}/;

function isHex(color) {
    return color.match(hexRegex);
}

function isColored(name) {
    return name.match(colorRegex) || isHex(name);
}

function getColoredString(str, colorClassName) {
    return `<span class='mindustry-${colorClassName}'>${str}</span>`;
}

function getHexColoredString(str, hexColor) {
    return `<span style="color: ${hexColor.startsWith('#') ? hexColor : `#${hexColor}`}">${str}</span>`;
}

function checkColor(str) {
    for (let i = 1; i < str.length; i++) {
        if (str.charAt(i) === ']') {
            const color = str.substring(1, i);
            return { str: str.substring(i + 1), color };
        }
    }
    return str;
}

function parseName(rawName) {
    const name = rawName.trim();

    if (name === '[' || name === ']' || !isColored(name)) {
        return `<div class='colored'>${name}</div>`;
    }

    const coloredStrings = [];
    for (let i = 0; i < name.length; i++) {
        if (name.charAt(i) === '[' && i !== name.length - 1 && name.charAt(i + 1) !== '[' && (i === 0 || name.charAt(i - 1) !== '[')) {
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
        }
    }
    return `<div class="colored">${coloredStrings.join('')}</div>`;
}

module.exports = parseName;
