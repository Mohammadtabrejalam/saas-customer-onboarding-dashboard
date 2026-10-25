
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const defaultTasks = [
  { id: 1, title: "Account Setup", completed: false },
  { id: 2, title: "Software Configuration", completed: false },
  { id: 3, title: "Customer Training", completed: false },
  { id: 4, title: "Account Activation", completed: false }
];

function CustomerDetails({ customer }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const tasks = customer.tasks ?? defaultTasks;

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const progress = Math.round(
    (completedCount / tasks.length) * 100
  );

  async function toggleTask(id) {
    const user = auth.currentUser;
    if (!user || saving) return;

    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    );

    const count = updatedTasks.filter(
      (task) => task.completed
    ).length;

    const newStatus =
      count === 0
        ? "Pending"
        : count === updatedTasks.length
          ? "Completed"
          : "In Progress";

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
        tasks: updatedTasks,
        status: newStatus,
        progress: Math.round(
          (count / updatedTasks.length) * 100
        )
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="details">
      <h2>{customer.name} - Onboarding</h2>
      <h3>Progress: {progress}%</h3>

      <progress value={progress} max="100" />

      {tasks.map((task) => (
        <div className="task" key={task.id}>
          <label>
            <input
              type="checkbox"
              checked={task.completed}
              disabled={saving}
              onChange={() => toggleTask(task.id)}
            />
            {task.title}
          </label>
        </div>
      ))}

      {saving && <p>Saving...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default CustomerDetails;
