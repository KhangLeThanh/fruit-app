import { ref } from "vue";
import { InventoryItem } from "../services/types";
import {
  getInventory,
  addItem,
  removeItem,
  updateItemQuantity,
  getOneInventory,
} from "../services/inventoryService";

export default function useInventory() {
  const inventory = ref<InventoryItem[]>([]);
  const newItemName = ref("");

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

    // Add item via API
    const newItem = await addItem(itemName);

    // Fetch updated inventory
    await fetchInventory();

    return newItem;
  };
  const handleRemoveItem = async (id: number) => {
    await removeItem(id);
    await fetchInventory();
  };
  const handleEditItem = async (id: number, quantity: number, name: string) => {
    await updateItemQuantity(id, quantity, name);
    await fetchInventory();
  };
  return {
    inventory,
    newItemName,
    fetchInventory,
    fetchOneInventory,
    handleAddItem,
    handleRemoveItem,
    handleEditItem,
  };
}
