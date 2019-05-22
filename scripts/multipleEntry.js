const path = require('path')
const fs = require('fs')

const camelizeRE = /-(\w)/g
const camelize = str => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
}

const hyphenateRE = /\B([A-Z])/g
const hyphenate = str => {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
}

exports.fileToComponentName = ({ prefix = 'wc', component }) => {
  const basename = path.basename(component).replace(/\.(jsx?|vue)$/, '')
  const camelName = camelize(basename)
  const kebabName = `${prefix ? `${prefix}-` : ``}${hyphenate(basename)}`

  return {
    basename,
    camelName,
    kebabName
  }
}

const createElement = ({ prefix = 'wc', component, file }) => {
  const { camelName, kebabName } = exports.fileToComponentName({ prefix, component })

  return `import ${camelName} from './../${file}?shadow'\n` +
    `window.customElements.define('${kebabName}', wrap(Vue, ${camelName}))\n`
}

exports.resolveEntry = ({ prefix = 'wc', libName = 'vue', component }) => {
  const resolvedFiles = require('globby').sync('./src', {
    expandDirectories: {
      files: [component],
      extensions: ['vue']
    }
  })

  const filePath = path.resolve(__dirname, './../tmp/entry-wc.js')
  const elements =
    prefix === ''
      ? [createElement({ prefix: '', component: libName, file: files[0] })]
      : resolvedFiles.map(file => createElement({ prefix, component: file, file })).join('\n')

  const content = `
    import './../scripts/setPublicPath'
    import Vue from 'vue'
    import wrap from '@vue/web-component-wrapper'
    // runtime shared by every component chunk
    import 'css-loader/dist/runtime/api'
    import 'vue-style-loader/lib/addStylesShadow'
    import 'vue-loader/lib/runtime/componentNormalizer'
    ${elements}`.trim()

  fs.writeFileSync(filePath, content)

  return filePath
}
