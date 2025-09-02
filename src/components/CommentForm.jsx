import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schema } from "../validation/commentValid";


export default function CommentForm({ onSubmit, initialData }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      body: "",
    },
  });

  //  Populate form when editing
  useEffect(() => {
    if (initialData) {
      setValue("name", initialData.name);
      setValue("email", initialData.email);
      setValue("body", initialData.body);
    }
  }, [initialData, setValue]);

  const submitHandler = (data) => {
    onSubmit(data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-3 bg-white p-4 rounded shadow"
    >
      {/* Name */}
      <div>
        <input
          type="text"
          placeholder="Name"
          {...register("name")}
          className="w-full border p-2 rounded"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full border p-2 rounded"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Body */}
      <div>
        <textarea
          placeholder="Comment"
          rows="4"
          {...register("body")}
          className="w-full border p-2 rounded"
        />
        {errors.body && (
          <p className="text-red-500 text-sm">{errors.body.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {initialData ? "Update" : "Add"} Comment
      </button>
    </form>
  );
}
