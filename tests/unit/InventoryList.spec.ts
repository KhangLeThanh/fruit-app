import { mount, VueWrapper } from "@vue/test-utils";
import InventoryList from "@/pages/InventoryList/InventoryList.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog/ConfirmationDialog.vue";
import { createRouter, createMemoryHistory } from "vue-router";
import { nextTick } from "vue";

// Mocking useInventory composable
jest.mock("@/composables/useInventory", () => ({
  __esModule: true,
  default: () => ({
    inventory: [
      { id: "1", name: "Orange", quantity: 10 },
      { id: "2", name: "Lemon", quantity: 20 },
    ],
    fetchInventory: jest.fn(),
    handleRemoveItem: jest.fn(),
  }),
}));

// Mocking Vue Router
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: "/form", component: { template: "<div>Add Item</div>" } },
    { path: "/form/:id", component: { template: "<div>Edit Item</div>" } },
  ],
});
describe("InventoryList.vue", () => {
  let wrapper: VueWrapper;
  beforeEach(async () => {
    router.push("/form");
    await router.isReady();
    wrapper = mount(InventoryList, {
      global: {
        plugins: [router],
      },
    });
  });
  it("renders inventory items correctly", async () => {
    await nextTick(); // Ensure the component has re-rendered after fetching inventory
    const itemElements = wrapper.findAll(".list-group-item");
    expect(itemElements).toHaveLength(2); // mocking 2 inventory items
    expect(itemElements[0].text()).toContain("Orange");
    expect(itemElements[1].text()).toContain("Lemon");
  });
  it("navigates to the add form when 'Add New' button is clicked", async () => {
    const routerPushSpy = jest.spyOn(router, "push");
    const addButton = wrapper.find(".btn-primary");
    await addButton.trigger("click");
    expect(routerPushSpy).toHaveBeenCalledWith("/form");
  });
  it("navigates to the edit form when first 'Edit' button is clicked", async () => {
    const routerPushSpy = jest.spyOn(router, "push");
    const editButton = wrapper.findAll(".btn-warning")[0];
    await editButton.trigger("click");
    expect(routerPushSpy).toHaveBeenCalledWith("/form/1");
  });
  it("shows ConfirmationDialog when first 'Remove' button is clicked", async () => {
    const removeButton = wrapper.findAll(".btn-danger")[0];
    await removeButton.trigger("click");
    expect(wrapper.findComponent(ConfirmationDialog).isVisible()).toBe(true);
  });
});
