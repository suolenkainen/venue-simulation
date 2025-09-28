import restaurantVariablesJson from "./restaurantVariableData.json";

export type AttributeRow = {
  variable: string | string[];
  value: string | number | string[];
  base_value: string | number | string[];
  description: string | string[];
};

export type RestaurantPhysical = {
  space_and_layout: AttributeRow[];
  show_infrastructure: AttributeRow[];
  comfort_and_guest_experience: AttributeRow[];
  safety_and_compliance: AttributeRow[];
  support_and_backstage: AttributeRow[];
  external_and_access: AttributeRow[];
  additional_variables: AttributeRow[];
  clientele_variables: AttributeRow[];
};

export type RestaurantInfo = {
  venue_physical_characteristics: RestaurantPhysical;
};

// The  JSON transformed into a typed constant:
export const restaurantVariables: RestaurantInfo =
  restaurantVariablesJson as RestaurantInfo;
