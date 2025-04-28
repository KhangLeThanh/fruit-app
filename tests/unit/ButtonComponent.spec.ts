import { mount } from "@vue/test-utils";
import ButtonComponent from "@/components/ButtonComponent/ButtonComponent.vue";

describe("ButtonComponent", () => {
  it("renders with correct  text", () => {
    const wrapper = mount(ButtonComponent, {
      props: {
        text: "Test value",
      },
    });

    const button = wrapper.get("button");
    expect(button.text()).toBe("Test value");
  });
  it("renders with disabled props", () => {
    const wrapper = mount(ButtonComponent, {
      props: {
        text: "hi",
        isDisabled: true,
      },
    });

    const button = wrapper.get("button");
    expect(button.attributes("disabled")).toBeDefined();
  });
  it("renders with class props", () => {
    const wrapper = mount(ButtonComponent, {
      props: {
        text: "hi",
        class: "btn-primary",
      },
    });

    const button = wrapper.get("button");
    expect(button.classes()).toContain("btn-primary");
  });
  it("emits parentClick on click", async () => {
    const wrapper = mount(ButtonComponent, {
      props: {
        text: "Click me",
      },
    });

    await wrapper.get("button").trigger("click");
    expect(wrapper.emitted("parentClick")).toBeTruthy();
  });
});
