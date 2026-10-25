
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

function FollowUp({ customer }) {
  const [date, setDate] = useState(customer.followUpDate || "");
  const [note, setNote] = useState(customer.followUpNote || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Keep form synchronized with the selected customer
  useEffect(() => {
    setDate(customer.followUpDate || "");
    setNote(customer.followUpNote || "");
  }, [customer.id, customer.followUpDate, customer.followUpNote]);

  // SAVE OR RESCHEDULE FOLLOW-UP
  async function saveFollowUp() {
    const user = auth.currentUser;

    if (!user || saving) return;

    setSaving(true);
    setError("");

    try {
      const customerRef = doc(
        db,
        "users",
        user.uid,
        "customers",
        customer.id
      );

      const dateChanged = date !== (customer.followUpDate || "");
      const updates = {
        followUpDate: date,
        followUpNote: note
      };

      // Reopen only when rescheduling, not when editing notes.
      if (dateChanged) {
        updates.followUpStatus = date ? "Pending" : "Not Scheduled";
        updates.followUpCompletedAt = null;
      }

      await updateDoc(customerRef, updates);

      alert("Follow-up saved successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // MARK FOLLOW-UP AS COMPLETED
  async function completeFollowUp() {
    const user = auth.currentUser;

    if (
      !user ||
      saving ||
      !customer.followUpDate ||
      customer.followUpStatus === "Completed"
    ) return;

    setSaving(true);
    setError("");

    try {
      const customerRef = doc(
        db,
        "users",
        user.uid,
        "customers",
        customer.id
      );

      await updateDoc(customerRef, {
        followUpStatus: "Completed",
        followUpCompletedAt: new Date().toISOString()
      });

      alert("Follow-up marked as completed!");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="follow-up">
      <h3>Customer Follow-up</h3>

      <p>
        Status:{" "}
        <strong>
          {customer.followUpStatus ||
            (customer.followUpDate ? "Pending" : "Not Scheduled")}
        </strong>
      </p>

      <label>
        Follow-up Date
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      <label>
        Follow-up Notes
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter follow-up details..."
        />
      </label>

      <div className="follow-up-actions">
        <button
          onClick={saveFollowUp}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Follow-up"}
        </button>

        <button
          onClick={completeFollowUp}
          disabled={
            saving ||
            !customer.followUpDate ||
            customer.followUpStatus === "Completed"
          }
        >
          {customer.followUpStatus === "Completed"
            ? "Follow-up Completed"
            : "Mark Follow-up Completed"}
        </button>
      </div>

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}
    </div>
  );
}

export default FollowUp;
