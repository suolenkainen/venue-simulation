export type Upgradeable = boolean | "usually_no" | "sometimes" | "partial";
export type Value = string | number | string[];

export type AttributeRow = {
  attribute: string;
  value: Value;
  unit:
    | string
    | "closing_time"
    | "enum"
    | "qualitative"
    | "count"
    | "spots"
    | "kW"
    | "dB"
    | "m"
    | "m²"
    | "0–1";
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
  information: { restaurant_name: string; location: string }; // keeping the original key as given
  venue_physical_characteristics: RestaurantPhysical;
};

// The  JSON transformed into a typed constant:
export const restaurantInfo: RestaurantInfo = {
  information: {
    restaurant_name: "",
    location: "",
  },
  venue_physical_characteristics: {
    space_and_layout: [
      {
        attribute: "Floor Area",
        value: "1.0",
        unit: "m²",
        range: "80–600",
        effect:
          "Sets max capacity (≈ area ÷ 1.2 m² per person) and scales rent & cleaning cost.",
        upgradeable: false,
      },
      {
        attribute: "Ceiling Height",
        value: "1.0",
        unit: "m",
        range: "2.5–7",
        effect:
          "High = better acoustics, larger acts possible. Very low → guest discomfort penalty.",
        upgradeable: "usually_no",
      },
      {
        attribute: "Floor Plan Complexity",
        value: "1.0",
        unit: "0–1",
        range: "0.2–0.9",
        effect:
          "Higher complexity → more bottlenecks, reduces drink sales by up to 15%.",
        upgradeable: false,
      },
      {
        attribute: "Number of Rooms",
        value: "1.0",
        unit: "count",
        range: "1–5",
        effect: "More rooms = VIP zones possible but higher maintenance cost.",
        upgradeable: "sometimes",
      },
    ],
    show_infrastructure: [
      {
        attribute: "Stage Size",
        value: "1.0",
        unit: "m²",
        range: "10–80",
        effect: "Affects band fee negotiations and max band tier you can book.",
        upgradeable: true,
      },
      {
        attribute: "Lighting Quality",
        value: "1.0",
        unit: "0–1",
        range: "0.1–1.0",
        effect: "Adds to show quality score, boosts ticket demand up to +10%.",
        upgradeable: true,
      },
      {
        attribute: "Sound Isolation",
        value: "1.0",
        unit: "dB",
        range: "20–65",
        effect: "Reduces risk of noise fines and curfew enforcement.",
        upgradeable: true,
      },
      {
        attribute: "Power Capacity",
        value: "1.0",
        unit: "kW",
        range: "10–50",
        effect: "Must exceed band equipment demand. Low = forced smaller acts.",
        upgradeable: true,
      },
    ],
    comfort_and_guest_experience: [
      {
        attribute: "Air Conditioning / Ventilation",
        value: "1.0",
        unit: "0–1",
        range: "0.2–1.0",
        effect:
          "High = guests stay longer (+drink sales), low = -10% attendance on hot nights.",
        upgradeable: true,
      },
      {
        attribute: "Bar Count",
        value: "1.0",
        unit: "count",
        range: "1–4",
        effect: "More bars = shorter wait, +drink sales per guest.",
        upgradeable: true,
      },
      {
        attribute: "Restroom Count",
        value: "1.0",
        unit: "count",
        range: "1–6",
        effect: "Too low = guest satisfaction ↓, can cause fines.",
        upgradeable: true,
      },
      {
        attribute: "Seating Availability",
        value: "1.0",
        unit: "0–1",
        range: "0–1",
        effect:
          "High seating → older demographics attend more, low seating good for standing shows.",
        upgradeable: "partial",
      },
      {
        attribute: "Aesthetics / Theme",
        value: "1.0",
        unit: "0–1",
        range: "0.3–1.0",
        effect: "Adds base attractiveness score (demand multiplier).",
        upgradeable: true,
      },
    ],
    safety_and_compliance: [
      {
        attribute: "Fire Exits",
        value: "1.0",
        unit: "count",
        range: "1–4",
        effect: "Fewer exits = cap on max capacity and risk of fines/shutdown.",
        upgradeable: true,
      },
      {
        attribute: "Fire Suppression Rating",
        value: "1.0",
        unit: "enum",
        range: ["Poor", "OK", "Good"],
        effect: "Influences insurance cost & compliance events.",
        upgradeable: true,
      },
      {
        attribute: "Zoning/Curfew",
        value: "1.0",
        unit: "closing_time",
        range: "22:00–04:00",
        effect: "Hard cap on open hours, affects total sales potential.",
        upgradeable: false,
      },
    ],
    support_and_backstage: [
      {
        attribute: "Backstage Space",
        value: "1.0",
        unit: "qualitative",
        range: ["None", "Small", "Medium", "Large"],
        effect:
          "Improves artist happiness → cheaper booking fees, bigger acts possible.",
        upgradeable: true,
      },
      {
        attribute: "Storage / Kitchen Space",
        value: "1.0",
        unit: "qualitative",
        range: ["None", "Partial", "Full"],
        effect: "Allows extra revenue (food, merch), reduces logistics costs.",
        upgradeable: true,
      },
    ],
    external_and_access: [
      {
        attribute: "Parking Capacity",
        value: "1.0",
        unit: "spots",
        range: "0–80",
        effect: "Slightly increases attendance for driving demographics.",
        upgradeable: "sometimes",
      },
      {
        attribute: "Outdoor Space",
        value: "1.0",
        unit: "qualitative",
        range: ["None", "Small Patio", "Large Patio"],
        effect: "Adds warm-weather capacity, day events possible.",
        upgradeable: true,
      },
      {
        attribute: "Visibility / Foot Traffic",
        value: "1.0",
        unit: "qualitative",
        range: ["Low", "Medium", "High"],
        effect: "Raises walk-in guests (free marketing).",
        upgradeable: false,
      },
    ],
  },
};
