import { useMemo, useState, type JSX } from "react";
import type { AttributeRow, RestaurantInfo } from "./data/restaurantVariables";
import { restaurantVariables } from "./data/restaurantVariables";

// Single clean Clientel component
export default function Clientel(): JSX.Element {
  const data = restaurantVariables as unknown as RestaurantInfo;

  const clientele =
    data.venue_physical_characteristics?.clientele_variables ?? [];

  const getVar = (name: string, fallback: number) => {
    const v = clientele.find((r) => r.variable === name);
    return v && typeof v.value === "number" ? (v.value as number) : fallback;
  };

  const [weekdayModifier, setWeekdayModifier] = useState<number>(() =>
    getVar("weekdayModifier", 0.5)
  );
  const [avgDrinkPrice, setAvgDrinkPrice] = useState<number>(() =>
    getVar("avgDrinkPrice", 6.5)
  );
  const [turnoverPerHour, setTurnoverPerHour] = useState<number>(() =>
    getVar("turnoverPerHour", 0.2)
  );
  const [openHours, setOpenHours] = useState<number>(() =>
    getVar("openHours", 6)
  );

  const spaceLayout: AttributeRow[] =
    data.venue_physical_characteristics?.space_and_layout ?? [];
  const comfort: AttributeRow[] = useMemo(
    () =>
      data.venue_physical_characteristics?.comfort_and_guest_experience ?? [],
    [data.venue_physical_characteristics?.comfort_and_guest_experience]
  );

  const [maxCapacity, setMaxCapacity] = useState<number>(() => {
    const m = spaceLayout.find((r) => r.variable === "maxCapacity");
    return m && typeof m.value === "number" ? (m.value as number) : 50;
  });

  const [guestComfort, setGuestComfort] = useState<number>(() => {
    const g = comfort.find((r) => r.variable === "guestComfort");
    return g && typeof g.value === "number" ? (g.value as number) : 1.0;
  });

  const [guestSatisfaction, setGuestSatisfaction] = useState<number>(() => {
    const g = comfort.find((r) => r.variable === "guestSatisfaction");
    return g && typeof g.value === "number" ? (g.value as number) : 1.0;
  });

  const [venueAttractiveness, setVenueAttractiveness] = useState<number>(() =>
    getVar("venueAttractiveness", 1.0)
  );

  const weekdayClients = useMemo(() => {
    const theoreticalWeekend = Math.round(
      maxCapacity * venueAttractiveness * guestSatisfaction
    );
    return Math.round(theoreticalWeekend * weekdayModifier * guestComfort);
  }, [
    maxCapacity,
    venueAttractiveness,
    guestSatisfaction,
    weekdayModifier,
    guestComfort,
  ]);

  const drinkSalesPerCustomer = useMemo(() => {
    const found = comfort.find((r) => r.variable === "drinkSalesPerGuest");
    if (found && typeof found.value === "number") return found.value as number;
    return +(avgDrinkPrice * (1.2 * guestComfort)).toFixed(2);
  }, [avgDrinkPrice, guestComfort, comfort]);

  const hourlyTurnover = turnoverPerHour;

  const estimatedHourlyDrinkRevenue = useMemo(() => {
    const present = weekdayClients;
    return +(present * drinkSalesPerCustomer * hourlyTurnover).toFixed(2);
  }, [weekdayClients, drinkSalesPerCustomer, hourlyTurnover]);

  // Compute total new customers over the open period using integer turnover per hour
  // turnoverPerHour is a fraction (e.g. 0.2 = 20% of customers replaced per hour)
  const totalNewCustomers = useMemo(() => {
    const present = weekdayClients;
    let remaining = present; // current present customers
    let totalNew = 0;
    for (let h = 0; h < Math.max(0, Math.floor(openHours)); h++) {
      // number of customers that leave this hour (integer)
      const leaving = Math.floor(remaining * hourlyTurnover);
      // new customers fill up to cap; we count only new arrivals (integer)
      const arriving = Math.min(
        leaving,
        Math.max(0, Math.floor(maxCapacity - (remaining - leaving)))
      );
      totalNew += arriving;
      // update remaining for next hour
      remaining = remaining - leaving + arriving;
      // enforce cap
      if (remaining > maxCapacity) remaining = maxCapacity;
    }
    return totalNew;
  }, [weekdayClients, hourlyTurnover, openHours, maxCapacity]);

  return (
    <div>
      <h2>Clientele</h2>
      <p>Adjust clientele-related inputs and see derived estimates.</p>

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr" }}>
        <label>
          Max Capacity
          <input
            type="number"
            value={maxCapacity}
            onChange={(e) => setMaxCapacity(Number(e.target.value))}
          />
        </label>

        <label>
          Restaurant open hours
          <input
            type="number"
            step="1"
            min="0"
            value={openHours}
            onChange={(e) => setOpenHours(Number(e.target.value))}
          />
        </label>

        <label>
          Guest Comfort
          <input
            type="number"
            step="0.1"
            value={guestComfort}
            onChange={(e) => setGuestComfort(Number(e.target.value))}
          />
        </label>

        <label>
          Guest Satisfaction
          <input
            type="number"
            step="0.1"
            value={guestSatisfaction}
            onChange={(e) => setGuestSatisfaction(Number(e.target.value))}
          />
        </label>

        <label>
          Venue Attractiveness
          <input
            type="number"
            step="0.1"
            value={venueAttractiveness}
            onChange={(e) => setVenueAttractiveness(Number(e.target.value))}
          />
        </label>

        <label>
          Weekday Modifier
          <input
            type="number"
            step="0.01"
            value={weekdayModifier}
            onChange={(e) => setWeekdayModifier(Number(e.target.value))}
          />
        </label>

        <label>
          Avg Drink Price
          <input
            type="number"
            step="0.1"
            value={avgDrinkPrice}
            onChange={(e) => setAvgDrinkPrice(Number(e.target.value))}
          />
        </label>

        <label>
          Turnover % / hour
          <input
            type="number"
            step="0.01"
            value={turnoverPerHour}
            onChange={(e) => setTurnoverPerHour(Number(e.target.value))}
          />
        </label>
      </div>

      <h3>Derived estimates</h3>
      <ul>
        <li>Weekday clients (estimate): {weekdayClients}</li>
        <li>Drink sales per customer (estimate): {drinkSalesPerCustomer}</li>
        <li>Estimated hourly drink revenue: {estimatedHourlyDrinkRevenue}</li>
        <li>Total new customers during open hours: {totalNewCustomers}</li>
        <li>
          Total unique customers served (no decimals):{" "}
          {weekdayClients + totalNewCustomers}
        </li>
        <li>
          Total income (delivered estimate): $
          {
            +(
              (weekdayClients + totalNewCustomers) *
              drinkSalesPerCustomer
            ).toFixed(2)
          }
        </li>
        <li>Turnover per hour (fraction): {hourlyTurnover}</li>
      </ul>
    </div>
  );
}
