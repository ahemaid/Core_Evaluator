import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, MessageSquare, Video, FileText, Edit, Send, AlertCircle } from 'lucide-react';

interface Appointment {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  serviceType: string;
  notes?: string;
  cancellationReason?: string;
  cancelledBy?: string;
  cancelledAt?: string;
}

interface AppointmentNote {
  _id: string;
  title?: string;
  content: string;
  type: string;
  isVisibleToPatient: boolean;
  attachments: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  createdAt: string;
}

interface Meeting {
  _id: string;
  meetingUrl: string;
  meetingId: string;
  password?: string;
  platform: string;
  status: string;
  scheduledAt: string;
  duration: number;
}

const ProviderAppointmentManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [notes, setNotes] = useState<AppointmentNote[]>([]);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    type: 'consultation',
    isVisibleToPatient: false
  });

  const [rescheduleData, setRescheduleData] = useState({
    newDate: '',
    newTime: '',
    reason: ''
  });

  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/provider-portal/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmAppointment = async (appointmentId: string, message?: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/provider-portal/appointments/${appointmentId}/confirm`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      if (response.ok) {
        await fetchAppointments();
      }
    } catch (error) {
      console.error('Error confirming appointment:', error);
    }
  };

  const rejectAppointment = async (appointmentId: string, reason: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/provider-portal/appointments/${appointmentId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        await fetchAppointments();
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Error rejecting appointment:', error);
    }
  };

  const rescheduleAppointment = async (appointmentId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/provider-portal/appointments/${appointmentId}/reschedule`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rescheduleData)
      });

      if (response.ok) {
        await fetchAppointments();
        setShowRescheduleModal(false);
        setRescheduleData({ newDate: '', newTime: '', reason: '' });
      }
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
    }
  };

  const fetchAppointmentNotes = async (appointmentId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/provider-portal/appointments/${appointmentId}/notes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const createNote = async () => {
    if (!selectedAppointment || !newNote.content.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/provider-portal/appointments/${selectedAppointment._id}/notes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newNote)
      });

      if (response.ok) {
        await fetchAppointmentNotes(selectedAppointment._id);
        setNewNote({ title: '', content: '', type: 'consultation', isVisibleToPatient: false });
      }
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const createMeeting = async (platform: string, duration: number) => {
    if (!selectedAppointment) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/provider-portal/appointments/${selectedAppointment._id}/meeting`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          platform,
          duration,
          title: `Consultation with ${selectedAppointment.userId.name}`
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMeeting(data.data);
        setShowMeetingModal(false);
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Appointment Management</h2>
          <p className="text-gray-600">Manage your appointments and consultations</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Total: {appointments.length} | 
            Pending: {appointments.filter(a => a.status === 'pending').length} |
            Confirmed: {appointments.filter(a => a.status === 'confirmed').length}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.userId.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.userId.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.date}</div>
                    <div className="text-sm text-gray-500">{appointment.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.serviceType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {getStatusIcon(appointment.status)}
                      <span className="ml-1 capitalize">{appointment.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {appointment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => confirmAppointment(appointment._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700 flex items-center gap-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Confirm
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setRejectionReason('');
                            }}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-700 flex items-center gap-1"
                          >
                            <XCircle className="h-3 w-3" />
                            Reject
                          </button>
                        </>
                      )}
                      
                      {['pending', 'confirmed'].includes(appointment.status) && (
                        <button
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowRescheduleModal(true);
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-700 flex items-center gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Reschedule
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          fetchAppointmentNotes(appointment._id);
                          setShowNoteModal(true);
                        }}
                        className="bg-gray-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-gray-700 flex items-center gap-1"
                      >
                        <FileText className="h-3 w-3" />
                        Notes
                      </button>

                      {appointment.status === 'confirmed' && (
                        <button
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowMeetingModal(true);
                          }}
                          className="bg-purple-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-purple-700 flex items-center gap-1"
                        >
                          <Video className="h-3 w-3" />
                          Meeting
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejection Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Appointment</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this appointment with {selectedAppointment.userId.name}.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => rejectAppointment(selectedAppointment._id, rejectionReason)}
                disabled={!rejectionReason.trim()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Reject Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reschedule Appointment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Date</label>
                <input
                  type="date"
                  value={rescheduleData.newDate}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, newDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Time</label>
                <input
                  type="time"
                  value={rescheduleData.newTime}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, newTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason (Optional)</label>
                <textarea
                  value={rescheduleData.reason}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, reason: e.target.value })}
                  placeholder="Reason for rescheduling..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => rescheduleAppointment(selectedAppointment._id)}
                disabled={!rescheduleData.newDate || !rescheduleData.newTime}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNoteModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Notes for {selectedAppointment.userId.name}
              </h3>
              <button
                onClick={() => setShowNoteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Existing Notes */}
            <div className="space-y-4 mb-6">
              {notes.map((note) => (
                <div key={note._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {note.title || 'Consultation Note'}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {note.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {note.isVisibleToPatient && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Visible to Patient
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{note.content}</p>
                  {note.attachments.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Attachments:</p>
                      {note.attachments.map((attachment, index) => (
                        <a
                          key={index}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          {attachment.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Note */}
            <div className="border-t pt-4">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Add New Note</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title (Optional)</label>
                  <input
                    type="text"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your notes here..."
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={newNote.type}
                      onChange={(e) => setNewNote({ ...newNote, type: e.target.value })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="consultation">Consultation</option>
                      <option value="follow_up">Follow-up</option>
                      <option value="prescription">Prescription</option>
                      <option value="diagnosis">Diagnosis</option>
                      <option value="treatment">Treatment</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="visibleToPatient"
                      checked={newNote.isVisibleToPatient}
                      onChange={(e) => setNewNote({ ...newNote, isVisibleToPatient: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="visibleToPatient" className="text-sm text-gray-700">
                      Visible to Patient
                    </label>
                  </div>
                </div>
                <button
                  onClick={createNote}
                  disabled={!newNote.content.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Modal */}
      {showMeetingModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Meeting</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="zoom">Zoom</option>
                  <option value="teams">Microsoft Teams</option>
                  <option value="google_meet">Google Meet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowMeetingModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => createMeeting('zoom', 30)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Create Meeting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Link Display */}
      {meeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Created</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meeting URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={meeting.meetingUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(meeting.meetingUrl)}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Copy
                  </button>
                </div>
              </div>
              {meeting.password && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={meeting.password}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(meeting.password!)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setMeeting(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
              <a
                href={meeting.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Join Meeting
              </a>
            </div>
          </div>
        </div>
      )}

      {appointments.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have any appointments yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProviderAppointmentManagement;
