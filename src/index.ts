import { vueJsxTransform } from './transform'

export default () => {
  return {
    transforms: [vueJsxTransform]
  }
}