import { z } from "zod";

export const addTodoValidation = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be type of string",
    })
    .min(2, {
      message: "Name must be minimum of 2 characters",
    }),
  description: z
    .string({
      required_error: "Description is required",
      invalid_type_error: "Description must be type of string",
    })
    .min(2, {
      message: "Description must be minimum of 2 characters",
    }),
  scheduledDate: z
    .date({
      required_error: "Schedule date is required",
      invalid_type_error: "Schedule date must be a valid date",
      coerce: true,
    })
    .min(new Date(), { message: "Scheduled date should not be at the past" }),
});
