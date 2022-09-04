"use strict";
function normalizeColor(color) {
    return `rgb(${String(Math.round(color.r * 255))},${String(Math.round(color.g * 255))},${String(Math.round(color.b * 255))});`;
}
function getStyles(node) {
    var _a, _b, _c, _d, _e, _f;
    return `${typeof node.layoutMode === 'string' ? 'display:flex;' : ''}
  ${node.layoutMode === 'VERTICAL' ? 'flex-direction:column;' : ''}
  ${node.layoutAlign === 'STRETCH' ? 'align-self:stretch;' : ''}
  ${node.layoutGrow === 0 ? 'flex-grow: 0;' : ''}
  ${typeof node.itemSpacing === 'number' ? 'gap:'.concat(String(node.itemSpacing), 'px;') : ''}
  ${(node.backgroundColor != null) ? 'color:'.concat(normalizeColor(node.backgroundColor)) : ''}
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
  ${(node.background != null) && ((_f = node.background) === null || _f === void 0 ? void 0 : _f.length) > 0 ? 'background-color:'.concat(normalizeColor(node.background[0].color)) : ''}

  `;
}
function createElement({ elementType, content, className, styles }) {
    return `<${elementType} class="${className !== null && className !== void 0 ? className : ''}" style="${styles !== null && styles !== void 0 ? styles : ''}">${content}</${elementType}>`;
}
function reducer(node) {
    var _a, _b, _c, _d, _e;
    switch (node.type) {
        case 'DOCUMENT':
            return createElement({ elementType: 'div', content: (_a = node.characters) !== null && _a !== void 0 ? _a : '', className: node.name.toLowerCase(), styles: getStyles(node) });
        case 'COMPONENT':
            return '';
        case 'CANVAS':
            return createElement({ elementType: 'div', content: (_b = node.characters) !== null && _b !== void 0 ? _b : '', className: node.name.toLowerCase(), styles: getStyles(node) });
        case 'FRAME':
            return createElement({ elementType: 'div', content: (_c = node.characters) !== null && _c !== void 0 ? _c : '', className: node.name.toLowerCase(), styles: getStyles(node) });
        case 'TEXT':
            return createElement({ elementType: 'span', content: (_d = node.characters) !== null && _d !== void 0 ? _d : '', className: node.name.toLowerCase(), styles: getStyles(node) });
        default:
            return createElement({ elementType: 'div', content: (_e = node.characters) !== null && _e !== void 0 ? _e : '', className: node.name.toLowerCase(), styles: getStyles(node) });
    }
}
// Парсер
// const st = new Set()
// function parse (node: Node): void {
//   st.add(node.style)
//   if ((typeof node.children !== 'undefined') && node.children?.length > 0) {
//     for (const child of node.children) {
//       st.add(child.style)
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
    const result = traverse(json.document);
    return result;
}
module.exports = build;
