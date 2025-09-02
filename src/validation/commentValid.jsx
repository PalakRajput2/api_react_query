import React from 'react'
import * as yup from "yup";
export const schema = yup.object({
  name: yup
  .string()
  .required("Name is required")
  .min(3,"the name must be of greater than 3 characters"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  body: yup.string().required("Comment body is required"),
});
