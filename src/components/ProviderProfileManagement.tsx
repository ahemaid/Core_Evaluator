import React, { useState, useEffect } from 'react';
import { Save, Calendar, Clock, MapPin, GraduationCap, Camera, Plus, Trash2, Edit, Check, X } from 'lucide-react';
import { toast } from 'react-toastify';

interface ConsultationType {
  type: 'video_call' | 'chat' | 'in_person' | 'phone';
  price: number;
  duration: number;
  description: string;
  isActive: boolean;
}

interface AvailabilitySlot {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  consultationTypes: string[];
  maxBookings: number;
  isActive: boolean;
}

interface ProviderProfile {
  _id: string;
  name: string;
  specialty: string;
  subSpecialty: string;
  qualifications: Array<{
    degree: string;
    institution: string;
    year: number;
    certificate: string;
  }>;
  experience: number;
  bio: string;
  clinicName: string;
  clinicAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  consultationTypes: ConsultationType[];
  availabilitySlots: AvailabilitySlot[];
  profilePhoto: string;
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  socialLinks: {
    website: string;
    linkedin: string;
    twitter: string;
    facebook: string;
  };
}

const ProviderProfileManagement: React.FC = () => {
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [editingField, setEditingField] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    subSpecialty: '',
    experience: 0,
    bio: '',
    clinicName: '',
    clinicAddress: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    profilePhoto: '',
    website: '',
    linkedin: '',
    twitter: '',
    facebook: ''
  });

  const [consultationTypes, setConsultationTypes] = useState<ConsultationType[]>([
    { type: 'video_call', price: 100, duration: 30, description: 'Video consultation', isActive: true },
    { type: 'in_person', price: 150, duration: 45, description: 'In-person consultation', isActive: true }
  ]);

  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [photoUploading, setPhotoUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/provider-portal/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.data);
        setFormData({
          name: data.data.name || '',
          specialty: data.data.specialty || '',
          subSpecialty: data.data.subSpecialty || '',
          experience: data.data.experience || 0,
          bio: data.data.bio || '',
          clinicName: data.data.clinicName || '',
          clinicAddress: {
            street: data.data.clinicAddress?.street || '',
            city: data.data.clinicAddress?.city || '',
            state: data.data.clinicAddress?.state || '',
            country: data.data.clinicAddress?.country || '',
            zipCode: data.data.clinicAddress?.zipCode || ''
          },
          profilePhoto: data.data.profilePhoto || '',
          website: data.data.socialLinks?.website || '',
          linkedin: data.data.socialLinks?.linkedin || '',
          twitter: data.data.socialLinks?.twitter || '',
          facebook: data.data.socialLinks?.facebook || ''
        });
        setConsultationTypes(data.data.consultationTypes || []);
        setAvailabilitySlots(data.data.availabilitySlots || []);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/provider-portal/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          consultationTypes,
          socialLinks: {
            website: formData.website,
            linkedin: formData.linkedin,
            twitter: formData.twitter,
            facebook: formData.facebook
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.data);
        setEditingField(null);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const saveAvailability = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/provider-portal/availability', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          availabilitySlots
        })
      });

      if (response.ok) {
        setEditingField(null);
      }
    } catch (error) {
      console.error('Error saving availability:', error);
    } finally {
      setSaving(false);
    }
  };

  const addConsultationType = () => {
    setConsultationTypes([...consultationTypes, {
      type: 'video_call',
      price: 0,
      duration: 30,
      description: '',
      isActive: true
    }]);
  };

  const updateConsultationType = (index: number, field: keyof ConsultationType, value: any) => {
    const updated = [...consultationTypes];
    updated[index] = { ...updated[index], [field]: value };
    setConsultationTypes(updated);
  };

  const removeConsultationType = (index: number) => {
    setConsultationTypes(consultationTypes.filter((_, i) => i !== index));
  };

  const addAvailabilitySlot = () => {
    setAvailabilitySlots([...availabilitySlots, {
      dayOfWeek: 'monday',
      startTime: '09:00',
      endTime: '17:00',
      consultationTypes: ['video_call', 'in_person'],
      maxBookings: 1,
      isActive: true
    }]);
  };

  const updateAvailabilitySlot = (index: number, field: keyof AvailabilitySlot, value: any) => {
    const updated = [...availabilitySlots];
    updated[index] = { ...updated[index], [field]: value };
    setAvailabilitySlots(updated);
  };

  const removeAvailabilitySlot = (index: number) => {
    setAvailabilitySlots(availabilitySlots.filter((_, i) => i !== index));
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPG, PNG, or WebP image.');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size too large. Please upload a file smaller than 5MB.');
      return;
    }

    setPhotoUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('providerId', profile?._id || 'temp');
      
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please log in to upload photos.');
        return;
      }

      console.log('Uploading photo to:', 'http://localhost:3001/upload-provider-photo');
      console.log('File details:', { name: file.name, size: file.size, type: file.type });
      
      const response = await fetch('http://localhost:3001/upload-provider-photo', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      console.log('Photo upload response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        console.error('Photo upload error:', errorData);
        throw new Error(errorData.error || errorData.message || 'Upload failed');
      }
      
      const data = await response.json();
      console.log('Photo upload success:', data);
      
      // Update the form data with the new photo URL
      const photoUrl = `http://localhost:3001${data.fileUrl}`;
      setFormData(prev => ({ ...prev, profilePhoto: photoUrl }));
      
      toast.success('Photo uploaded successfully!');
    } catch (error) {
      console.error('Photo upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload photo';
      toast.error(`Failed to upload photo: ${errorMessage}`);
    } finally {
      setPhotoUploading(false);
    }
  };

  const daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const consultationTypeOptions = [
    { value: 'video_call', label: 'Video Call' },
    { value: 'chat', label: 'Chat' },
    { value: 'in_person', label: 'In Person' },
    { value: 'phone', label: 'Phone' }
  ];

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
          <h2 className="text-2xl font-bold text-gray-900">Profile & Availability Management</h2>
          <p className="text-gray-600">Manage your professional profile and availability settings</p>
        </div>
        <button
          onClick={saveProfile}
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <nav className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'basic' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Basic Information
            </button>
            <button
              onClick={() => setActiveTab('consultation')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'consultation' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Consultation Types
            </button>
            <button
              onClick={() => setActiveTab('availability')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'availability' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Availability
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'location' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Location & Contact
            </button>
          </div>
        </nav>

        <div className="p-6">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  {formData.profilePhoto ? (
                    <img
                      src={formData.profilePhoto}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <Camera className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <label className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="h-4 w-4" />
                    {photoUploading ? 'Uploading...' : 'Upload Photo'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={photoUploading}
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-1">JPG, PNG, WebP up to 5MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sub-specialty</label>
                  <input
                    type="text"
                    value={formData.subSpecialty}
                    onChange={(e) => setFormData({ ...formData, subSpecialty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell patients about your experience and approach..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Name</label>
                <input
                  type="text"
                  value={formData.clinicName}
                  onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Consultation Types Tab */}
          {activeTab === 'consultation' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Consultation Types & Pricing</h3>
                <button
                  onClick={addConsultationType}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Consultation Type
                </button>
              </div>

              <div className="space-y-4">
                {consultationTypes.map((type, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Consultation Type {index + 1}</h4>
                      <button
                        onClick={() => removeConsultationType(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select
                          value={type.type}
                          onChange={(e) => updateConsultationType(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {consultationTypeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                        <input
                          type="number"
                          value={type.price}
                          onChange={(e) => updateConsultationType(index, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration (min)</label>
                        <input
                          type="number"
                          value={type.duration}
                          onChange={(e) => updateConsultationType(index, 'duration', parseInt(e.target.value) || 30)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={type.isActive ? 'active' : 'inactive'}
                          onChange={(e) => updateConsultationType(index, 'isActive', e.target.value === 'active')}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <input
                        type="text"
                        value={type.description}
                        onChange={(e) => updateConsultationType(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Brief description of this consultation type..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Availability Tab */}
          {activeTab === 'availability' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Weekly Availability</h3>
                <button
                  onClick={addAvailabilitySlot}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Time Slot
                </button>
              </div>

              <div className="space-y-4">
                {availabilitySlots.map((slot, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Time Slot {index + 1}</h4>
                      <button
                        onClick={() => removeAvailabilitySlot(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                        <select
                          value={slot.dayOfWeek}
                          onChange={(e) => updateAvailabilitySlot(index, 'dayOfWeek', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {daysOfWeek.map(day => (
                            <option key={day.value} value={day.value}>
                              {day.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => updateAvailabilitySlot(index, 'startTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => updateAvailabilitySlot(index, 'endTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Max Bookings</label>
                        <input
                          type="number"
                          value={slot.maxBookings}
                          onChange={(e) => updateAvailabilitySlot(index, 'maxBookings', parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Available Consultation Types</label>
                      <div className="flex flex-wrap gap-2">
                        {consultationTypeOptions.map(option => (
                          <label key={option.value} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={slot.consultationTypes.includes(option.value)}
                              onChange={(e) => {
                                const updated = e.target.checked
                                  ? [...slot.consultationTypes, option.value]
                                  : slot.consultationTypes.filter(t => t !== option.value);
                                updateAvailabilitySlot(index, 'consultationTypes', updated);
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={saveAvailability}
                  disabled={saving}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Availability'}
                </button>
              </div>
            </div>
          )}

          {/* Location & Contact Tab */}
          {activeTab === 'location' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Location & Contact Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input
                    type="text"
                    value={formData.clinicAddress.street}
                    onChange={(e) => setFormData({
                      ...formData,
                      clinicAddress: { ...formData.clinicAddress, street: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={formData.clinicAddress.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      clinicAddress: { ...formData.clinicAddress, city: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                  <input
                    type="text"
                    value={formData.clinicAddress.state}
                    onChange={(e) => setFormData({
                      ...formData,
                      clinicAddress: { ...formData.clinicAddress, state: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    value={formData.clinicAddress.country}
                    onChange={(e) => setFormData({
                      ...formData,
                      clinicAddress: { ...formData.clinicAddress, country: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP/Postal Code</label>
                  <input
                    type="text"
                    value={formData.clinicAddress.zipCode}
                    onChange={(e) => setFormData({
                      ...formData,
                      clinicAddress: { ...formData.clinicAddress, zipCode: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">Social Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                    <input
                      type="url"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                    <input
                      type="url"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderProfileManagement;
