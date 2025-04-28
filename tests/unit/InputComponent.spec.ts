import { mount } from "@vue/test-utils";
import InputComponent from "@/components/InputComponent/InputComponent.vue";

describe("InputComponent", () => {
  it("renders with correct value and type", () => {
    const wrapper = mount(InputComponent, {
      props: {
        modelValue: "Test value",
        type: "text",
      },
    });

    const input = wrapper.get("input");
    expect(input.element.value).toBe("Test value");
    expect(input.attributes("type")).toBe("text");
  });
  it("emits update:modelValue on input", async () => {
    const wrapper = mount(InputComponent, {
      props: {
        modelValue: "",
      },
    });
    const input = wrapper.get("input");
    input.setValue("test");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["test"]);
  });
  it("adds is-invalid class when errorInput is true", () => {
    const wrapper = mount(InputComponent, {
      props: {
        modelValue: "",
        errorInput: true,
      },
    });

    const input = wrapper.get("input");
    expect(input.classes()).toContain("is-invalid");
  });
  it("adds isDisabled is true", () => {
    const wrapper = mount(InputComponent, {
      props: {
        modelValue: "test",
        isDisabled: true,
      },
    });
    const input = wrapper.get("input");
    expect(input.attributes("disabled")).toBeDefined();
  });
});
