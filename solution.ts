interface Json {
  document: Node
}
interface Color {
  r: number
  g: number
  b: number
  a: number
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
  backgroundColor: Color
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

interface CreateElement {
  elementType: string
  content: string
  className?: string
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

function createElement ({ elementType, content, className }: CreateElement): string {
  return `<${elementType} class="${className ?? ''}">${content}</${elementType}>`
}

function reducer (node: Node): string {
  switch (node.type) {
    case 'DOCUMENT':
      return createElement({ elementType: 'div', content: node.characters ?? '', className: node.name.toLowerCase() })
    case 'COMPONENT':
      return ''
    case 'CANVAS':
      return createElement({ elementType: 'div', content: node.characters ?? '', className: node.name.toLowerCase() })
    case 'FRAME':
      return createElement({ elementType: 'div', content: node.characters ?? '', className: node.name.toLowerCase() })
    case 'TEXT':
      return createElement({ elementType: 'p', content: node.characters ?? '', className: node.name.toLowerCase() })
    default:
      return createElement({ elementType: 'div', content: node.characters ?? '', className: node.name.toLowerCase() })
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
