import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Shield, 
  Clock, 
  Activity,
  MapPin,
  CreditCard,
  Filter,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';

// Mock data - in production this would come from React Query
const mockKPIs = {
  totalAlerts: 1247,
  confirmedFraud: 89,
  falsePositives: 156,
  avgResponseTime: 4.2,
  fraudRate: 0.071,
  blockedAmount: 2847392
};

const mockTrendData = [
  { time: '00:00', alerts: 45, fraudRate: 0.067 },
  { time: '02:00', alerts: 32, fraudRate: 0.059 },
  { time: '04:00', alerts: 28, fraudRate: 0.071 },
  { time: '06:00', alerts: 56, fraudRate: 0.084 },
  { time: '08:00', alerts: 89, fraudRate: 0.092 },
  { time: '10:00', alerts: 134, fraudRate: 0.078 },
  { time: '12:00', alerts: 167, fraudRate: 0.085 },
  { time: '14:00', alerts: 198, fraudRate: 0.091 },
  { time: '16:00', alerts: 234, fraudRate: 0.103 },
  { time: '18:00', alerts: 198, fraudRate: 0.096 },
  { time: '20:00', alerts: 156, fraudRate: 0.088 },
  { time: '22:00', alerts: 89, fraudRate: 0.074 }
];

const mockMerchantData = [
  { name: 'E-Commerce Global', alerts: 89, amount: 125000, risk: 'high' },
  { name: 'Payment Systems Inc', alerts: 67, amount: 98000, risk: 'medium' },
  { name: 'Digital Marketplace', alerts: 45, amount: 76000, risk: 'high' },
  { name: 'Retail Networks', alerts: 34, amount: 54000, risk: 'low' },
  { name: 'Online Services', alerts: 29, amount: 43000, risk: 'medium' }
];

const mockRiskDistribution = [
  { name: 'High Risk', value: 23, color: '#ef4444' },
  { name: 'Medium Risk', value: 45, color: '#f59e0b' },
  { name: 'Low Risk', value: 32, color: '#22c55e' }
];

const mockRecentAlerts = [
  {
    id: 'TXN-2024-001247',
    amount: 8950,
    merchant: 'E-Commerce Global',
    riskScore: 94,
    time: '2 minutes ago',
    type: 'card_not_present',
    status: 'investigating'
  },
  {
    id: 'TXN-2024-001246',
    amount: 2340,
    merchant: 'Digital Marketplace',
    riskScore: 89,
    time: '5 minutes ago',
    type: 'velocity_check',
    status: 'flagged'
  },
  {
    id: 'TXN-2024-001245',
    amount: 15670,
    merchant: 'Payment Systems Inc',
    riskScore: 87,
    time: '8 minutes ago',
    type: 'geographic_anomaly',
    status: 'blocked'
  }
];

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: React.ReactNode;
  colorScheme: 'primary' | 'success' | 'warning' | 'danger';
}

const KPICard: React.FC<KPICardProps> = ({ title, value, trend, icon, colorScheme }) => {
  const colorMap = {
    primary: 'text-blue-600 bg-blue-50 border-blue-200',
    success: 'text-green-600 bg-green-50 border-green-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    danger: 'text-red-600 bg-red-50 border-red-200'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center">
              {trend > 0 ? (
                <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${trend > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorMap[colorScheme]}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const AlertItem: React.FC<{ alert: typeof mockRecentAlerts[0] }> = ({ alert }) => {
  const statusColors = {
    investigating: 'bg-yellow-100 text-yellow-800',
    flagged: 'bg-red-100 text-red-800',
    blocked: 'bg-gray-100 text-gray-800'
  };

  const riskColor = alert.riskScore >= 90 ? 'text-red-600' : alert.riskScore >= 70 ? 'text-yellow-600' : 'text-green-600';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center mb-1">
          <span className="text-sm font-medium text-gray-900 mr-2">{alert.id}</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[alert.status]}`}>
            {alert.status}
          </span>
        </div>
        <p className="text-sm text-gray-600 truncate">{alert.merchant}</p>
        <p className="text-xs text-gray-500">{alert.time}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-900">
          ${alert.amount.toLocaleString()}
        </p>
        <p className={`text-sm font-medium ${riskColor}`}>
          Risk: {alert.riskScore}
        </p>
      </div>
    </motion.div>
  );
};

const Dashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [realtimeAlerts, setRealtimeAlerts] = useState(mockRecentAlerts);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new alert every 30 seconds
      const newAlert = {
        id: `TXN-2024-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
        amount: Math.floor(Math.random() * 50000) + 1000,
        merchant: ['E-Commerce Global', 'Digital Marketplace', 'Payment Systems Inc'][Math.floor(Math.random() * 3)],
        riskScore: Math.floor(Math.random() * 40) + 60,
        time: 'Just now',
        type: ['card_not_present', 'velocity_check', 'geographic_anomaly'][Math.floor(Math.random() * 3)],
        status: ['investigating', 'flagged'][Math.floor(Math.random() * 2)] as 'investigating' | 'flagged'
      };
      
      setRealtimeAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fraud Detection Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time monitoring and analytics</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select 
              value={selectedTimeRange} 
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
          
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Active Alerts"
          value={mockKPIs.totalAlerts.toLocaleString()}
          trend={8.2}
          icon={<AlertTriangle className="w-6 h-6" />}
          colorScheme="warning"
        />
        <KPICard
          title="Confirmed Fraud"
          value={mockKPIs.confirmedFraud}
          trend={-3.1}
          icon={<Shield className="w-6 h-6" />}
          colorScheme="danger"
        />
        <KPICard
          title="Avg Response Time"
          value={`${mockKPIs.avgResponseTime}m`}
          trend={-12.5}
          icon={<Clock className="w-6 h-6" />}
          colorScheme="success"
        />
        <KPICard
          title="Blocked Amount"
          value={`${(mockKPIs.blockedAmount / 1000000).toFixed(1)}M`}
          trend={15.7}
          icon={<CreditCard className="w-6 h-6" />}
          colorScheme="primary"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Alert Trends */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Alert Trends</h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Alerts</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Fraud Rate</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="alerts"
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="fraudRate"
                  orientation="right"
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => [
                    name === 'fraudRate' ? `${(value * 100).toFixed(1)}%` : value,
                    name === 'fraudRate' ? 'Fraud Rate' : 'Alerts'
                  ]}
                />
                <Line 
                  yAxisId="alerts"
                  type="monotone" 
                  dataKey="alerts" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
                <Line 
                  yAxisId="fraudRate"
                  type="monotone" 
                  dataKey="fraudRate" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockRiskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {mockRiskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Percentage']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {mockRiskDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Merchants */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Risk Merchants</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {mockMerchantData.map((merchant, index) => {
              const riskColor = merchant.risk === 'high' ? 'text-red-600 bg-red-50' : 
                               merchant.risk === 'medium' ? 'text-yellow-600 bg-yellow-50' : 
                               'text-green-600 bg-green-50';
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{merchant.name}</p>
                      <p className="text-sm text-gray-600">{merchant.alerts} alerts</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${merchant.amount.toLocaleString()}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${riskColor}`}>
                      {merchant.risk} risk
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Real-time Alerts Feed */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Live Alerts</h3>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-gray-600">Live</span>
              </div>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {realtimeAlerts.map((alert, index) => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;