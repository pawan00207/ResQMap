import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const res = await axios.get("http://localhost:5000/api/reports");
    setReports(res.data);
  };

  const handleApprove = async (id) => {
    await axios.put(`http://localhost:5000/api/reports/${id}/approve`);
    fetchReports();
  };

  const handleReject = async (id) => {
    await axios.put(`http://localhost:5000/api/reports/${id}/reject`);
    fetchReports();
  };

  return (
    <div>
      <h2>Admin Moderation Panel</h2>

      {reports.map((report) => (
        <div key={report._id}>
          <h4>{report.title}</h4>
          <p>{report.description}</p>
          <p>Status: {report.status}</p>

          <button onClick={() => handleApprove(report._id)}>Approve</button>
          <button onClick={() => handleReject(report._id)}>Reject</button>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
