import * as yup from "yup";

export const validationSchema = yup.object({
  name: yup.string().required("Inventory Name is required"),
  quantity: yup
    .number()
    .min(0, "Quantity cannot be negative")
    .required("Quantity is required"),
});
