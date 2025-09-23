import { useState } from "react";

export default function Restaurant() {
  // state for data
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  // state for editing mode and temp values
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftAddress, setDraftAddress] = useState(address);

  const handleEdit = () => {
    // initialize draft with current values
    setDraftName(name);
    setDraftAddress(address);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setName(draftName);
    setAddress(draftAddress);
    setIsEditing(false);
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>{name || <em>(Unnamed)</em>}</h2>

      {!isEditing ? (
        <>
          <p>
            <strong>Name:</strong> {name || <em>(not set)</em>}
          </p>
          <p>
            <strong>Address:</strong> {address || <em>(not set)</em>}
          </p>
          <button
            id="edit-button"
            style={{ padding: "4px 10px", borderRadius: 6 }}
            onClick={handleEdit}
          >
            Edit
          </button>
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              maxWidth: 400,
            }}
          >
            <label>
              Name:
              <input
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                style={{ width: "100%", marginTop: 4 }}
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                value={draftAddress}
                onChange={(e) => setDraftAddress(e.target.value)}
                style={{ width: "100%", marginTop: 4 }}
              />
            </label>
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button
              id="save-button"
              style={{ padding: "4px 10px", borderRadius: 6 }}
              onClick={handleSave}
            >
              Save
            </button>
            <button
              id="cancel-button"
              style={{ padding: "4px 10px", borderRadius: 6 }}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
