
function Analytics({ customers }) {
  const total = customers.length;

  const completed = customers.filter(
    (customer) => customer.status === "Completed"
  ).length;

  const inProgress = customers.filter(
    (customer) => customer.status === "In Progress"
  ).length;

  const pending = customers.filter(
    (customer) => customer.status === "Pending"
  ).length;

  // Calculate completion rate
  const completionRate = total === 0
    ? 0
    : Math.round((completed / total) * 100);

  // Calculate average progress
  const totalProgress = customers.reduce(
    (sum, customer) => sum + (Number(customer.progress) || 0),
    0
  );

  const averageProgress = total === 0
    ? 0
    : Math.round(totalProgress / total);

  const statusData = [
    { label: "Completed", value: completed, color: "#16a34a" },
    { label: "In Progress", value: inProgress, color: "#2563eb" },
    { label: "Pending", value: pending, color: "#f59e0b" }
  ];

  return (
    <section className="analytics">
      <h2>Onboarding Analytics</h2>

      <div className="analytics-stats">
        <div className="analytics-card">
          <h3>{completionRate}%</h3>
          <p>Completion Rate</p>
        </div>

        <div className="analytics-card">
          <h3>{averageProgress}%</h3>
          <p>Average Onboarding Progress</p>
        </div>

        <div className="analytics-card">
          <h3>{total}</h3>
          <p>Total Customers</p>
        </div>
      </div>

      <h3>Customers by Status</h3>

      <div className="analytics-chart">
        {statusData.map((item) => {
          const percentage = total === 0
            ? 0
            : (item.value / total) * 100;

          return (
            <div className="chart-row" key={item.label}>
              <div className="chart-label">
                <strong>{item.label}</strong>
                <span>{item.value} customers</span>
              </div>

              <div className="chart-track">
                <div
                  className="chart-fill"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Analytics;
