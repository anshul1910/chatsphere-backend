import type { UserDocument } from "../models/user/user.model.js";

// What a user sees about THEMSELVES
export function serializeSelf(user: UserDocument) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
  };
}

// What anyone else is allowed to see
export function serializeUser(user: UserDocument) {
  return {
    id: user.id,
    username: user.username,
    avatar: user.avatar,
  };
}
