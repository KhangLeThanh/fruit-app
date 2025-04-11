<template>
  <div>
    <h1>Inventory</h1>
    <ul>
      <li v-for="item in inventory" :key="item.id">
        <span>{{ item.name }} - {{ item.quantity }}</span>
        <button @click="goToEditForm(item.id)">Edit</button>
        <button @click="handleRemoveItem(item.id)">Remove</button>
      </li>
    </ul>
    <button @click="goToAddForm">Add New</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import useInventory from "../../composables/useInventory";

export default defineComponent({
  name: "InventoryList",
  setup() {
    const { inventory, fetchInventory, handleRemoveItem } = useInventory();
    const router = useRouter();

    const goToAddForm = () => {
      router.push("/form");
    };

    const goToEditForm = (id: number) => {
      router.push(`/form/${id}`);
    };

    onMounted(() => {
      fetchInventory();
    });

    return {
      inventory,
      handleRemoveItem,
      goToAddForm,
      goToEditForm,
    };
  },
});
</script>
