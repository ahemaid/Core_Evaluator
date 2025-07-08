import React, { useEffect, useState } from 'react';

interface ExpertApplicationForm {
  legalAck: boolean;
  date: string;
  workedForFirm: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  function: string;
  companyActivity: string;
  doneAssessment: string;
  years: string;
  certified: string;
  accreditor: string;
  ageGroup: string;
  income: string;
  education: string;
  availableDays: string[];
  motivation: string;
  submittedAt?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export default function AdminExpertApplications() {
  const [applications, setApplications] = useState<ExpertApplicationForm[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('expertApplications');
    if (data) {
      const parsed = JSON.parse(data).map((app: ExpertApplicationForm) => ({
        ...app,
        status: app.status || 'pending',
      }));
      setApplications(parsed);
    }
  }, []);

  const updateStatus = (idx: number, status: 'approved' | 'rejected') => {
    const updated = applications.map((app, i) =>
      i === idx ? { ...app, status } : app
    );
    setApplications(updated);
    localStorage.setItem('expertApplications', JSON.stringify(updated));
  };

  if (applications.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
        <h2 className="text-2xl font-bold mb-4">Expert Evaluator Applications</h2>
        <p>No applications found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Expert Evaluator Applications</h2>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">City</th>
            <th className="p-2 border">Submitted</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
            <th className="p-2 border">Details</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app, idx) => (
            <tr key={idx} className="border-b">
              <td className="p-2 border">{app.name}</td>
              <td className="p-2 border">{app.email}</td>
              <td className="p-2 border">{app.phone}</td>
              <td className="p-2 border">{app.city}</td>
              <td className="p-2 border">{app.submittedAt ? new Date(app.submittedAt).toLocaleString() : ''}</td>
              <td className="p-2 border capitalize">
                {app.status || 'pending'}
              </td>
              <td className="p-2 border">
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded mr-2 disabled:opacity-50"
                  disabled={app.status === 'approved'}
                  onClick={() => updateStatus(idx, 'approved')}
                >
                  Approve
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded disabled:opacity-50"
                  disabled={app.status === 'rejected'}
                  onClick={() => updateStatus(idx, 'rejected')}
                >
                  Reject
                </button>
              </td>
              <td className="p-2 border">
                <details>
                  <summary className="cursor-pointer">View</summary>
                  <div className="mt-2 text-xs text-left">
                    <div><b>Address:</b> {app.address}</div>
                    <div><b>Function:</b> {app.function}</div>
                    {app.companyActivity && <div><b>Company Activity:</b> {app.companyActivity}</div>}
                    <div><b>Worked for Firm:</b> {app.workedForFirm}</div>
                    <div><b>Done Assessment:</b> {app.doneAssessment}</div>
                    {app.years && <div><b>Years:</b> {app.years}</div>}
                    <div><b>Certified:</b> {app.certified}</div>
                    {app.accreditor && <div><b>Accreditor:</b> {app.accreditor}</div>}
                    <div><b>Age Group:</b> {app.ageGroup}</div>
                    <div><b>Income:</b> {app.income}</div>
                    <div><b>Education:</b> {app.education}</div>
                    <div><b>Available Days:</b> {app.availableDays.join(', ')}</div>
                    <div><b>Motivation:</b> {app.motivation}</div>
                    <div><b>Legal Ack:</b> {app.legalAck ? 'Yes' : 'No'}</div>
                    <div><b>Date:</b> {app.date}</div>
                  </div>
                </details>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 