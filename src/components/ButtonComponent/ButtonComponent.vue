<template>
  <button
    :type="buttonType"
    class="btn"
    :class="buttonClass"
    :disabled="isDisabled"
    :data-testid="testId"
    @click="onClick"
  >
    {{ text }}
  </button>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
export default defineComponent({
  name: "ButtonComponent",
  props: {
    text: {
      type: String,
      required: true,
    },
    isDisabled: {
      type: Boolean,
      required: false,
    },
    dataId: {
      type: String,
      required: false,
    },
    type: {
      type: String as () => "button" | "submit" | "reset",
      default: "button",
    },
    class: {
      type: String,
      required: false,
    },
  },
  emits: ["parentClick"],
  setup(props, { emit }) {
    const onClick = () => {
      if (emit) {
        emit("parentClick");
      }
    };
    const testId = computed(() => props.dataId);
    const buttonType = computed(() => props.type);
    const buttonClass = computed(() => props.class);

    return {
      onClick,
      testId,
      buttonType,
      buttonClass,
    };
  },
});
</script>
