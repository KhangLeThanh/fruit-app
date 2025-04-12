import * as yup from "yup";

export const validationSchema = yup.object({
  name: yup.string().required("Inventory Name is required"),
  quantity: yup
    .number()
    .min(0, "Quantity can not be a negative number")
    .required("Quantity is required")
    .integer("Quantity must be an integer"),
});
