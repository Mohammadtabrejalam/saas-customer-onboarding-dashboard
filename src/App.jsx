
import { useEffect, useState } from "react";
import Analytics from "./components/Analytics";
import ActivityHistory from "./components/ActivityHistory";
import {
  onAuthStateChanged,
  signInAnonymously
} from "firebase/auth";

import {
  addDoc,
  collection,
  onSnapshot
} from "firebase/firestore";

import { auth, db } from "./firebase";
import CustomerDetails from "./components/CustomerDetails";
import FollowUp from "./components/FollowUp";
import "./App.css";

function App() {
  // ============================
  // 1. REACT STATES
  // ============================

  const [user, setUser] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [adding, setAdding] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  // ============================
  // 2. FIREBASE AUTHENTICATION
  // ============================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (currentUser) {
          setCustomers([]);
          setLoadingCustomers(true);
          setUser(currentUser);
        } else {
          setCustomers([]);
          setLoadingCustomers(true);
          setUser(null);

          try {
            await signInAnonymously(auth);
          } catch (err) {
            setError(err.message);
          }
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // ============================
  // 3. LOAD CUSTOMERS FROM FIRESTORE
  // ============================

  useEffect(() => {
    if (!user) return;

    const customerCollection = collection(
      db,
      "users",
      user.uid,
      "customers"
    );

    const unsubscribe = onSnapshot(
      customerCollection,
      (snapshot) => {
        const data = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data()
        }));

        setCustomers(data);
        setLoadingCustomers(false);
        setError("");
      },
      (err) => {
        setLoadingCustomers(false);
        setError(err.message);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // ============================
  // 4. ADD NEW CUSTOMER
  // ============================

  async function addCustomer() {
    if (!name.trim() || !user || adding) return;

    setAdding(true);
    setError("");

    try {
      await addDoc(
        collection(db, "users", user.uid, "customers"),
        {
          name: name.trim(),
          status: "Pending",
          progress: 0,
          createdAt: new Date().toISOString()
        }
      );

      setName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  }

  // ============================
  // 5. DASHBOARD STATISTICS
  // ============================

  const totalCustomers = customers.length;

  const completedCustomers = customers.filter(
    (customer) => customer.status === "Completed"
  ).length;

  const pendingCustomers = customers.filter(
    (customer) => customer.status === "Pending"
  ).length;

  const inProgressCustomers = customers.filter(
    (customer) => customer.status === "In Progress"
  ).length;

  // ============================
  // 6. CUSTOMER SEARCH AND FILTER
  // ============================

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = (customer.name || "")
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ============================
  // 7. FOLLOW-UP DATE CALCULATIONS
  // ============================

  const now = new Date();

  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("-");

  const overdueCustomers = customers.filter(
    (customer) =>
      customer.followUpDate &&
      customer.followUpDate < today &&
      customer.followUpStatus !== "Completed" &&
      customer.status !== "Completed"
  );

  const dueTodayCustomers = customers.filter(
    (customer) =>
      customer.followUpDate === today &&
    customer.followUpStatus !== "Completed" &&
      customer.status !== "Completed"
  );

  const upcomingCustomers = customers.filter(
    (customer) =>
      customer.followUpDate &&
      customer.followUpDate > today &&
      customer.followUpStatus !== "Completed" &&
      customer.status !== "Completed"
  );

  // ============================
  // 8. SELECTED CUSTOMER
  // ============================

  const currentCustomer = selectedCustomer
    ? customers.find(
        (customer) => customer.id === selectedCustomer.id
      )
    : null;

  // ============================
  // 9. DASHBOARD INTERFACE
  // ============================

  return (
    <div className="dashboard">

      <h1>Customer Onboarding Dashboard</h1>

      <p>
        Manage customers, track onboarding progress,
        and schedule follow-ups.
      </p>

      {error && (
        <p className="error-message">{error}</p>
      )}
      {/* ANALYTICS AND REPORTS */}
<Analytics customers={customers} />

      {/* DASHBOARD STATISTICS */}

      <div className="stats">

        <div className="stat-card">
          <h2>{totalCustomers}</h2>
          <p>Total Customers</p>
        </div>

        <div className="stat-card">
          <h2>{completedCustomers}</h2>
          <p>Completed Onboarding</p>
        </div>

        <div className="stat-card">
          <h2>{pendingCustomers}</h2>
          <p>Pending Customers</p>
        </div>

        <div className="stat-card">
          <h2>{inProgressCustomers}</h2>
          <p>In Progress</p>
        </div>

        <div className="stat-card">
          <h2>{overdueCustomers.length}</h2>
          <p>Overdue Follow-ups</p>
        </div>

        <div className="stat-card">
          <h2>{dueTodayCustomers.length}</h2>
          <p>Due Today</p>
        </div>

        <div className="stat-card">
          <h2>{upcomingCustomers.length}</h2>
          <p>Upcoming Follow-ups</p>
        </div>

      </div>

      {/* OVERDUE FOLLOW-UP ALERT */}

      {overdueCustomers.length > 0 && (
        <div className="overdue-alert">
          <h3>Overdue Follow-ups</h3>

          {overdueCustomers.map((customer) => (
            <div className="alert-item" key={customer.id}>
              <strong>{customer.name}</strong>

              <span>
                Due: {customer.followUpDate}
              </span>

              <button
                onClick={() => setSelectedCustomer(customer)}
              >
                View Customer
              </button>
            </div>
          ))}
        </div>
      )}

      {/* DUE TODAY ALERT */}

      {dueTodayCustomers.length > 0 && (
        <div className="today-alert">
          <h3>Follow-ups Due Today</h3>

          {dueTodayCustomers.map((customer) => (
            <div className="alert-item" key={customer.id}>
              <strong>{customer.name}</strong>

              <button
                onClick={() => setSelectedCustomer(customer)}
              >
                View Customer
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ADD CUSTOMER FORM */}

      <div className="add-customer">

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter customer name"
        />

        <button
          onClick={addCustomer}
          disabled={!user || adding || !name.trim()}
        >
          {adding ? "Adding..." : "Add Customer"}
        </button>

      </div>

      {/* CUSTOMER LIST */}

      <h2>Customer List</h2>

      {/* SEARCH AND FILTER */}

      <div className="filter-bar">

        <input
          type="text"
          placeholder="Search by customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Customers</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

      </div>

      {/* CUSTOMER RECORDS */}

      {loadingCustomers ? (
        <p role="status">Loading customers...</p>
      ) : filteredCustomers.length === 0 && !error ? (
        <p>No matching customers found.</p>
      ) : null}

      {filteredCustomers.map((customer) => {

        const isOverdue =
          customer.followUpDate &&
          customer.followUpDate < today &&
          customer.followUpStatus !== "Completed" &&
          customer.status !== "Completed";

        return (
          <div className="customer-card" key={customer.id}>

            <strong>{customer.name}</strong>

            <span>{customer.status}</span>

            <span>{customer.progress ?? 0}%</span>

            {isOverdue && (
              <span className="overdue-badge">
                Overdue
              </span>
            )}

            <button
              onClick={() => setSelectedCustomer(customer)}
            >
              View Details
            </button>

          </div>
        );
      })}

      {/* CUSTOMER DETAILS AND FOLLOW-UP */}
      
{/* CUSTOMER DETAILS AND FOLLOW-UP */}

{currentCustomer && (
  <div className="customer-details-section">

    <button
      className="close-button"
      onClick={() => setSelectedCustomer(null)}
    >
      Close Details
    </button>

    <CustomerDetails
      key={currentCustomer.id}
      customer={currentCustomer}
    />

    <FollowUp
      key={`${currentCustomer.id}:${currentCustomer.followUpDate || ""}:${currentCustomer.followUpNote || ""}`}
      customer={currentCustomer}
    />

    <ActivityHistory
      key={currentCustomer.id}
      customer={currentCustomer}
    />

  </div>
)}


    </div>
  );
}

export default App;
