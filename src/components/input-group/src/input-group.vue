<template>
  <div v-bind:class="classes">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "vui-input-group",
    inject: {
      vuiForm: {
        default: undefined
      }
    },
    provide() {
      return {
        vuiInputGroup: this
      };
    },
    props: {
      compact: {
        type: Boolean,
        default: false
      },
      size: {
        type: String,
        default() {
          return (this.$vui || {}).size || (this.vuiForm || {}).size || undefined;
        },
        validator(value) {
          return ["large", "small"].indexOf(value) !== -1;
        }
      },
      disabled: {
        type: Boolean,
        default() {
          return (this.vuiForm || {}).disabled || false;
        }
      }
    },
    computed: {
      classes() {
        const { compact } = this;
        const name = this.$options.name;
        const classes = {
          [`${name}`]: true,
          [`${name}-compact`]: compact
        };

        return classes;
      }
    }
  };
</script>