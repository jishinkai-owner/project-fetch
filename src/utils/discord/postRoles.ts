import { RoleType } from "@/types/user";
import axios from "axios";
export async function postRoles(
  id?: string | null,
  grade?: number | null,
  role?: RoleType | null
) {
  try {
    const res = await axios.put("/api/roles", {
      id: id,
      grade: grade,
      role: role,
    });
    if (res.status === 201) {
      console.log("Roles posted successfully");
      return { success: true };
    }
    return { success: false, error: "Failed to post roles" };
  } catch (error) {
    console.error("Error posting roles: ", error);
    throw error;
  }
}
