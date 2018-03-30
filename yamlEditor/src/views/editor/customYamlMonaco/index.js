import customYamlMonaco from './customYamlMonaco'

export default customYamlMonaco

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(customYamlMonaco.name, customYamlMonaco)
}
