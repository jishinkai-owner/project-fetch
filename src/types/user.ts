export type RoleType = {
  isAdmin?: boolean;
  isCL?: boolean;
  isSL?: boolean;
  isMeal?: boolean;
  isEquipment?: boolean;
  isWeather?: boolean;
  isLoading?: boolean;
  isError?: boolean;
};

export type RolesState = {
  isAdmin: boolean;
  isCL: boolean;
  isSL: boolean;
  isWeather: boolean;
  isMeal: boolean;
  isEquipment: boolean;
};
