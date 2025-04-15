import { InventoryItem } from "./types";

const API_URL = "/api/inventory";

export const getInventory = async (): Promise<InventoryItem[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch inventory data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }
};

export const addItem = async (name: string): Promise<InventoryItem> => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to add inventory data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding a new inventory:", error);
    throw error;
  }
};

export const getOneInventory = async (id: string): Promise<InventoryItem> => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch an inventory data");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching item with id ${id}:`, error);
    throw error;
  }
};

export const removeItem = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error("Failed to delete an inventory ");
    }
  } catch (error) {
    console.error(`Error deleting item with id ${id}:`, error);
    throw error;
  }
};

export const updateItem = async (
  id: string,
  quantity: number,
  name: string
): Promise<InventoryItem> => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("quantity", quantity.toString());
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to update an inventory data");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating item with id ${id}:`, error);
    throw error;
  }
};
