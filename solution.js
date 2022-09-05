"use strict";
function normalizeColor(color) {
    if (typeof color === 'undefined') {
        return 'red';
    }
    if (typeof (color === null || color === void 0 ? void 0 : color.r) === 'undefined' || typeof (color === null || color === void 0 ? void 0 : color.g) === 'undefined' || typeof (color === null || color === void 0 ? void 0 : color.g) === 'undefined') {
        return 'red';
    }
    return `rgb(${String(Math.round(color.r * 255))},${String(Math.round(color.g * 255))},${String(Math.round(color.b * 255))});`;
}
function getStyles(node) {
    var _a, _b, _c, _d, _e, _f, _g;
    return `${typeof node.layoutMode === 'string' ? 'display:flex;' : ''}
  ${node.layoutMode === 'VERTICAL' ? 'flex-direction:column;' : ''}
  ${node.layoutAlign === 'STRETCH' ? 'align-self:stretch;' : ''}
  ${node.layoutGrow === 0 ? 'flex-grow: 0;' : ''}
  ${typeof node.itemSpacing === 'number' ? 'gap:'.concat(String(node.itemSpacing), 'px;') : ''}

  ${node.primaryAxisAlignItems === 'SPACE_BETWEEN' ? 'justify-content: space-between;' : ''}
  ${node.counterAxisAlignItems === 'CENTER' ? 'align-items: center;' : ''}
  ${node.primaryAxisAlignItems === 'CENTER' ? 'justify-content: center;' : ''}
  ${(node.paddingTop != null) ? 'padding-top:'.concat(String(node.paddingTop), 'px;') : ''}
  ${(node.paddingBottom != null) ? 'padding-bottom:'.concat(String(node.paddingBottom), 'px;') : ''}
  ${(node.paddingLeft != null) ? 'padding-left:'.concat(String(node.paddingLeft), 'px;') : ''}
  ${(node.paddingRight != null) ? 'padding-right:'.concat(String(node.paddingRight), 'px;') : ''}
  ${typeof ((_a = node.style) === null || _a === void 0 ? void 0 : _a.fontFamily) === 'string' ? 'font-family:'.concat(node.style.fontFamily, ';') : ''}
  ${typeof ((_b = node.style) === null || _b === void 0 ? void 0 : _b.fontWeight) === 'number' ? 'font-weight:'.concat(String(node.style.fontWeight), ';') : ''}
  ${typeof ((_c = node.style) === null || _c === void 0 ? void 0 : _c.fontSize) === 'number' ? 'font-size:'.concat(String(node.style.fontSize), 'px;') : ''}
  ${typeof ((_d = node.style) === null || _d === void 0 ? void 0 : _d.textAlignHorizontal) === 'string' ? 'text-align:'.concat(node.style.textAlignHorizontal.toLowerCase(), ';') : ''}
  ${typeof ((_e = node.style) === null || _e === void 0 ? void 0 : _e.lineHeightPercent) === 'number' ? 'line-height:'.concat(String(node.style.lineHeightPercent), '%;') : ''}
  ${(node.absoluteBoundingBox != null) ? 'width:'.concat(String(node.absoluteBoundingBox.width), 'px;') : ''}
  ${(node.absoluteBoundingBox != null) && node.type === 'RECTANGLE' ? 'height:'.concat(String(node.absoluteBoundingBox.height), 'px;') : ''}
  ${(node.name.toLowerCase() === 'main' || node.name.toLowerCase() === 'navbar' || node.name.toLowerCase() === 'content' || node.name.toLowerCase() === 'section' ? 'margin: 0 auto;' : '')}
  ${(node.name.toLowerCase() === 'image' && (node.fills != null) && ((_f = node.fills) === null || _f === void 0 ? void 0 : _f.length) > 0 ? 'background-color:'.concat(normalizeColor(node === null || node === void 0 ? void 0 : node.fills[0].color), ';') : '')}
  ${(node.type === 'TEXT' && (node.fills != null) && ((_g = node.fills) === null || _g === void 0 ? void 0 : _g.length) > 0 ? 'color:'.concat(normalizeColor(node === null || node === void 0 ? void 0 : node.fills[0].color), ';') : '')}
 ${(node.effects != null && node.effects.length > 0 && node.effects[0].type === 'DROP_SHADOW') ? 'box-shadow: 0px 1px 0px #000000;' : ''}
  `;
}
function createElement({ elementType, content, className, styles }) {
    return `<${elementType} class="${className !== null && className !== void 0 ? className : ''}" style="${styles !== null && styles !== void 0 ? styles : ''}">${content}</${elementType}>`;
}
function createInstance(node) {
    var _a, _b;
    if (node.name.toLowerCase() === 'button') {
        return `<button type="button" class="${node.name.toLowerCase()}" style="${getStyles(node)} padding-left:0; padding-right:0; cursor:pointer; background:${(node.background != null) && node.background.length > 0 ? normalizeColor(node.background[0].color) : 'transparent'};">${(_a = node.characters) !== null && _a !== void 0 ? _a : ''}</button>`;
    }
    return createElement({ elementType: 'div', content: (_b = node.characters) !== null && _b !== void 0 ? _b : '', className: node.name.toLowerCase(), styles: getStyles(node) });
}
function createRectangle(node) {
    var _a, _b;
    if (node.name.toLowerCase() === 'image') {
        return `<div class="${node.name.toLowerCase()}" style="${getStyles(node)}">${(_a = node.characters) !== null && _a !== void 0 ? _a : ''}</div>`;
    }
    return createElement({ elementType: 'div', content: (_b = node.characters) !== null && _b !== void 0 ? _b : '', className: node.name.toLowerCase(), styles: getStyles(node) });
}
function reducer(node) {
    var _a, _b, _c;
    switch (node.type) {
        case 'COMPONENT':
            return '';
        case 'FRAME':
            return createElement({ elementType: 'div', content: (_a = node.characters) !== null && _a !== void 0 ? _a : '', className: node.name.toLowerCase(), styles: getStyles(node) });
        case 'TEXT':
            return createElement({ elementType: 'span', content: (_b = node.characters) !== null && _b !== void 0 ? _b : '', className: node.name.toLowerCase(), styles: getStyles(node) });
        case 'RECTANGLE':
            return createRectangle(node);
        case 'INSTANCE':
            return createInstance(node);
        default:
            if (typeof node.children[0] !== 'undefined') {
                return reducer(node.children[0]);
            }
            else {
                return createElement({ elementType: 'div', content: (_c = node.characters) !== null && _c !== void 0 ? _c : '', className: node.name.toLowerCase(), styles: getStyles(node) });
            }
    }
}
// Парсер
// const st = new Set()
// function parse (node: Node): void {
//   st.add(node.type)
//   if ((typeof node.children !== 'undefined') && node.children?.length > 0) {
//     for (const child of node.children) {
//       st.add(child.type)
//       parse(child)
//     }
//   }
// }
function traverse(node) {
    if (node.characters == null) {
        node.characters = '';
    }
    if (typeof node.children !== 'undefined' && node.children.length > 0) {
        for (const child of node.children) {
            node.characters = node.characters.concat(' ' + traverse(child));
        }
    }
    return reducer(node);
}
function build(json) {
    // parse(json.document)
    // console.log(st)
    const result = traverse(json.document);
    return result;
}
module.exports = build;
