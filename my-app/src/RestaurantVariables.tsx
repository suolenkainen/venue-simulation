import { useMemo, useState } from "react";
import {
  restaurantVariables,
  type AttributeRow,
} from "./data/restaurantVariables";

import "./global.css";

export default function Restaurant() {
  const [isEditing, setIsEditing] = useState(false);

  const data = restaurantVariables.venue_physical_characteristics;

  const handleCancel = () => setIsEditing(false);
  const handleSave = () => {
    setIsEditing(false);
  };

  const categories = useMemo(
    () =>
      [
        ["Space & Layout", data.space_and_layout],
        ["Show Infrastructure", data.show_infrastructure],
        ["Comfort & Guest Experience", data.comfort_and_guest_experience],
        ["Safety & Compliance", data.safety_and_compliance],
        ["Support & Backstage", data.support_and_backstage],
        ["External & Access", data.external_and_access],
        ["Additional Variables", data.additional_variables],
      ] as [string, AttributeRow[]][],
    [data]
  );

  return (
    <div>
      <h2>Restaurant Variables</h2>

      {/* Basic info */}
      {!isEditing ? (
        <>
          <div className="row"></div>
        </>
      ) : (
        <>
          {/* simple stacked form (no special classes needed unless you add them) */}
          <div style={{ display: "grid", gap: 10, maxWidth: 480 }}>
            <label></label>

            <label></label>
          </div>

          <div className="flex gap-2" style={{ marginTop: 12 }}>
            <button
              id="save-button"
              className="btn btn--save"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              id="cancel-button"
              className="btn btn--cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {/* Characteristics */}
      {categories.map(([title, rows]) => (
        <details key={title} open>
          <summary>{title}</summary>
          <table className="table" aria-label={`${title} attributes`}>
            <thead>
              <tr>
                <th>Variable</th>
                <th>Value</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr>
                  <td>{r.variable}</td>
                  <td>{r.value}</td>
                  <td>{r.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      ))}
    </div>
  );
}
