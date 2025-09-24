export type Upgradeable = boolean | "usually_no" | "sometimes" | "partial";
export type Value = string | number | string[];
export type ValueType = string | string[];
import restaurantInfoJson from "./restaurantInfo.json";

export type BasicInfo = {
  restaurant_name: string;
  location: string;
  variable_type: string;
};

export type AttributeRow = {
  attribute: string;
  value: Value;
  value_type: ValueType;
  unit: string;
  range: string | string[];
  effect: string;
  upgradeable: Upgradeable;
};

export type RestaurantPhysical = {
  space_and_layout: AttributeRow[];
  show_infrastructure: AttributeRow[];
  comfort_and_guest_experience: AttributeRow[];
  safety_and_compliance: AttributeRow[];
  support_and_backstage: AttributeRow[];
  external_and_access: AttributeRow[];
};

export type RestaurantInfo = {
  information: BasicInfo;
  venue_physical_characteristics: RestaurantPhysical;
};

export const restaurantInfo: RestaurantInfo =
  restaurantInfoJson as RestaurantInfo;
