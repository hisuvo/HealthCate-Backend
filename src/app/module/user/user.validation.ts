import z, { uuid } from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const createDoctorZodSchema = z.object({
  password: z
    .string("password is required")
    .min(6, "Password minimum length is 6")
    .max(10, "Password maximum length is 10"),

  doctor: z.object({
    name: z
      .string("Name is required")
      .min(5, "Name must be at least 5 characters")
      .max(30, "Name must be at most 30 characters"),

    email: z.email("Invalied email address"),

    contactNumber: z
      .string("Contact Number is required")
      .min(11, "Contact number must be at least 11 characters")
      .max(14, "Contact number must be at most 14 characters"),

    address: z
      .string("Address is required")
      .min(10, "Address must be at least 10 characters")
      .max(100, "Address must be at most 100 characters")
      .optional(),

    registrationNumber: z.string("Registation number is required"),

    experience: z
      .number("Experience must be a integeare")
      .nonnegative("Experence can not be a negative"),

    gender: z.enum([Gender.MALE, Gender.FMALE], "Gender either MALE or FMALE"),

    appointmentFee: z
      .number("Appointment Fee is required")
      .nonnegative("Appointment fee can not be a negative"),

    qualification: z
      .string()
      .trim()
      .min(2, { message: "Qualification is required" })
      .max(100, { message: "Qualification too long" }),

    currentWorkingPlace: z
      .string()
      .trim()
      .min(2, { message: "Current working place is required" })
      .max(150, { message: "Working place too long" }),

    designation: z
      .string()
      .trim()
      .min(2, { message: "Designation is required" })
      .max(100, { message: "Designation too long" }),
  }),
  specialties: z
    .array(uuid(), "Specialties must be a array of string")
    .min(1, "At least one specialty is required"),
});
