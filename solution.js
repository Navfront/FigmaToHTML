"use strict";
function createElement({ elementType, content, className }) {
    return `<${elementType} class="${className !== null && className !== void 0 ? className : ''}">${content}</${elementType}>`;
}
function reducer(node) {
    var _a, _b, _c, _d, _e;
    switch (node.type) {
        case 'DOCUMENT':
            return createElement({ elementType: 'div', content: (_a = node.characters) !== null && _a !== void 0 ? _a : '', className: node.name.toLowerCase() });
        case 'COMPONENT':
            return '';
        case 'CANVAS':
            return createElement({ elementType: 'div', content: (_b = node.characters) !== null && _b !== void 0 ? _b : '', className: node.name.toLowerCase() });
        case 'FRAME':
            return createElement({ elementType: 'div', content: (_c = node.characters) !== null && _c !== void 0 ? _c : '', className: node.name.toLowerCase() });
        case 'TEXT':
            return createElement({ elementType: 'p', content: (_d = node.characters) !== null && _d !== void 0 ? _d : '', className: node.name.toLowerCase() });
        default:
            return createElement({ elementType: 'div', content: (_e = node.characters) !== null && _e !== void 0 ? _e : '', className: node.name.toLowerCase() });
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
