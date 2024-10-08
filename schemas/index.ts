import { UserRole } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  email: z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6)),
})
  .refine((data) => {
    if (!data.newPassword && data.password) {
      return false;
    }

    return true;
  }, {
    message: "New password is required!",
    path: ["newPassword"]
  })
  .refine((data) => {
    if (!data.password && data.newPassword) {
      return false;
    }

    return true;
  }, {
    message: "Password is required!",
    path: ["password"]
  })
export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required"
  }),
})

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required"
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required"
  }),
  password: z.string().min(1, {
    message: "Pasword is required"
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required"
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required"
  }),
  name: z.string().min(1, {
    message: "Name is required"
  })
});

export const CompanySetupSchema = z.object({
  companyName: z.string(),
  companyInviteLink: z.string(),
})

export const ChangeCompanyUserRoleSchema = z.object ({
  newUserRole: z.string()
})

export const ContactSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email({
    message: "Email is required"
  }),
  position: z.string(),
})

export const AuditSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
  sendDate: z.string().min(1, "Send Date is required")
});
