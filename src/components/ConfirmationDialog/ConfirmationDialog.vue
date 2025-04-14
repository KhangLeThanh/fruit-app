<template>
  <div v-if="internalOpen" class="modal-overlay" data-testId="modal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <p>{{ message }}</p>
        <div class="modal-actions">
          <button
            @click="onConfirm"
            data-testId="confirmButton"
            class="btn btn-danger confirm-button"
          >
            Delete
          </button>
          <button
            @click="onCancel"
            class="btn btn-primary"
            data-testId="cancelButton"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "ConfirmationDialog",
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  emits: ["confirm", "cancel", "update:isVisible"],
  setup(props, { emit }) {
    const internalOpen = ref<boolean>(false);

    // Sync the modal visibility between parent and child
    watch(
      () => props.isVisible,
      (newVal) => {
        internalOpen.value = newVal;
      }
    );

    // Emit the updated visibility to the parent
    watch(internalOpen, (newVal) => {
      emit("update:isVisible", newVal);
    });

    // Action handlers for the modal
    const onConfirm = () => {
      emit("confirm");
      internalOpen.value = false;
    };

    const onCancel = () => {
      emit("cancel");
      internalOpen.value = false;
    };

    return {
      internalOpen,
      onConfirm,
      onCancel,
    };
  },
});
</script>

<style scoped>
/* Style for overlay */
.modal-overlay {
  background-color: rgba(0, 0, 0, 0.6); /* Semi-transparent overlay */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000; /* Ensure overlay covers everything */
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease-in-out;
}

/* Center modal content */
.modal-dialog.modal-dialog-centered {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height */
}

/* Styling for modal content */
.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 9999;
}

.modal-content p {
  font-size: 24px;
  color: #23282d;
  margin-bottom: 20px;
  font-weight: 600;
}

/* Styling for action buttons */
.modal-actions {
  display: flex;
  justify-content: flex-start;
}
.confirm-button {
  margin-right: 15px;
}
</style>
