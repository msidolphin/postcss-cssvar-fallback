const fs = require('fs')
const postcss = require('postcss')
const valueParser = require('postcss-value-parser')

const variables = new Map()

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = postcss.plugin('postcss-cssvar-fallback', (options) => {
  if (variables.size === 0) {
    const { path } = options
    const themes = fs.readFileSync(path, 'utf-8')
    const root = postcss.parse(themes)
    const nodes = root.nodes
    // 收集cssvar
    nodes.forEach(node => {
      const Declarations = node.nodes
      Declarations.forEach(Declaration => {
        const prop = Declaration.prop
        if (/^--/.test(prop)) {
          variables.set(prop, Declaration.value)
        }
      })
    })
    variables.forEach((variable, key) => {
      const ast = valueParser(variable)
      if (ast && ast.nodes) {
        ast.nodes.forEach(node => {
          parseValue(node)
        })
        const parsedValue = ast.toString()
        if (variable !== parsedValue) {
          variables.set(key, parsedValue)
        }
      }
    })
  }
  
  function parseValue (node) {
    if (node.type === 'word') {
      const cssvar = node.value
      if (/^--/.test(cssvar)) {
        const parsedValue = variables.get(cssvar)
        if (parsedValue) {
          node.value = `${node.value}, ${parsedValue}`
        }
      }
    } else {
      if (node.nodes) {
        if (node.nodes.length === 1) {
          // 必然不包含默认值，要做处理
          parseValue(node.nodes[0])
        } else {
          for (let i = 0; i < node.nodes.length; ++i) {
            const curNode = node.nodes[i]
            if (curNode.type === 'function') {
              parseValue(curNode)
            } else {
              const defaultValue = node.nodes[i + 2]
              if (!defaultValue) {
                parseValue(curNode)
              } else {
                if (/^--/.test(defaultValue.value)) {
                  parseValue(curNode)
                }
              }
            }
          }
        }
      }
    }
  }

  return (root) => {
    root.walkDecls((decl) => {
      const value = decl.value
      const ast = valueParser(value)
      if (ast && ast.nodes) {
        ast.nodes.forEach(node => {
          parseValue(node)
        })
        decl.value = ast.toString()
      }
    })
  }
})


module.exports.postcss = true
