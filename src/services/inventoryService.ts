import { InventoryItem } from "./types";

const API_URL = "/api/inventory";

export const getInventory = async (): Promise<InventoryItem[]> => {
  const response = await fetch(API_URL);
  return response.json();
};

export const addItem = async (name: string): Promise<InventoryItem> => {
  const formData = new FormData();
  formData.append("name", name);
  const response = await fetch(API_URL, {
    method: "POST",
    body: formData,
  });

  return response.json();
};

export const getOneInventory = async (id: string): Promise<InventoryItem> => {
  const response = await fetch(`${API_URL}/${id}`);
  return response.json();
};

export const removeItem = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};

export const updateItemQuantity = async (
  id: number,
  quantity: number,
  name: string
): Promise<InventoryItem> => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("quantity", quantity.toString());
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    body: formData,
  });
  return response.json();
};
