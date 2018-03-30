<template>
  <div>
		<MonacoEditor
    height="850"
    :language="language"
    :code="code"
    :editorOptions="options"
    @mounted="onMounted"
    @codeChange="onCodeChange"
    >
</MonacoEditor>
  </div>
</template>

<script>
import MonacoEditor from 'vue-monaco-editor'
export default {
  data() {
    return {
      language: 'yaml',
      code: '// yaml语法验证、关键字验证 \n',
      options: {
        selectOnLineNumbers: false,
        setDiagnosticsOptions: {
          validate: true,
          schemas: [{
            fileMatch: ['*'],
            schema: {
              'title': 'Person',
              'type': 'object',
              'properties': {
                'firstName': {
                  'type': 'string'
                },
                'lastName': {
                  'type': 'string'
                },
                'age': {
                  'description': 'Age in years',
                  'type': 'integer',
                  'minimum': 0
                }
              },
              'required': ['firstName', 'lastName']
            }
          }]
        }
      }
    }
  },

  components: {
    MonacoEditor
  },

  computed: {},

  mounted: {},
  methods: {
    onMounted(editor) {
      this.editor = editor
    },
    onCodeChange(editor) {
      // console.log(this.editor.getValue())
    }
  }
}

</script>
<style lang='scss' scoped>
</style>