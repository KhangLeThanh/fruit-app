<template>
  <div class="container">
    <div v-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>
    <div
      v-if="!errorMessage"
      class="d-flex justify-content-between align-items-center mb-3"
    >
      <h1 class="mb-0">Inventory</h1>
      <button
        class="btn btn-primary"
        @click="goToAddForm"
        data-testid="addButton"
      >
        Add New
      </button>
    </div>
    <h5 v-if="inventory && inventory.length === 0">No Inventory Found</h5>
    <ul class="list-group" v-if="inventory">
      <li
        v-for="item in inventory"
        :key="item.id"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          >Name: <strong>{{ item.name }}</strong> - Quantity:
          <strong>{{ item.quantity }}</strong></span
        >
        <div>
          <button
            class="btn btn-warning btn-sm"
            data-testid="editButton"
            @click="goToEditForm(item.id)"
          >
            Edit
          </button>
          <button
            class="btn btn-danger btn-sm ms-2"
            data-testid="removeButton"
            @click="showDeleteDialog(item.id)"
          >
            Remove
          </button>
        </div>
      </li>
    </ul>

    <!-- Confirmation Dialog Modal -->
    <ConfirmationDialog
      v-model:isVisible="isDialog"
      :message="'Are you sure you want to delete?'"
      @confirm="removeItem"
      @cancel="onClose"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useInventory from "@/composables/useInventory";
import ConfirmationDialog from "@/components/ConfirmationDialog/ConfirmationDialog.vue";

export default defineComponent({
  name: "InventoryList",
  components: {
    ConfirmationDialog,
  },
  setup() {
    const { inventory, fetchInventory, handleRemoveItem } = useInventory();
    const router = useRouter();
    const isDialog = ref<boolean>(false);
    const errorMessage = ref<string | null>(null);
    const itemIdToRemove = ref<string | null>(null);

    onMounted(async () => {
      try {
        await fetchInventory();
      } catch {
        errorMessage.value =
          "Unable to load inventory. Please try again later.";
      }
    });

    const goToAddForm = () => {
      router.push("/form");
    };

    const goToEditForm = (id: string) => {
      router.push(`/form/${id}`);
    };

    const showDeleteDialog = (id: string) => {
      itemIdToRemove.value = id;
      isDialog.value = true; // Show modal
    };

    const removeItem = async () => {
      if (itemIdToRemove.value !== null) {
        await handleRemoveItem(itemIdToRemove.value);
      }
    };

    const onClose = () => {
      isDialog.value = false; // Close modal on cancel
    };

    return {
      inventory,
      goToAddForm,
      goToEditForm,
      isDialog,
      errorMessage,
      removeItem,
      showDeleteDialog,
      onClose,
    };
  },
});
</script>
