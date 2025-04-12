import { mount, VueWrapper } from "@vue/test-utils";
import InventoryForm from "@/pages/InventoryForm/InventoryForm.vue";
import { createRouter, createMemoryHistory } from "vue-router";
import { nextTick } from "vue";
import flushPromises from "flush-promises"; // <-- Import here

// Mock composable
const handleAddItem = jest.fn();
const handleEditItem = jest.fn();
const fetchOneInventoryMock = jest.fn();

jest.mock("@/composables/useInventory", () => ({
  __esModule: true,
  default: () => ({
    handleAddItem,
    handleEditItem,
    fetchOneInventory: fetchOneInventoryMock,
  }),
}));

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: "/", component: { template: "<div>Home</div>" } },
    { path: "/form", component: InventoryForm },
    { path: "/form/:id", component: InventoryForm },
  ],
});

describe("InventoryForm.vue", () => {
  let wrapper: VueWrapper;

  beforeEach(async () => {
    jest.clearAllMocks(); // Clear previous mock calls

    router.push("/form");
    await router.isReady(); // Wait for router to be ready
    wrapper = mount(InventoryForm, {
      global: {
        plugins: [router],
      },
    });
  });

  it("renders 'Add Item' text when not in edit mode", () => {
    expect(wrapper.text()).toContain("Add Item");
  });

  it("submits the form and calls handleAddItem", async () => {
    await wrapper.find("#name").setValue("Apple");
    await wrapper.find("form").trigger("submit.prevent");

    await nextTick();
    expect(handleAddItem).toHaveBeenCalledWith("Apple");
  });

  it("renders 'Edit Item' text and fetches data in edit form", async () => {
    // Mock the API response for fetching inventory
    fetchOneInventoryMock.mockResolvedValueOnce({
      name: "Orange",
      quantity: 10,
    });

    // Simulate the mount of the InventoryForm component with the 'id' prop set to '1'
    const wrapper = mount(InventoryForm, {
      global: {
        plugins: [router],
      },
      props: {
        id: "1", // Pass the 'id' prop for edit mode
      },
    });

    // Wait for the next DOM update after the component has mounted
    await flushPromises(); // <- Wait for fetchOneInventory and all async logic to finish
    await nextTick();

    expect(wrapper.text()).toContain("Edit Item");

    // Ensure that the fetchOneInventory function is called with the correct ID from the prop
    expect(fetchOneInventoryMock).toHaveBeenCalledWith("1");

    // Check if the name and quantity fields are populated with the mock data
    const nameInput = wrapper.find("#name").element as HTMLInputElement;
    const quantityInput = wrapper.find("#quantity").element as HTMLInputElement;

    expect(nameInput.value).toBe("Orange");
    expect(quantityInput.value).toBe("10");

    // Simulate the user updating the negative number  (changing it to -2)
    await wrapper.find("#quantity").setValue(-2); // invalid quantity
    await wrapper.find("form").trigger("submit.prevent");
    await nextTick();
    expect(wrapper.text()).toContain("Quantity can not be a negative number");
    expect(handleEditItem).not.toHaveBeenCalled();

    // Simulate the user updating the quantity (changing it to 9)
    await wrapper.find("#quantity").setValue(9);
    await wrapper.find("form").trigger("submit.prevent");
    await nextTick();
    expect(handleEditItem).toHaveBeenCalledWith("1", 9, "Orange");
  });

  it("displays validation errors if form is invalid", async () => {
    await wrapper.find("#name").setValue(""); // invalid name
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    expect(wrapper.text()).toContain("Name is required");
    expect(handleAddItem).not.toHaveBeenCalled();
  });
  it("navigates to home page when  'Back' button is clicked", async () => {
    const routerPushSpy = jest.spyOn(router, "push");
    const backButton = wrapper.find('[data-testid="backButton"]');
    await backButton.trigger("click");
    expect(routerPushSpy).toHaveBeenCalledWith("/");
  });
});
