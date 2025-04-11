import { mount, VueWrapper } from "@vue/test-utils";
import ConfirmationDialog from "@/components/ConfirmationDialog/ConfirmationDialog.vue"; // adjust the path as needed

describe("ConfirmationDialog.vue", () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = mount(ConfirmationDialog, {
      props: {
        isVisible: true,
        message: "Are you sure you want to delete this item?",
      },
      emit: ["confirm", "cancel"], // You can mock these events too
    });
  });
  it("renders the modal when internalOpen is true", async () => {
    const modalContent = wrapper.find(".modal-content");
    expect(modalContent.exists()).toBe(true);
    expect(modalContent.text()).toContain(
      "Are you sure you want to delete this item?"
    );
  });

  it("does not render the modal when internalOpen is false", async () => {
    await wrapper.setProps({ isVisible: false });
    const modalContent = wrapper.find(".modal-content");
    expect(modalContent.exists()).toBe(false);
  });

  it('emits "confirm" event when the delete button is clicked', async () => {
    await wrapper.find(".btn-danger").trigger("click"); // Trigger the delete button click
    // Expect the "confirm" event to be emitted
    const emittedConfirm = wrapper.emitted("confirm");
    expect(emittedConfirm).toBeTruthy();
    expect(emittedConfirm?.length).toBe(1);
  });

  it('emits "cancel" event when the cancel button is clicked', async () => {
    await wrapper.find(".btn-primary").trigger("click"); // Trigger the cancel button click
    // Expect the "cancel" event to be emitted
    const emittedCancel = wrapper.emitted("cancel");
    expect(emittedCancel).toBeTruthy();
    expect(emittedCancel?.length).toBe(1);
  });

  it('emits "update:isVisible" when internalOpen changes', async () => {
    // Update internalOpen state, simulating closing the modal
    await wrapper.setProps({ isVisible: false });
    // Ensure that the "update:isVisible" event is emitted
    expect(wrapper.emitted("update:isVisible")).toBeTruthy();

    // Type assertion to handle the possibility of undefined
    const emittedValues = wrapper.emitted("update:isVisible");
    expect(emittedValues).toBeTruthy(); // Ensures the array is not undefined
    expect(emittedValues?.[0]).toEqual([false]); // TypeScript knows that emittedValues is defined
  });
});
