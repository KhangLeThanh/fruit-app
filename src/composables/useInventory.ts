import { ref } from "vue";
import { InventoryItem } from "@/services/types";
import {
  getInventory,
  addItem,
  removeItem,
  updateItem,
  getOneInventory,
} from "@/services/inventoryService";

export default function useInventory() {
  const inventory = ref<InventoryItem[]>([]);

  const fetchInventory = async () => {
    inventory.value = await getInventory();
  };
  const fetchOneInventory = async (id: string) => {
    const item = await getOneInventory(id);
    if (item) {
      return item;
    }
    return null;
  };
  const handleAddItem = async (itemName: string) => {
    if (!itemName.trim()) return;
    const newItem = await addItem(itemName);
    return newItem;
  };
  const handleRemoveItem = async (id: string) => {
    await removeItem(id);
    await fetchInventory();
  };
  const handleEditItem = async (id: string, quantity: number, name: string) => {
    await updateItem(id, quantity, name);
  };
  return {
    inventory,
    fetchInventory,
    fetchOneInventory,
    handleAddItem,
    handleRemoveItem,
    handleEditItem,
  };
}
