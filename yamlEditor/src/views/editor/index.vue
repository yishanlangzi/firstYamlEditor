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
export default {
  data() {
    return {
      code: ['firstName: Bob',
        'lastName: sdhu',
        'age: 10'
      ].join('\n')
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