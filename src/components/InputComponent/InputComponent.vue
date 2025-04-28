<template>
  <input
    data-testid="inputValue"
    :value="modelValue"
    :type="inputType"
    @input="onInput"
    class="form-control"
    :class="{ 'is-invalid': inputError }"
    placeholder="Enter item name"
    :disabled="disabledInput"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "InputComponent",
  props: {
    modelValue: {
      type: [String, Number],
      required: true,
    },
    type: {
      type: String,
      default: "text",
    },
    errorInput: {
      type: [String, Boolean],
      required: false,
    },
    isDisabled: {
      type: Boolean,
      required: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const onInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      emit("update:modelValue", target.value);
    };
    const inputType = computed(() => props.type);
    const inputError = computed(() => props.errorInput);
    const disabledInput = computed(() => props.isDisabled);

    return {
      onInput,
      inputType,
      inputError,
      disabledInput,
    };
  },
});
</script>
