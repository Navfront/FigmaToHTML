interface Json {
  document: Node
}
interface BGColor {
  r: number
  g: number
  b: number
  a: number
}

interface Node {
  id: string
  name: string
  type: NodeType
  children: Node[] | undefined
  backgroundColor: BGColor
  characters?: string | undefined
  style?: {} | undefined
  background?: [] | undefined
  blendMode?: 'PASS_THROUGH' | undefined
  layoutAlign?: 'INHERIT' | 'STRETCH' | undefined
  layoutGrow?: 0 | undefined
  layoutMode?: 'VERTICAL' | 'HORIZONTAL' | undefined

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

// const st = new Set()
// function parse (node: Node): void {
//   st.add(node.characters)
//   if ((typeof node.children !== 'undefined') && node.children?.length > 0) {
//     for (const child of node.children) {
//       st.add(child.characters)
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
