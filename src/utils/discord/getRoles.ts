import axios from "axios";

const roleMap = [
  {
    id: "1143235241033609337",
    name: "isAdmin",
  },
  { id: "1091925379540852828", name: "isCL" },
  { id: "1091929637023658024", name: "isSL" },
  { id: "1230081030912872449", name: "isWeather" },
  { id: "1230085573021270036", name: "isMeal" },
  { id: "1230084175843819551", name: "isEquipment" },
  { id: "1091924752219775068", name: 4 },
  { id: "1099984828763492383", name: 3 },
  { id: "1231841360949149716", name: 2 },
];

type RoleMap = {
  [key: string]: boolean;
};

export async function getUserRoles(id: string) {
  try {
    const res = await axios.post(`/api/discord`, { id: id });
    console.log("Discord roles: ", res.data);
    const roles: RoleMap = {};
    roleMap.forEach((role) => {
      roles[role.name] = false;
    });

    console.log("Roles: ", res.data);

    res.data.roles.forEach((roleId: string) => {
      const roleName = roleMap.find((role) => role.id === roleId);
      if (roleName) {
        roles[roleName.name] = true;
      }
    });

    return roles;
  } catch (error) {
    console.error("Error fetching user roles: ", error);
    throw error;
  }
}
