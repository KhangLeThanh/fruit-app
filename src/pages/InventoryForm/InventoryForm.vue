<template>
  <div class="container">
    <button @click="goBack" class="btn btn-secondary mb-3">Back</button>

    <h1 class="text-center mb-4">
      {{ isEditMode ? "Edit Item" : "Add Item" }}
    </h1>
    <form
      @submit.prevent="handleSubmit"
      class="mx-auto"
      style="max-width: 500px"
    >
      <div class="mb-3">
        <label for="name" class="form-label text-start d-block"
          >Inventory Name:</label
        >
        <input
          id="name"
          v-model="name"
          type="text"
          class="form-control"
          placeholder="Enter item name"
        />
        <div v-if="errors.name" class="error-message text-danger mt-1">
          {{ errors.name }}
        </div>
      </div>

      <div class="mb-3">
        <label for="quantity" class="form-label text-start d-block"
          >Quantity:</label
        >
        <input
          id="quantity"
          type="number"
          v-model.number="quantity"
          class="form-control"
          :disabled="!isEditMode"
        />
        <div v-if="errors.quantity" class="error-message text-danger mt-1">
          {{ errors.quantity }}
        </div>
      </div>

      <button type="submit" class="btn btn-primary w-100">
        {{ isEditMode ? "Update" : "Add" }}
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { validationSchema } from "../../services/validationSchema";
import { ValidationError } from "yup";
import useInventory from "../../composables/useInventory";

export default defineComponent({
  name: "InventoryForm",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { handleAddItem, handleEditItem, fetchOneInventory } = useInventory();

    const isEditMode = ref(false);
    const inventoryId = ref<string>("");
    const name = ref("");
    const quantity = ref(0);
    const errors = ref({
      name: "",
      quantity: "",
    });
    onMounted(async () => {
      const routeId = route.params.id;

      if (routeId && typeof routeId === "string") {
        isEditMode.value = true;
        inventoryId.value = routeId;
        const item = await fetchOneInventory(routeId);
        if (item) {
          name.value = item.name;
          quantity.value = item.quantity;
        } else {
          console.error("Item not found!");
        }
      }
    });
    const goBack = () => {
      router.push("/");
    };
    const validateForm = async () => {
      try {
        errors.value = { name: "", quantity: "" };
        await validationSchema.validate(
          { name: name.value, quantity: quantity.value },
          { abortEarly: false }
        );
        return true;
      } catch (err) {
        if (err instanceof ValidationError) {
          err.inner.forEach((error) => {
            errors.value[error.path as keyof typeof errors.value] =
              error.message;
          });
        } else {
          console.error("Unexpected error:", err);
        }
        return false;
      }
    };

    const handleSubmit = async () => {
      const isValid = await validateForm();
      if (!isValid) return;
      if (isEditMode.value && inventoryId.value !== null) {
        await handleEditItem(
          Number(inventoryId.value),
          quantity.value,
          name.value
        );
      } else {
        await handleAddItem(name.value);
      }
      router.push("/");
    };

    return {
      name,
      quantity,
      isEditMode,
      handleSubmit,
      errors,
      goBack,
    };
  },
});
</script>

<style scoped>
/* Optional custom styles for error messages */
.error-message {
  font-size: 0.875rem;
  color: #dc3545;
}
</style>
