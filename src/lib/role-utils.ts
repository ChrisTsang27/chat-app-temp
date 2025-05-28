import { Role } from "@/types/index"; // If you don’t have a type, see below

export function isAdmin(role: Role) {
  return role === "admin";
}

export function isEditor(role: Role) {
  return role === "admin" || role === "editor";
}

export function isRegularMember(role: Role) {
  return role === "member";
}