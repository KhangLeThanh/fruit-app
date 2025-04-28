<template>
  <select id="test-dropdown" :valuel="modelValue" @change="onChange">
    <option v-for="option in options" :key="option" :value="option">
      {{ option }}
    </option>
  </select>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
export default defineComponent({
  name: "SelectComponent",
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    options: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const onChange = (event: Event) => {
      const target = event.target as HTMLSelectElement;
      emit("update:modelValue", target.value);
    };
    return { onChange };
  },
});
</script>
