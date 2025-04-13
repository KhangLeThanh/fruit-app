import { createRouter, createWebHistory } from "vue-router";

const InventoryList = () => import("@/pages/InventoryList/InventoryList.vue");
const InventoryForm = () => import("@/pages/InventoryForm/InventoryForm.vue");

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
