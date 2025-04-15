import { mount, VueWrapper } from "@vue/test-utils";
import { ref } from "vue";
import InventoryList from "@/pages/InventoryList/InventoryList.vue";
import ConfirmationDialog from "@/components/ConfirmationDialog/ConfirmationDialog.vue";
import { createRouter, createMemoryHistory } from "vue-router";
import { nextTick } from "vue";

// Mocking useInventory composable
const mockFetchInventory = jest.fn();
const mockHandleRemoveItem = jest.fn();

// Default inventory mock
const mockInventory = ref([
  { id: "1", name: "Orange", quantity: 10 },
  { id: "2", name: "Lemon", quantity: 20 },
]);
jest.mock("@/composables/useInventory", () => ({
  __esModule: true,
  default: () => ({
    inventory: mockInventory,
    fetchInventory: mockFetchInventory,
    handleRemoveItem: mockHandleRemoveItem,
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
    jest.clearAllMocks(); // Clear previous mock calls

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
  it("navigates to the edit form when first 'Edit' button is clicked", async () => {
    const routerPushSpy = jest.spyOn(router, "push");
    const editButton = wrapper.findAll('[data-testid="editButton"]')[0];
    await editButton.trigger("click");
    expect(routerPushSpy).toHaveBeenCalledWith("/form/1");
  });
  it("shows ConfirmationDialog when first 'Remove' button is clicked", async () => {
    const removeButton = wrapper.findAll('[data-testid="removeButton"]')[0];
    await removeButton.trigger("click");
    expect(wrapper.findComponent(ConfirmationDialog).isVisible()).toBe(true);
  });
  it("renders empty inventory items ", async () => {
    mockInventory.value = [];
    wrapper = mount(InventoryList, {
      global: { plugins: [router] },
    });
    await nextTick();
    expect(wrapper.text()).toContain("No Inventory Found");
  });
  it("navigates to the add form when 'Add New' button is clicked", async () => {
    const routerPushSpy = jest.spyOn(router, "push");
    const addButton = wrapper.find('[data-testid="addButton"]');
    await addButton.trigger("click");
    expect(routerPushSpy).toHaveBeenCalledWith("/form");
  });
});
