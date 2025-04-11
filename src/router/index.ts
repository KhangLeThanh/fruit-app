import { createRouter, createWebHistory } from "vue-router";
import InventoryList from "../pages/InventoryList/InventoryList.vue";
import InventoryForm from "../pages/InventoryForm/InventoryForm.vue";

const routes = [
  { path: "/", name: "InventoryList", component: InventoryList },
  { path: "/form", name: "AddItem", component: InventoryForm },
  {
    path: "/form/:id",
    name: "EditItem",
    component: InventoryForm,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
