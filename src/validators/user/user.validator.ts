import { z } from "zod";

export const searchUsersQuerySchema = z.object({
  q: z.string().trim().min(2).max(50),
  limit: z.coerce.number().int().min(1).max(20).default(10),
});

export const userIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user id"),
});

export const updateProfileSchema = z
  .object({
    username: z.string().trim().min(3).max(30).optional(),
    avatar: z
      .union([z.literal(""), z.url({ protocol: /^https?$/ })])
      .optional(),
  })
  .refine((data) => data.username !== undefined || data.avatar !== undefined, {
    message: "Provide at least one field to update",
  });

export type SearchUsersQuery = z.infer<typeof searchUsersQuerySchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
