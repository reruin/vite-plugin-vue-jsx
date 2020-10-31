import { isRef, vShow, withDirectives , createVNode, isVNode  } from 'vue'

const getVal = (val:any) => isRef(val) ? val.value : val

const setVal = (val:any, nv:any) => isRef(val) ? (val.value = nv) : (val = nv)

export const jsx = (tag:string, props:any, ...children:any[]) => {
  let directives:any[] = []
  let slots:any = {}
  if (props) {
    let keys = Object.keys(props)
    for (let prop of keys) {
      let val = props[prop]

      if (prop == 'v-model') {
        if (Array.isArray(val)) {
          let [newval, modelValue] = val
          props[modelValue] = getVal(newval)
          props['onUpdate:' + modelValue] = ($event:any) => setVal(newval, $event)
        } else {
          if (['select', 'input', 'textarea'].includes(tag)) {
            props['value'] = getVal(val)
            props['onInput'] = ($event:any) => setVal(val, $event.target.value)
          } else if (['radio', 'checkbox'].includes(tag)) {

          } else {
            props['modelValue'] = getVal(val)
            props['onUpdate:modelValue'] = ($event:any) => setVal(val, $event)
          }

        }
        Reflect.deleteProperty(props, prop)
      }
      else if (prop == 'v-html') {
        props.innerHTML = getVal(val)
        Reflect.deleteProperty(props, prop)
      }
      else if (prop == 'v-text') {
        props.textContent = getVal(val)
        Reflect.deleteProperty(props, prop)
      }
      else if (prop == 'v-show') {
        directives.push([vShow, getVal(val)])
        Reflect.deleteProperty(props, prop)
      }
      else if (prop == 'v-slots') {
        for(let i in val){
          slots[i] = val[i]
        }
        Reflect.deleteProperty(props, prop);
      }
    }
  }

  if(children.length > 0){
    let last = children[0]
    // children is slots
    if( typeof last == 'object' && !isVNode(last) ){
        for(let i in last){
            slots[i] = last[i]
        }
    }else{
        slots.default = () => children
    }
  
  }

  let vnode = createVNode(tag, props, Object.keys(slots).length == 0 ? null : slots)

  if (directives.length) {
    vnode = withDirectives(vnode, directives)
  }
  return vnode
}