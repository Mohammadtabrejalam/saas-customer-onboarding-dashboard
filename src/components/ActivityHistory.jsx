
import { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, db } from "../firebase";

function ActivityHistory({ customer }) {
  const [note, setNote] = useState("");
  const [outcome, setOutcome] = useState("Contacted");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const activities = [...(customer.activities || [])]
    .sort((a, b) => b.date.localeCompare(a.date));

  async function addActivity() {
    if (!note.trim() || !auth.currentUser || saving) return;

    setSaving(true);
    setError("");

    const activity = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      outcome: outcome,
      note: note.trim()
    };

    try {
      const customerRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "customers",
        customer.id
      );

      await updateDoc(customerRef, {
        activities: arrayUnion(activity)
      });

      setNote("");
      setOutcome("Contacted");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="activity-history">
      <h2>Customer Activity History</h2>

      <h3>Add New Activity</h3>

      <label>
        Contact Outcome
        <select
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
        >
          <option>Contacted</option>
          <option>No Response</option>
          <option>Issue Resolved</option>
          <option>Training Completed</option>
          <option>Follow-up Required</option>
        </select>
      </label>

      <label>
        Activity Notes
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What happened during the interaction?"
        />
      </label>

      <button
        onClick={addActivity}
        disabled={saving || !note.trim()}
      >
        {saving ? "Saving..." : "Save Activity"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Previous Activities</h3>

      {activities.length === 0 && (
        <p>No activities recorded yet.</p>
      )}

      {activities.map((activity) => (
        <div className="activity-card" key={activity.id}>
          <strong>{activity.outcome}</strong>

          <p>{activity.note}</p>

          <small>
            {new Date(activity.date).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}

export default ActivityHistory;
