<template>
  <div class="container">
    <!-- Inventory Header Section -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1 class="mb-0">Inventory</h1>
      <button class="btn btn-primary" @click="goToAddForm">Add New</button>
    </div>

    <!-- Inventory List -->
    <ul class="list-group">
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
          <button class="btn btn-warning btn-sm" @click="goToEditForm(item.id)">
            Edit
          </button>
          <button
            class="btn btn-danger btn-sm ms-2"
            @click="showDeleteDialog(item.id)"
          >
            Remove
          </button>
        </div>
      </li>
    </ul>

    <!-- Confirmation Dialog Modal -->
    <ConfirmationDialog
      :isVisible="isDialog"
      :message="'Are you sure you want to delete?'"
      @confirm="removeItem"
      @cancel="onClose"
      @update:isVisible="isDialog = $event"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import useInventory from "../../composables/useInventory";
import ConfirmationDialog from "../../components/ConfirmationDialog/ConfirmationDialog.vue"; // Import your ConfirmationDialog

export default defineComponent({
  name: "InventoryList",
  components: {
    ConfirmationDialog,
  },
  setup() {
    const { inventory, fetchInventory, handleRemoveItem } = useInventory();
    const router = useRouter();
    const isDialog = ref(false); // Controls visibility of the modal
    const itemIdToRemove = ref<number | null>(null);

    onMounted(() => {
      fetchInventory();
    });

    const goToAddForm = () => {
      router.push("/form");
    };

    const goToEditForm = (id: number) => {
      router.push(`/form/${id}`);
    };

    const showDeleteDialog = (id: number) => {
      itemIdToRemove.value = id;
      isDialog.value = true; // Show modal
    };

    const removeItem = async () => {
      if (itemIdToRemove.value !== null) {
        await handleRemoveItem(itemIdToRemove.value);
        isDialog.value = false; // Close modal after removing item
      }
    };

    const onClose = () => {
      isDialog.value = false; // Close modal on cancel
    };

    return {
      inventory,
      handleRemoveItem,
      goToAddForm,
      goToEditForm,
      isDialog,
      removeItem,
      showDeleteDialog,
      onClose,
    };
  },
});
</script>

<style scoped>
/* Optional styles for specific customizations */
</style>
