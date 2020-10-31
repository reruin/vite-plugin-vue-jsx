import { Transform } from 'vite'

export const vueJsxTransform: Transform = {
  test({ path, isBuild }) {
    if (!/\.(t|j)sx?$/.test(path)) {
      return false
    }
    if ((path.startsWith(`/@modules/`) || path.includes('node_modules')) && !path.endsWith('x')) {
      return false
    }

    return true
  },
  transform({ id, code, path, isBuild }) {
    
    if (code.includes("import { jsx } from")) {
      code = code.replace(/import \{ jsx \} from[^\r\n]+/, "import { jsx } from 'vite-plugin-vue-jsx/dist/jsx'")
    }
    return {
      code: `${code}`,
      // map: result.map
    }
    
  }
}
