<template>
  <div class="container">
    <div v-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>

    <button
      @click="goBack"
      class="btn btn-secondary mb-3"
      data-testid="backButton"
    >
      Back
    </button>

    <h1 class="text-center mb-4">
      {{ isEditMode ? "Edit Item" : "Add Item" }}
    </h1>

    <form @submit.prevent="submitForm" class="mx-auto" style="max-width: 500px">
      <div class="mb-3">
        <label for="name" class="form-label text-start d-block"
          >Inventory Name:</label
        >
        <input
          id="name"
          v-model="nameValue"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': nameError }"
          placeholder="Enter item name"
        />
        <div v-if="nameError" class="invalid-feedback text-start">
          {{ nameError }}
        </div>
      </div>

      <div class="mb-3">
        <label for="quantity" class="form-label text-start d-block"
          >Quantity:</label
        >
        <input
          id="quantity"
          type="number"
          v-model.number="quantityValue"
          class="form-control"
          :class="{ 'is-invalid': quantityError }"
          :disabled="!isEditMode"
        />
        <div v-if="quantityError" class="invalid-feedback text-start">
          {{ quantityError }}
        </div>
      </div>

      <div v-if="submitError" class="alert alert-danger text-center">
        {{ submitError }}
      </div>

      <button
        type="submit"
        class="btn btn-primary w-100"
        :disabled="isUnchanged"
        data-testid="submitButton"
      >
        {{ isEditMode ? "Update" : "Add" }}
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useForm, useField } from "vee-validate";
import { validationSchema } from "@/services/validationSchema";
import { InventoryItem } from "@/services/types";
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
    const submitError = ref<string>("");

    const isEditMode = ref<boolean>(false);
    const inventoryId = ref<string>("");

    // VeeValidate form setup
    const { handleSubmit, setValues, values } = useForm({
      validationSchema,
      initialValues: {
        id: "",
        name: "",
        quantity: 0,
      },
    });

    const { value: nameValue, errorMessage: nameError } =
      useField<string>("name");
    const { value: quantityValue, errorMessage: quantityError } =
      useField<number>("quantity");

    const originalValues = ref<InventoryItem>({
      id: "",
      name: "",
      quantity: 0,
    });

    onMounted(async () => {
      const routeId = props.id;

      if (routeId) {
        isEditMode.value = true;
        inventoryId.value = routeId;

        try {
          const item = await fetchOneInventory(routeId);
          if (item) {
            setValues({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
            });
            originalValues.value = {
              id: item.id,
              name: item.name,
              quantity: item.quantity,
            };
          } else {
            errorMessage.value = "Item not found.";
          }
        } catch {
          errorMessage.value =
            "Unable to load inventory data. Please try again later.";
        }
      }
    });

    const isUnchanged = computed(() => {
      return JSON.stringify(values) === JSON.stringify(originalValues.value);
    });

    const goBack = () => router.push("/");

    const onSubmit = async (formValues: { name: string; quantity: number }) => {
      const trimmedName = formValues.name.trim();

      if (!trimmedName) {
        submitError.value = "Item name cannot be empty.";
        return;
      }
      try {
        if (isEditMode.value) {
          await handleEditItem(
            inventoryId.value,
            formValues.quantity,
            formValues.name
          );
        } else {
          await handleAddItem(formValues.name);
        }
        router.push("/");
      } catch (err) {
        submitError.value = "Unable to save data.";
      }
    };
    const submitForm = handleSubmit(onSubmit);

    return {
      nameValue,
      quantityValue,
      nameError,
      quantityError,
      isEditMode,
      isUnchanged,
      submitError,
      errorMessage,
      submitForm,
      goBack,
    };
  },
});
</script>
