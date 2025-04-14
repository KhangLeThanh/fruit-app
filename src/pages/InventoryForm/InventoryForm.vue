<template>
  <div class="container">
    <div v-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>
    <button
      @click="goBack"
      class="btn btn-secondary mb-3"
      data-testId="backButton"
    >
      Back
    </button>

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
          :class="{ 'is-invalid': errors.name }"
          placeholder="Enter item name"
        />
        <div v-if="errors.name" class="invalid-feedback text-start">
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
          :class="{ 'is-invalid': errors.quantity }"
          :disabled="!isEditMode"
        />
        <div v-if="errors.quantity" class="invalid-feedback text-start">
          {{ errors.quantity }}
        </div>
      </div>
      <div v-if="submitError" class="alert alert-danger text-center">
        {{ submitError }}
      </div>
      <button
        type="submit"
        class="btn btn-primary w-100"
        :disabled="isUnchanged"
        data-testId="submitButton"
      >
        {{ isEditMode ? "Update" : "Add" }}
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { validationSchema } from "@/services/validationSchema";
import { InventoryFormErrors } from "@/services/types";
import { ValidationError } from "yup";
import useInventory from "@/composables/useInventory";

export default defineComponent({
  name: "InventoryForm",
  props: {
    id: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const router = useRouter();
    const { handleAddItem, handleEditItem, fetchOneInventory } = useInventory();
    const errorMessage = ref<string | null>(null);

    const isEditMode = ref<boolean>(false);
    const inventoryId = ref<string>("");
    const name = ref<string>("");
    const quantity = ref<number>(0);
    const originalName = ref<string>("");
    const originalQuantity = ref<number>(0);
    const errors = ref<InventoryFormErrors>({
      name: "",
      quantity: "",
    });
    const submitError = ref<string>("");
    onMounted(async () => {
      const routeId = props.id;

      if (routeId && typeof routeId === "string") {
        isEditMode.value = true;
        inventoryId.value = routeId;
        try {
          const item = await fetchOneInventory(routeId);

          if (item) {
            name.value = item.name;
            quantity.value = item.quantity;
            originalName.value = item.name;
            originalQuantity.value = item.quantity;
          } else {
            console.error("Item not found!");
          }
        } catch {
          errorMessage.value =
            "Unable to load an inventory data. Please try again later.";
        }
      }
    });

    const goBack = () => {
      router.push("/");
    };

    // Checking whether value of name and quantity changes in edit mode or not
    const isUnchanged = computed(() => {
      if (!isEditMode.value) return false; // Always enable in Add mode
      return (
        name.value === originalName.value &&
        quantity.value === originalQuantity.value
      );
    });

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
      try {
        if (isEditMode.value) {
          await handleEditItem(inventoryId.value, quantity.value, name.value);
        } else {
          await handleAddItem(name.value);
        }
        router.push("/");
      } catch {
        submitError.value = "Unabled to save data";
      }
    };

    return {
      name,
      quantity,
      isEditMode,
      handleSubmit,
      errors,
      goBack,
      isUnchanged,
      submitError,
      errorMessage,
    };
  },
});
</script>
