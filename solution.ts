interface Json {
  document: Node
}
interface Color {
  r: number
  g: number
  b: number
  a: number
}

interface Layer {
  blendMode: 'NORMAL'
  visible: boolean
  type: 'SOLID' | 'IMAGE'
  scaleMode?: 'FILL'
  color: Color
  imageRef?: string
}

type Background = Layer[]

interface AbsBoundingBox {
  x: number
  y: number
  width: number
  height: number
}

interface DropShadowEffect {
  type: 'DROP_SHADOW'
  visible: true
  color: Color
  blendMode: 'NORMAL'
  offset: { x: number, y: number}
  radius: 0
  showShadowBehindNode: false
}

type Effects = DropShadowEffect[]

interface Constraints {
  vertical: 'TOP' | 'BOTTOM' | 'SCALE'
  horizontal: 'LEFT' | 'CENTER' | 'RIGHT' | 'SCALE'
}

interface Node {
  id: string
  name: string
  type: NodeType
  children: Node[]
  backgroundColor?: Color
  characters?: string | undefined
  style?: Style | undefined
  background?: Background | undefined
  blendMode?: 'PASS_THROUGH' | undefined
  layoutAlign?: 'INHERIT' | 'STRETCH' | undefined
  layoutGrow?: 0 | undefined
  layoutMode?: 'VERTICAL' | 'HORIZONTAL' | undefined
  absoluteBoundingBox?: AbsBoundingBox | undefined
  constraints?: Constraints
  paddingLeft?: number
  paddingRight?: number
  paddingTop?: number
  paddingBottom?: number
  effects?: Effects
  strokeWeight?: number | undefined
  strokeAlign?: 'INSIDE' | 'OUTSIDE' | undefined
  clipsContent?: boolean | undefined
  fills?: Layer[] | undefined
  itemSpacing?: number | undefined
  primaryAxisSizingMode?: 'FIXED' | undefined
  counterAxisAlignItems?: 'CENTER' | undefined
  primaryAxisAlignItems?: 'SPACE_BETWEEN' | 'CENTER' | undefined
  strokes?: Layer[] | undefined
}

interface Style {
  fontFamily?: 'Inter' | undefined
  fontPostScriptName?: 'Inter-Bold' | 'Inter-Medium' | undefined
  fontWeight?: number | undefined
  textAutoResize?: 'WIDTH_AND_HEIGHT' | 'HEIGHT' | undefined
  fontSize?: number | undefined
  textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT' | undefined
  textAlignVertical?: 'TOP' | undefined
  letterSpacing?: number | undefined
  lineHeightPx?: number | undefined
  lineHeightPercent?: number | undefined
  lineHeightUnit?: 'INTRINSIC_%' | undefined
}

interface CreateElement {
  elementType: string
  content: string
  className?: string
  styles?: string
}

type NodeType =
    'DOCUMENT' |
    'CANVAS' |
    'FRAME' |
    'TEXT' |
    'INSTANCE' |
    'RECTANGLE' |
    'COMPONENT_SET' |
    'COMPONENT'

function normalizeColor (color: Color): string {
  if (typeof color === 'undefined') {
    return 'red'
  }
  if (typeof color?.r === 'undefined' || typeof color?.g === 'undefined' || typeof color?.g === 'undefined') { return 'red' }
  return `rgb(${String(Math.round(color.r * 255))},${String(Math.round(color.g * 255))},${String(Math.round(color.b * 255))});`
}

function getStyles (node: Node): string {
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
  ${typeof node.style?.fontFamily === 'string' ? 'font-family:'.concat(node.style.fontFamily, ';') : ''}
  ${typeof node.style?.fontWeight === 'number' ? 'font-weight:'.concat(String(node.style.fontWeight), ';') : ''}
  ${typeof node.style?.fontSize === 'number' ? 'font-size:'.concat(String(node.style.fontSize), 'px;') : ''}
  ${typeof node.style?.textAlignHorizontal === 'string' ? 'text-align:'.concat(node.style.textAlignHorizontal.toLowerCase(), ';') : ''}
  ${typeof node.style?.lineHeightPercent === 'number' ? 'line-height:'.concat(String(node.style.lineHeightPercent), '%;') : ''}
  ${(node.absoluteBoundingBox != null) ? 'width:'.concat(String(node.absoluteBoundingBox.width), 'px;') : ''}
  ${(node.absoluteBoundingBox != null) && node.type === 'RECTANGLE' ? 'height:'.concat(String(node.absoluteBoundingBox.height), 'px;') : ''}
  ${(node.name.toLowerCase() === 'main' || node.name.toLowerCase() === 'navbar' || node.name.toLowerCase() === 'content' || node.name.toLowerCase() === 'section' ? 'margin: 0 auto;' : '')}
  ${(node.name.toLowerCase() === 'image' && (node.fills != null) && node.fills?.length > 0 ? 'background-color:'.concat(normalizeColor(node?.fills[0].color), ';') : '')}
  ${(node.type === 'TEXT' && (node.fills != null) && node.fills?.length > 0 ? 'color:'.concat(normalizeColor(node?.fills[0].color), ';') : '')}
 ${(node.effects != null && node.effects.length > 0 && node.effects[0].type === 'DROP_SHADOW') ? 'box-shadow: 0px 1px 0px #000000;' : ''}
  `
}

function createElement ({ elementType, content, className, styles }: CreateElement): string {
  return `<${elementType} class="${className ?? ''}" style="${styles ?? ''}">${content}</${elementType}>`
}

function createInstance (node: Node): string {
  if (node.name.toLowerCase() === 'button') {
    return `<button type="button" class="${node.name.toLowerCase()}" style="${getStyles(node)} padding-left:0; padding-right:0; cursor:pointer; background:${(node.background != null) && node.background.length > 0 ? normalizeColor(node.background[0].color) : 'transparent'};">${node.characters ?? ''}</button>`
  }
  return createElement({ elementType: 'div', content: node.characters ?? '', className: node.name.toLowerCase(), styles: getStyles(node) })
}

function createRectangle (node: Node): string {
  if (node.name.toLowerCase() === 'image') {
    return `<div class="${node.name.toLowerCase()}" style="${getStyles(node)}">${node.characters ?? ''}</div>`
  }
  return createElement({ elementType: 'div', content: node.characters ?? '', className: node.name.toLowerCase(), styles: getStyles(node) })
}

function reducer (node: Node): string {
  switch (node.type) {
    case 'COMPONENT':
      return ''
    case 'FRAME':
      return createElement({ elementType: 'div', content: node.characters ?? '', className: node.name.toLowerCase(), styles: getStyles(node) })
    case 'TEXT':
      return createElement({ elementType: 'span', content: node.characters ?? '', className: node.name.toLowerCase(), styles: getStyles(node) })
    case 'RECTANGLE':
      return createRectangle(node)
    case 'INSTANCE':
      return createInstance(node)
    default:
      if (typeof node.children[0] !== 'undefined') {
        return reducer(node.children[0])
      } else {
        return createElement({ elementType: 'div', content: node.characters ?? '', className: node.name.toLowerCase(), styles: getStyles(node) })
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

function traverse (node: Node): string {
  if (node.characters == null) {
    node.characters = ''
  }
  if (typeof node.children !== 'undefined' && node.children.length > 0) {
    for (const child of node.children) {
      node.characters = node.characters.concat(' ' + traverse(child))
    }
  }
  return reducer(node)
}

function build (json: Json): string {
  // parse(json.document)
  // console.log(st)

  const result = traverse(json.document)
  return result
}
module.exports = build
