import { useMemo, useState } from "react";
import { restaurantExample, type AttributeRow } from "../data/restaurantData";

import "./global.css";

export default function Restaurant() {
  // basic info (view → edit)
  const [name, setName] = useState(
    restaurantExample.information.restaurant_name ?? ""
  );
  const [location, setLocation] = useState(
    restaurantExample.information.location ?? ""
  );
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftLocation, setDraftLocation] = useState(location);

  const data = restaurantExample.venue_physical_characteristics;

  const handleEdit = () => {
    setDraftName(name);
    setDraftLocation(location);
    setIsEditing(true);
  };
  const handleCancel = () => setIsEditing(false);
  const handleSave = () => {
    setName(draftName.trim());
    setLocation(draftLocation.trim());
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
      ] as [string, AttributeRow[]][],
    [data]
  );

  return (
    <div>
      <h2>Restaurant</h2>

      {/* Basic info */}
      {!isEditing ? (
        <>
          <div className="row">
            <div className="label">Name</div>
            <div className="value">
              {name || <em className="muted">(not set)</em>}
            </div>
          </div>

          <div className="row">
            <div className="label">Location</div>
            <div className="value">
              {location || <em className="muted">(not set)</em>}
            </div>
          </div>

          <button id="edit-button" className="btn" onClick={handleEdit}>
            Edit
          </button>
        </>
      ) : (
        <>
          {/* simple stacked form (no special classes needed unless you add them) */}
          <div style={{ display: "grid", gap: 10, maxWidth: 480 }}>
            <label>
              <div className="label" style={{ marginBottom: 4 }}>
                Name
              </div>
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
              />
            </label>

            <label>
              <div className="label" style={{ marginBottom: 4 }}>
                Location
              </div>
              <input
                type="text"
                value={draftLocation}
                onChange={(e) => setDraftLocation(e.target.value)}
              />
            </label>
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
                <th>Attribute</th>
                <th>Range</th>
                <th>Unit</th>
                <th>Effect</th>
                <th>Upgradeable</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.attribute}>
                  <td>{r.attribute}</td>
                  <td>
                    {Array.isArray(r.range) ? r.range.join(", ") : r.range}
                  </td>
                  <td>{r.unit}</td>
                  <td>{r.effect}</td>
                  <td>
                    <UpgradeTag value={r.upgradeable} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      ))}
    </div>
  );

  function UpgradeTag({ value }: { value: AttributeRow["upgradeable"] }) {
    const cls = tagClass(value);
    return <span className={`tag ${cls}`}>{tagLabel(value)}</span>;
  }

  function tagLabel(v: AttributeRow["upgradeable"]) {
    switch (v) {
      case true:
        return "Yes";
      case false:
        return "No";
      case "sometimes":
        return "Sometimes";
      case "partial":
        return "Partial";
      case "usually_no":
        return "Usually No";
      default:
        return String(v);
    }
  }

  function tagClass(v: AttributeRow["upgradeable"]) {
    switch (v) {
      case true:
        return "tag--yes";
      case false:
        return "tag--no";
      case "sometimes":
        return "tag--sometimes";
      case "partial":
        return "tag--partial";
      case "usually_no":
        return "tag--usually-no";
      default:
        return "";
    }
  }
}
