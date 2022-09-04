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
  horizontal: 'LEFT' | 'CENTER' | 'RIGHT'
}

interface Node {
  id: string
  name: string
  type: NodeType
  children: Node[] | undefined
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
  return `rgb(${String(Math.round(color.r * 255))},${String(Math.round(color.g * 255))},${String(Math.round(color.b * 255))});`
}

function getStyles (node: Node): string {
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
  ${typeof node.style?.fontFamily === 'string' ? 'font-family:'.concat(node.style.fontFamily, ';') : ''}
  ${typeof node.style?.fontWeight === 'number' ? 'font-weight:'.concat(String(node.style.fontWeight), ';') : ''}
  ${typeof node.style?.fontSize === 'number' ? 'font-size:'.concat(String(node.style.fontSize), 'px;') : ''}
  ${typeof node.style?.textAlignHorizontal === 'string' ? 'text-align:'.concat(node.style.textAlignHorizontal.toLowerCase(), ';') : ''}
  ${typeof node.style?.lineHeightPercent === 'number' ? 'line-height:'.concat(String(node.style.lineHeightPercent), '%;') : ''}
  ${(node.background != null) && node.background?.length > 0 ? 'background-color:'.concat(normalizeColor(node.background[0].color)) : ''}

  `
}

function createElement ({ elementType, content, className, styles }: CreateElement): string {
  return `<${elementType} class="${className ?? ''}" style="${styles ?? ''}">${content}</${elementType}>`
}

function reducer (node: Node): string {
  switch (node.type) {
    case 'DOCUMENT':
      return createElement({ elementType: 'div', content: node.characters ?? '', className: node.name.toLowerCase(), styles: getStyles(node) })
    case 'COMPONENT':
      return ''
    case 'CANVAS':
      return createElement({ elementType: 'div', content: node.characters ?? '', className: node.name.toLowerCase(), styles: getStyles(node) })
    case 'FRAME':
      return createElement({ elementType: 'div', content: node.characters ?? '', className: node.name.toLowerCase(), styles: getStyles(node) })
    case 'TEXT':
      return createElement({ elementType: 'span', content: node.characters ?? '', className: node.name.toLowerCase(), styles: getStyles(node) })
    default:
      return createElement({ elementType: 'div', content: node.characters ?? '', className: node.name.toLowerCase(), styles: getStyles(node) })
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
  const result = traverse(json.document)
  return result
}
module.exports = build
