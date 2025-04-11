<template>
  <div>
    <h1>{{ isEditMode ? "Edit Item" : "Add Item" }}</h1>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="name">Item Name:</label>
        <input id="name" v-model="itemName" placeholder="Enter item name" />
        <div v-if="errors.itemName" class="error-message">
          {{ errors.itemName }}
        </div>
      </div>
      <div>
        <label for="quantity">Quantity:</label>
        <input
          id="quantity"
          type="number"
          v-model.number="itemQuantity"
          :disabled="!isEditMode"
        />
        <div v-if="errors.itemQuantity" class="error-message">
          {{ errors.itemQuantity }}
        </div>
      </div>
      <button type="submit">{{ isEditMode ? "Update" : "Add" }}</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { validationSchema } from "../../services/validationSchema"; // Import your schema
import useInventory from "../../composables/useInventory";

export default defineComponent({
  name: "InventoryForm",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { handleAddItem, handleEditItem, fetchOneInventory } = useInventory();

    const isEditMode = ref(false);
    const itemId = ref<string | null>(null);
    const itemName = ref("");
    const itemQuantity = ref(0);
    const errors = ref({
      itemName: "",
      itemQuantity: "",
    });
    onMounted(async () => {
      if (route.params.id) {
        isEditMode.value = true;
        itemId.value = route.params.id;
        const item = await fetchOneInventory(itemId.value);
        if (item) {
          itemName.value = item.name;
          itemQuantity.value = item.quantity;
        } else {
          console.error("Item not found!");
        }
      }
    });
    const validateForm = async () => {
      try {
        errors.value = { itemName: "", itemQuantity: "" };
        await validationSchema.validate(
          { itemName: itemName.value, itemQuantity: itemQuantity.value },
          { abortEarly: false }
        );
        return true;
      } catch (err) {
        err.inner.forEach((error) => {
          errors.value[error.path as keyof typeof errors.value] = error.message;
        });
        return false;
      }
    };
    const handleSubmit = async () => {
      const isValid = await validateForm();
      if (!isValid) return;
      if (isEditMode.value && itemId.value !== null) {
        await handleEditItem(
          Number(itemId.value),
          itemQuantity.value,
          itemName.value
        );
      } else {
        await handleAddItem(itemName.value);
      }
      router.push("/");
    };

    return {
      itemName,
      itemQuantity,
      isEditMode,
      handleSubmit,
      errors,
    };
  },
});
</script>
