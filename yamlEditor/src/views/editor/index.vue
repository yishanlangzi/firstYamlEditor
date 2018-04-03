<template>
  <div>
		<customYamlMonaco
    height="850"
    class="editor"
    v-model="code"
    language="yaml">
    >
</customYamlMonaco>
  </div>
</template>

<script>
import customYamlMonaco from './customYamlMonaco/customYamlMonaco'
import schema from './customYamlMonaco/schema'
export default {
  data() {
    return {
      // code: [
      //   "specVersion: 1.0"
      // ].join("\n")
      code: schema
    }
  },

  components: {
    customYamlMonaco
  },

  computed: {},

  mounted: {},
  created() {},
  methods: {}
}
</script>
<style lang='scss' scoped>
.editor {
  width: 100%;
  height: 800px;
}
</style>