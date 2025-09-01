import React from "react";
import SidebarLayout from "../../components/admin/adminsidebar";

const Home = () => {
  return (
    <SidebarLayout>
       <div style={{ padding: "20px", background: "#f4f6f9", color: "#333", minHeight: "100vh" }}>
      <style>{`
        body {
          margin: 0;
          font-family: Arial, sans-serif;
        }
        h1 {
          margin-bottom: 5px;
        }
        p.subtitle {
          color: #666;
          margin-bottom: 20px;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .card {
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          text-align: center;
        }
        .card h2 {
          margin: 0;
          font-size: 1.2rem;
          color: #555;
        }
        .card p {
          margin: 10px 0 0;
          font-size: 1.8rem;
          font-weight: bold;
          color: #222;
        }
        .grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }
        .box {
          background: #fff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .box h3 {
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 1.1rem;
          color: #444;
        }
        ul.activity {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        ul.activity li {
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        ul.activity li:last-child {
          border-bottom: none;
        }
        .actions button {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border: none;
          border-radius: 8px;
          background: #f0f0f0;
          cursor: pointer;
          transition: background 0.3s;
        }
        .actions button:hover {
          background: #ddd;
        }
      `}</style>

      <h1>Admin Dashboard</h1>
      <p className="subtitle">Welcome back! Here’s what’s happening today.</p>

      {/* Stats Section */}
      <div className="stats">
        <div className="card">
          <h2>Total Users</h2>
          <p>1,245</p>
        </div>
        <div className="card">
          <h2>Providers</h2>
          <p>312</p>
        </div>
        <div className="card">
          <h2>Active Jobs</h2>
          <p>78</p>
        </div>
        <div className="card">
          <h2>Revenue</h2>
          <p>₹52,300</p>
        </div>
      </div>

      {/* Activity & Actions */}
      <div className="grid">
        {/* Recent Activity */}
        <div className="box">
          <h3>Recent Activity</h3>
          <ul className="activity">
            <li><strong>John Doe</strong> booked a plumber – <small>2h ago</small></li>
            <li><strong>Alice</strong> registered as provider – <small>5h ago</small></li>
            <li><strong>Rahul</strong> completed job #1021 – <small>8h ago</small></li>
            <li><strong>Admin</strong> verified electrician profile – <small>1d ago</small></li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="box">
          <h3>Quick Actions</h3>
          <div className="actions">
            <button>Approve Pending Providers</button>
            <button>View Job Requests</button>
            <button>Manage Payments</button>
            <button>Configure Services</button>
          </div>
        </div>
      </div>
    </div>
    </SidebarLayout>
  );
};

export default Home;
