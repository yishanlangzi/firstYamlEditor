export default {
  name: 'customYamlMonaco',

  props: {
    width: { type: [String, Number], default: '100%' },
    height: { type: [String, Number], default: '100%' },
    value: String,
    theme: {
      type: String,
      default: 'vs-dark'
    },
    language: String,
    options: Object,
    placeholder: null,
    require: {
      type: Function,
      default: window.require
    }
  },

  model: {
    event: 'change'
  },

  data() {
    return {
      editorLoaded: false
    }
  },

  watch: {
    options: {
      deep: true,
      handler(options) {
        if (this.editor) {
          this.editor.updateOptions(options)
        }
      }
    },

    value(newValue) {
      if (this.editor) {
        if (newValue !== this.editor.getValue()) {
          this.editor.setValue(newValue)
        }
      }
    },

    language(newVal) {
      if (this.editor) {
        window.monaco.editor.setModelLanguage(this.editor.getModel(), newVal)
      }
    },

    theme(newVal) {
      if (this.editor) {
        window.monaco.editor.setTheme(newVal)
      }
    }
  },

  mounted() {
    const options = {
      value: this.value,
      theme: this.theme,
      language: this.language,
      ...this.options
    }

    this.require(
      [
        'vs/editor/editor.main',
        'vs/basic-languages/dev/monaco.contribution',
        'vs/languages/yaml/monaco.contribution'
      ],
      () => {
        window.monaco.languages.yaml.yamlDefaults.setDiagnosticsOptions({
          validate: true,
          schemas: [
            {
              fileMatch: ['*'],
              schema: {
                properties: {
                  specVersion: {
                    type: 'string',
                    pattern: '[0‐9]+\\.[0‐9]+'
                  },
                  kind: {
                    type: 'string',
                    enum: ['TypeList', 'Interface']
                  },
                  meta: {
                    properties: {
                      module: {
                        type: 'string'
                      },
                      name: {
                        type: 'string'
                      },
                      version: {
                        type: 'string',
                        pattern: '[0‐9]+\\.[0‐9]+'
                      },
                      desc: {
                        type: 'string'
                      }
                    },
                    required: ['module', 'name', 'version'],
                    additionalProperties: false
                  },
                  references: {
                    type: 'array',
                    minItems: 1,
                    items: {
                      $ref: '#/definitions/Location'
                    }
                  },
                  types: {
                    minItems: 1,
                    items: {
                      $ref: '#/definitions/Type'
                    }
                  },
                  methods: {
                    minItems: 1,
                    items: {
                      $ref: '#/definitions/Method'
                    }
                  }
                },
                required: ['specVersion', 'kind', 'meta'],
                additionalProperties: false,
                oneOf: [
                  {
                    properties: {
                      kind: {
                        type: 'string',
                        enum: ['TypeList']
                      },
                      types: {}
                    },
                    required: ['kind', 'types'],
                    not: {
                      properties: {
                        methods: {}
                      },
                      required: ['methods']
                    }
                  },
                  {
                    properties: {
                      kind: {
                        type: 'string',
                        enum: ['Interface']
                      },
                      methods: {}
                    },
                    required: ['kind', 'methods']
                  }
                ],
                definitions: {
                  Location: {
                    properties: {
                      location: {
                        type: 'string'
                      }
                    },
                    additionalProperties: false
                  },
                  Field: {
                    properties: {
                      name: {
                        type: 'string'
                      },
                      type: {
                        type: 'string'
                      },
                      decs: {
                        type: 'string'
                      }
                    },
                    required: ['name', 'type'],
                    additionalProperties: false
                  },
                  Type: {
                    properties: {
                      name: {
                        type: 'string'
                      },
                      decs: {
                        type: 'string'
                      },
                      fields: {
                        minItems: 1,
                        items: {
                          $ref: '#/definitions/Field'
                        }
                      }
                    },
                    required: ['name', 'fields'],
                    additionalProperties: false
                  },
                  Param: {
                    properties: {
                      name: {
                        type: 'string'
                      },
                      type: {
                        type: 'string'
                      },
                      desc: {
                        type: 'string'
                      }
                    },
                    required: ['name', 'type'],
                    additionalProperties: false
                  },
                  Method: {
                    properties: {
                      name: {
                        type: 'string'
                      },
                      params: {
                        minItems: 1,
                        items: {
                          $ref: '#/definitions/Param'
                        }
                      },
                      return: {
                        type: 'string'
                      }
                    },
                    required: ['name'],
                    additionalProperties: false
                  }
                }

                // 'title': 'Person',
                // 'type': 'object',
                // 'properties': {
                //   'firstName': {
                //     'type': 'string'
                //   },
                //   'lastName': {
                //     'type': 'string'
                //   },
                //   'age': {
                //     'description': 'Age in years',
                //     'type': 'integer',
                //     'minimum': 0
                //   }
                // },
                // 'required': ['firstName', 'lastName']
              }
            }
          ]
        })

        this.editorLoaded = true
        this.editor = window.monaco.editor.create(this.$el, options)
        this.$emit('editorMount', this.editor)
        this.editor.onContextMenu(event => this.$emit('contextMenu', event))
        this.editor.onDidBlurEditor(() => this.$emit('blur'))
        this.editor.onDidBlurEditorText(() => this.$emit('blurText'))
        this.editor.onDidChangeConfiguration(event =>
          this.$emit('configuration', event)
        )
        this.editor.onDidChangeCursorPosition(event =>
          this.$emit('position', event)
        )
        this.editor.onDidChangeCursorSelection(event =>
          this.$emit('selection', event)
        )
        this.editor.onDidChangeModel(event => this.$emit('model', event))
        this.editor.onDidChangeModelContent(event => {
          const value = this.editor.getValue()
          if (this.value !== value) {
            this.$emit('change', value, event)
          }
        })
        this.editor.onDidChangeModelDecorations(event =>
          this.$emit('modelDecorations', event)
        )
        this.editor.onDidChangeModelLanguage(event =>
          this.$emit('modelLanguage', event)
        )
        this.editor.onDidChangeModelOptions(event =>
          this.$emit('modelOptions', event)
        )
        this.editor.onDidDispose(event => this.$emit('afterDispose', event))
        this.editor.onDidFocusEditor(() => this.$emit('focus'))
        this.editor.onDidFocusEditorText(() => this.$emit('focusText'))
        this.editor.onDidLayoutChange(event => this.$emit('layout', event))
        this.editor.onDidScrollChange(event => this.$emit('scroll', event))
        this.editor.onKeyDown(event => this.$emit('keydown', event))
        this.editor.onKeyUp(event => this.$emit('keyup', event))
        this.editor.onMouseDown(event => this.$emit('mouseDown', event))
        this.editor.onMouseLeave(event => this.$emit('mouseLeave', event))
        this.editor.onMouseMove(event => this.$emit('mouseMove', event))
        this.editor.onMouseUp(event => this.$emit('mouseUp', event))
      }
    )
  },

  beforeDestroy() {
    this.editor && this.editor.dispose()
  },

  methods: {
    getMonaco() {
      return this.editor
    },

    focus() {
      this.editor.focus()
    }
  },

  render(h) {
    return h('div', null, [this.editorLoaded ? null : this.placeholder])
  }
}
