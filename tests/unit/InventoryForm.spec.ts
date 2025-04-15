import { mount, VueWrapper } from "@vue/test-utils";
import InventoryForm from "@/pages/InventoryForm/InventoryForm.vue";
import { createRouter, createMemoryHistory } from "vue-router";
import { nextTick } from "vue";
import flushPromises from "flush-promises";
import { ref } from "vue";

type FormValues = {
  name: string;
  quantity: number;
};

// Mocks for composables
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

// Mock data to simulate form state
let mockNameValue = "";
let mockQuantityValue = 0;

// Ensure mockErrorMessage is a ref with the proper type
const mockErrorMessage = ref<string>("");
const mockErrorQuantityMessage = ref<string>("");

// Properly mock vee-validate with validation logic
jest.mock("vee-validate", () => ({
  useForm: jest.fn().mockImplementation(() => {
    return {
      handleSubmit:
        (submitHandler: (values: FormValues) => Promise<void>) =>
        async (e: Event) => {
          e.preventDefault();
          if (mockNameValue.trim() === "") {
            mockErrorMessage.value = "Name is required";
            return;
          }
          if (mockQuantityValue < 0) {
            mockErrorQuantityMessage.value =
              "Quantity can not be a negative number";
            return;
          }
          mockErrorMessage.value = "";
          await submitHandler({
            name: mockNameValue,
            quantity: mockQuantityValue,
          });
        },
      setValues: jest.fn((newValues: FormValues) => {
        mockNameValue = newValues.name;
        mockQuantityValue = newValues.quantity;
      }),
      values: { name: mockNameValue, quantity: mockQuantityValue },
    };
  }),
  useField: jest.fn().mockImplementation((field: string) => {
    return {
      value: field === "name" ? mockNameValue : mockQuantityValue,
      errorMessage:
        field === "name" ? mockErrorMessage : mockErrorQuantityMessage,
    };
  }),
}));

// Router setup
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
    jest.clearAllMocks();
    mockNameValue = "";
    mockQuantityValue = 0;
    mockErrorMessage.value = "";

    router.push("/form");
    await router.isReady();
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
    mockNameValue = "Apple";
    mockQuantityValue = 0;

    await wrapper.find("form").trigger("submit.prevent");
    await nextTick();
    expect(handleAddItem).toHaveBeenCalledWith("Apple");
  });

  it("displays validation errors if form is invalid", async () => {
    mockNameValue = "";
    mockErrorMessage.value = "Name is required";

    await wrapper.find("form").trigger("submit.prevent");
    await nextTick();
    expect(wrapper.text()).toContain("Name is required");
    expect(handleAddItem).not.toHaveBeenCalled();
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
    await flushPromises(); // Wait for fetchOneInventory and all async logic to finish
    await nextTick();

    expect(wrapper.text()).toContain("Edit Item");

    // Ensure that the fetchOneInventory function is called with the correct ID from the prop
    expect(fetchOneInventoryMock).toHaveBeenCalledWith("1");

    // Testing invalid quantity
    mockQuantityValue = -2;
    mockErrorQuantityMessage.value = "Quantity can not be a negative number";
    await wrapper.find("form").trigger("submit.prevent");
    await nextTick();
    expect(wrapper.text()).toContain("Quantity can not be a negative number");
    expect(handleEditItem).not.toHaveBeenCalled();

    // Testing updating data
    mockQuantityValue = 9;
    mockNameValue = "Apple";
    await wrapper.find("form").trigger("submit.prevent");
    await nextTick();
    expect(handleEditItem).toHaveBeenCalledWith("1", 9, "Apple");
  });

  it("navigates to home page when 'Back' button is clicked", async () => {
    const routerPushSpy = jest.spyOn(router, "push");
    const backButton = wrapper.find('[data-testid="backButton"]');
    await backButton.trigger("click");

    expect(routerPushSpy).toHaveBeenCalledWith("/");
  });
});
