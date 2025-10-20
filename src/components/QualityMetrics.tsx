import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Award, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface QualityScore {
  _id: string;
  providerId: {
    _id: string;
    name: string;
    category: string;
    rating: number;
  };
  sqi: number;
  reviewRating: number;
  appointmentCompletionRate: number;
  responseSpeed: number;
  complaintRate: number;
  period: string;
  periodStart: string;
  periodEnd: string;
}

interface QualityAnalytics {
  distribution: Array<{
    _id: {
      year: number;
      month: number;
      day?: number;
    };
    averageSQI: number;
    excellentProviders: number;
    goodProviders: number;
    averageProviders: number;
    poorProviders: number;
  }>;
  topProviders: Array<{
    providerId: string;
    providerName: string;
    providerCategory: string;
    averageSQI: number;
    latestSQI: number;
  }>;
  byCategory: Array<{
    _id: {
      category: string;
      year: number;
      month: number;
    };
    averageSQI: number;
    providerCount: number;
  }>;
  metrics: {
    averageReviewRating: number;
    averageCompletionRate: number;
    averageResponseSpeed: number;
    averageComplaintRate: number;
    totalAppointments: number;
    totalCompletedAppointments: number;
    totalComplaints: number;
  };
}

const QualityMetrics: React.FC = () => {
  const [qualityScores, setQualityScores] = useState<QualityScore[]>([]);
  const [analytics, setAnalytics] = useState<QualityAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchQualityData();
  }, [selectedPeriod, selectedCategory]);

  const fetchQualityData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [scoresResponse, analyticsResponse] = await Promise.all([
        fetch(`/api/quality/scores?period=${selectedPeriod}&limit=50`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`/api/quality/analytics?period=${selectedPeriod}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (scoresResponse.ok && analyticsResponse.ok) {
        const scoresData = await scoresResponse.json();
        const analyticsData = await analyticsResponse.json();
        
        setQualityScores(scoresData.data || []);
        setAnalytics(analyticsData.data || null);
      }
    } catch (error) {
      console.error('Error fetching quality data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSQIStatus = (sqi: number) => {
    if (sqi >= 90) return { status: 'excellent', color: '#10B981', icon: Award };
    if (sqi >= 70) return { status: 'good', color: '#3B82F6', icon: CheckCircle };
    if (sqi >= 50) return { status: 'average', color: '#F59E0B', icon: AlertTriangle };
    return { status: 'poor', color: '#EF4444', icon: XCircle };
  };

  const formatPeriod = (period: string) => {
    const periodMap: { [key: string]: string } = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      yearly: 'Yearly'
    };
    return periodMap[period] || period;
  };

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quality Metrics Dashboard</h2>
          <p className="text-gray-600">Service Quality Index (SQI) and performance analytics</p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average SQI</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.metrics.averageReviewRating ? Math.round(analytics.metrics.averageReviewRating * 20) : 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(analytics.metrics.averageCompletionRate)}%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(analytics.metrics.averageResponseSpeed)}h
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Complaint Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(analytics.metrics.averageComplaintRate)}%
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SQI Distribution */}
        {analytics && analytics.distribution.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">SQI Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.distribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id.month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="excellentProviders" stackId="a" fill="#10B981" name="Excellent (90+)" />
                <Bar dataKey="goodProviders" stackId="a" fill="#3B82F6" name="Good (70-89)" />
                <Bar dataKey="averageProviders" stackId="a" fill="#F59E0B" name="Average (50-69)" />
                <Bar dataKey="poorProviders" stackId="a" fill="#EF4444" name="Poor (<50)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Providers */}
        {analytics && analytics.topProviders.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Providers</h3>
            <div className="space-y-3">
              {analytics.topProviders.slice(0, 5).map((provider, index) => {
                const sqiStatus = getSQIStatus(provider.latestSQI);
                const StatusIcon = sqiStatus.icon;
                return (
                  <div key={provider.providerId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{provider.providerName}</p>
                        <p className="text-sm text-gray-600">{provider.providerCategory}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon className="h-5 w-5" style={{ color: sqiStatus.color }} />
                      <span className="font-bold" style={{ color: sqiStatus.color }}>
                        {Math.round(provider.latestSQI)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Quality Scores Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quality Scores</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SQI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Review Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Response Speed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Complaint Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {qualityScores.map((score) => {
                const sqiStatus = getSQIStatus(score.sqi);
                const StatusIcon = sqiStatus.icon;
                return (
                  <tr key={score._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {score.providerId.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 capitalize">
                        {score.providerId.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4" style={{ color: sqiStatus.color }} />
                        <span className="text-sm font-medium" style={{ color: sqiStatus.color }}>
                          {Math.round(score.sqi)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {score.reviewRating.toFixed(1)}/5
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {Math.round(score.appointmentCompletionRate)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {Math.round(score.responseSpeed)}h
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {Math.round(score.complaintRate)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                        style={{
                          backgroundColor: `${sqiStatus.color}20`,
                          color: sqiStatus.color
                        }}
                      >
                        {sqiStatus.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {qualityScores.length === 0 && (
        <div className="text-center py-12">
          <Award className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No quality data</h3>
          <p className="mt-1 text-sm text-gray-500">
            No quality scores available for the selected period.
          </p>
        </div>
      )}
    </div>
  );
};

export default QualityMetrics;
