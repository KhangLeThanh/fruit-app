import { mount } from "@vue/test-utils";
import ConfirmationDialog from "@/components/ConfirmationDialog/ConfirmationDialog.vue"; // adjust the path as needed

describe("ConfirmationDialog.vue", () => {
  it("renders the modal when internalOpen is true", async () => {
    const wrapper = mount(ConfirmationDialog, {
      props: {
        isVisible: true,
        message: "Are you sure you want to delete this item?",
      },
    });

    // Check if modal is rendered
    const modalContent = wrapper.find(".modal-content");
    expect(modalContent.exists()).toBe(true);
    expect(modalContent.text()).toContain(
      "Are you sure you want to delete this item?"
    );
  });

  it("does not render the modal when internalOpen is false", async () => {
    const wrapper = mount(ConfirmationDialog, {
      props: {
        isVisible: false,
        message: "Are you sure you want to delete this item?",
      },
    });

    // Modal should not be visible
    const modalContent = wrapper.find(".modal-content");
    expect(modalContent.exists()).toBe(false);
  });

  it('emits "confirm" event when the delete button is clicked', async () => {
    const wrapper = mount(ConfirmationDialog, {
      props: {
        isVisible: true,
        message: "Are you sure you want to delete this item?",
      },
    });

    await wrapper.find(".btn-danger").trigger("click"); // Trigger the delete button click

    // Expect the "confirm" event to be emitted
    expect(wrapper.emitted("confirm")).toBeTruthy();
  });

  it('emits "cancel" event when the cancel button is clicked', async () => {
    const wrapper = mount(ConfirmationDialog, {
      props: {
        isVisible: true,
        message: "Are you sure you want to delete this item?",
      },
    });

    await wrapper.find(".btn-primary").trigger("click"); // Trigger the cancel button click

    // Expect the "cancel" event to be emitted
    expect(wrapper.emitted("cancel")).toBeTruthy();
  });

  it('emits "update:isVisible" when internalOpen changes', async () => {
    const wrapper = mount(ConfirmationDialog, {
      props: {
        isVisible: true,
        message: "Are you sure you want to delete this item?",
      },
      emit: ["update:isVisible"], // Mock emitting update
    });

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
