import * as yup from "yup";

export const validationSchema = yup.object({
  itemName: yup.string().required("Inventory Name is required"),
  itemQuantity: yup
    .number()
    .min(0, "Quantity cannot be negative")
    .required("Quantity is required"),
});
