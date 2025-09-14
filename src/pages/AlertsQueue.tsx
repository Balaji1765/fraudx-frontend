import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown,
  Eye,
  Flag,
  Ban,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  MapPin,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data for alerts queue
const mockAlerts = Array.from({ length: 100 }, (_, i) => ({
  id: `ALT-${String(i + 1).padStart(8, '0')}`,
  transactionId: `TXN-2024-${String(i + 1000).padStart(6, '0')}`,
  timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  amount: Math.floor(Math.random() * 50000) + 100,
  currency: 'USD',
  merchantName: ['Amazon', 'Walmart', 'Target', 'Best Buy', 'Home Depot'][Math.floor(Math.random() * 5)],
  riskScore: Math.floor(Math.random() * 40) + 60,
  status: ['pending', 'investigating', 'flagged', 'approved'][Math.floor(Math.random() * 4)],
  priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
  assignedTo: Math.random() > 0.5 ? ['Sarah Chen', 'Mike Johnson', 'Emily Davis'][Math.floor(Math.random() * 3)] : null,
  country: ['US', 'CA', 'GB', 'FR', 'DE'][Math.floor(Math.random() * 5)],
  customerRisk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
  cardType: ['visa', 'mastercard', 'amex'][Math.floor(Math.random() * 3)]
}));

const AlertsQueue: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    riskRange: [60, 100] as [number, number]
  });
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedAlerts = useMemo(() => {
    let filtered = mockAlerts.filter(alert => {
      const matchesSearch = alert.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alert.merchantName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filters.status.length === 0 || filters.status.includes(alert.status);
      const matchesPriority = filters.priority.length === 0 || filters.priority.includes(alert.priority);
      const matchesRisk = alert.riskScore >= filters.riskRange[0] && alert.riskScore <= filters.riskRange[1];

      return matchesSearch && matchesStatus && matchesPriority && matchesRisk;
    });

    filtered.sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a];
      const bVal = b[sortBy as keyof typeof b];
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [searchTerm, sortBy, sortOrder, filters]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      investigating: 'bg-blue-100 text-blue-800',
      flagged: 'bg-red-100 text-red-800',
      approved: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      critical: 'text-red-600'
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600 font-bold';
    if (score >= 70) return 'text-yellow-600 font-semibold';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Alerts Triage Queue</h1>
        <p className="text-gray-600">Review and investigate fraud alerts</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions or merchants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            
            {selectedAlerts.length > 0 && (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-300">
                <span className="text-sm text-gray-600">{selectedAlerts.length} selected</span>
                <button className="flex items-center px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200">
                  <Flag className="w-3 h-3 mr-1" />
                  Bulk Flag
                </button>
                <button className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200">
                  <Ban className="w-3 h-3 mr-1" />
                  Bulk Block
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="space-y-1">
                  {['pending', 'investigating', 'flagged', 'approved'].map(status => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(status)}
                        onChange={(e) => {
                          const newStatuses = e.target.checked 
                            ? [...filters.status, status]
                            : filters.status.filter(s => s !== status);
                          setFilters(prev => ({ ...prev, status: newStatuses }));
                        }}
                        className="mr-2 text-blue-600"
                      />
                      <span className="text-sm capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <div className="space-y-1">
                  {['low', 'medium', 'high', 'critical'].map(priority => (
                    <label key={priority} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.priority.includes(priority)}
                        onChange={(e) => {
                          const newPriorities = e.target.checked 
                            ? [...filters.priority, priority]
                            : filters.priority.filter(p => p !== priority);
                          setFilters(prev => ({ ...prev, priority: newPriorities }));
                        }}
                        className="mr-2 text-blue-600"
                      />
                      <span className="text-sm capitalize">{priority}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Risk Score: {filters.riskRange[0]} - {filters.riskRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.riskRange[1]}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    riskRange: [prev.riskRange[0], parseInt(e.target.value)]
                  }))}
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Results Summary */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredAndSortedAlerts.length} of {mockAlerts.length} alerts
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAlerts(filteredAndSortedAlerts.map(alert => alert.id));
                      } else {
                        setSelectedAlerts([]);
                      }
                    }}
                    className="text-blue-600"
                  />
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('timestamp')}
                >
                  <div className="flex items-center">
                    Time
                    <ArrowUpDown className="w-3 h-3 ml-1" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center">
                    Amount
                    <ArrowUpDown className="w-3 h-3 ml-1" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Merchant
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('riskScore')}
                >
                  <div className="flex items-center">
                    Risk Score
                    <ArrowUpDown className="w-3 h-3 ml-1" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedAlerts.map((alert, index) => (
                <motion.tr
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedAlerts.includes(alert.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAlerts([...selectedAlerts, alert.id]);
                        } else {
                          setSelectedAlerts(selectedAlerts.filter(id => id !== alert.id));
                        }
                      }}
                      className="text-blue-600"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(alert.timestamp).toLocaleDateString()}
                      <br />
                      <span className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{alert.transactionId}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {alert.country}
                      <CreditCard className="w-3 h-3 ml-2 mr-1" />
                      {alert.cardType.toUpperCase()}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${alert.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {alert.merchantName}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className={`text-lg font-bold ${getRiskColor(alert.riskScore)}`}>
                      {alert.riskScore}
                    </div>
                    <div className={`text-xs ${getPriorityColor(alert.priority)}`}>
                      {alert.priority} priority
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(alert.status)}`}>
                      {alert.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {alert.assignedTo ? (
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {alert.assignedTo}
                      </div>
                    ) : (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-900">
                        <Flag className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Ban className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">50</span> of{' '}
          <span className="font-medium">{filteredAndSortedAlerts.length}</span> results
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">
            Previous
          </button>
          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
            1
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertsQueue;