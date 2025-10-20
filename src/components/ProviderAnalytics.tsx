import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, Users, Calendar, Star, Award, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface AnalyticsData {
  appointments: {
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
    completionRate: number;
  };
  reviews: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: number[];
  };
  meetings: {
    totalMeetings: number;
    completedMeetings: number;
    cancelledMeetings: number;
    averageDuration: number;
    totalDuration: number;
  };
  performance: {
    qualityScore: number;
    responseRate: number;
    patientSatisfaction: number;
  };
}

const ProviderAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/provider-portal/analytics?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const appointmentStatusData = analytics ? [
    { name: 'Completed', value: analytics.appointments.completed, color: '#10B981' },
    { name: 'Pending', value: analytics.appointments.pending, color: '#F59E0B' },
    { name: 'Cancelled', value: analytics.appointments.cancelled, color: '#EF4444' }
  ] : [];

  const ratingDistributionData = analytics ? [
    { rating: '5 Stars', count: analytics.reviews.ratingDistribution.filter(r => r === 5).length },
    { rating: '4 Stars', count: analytics.reviews.ratingDistribution.filter(r => r === 4).length },
    { rating: '3 Stars', count: analytics.reviews.ratingDistribution.filter(r => r === 3).length },
    { rating: '2 Stars', count: analytics.reviews.ratingDistribution.filter(r => r === 2).length },
    { rating: '1 Star', count: analytics.reviews.ratingDistribution.filter(r => r === 1).length }
  ] : [];

  const performanceData = analytics ? [
    { metric: 'Quality Score', value: analytics.performance.qualityScore, max: 100 },
    { metric: 'Response Rate', value: analytics.performance.responseRate, max: 100 },
    { metric: 'Patient Satisfaction', value: analytics.performance.patientSatisfaction, max: 100 }
  ] : [];

  const monthlyTrendData = [
    { month: 'Jan', appointments: 12, reviews: 8, rating: 4.2 },
    { month: 'Feb', appointments: 15, reviews: 10, rating: 4.5 },
    { month: 'Mar', appointments: 18, reviews: 12, rating: 4.3 },
    { month: 'Apr', appointments: 22, reviews: 15, rating: 4.6 },
    { month: 'May', appointments: 25, reviews: 18, rating: 4.4 },
    { month: 'Jun', appointments: 28, reviews: 20, rating: 4.7 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No analytics data</h3>
        <p className="mt-1 text-sm text-gray-500">
          Analytics data will appear here once you have appointments and reviews.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Performance</h2>
          <p className="text-gray-600">Track your performance and patient satisfaction</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Appointments</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.appointments.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.appointments.completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average Rating</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.reviews.averageRating.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Quality Score</p>
              <p className="text-2xl font-semibold text-gray-900">{analytics.performance.qualityScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={appointmentStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {appointmentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingDistributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="appointments" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="reviews" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-sm font-medium text-gray-900">{analytics.appointments.completed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="text-sm font-medium text-gray-900">{analytics.appointments.pending}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Cancelled</span>
              <span className="text-sm font-medium text-gray-900">{analytics.appointments.cancelled}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <span className="text-sm font-medium text-green-600">{analytics.appointments.completionRate}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Reviews</span>
              <span className="text-sm font-medium text-gray-900">{analytics.reviews.totalReviews}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Average Rating</span>
              <span className="text-sm font-medium text-yellow-600">{analytics.reviews.averageRating.toFixed(1)}/5</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">5-Star Reviews</span>
              <span className="text-sm font-medium text-gray-900">
                {analytics.reviews.ratingDistribution.filter(r => r === 5).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Patient Satisfaction</span>
              <span className="text-sm font-medium text-green-600">{analytics.performance.patientSatisfaction}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Meetings</span>
              <span className="text-sm font-medium text-gray-900">{analytics.meetings.totalMeetings}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-sm font-medium text-gray-900">{analytics.meetings.completedMeetings}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Average Duration</span>
              <span className="text-sm font-medium text-gray-900">{analytics.meetings.averageDuration.toFixed(0)} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Response Rate</span>
              <span className="text-sm font-medium text-green-600">{analytics.performance.responseRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-2">Strengths</h4>
            <ul className="space-y-2">
              {analytics.performance.qualityScore > 80 && (
                <li className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  High quality score ({analytics.performance.qualityScore}%)
                </li>
              )}
              {analytics.reviews.averageRating > 4.0 && (
                <li className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Excellent patient ratings ({analytics.reviews.averageRating.toFixed(1)}/5)
                </li>
              )}
              {analytics.appointments.completionRate > 90 && (
                <li className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  High appointment completion rate ({analytics.appointments.completionRate}%)
                </li>
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-2">Areas for Improvement</h4>
            <ul className="space-y-2">
              {analytics.performance.responseRate < 95 && (
                <li className="flex items-center gap-2 text-sm text-yellow-600">
                  <AlertCircle className="h-4 w-4" />
                  Response rate could be improved ({analytics.performance.responseRate}%)
                </li>
              )}
              {analytics.appointments.cancelled > analytics.appointments.completed * 0.1 && (
                <li className="flex items-center gap-2 text-sm text-yellow-600">
                  <AlertCircle className="h-4 w-4" />
                  High cancellation rate ({((analytics.appointments.cancelled / analytics.appointments.total) * 100).toFixed(1)}%)
                </li>
              )}
              {analytics.reviews.totalReviews < 10 && (
                <li className="flex items-center gap-2 text-sm text-yellow-600">
                  <AlertCircle className="h-4 w-4" />
                  Encourage more patient reviews ({analytics.reviews.totalReviews} total)
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderAnalytics;
