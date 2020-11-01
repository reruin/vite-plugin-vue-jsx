import { vShow, withDirectives, vModelText, vModelSelect, vModelRadio, vModelCheckbox, createVNode, isVNode } from 'vue'

// const setVal = (wrap:any,setter?:Function) => isRef(wrap) ? (val:any) => (wrap.value = val) : setter;

export const jsx = (tag: string, props: any, ...children: any[]) => {
  let directives: any[] = []
  let slots: any = {}
  if (props) {
    let keys = Object.keys(props)
    for (let prop of keys) {
      let val = props[prop]

      if (prop == 'v-model') {
        let [setter, newval, ...rest] = val
        let modelValue: string = 'modelValue', modifier: string[] = rest[1] || []
        if (typeof rest[0] == 'string') {
          modelValue = rest[0]
        } else if (Array.isArray(rest[0])) {
          modifier = rest[0]
        }
        let modifierObj: any = modifier.reduce((t:any, c:string) => (t[c] = true, t), {})
        let directive
        if (['input', 'textarea'].includes(tag)) {
          directive = vModelText
        }
        else if (tag == 'select') {
          directive = vModelSelect
        }
        else if (tag == 'radio') {
          directive = vModelRadio
        }
        else if (tag == 'checkbox') {
          directive = vModelCheckbox
        }
        else {
          if (modifier.length) {
            props[modelValue + 'Modifiers'] = modifierObj
          }
        }
        if(directive){
          directives.push([directive, newval, '', modifierObj]);
        }else{
          props[modelValue] = newval;
        }
        props['onUpdate:'+modelValue] = setter;
        
        Reflect.deleteProperty(props, prop)
      }
      else if (prop == 'v-html') {
        props.innerHTML = val
        Reflect.deleteProperty(props, prop)
      }
      else if (prop == 'v-text') {
        props.textContent = val
        Reflect.deleteProperty(props, prop)
      }
      else if (prop == 'v-show') {
        directives.push([vShow, val])
        Reflect.deleteProperty(props, prop)
      }
      else if (prop == 'v-slots') {
        for (let i in val) {
          slots[i] = val[i]
        }
        Reflect.deleteProperty(props, prop);
      }
    }
  }

  if (children.length > 0) {
    let last = children[0]
    // children is slots
    if (Object.prototype.toString.call(last) == '[object Object]' && !isVNode(last)) {
      for (let i in last) {
        slots[i] = last[i]
      }
    } else {
      slots.default = () => children
    }

  }

  let vnode = createVNode(tag, props, Object.keys(slots).length == 0 ? null : slots)

  if (directives.length) {
    vnode = withDirectives(vnode, directives)
  }
  return vnode
}