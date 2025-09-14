import React, { useState } from 'react';
import {
  ArrowLeft,
  AlertTriangle,
  Shield,
  User,
  CreditCard,
  MapPin,
  Clock,
  Smartphone,
  Globe,
  Flag,
  Ban,
  DollarSign,
  ArrowUpRight,
  Eye,
  FileText,
  Hash,
  Calendar,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import ExplainabilityWaterfall from '../components/Explainability/Waterfall';

// Mock transaction data
const mockTransaction = {
  id: 'TXN-2024-001247',
  amount: 8950.00,
  currency: 'USD',
  timestamp: '2024-09-14T14:32:18Z',
  merchant: {
    id: 'MRC-8945',
    name: 'E-Commerce Global',
    category: 'Online Retail',
    country: 'US',
    riskLevel: 'high'
  },
  card: {
    bin: '424242',
    last4: '4242',
    type: 'visa',
    issuer: 'Chase Bank'
  },
  customer: {
    id: 'CUST-445821',
    email: 'j***@email.com',
    phone: '+1-555-***-2847',
    accountAge: 847, // days
    verified: true
  },
  device: {
    fingerprint: 'fp_8x9y2z1a3b4c5d6e',
    ipAddress: '203.45.67.89',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    location: {
      country: 'United States',
      city: 'Los Angeles',
      coordinates: [34.0522, -118.2437]
    }
  },
  riskAssessment: {
    overallScore: 94,
    confidence: 0.89,
    modelVersion: 'v2.4.1',
    features: [
      { name: 'Transaction Amount', value: 8950, impact: 0.32, description: 'High-value transaction' },
      { name: 'Velocity Score', value: 0.87, impact: 0.28, description: 'Multiple transactions in short timeframe' },
      { name: 'Geographic Risk', value: 0.45, impact: 0.15, description: 'Transaction from new location' },
      { name: 'Device Risk', value: 0.23, impact: 0.12, description: 'Unrecognized device fingerprint' },
      { name: 'Merchant Risk', value: 0.78, impact: 0.08, description: 'High-risk merchant category' },
      { name: 'Time Pattern', value: 0.34, impact: 0.05, description: 'Unusual transaction time' }
    ]
  },
  rules: [
    { id: 'RULE-001', name: 'High Value Transaction', triggered: true, severity: 'high' },
    { id: 'RULE-003', name: 'Velocity Check Failed', triggered: true, severity: 'medium' },
    { id: 'RULE-007', name: 'New Device Detection', triggered: true, severity: 'low' }
  ],
  status: 'investigating',
  assignedTo: 'Sarah Chen',
  notes: [
    { id: 1, author: 'Sarah Chen', text: 'Customer contacted via email - awaiting response', timestamp: '2024-09-14T14:45:00Z' },
    { id: 2, author: 'System', text: 'Similar transaction pattern detected in last 24h', timestamp: '2024-09-14T14:35:00Z' }
  ]
};

const mockTransactionHistory = [
  { id: 'TXN-001246', amount: 45.67, merchant: 'Coffee Shop', date: '2024-09-14T09:15:00Z', status: 'approved' },
  { id: 'TXN-001245', amount: 120.00, merchant: 'Gas Station', date: '2024-09-13T18:22:00Z', status: 'approved' },
  { id: 'TXN-001244', amount: 2340.00, merchant: 'Electronics Store', date: '2024-09-13T14:30:00Z', status: 'flagged' },
  { id: 'TXN-001243', amount: 89.99, merchant: 'Online Service', date: '2024-09-12T20:45:00Z', status: 'approved' },
  { id: 'TXN-001242', amount: 1500.00, merchant: 'Department Store', date: '2024-09-12T16:12:00Z', status: 'approved' }
];

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  variant: 'primary' | 'danger' | 'warning' | 'secondary';
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, variant, onClick }) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white'
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 rounded-md font-medium text-sm transition-colors ${variants[variant]}`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );
};

const RiskScoreGauge: React.FC<{ score: number; confidence: number }> = ({ score, confidence }) => {
  const radius = 80;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#ef4444';
    if (score >= 60) return '#f59e0b';
    return '#22c55e';
  };

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress circle */}
        <circle
          stroke={getScoreColor(score)}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold" style={{ color: getScoreColor(score) }}>
          {score}
        </div>
        <div className="text-sm text-gray-600 font-medium">RISK SCORE</div>
        <div className="text-xs text-gray-500">
          {Math.round(confidence * 100)}% confidence
        </div>
      </div>
    </div>
  );
};

const TimelineItem: React.FC<{ icon: React.ReactNode; title: string; description: string; time: string; isLast?: boolean }> = 
  ({ icon, title, description, time, isLast = false }) => (
    <div className="relative flex items-start space-x-3 pb-6">
      {!isLast && (
        <div className="absolute left-5 top-12 -ml-px h-full w-0.5 bg-gray-200" />
      )}
      <div className="relative flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-50 ring-2 ring-blue-200">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm">
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
        <div className="mt-1 text-xs text-gray-500">{time}</div>
      </div>
    </div>
  );

const Investigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');
  const [showConfirmAction, setShowConfirmAction] = useState<string | null>(null);

  const handleAction = (action: string) => {
    setShowConfirmAction(action);
  };

  const confirmAction = () => {
    console.log(`Action confirmed: ${showConfirmAction}`);
    setShowConfirmAction(null);
    // In real app, this would call the API
  };

  const addNote = () => {
    if (newNote.trim()) {
      console.log('Adding note:', newNote);
      setNewNote('');
      // In real app, this would call the API
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'history', label: 'Transaction History' },
    { id: 'device', label: 'Device Analysis' },
    { id: 'timeline', label: 'Investigation Timeline' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-md hover:bg-gray-100">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Transaction {mockTransaction.id}
                </h1>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                  <span>{new Date(mockTransaction.timestamp).toLocaleString()}</span>
                  <span>•</span>
                  <span>Assigned to {mockTransaction.assignedTo}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <ActionButton
                icon={<Flag className="w-4 h-4" />}
                label="Flag"
                variant="warning"
                onClick={() => handleAction('flag')}
              />
              <ActionButton
                icon={<Ban className="w-4 h-4" />}
                label="Block"
                variant="danger"
                onClick={() => handleAction('block')}
              />
              <ActionButton
                icon={<DollarSign className="w-4 h-4" />}
                label="Refund"
                variant="secondary"
                onClick={() => handleAction('refund')}
              />
              <ActionButton
                icon={<ArrowUpRight className="w-4 h-4" />}
                label="Escalate"
                variant="primary"
                onClick={() => handleAction('escalate')}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Risk Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <RiskScoreGauge 
                  score={mockTransaction.riskAssessment.overallScore} 
                  confidence={mockTransaction.riskAssessment.confidence}
                />
              </div>
              
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Explanation</h3>
                <ExplainabilityWaterfall 
                  features={mockTransaction.riskAssessment.features}
                  baseScore={0}
                  finalScore={mockTransaction.riskAssessment.overallScore}
                />
              </div>
            </div>
          </motion.div>

          {/* Transaction Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Transaction Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ${mockTransaction.amount.toLocaleString()} {mockTransaction.currency}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Merchant</span>
                  <span className="text-sm font-medium text-gray-900">{mockTransaction.merchant.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Category</span>
                  <span className="text-sm text-gray-900">{mockTransaction.merchant.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Card</span>
                  <span className="text-sm text-gray-900">
                    •••• •••• •••• {mockTransaction.card.last4}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Location</span>
                  <span className="text-sm text-gray-900">
                    {mockTransaction.device.location.city}, {mockTransaction.device.location.country}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Risk Factors */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Triggered Rules</h3>
              </div>
              <div className="p-6 space-y-3">
                {mockTransaction.rules.map((rule) => {
                  const severityColors = {
                    high: 'bg-red-100 text-red-800',
                    medium: 'bg-yellow-100 text-yellow-800',
                    low: 'bg-blue-100 text-blue-800'
                  };
                  
                  return (
                    <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{rule.name}</p>
                        <p className="text-xs text-gray-600">{rule.id}</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severityColors[rule.severity]}`}>
                        {rule.severity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Tabbed Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 shadow-sm"
          >
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Customer Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Customer ID</p>
                          <p className="text-sm font-medium text-gray-900">{mockTransaction.customer.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Hash className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="text-sm font-medium text-gray-900">{mockTransaction.customer.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Account Age</p>
                          <p className="text-sm font-medium text-gray-900">{mockTransaction.customer.accountAge} days</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Verification Status</p>
                          <p className={`text-sm font-medium ${mockTransaction.customer.verified ? 'text-green-600' : 'text-red-600'}`}>
                            {mockTransaction.customer.verified ? 'Verified' : 'Unverified'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Payment Method</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <CreditCard className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Card Number</p>
                          <p className="text-sm font-medium text-gray-900">
                            {mockTransaction.card.bin}•••••••••{mockTransaction.card.last4}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Activity className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Card Type</p>
                          <p className="text-sm font-medium text-gray-900 capitalize">
                            {mockTransaction.card.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Issuing Bank</p>
                          <p className="text-sm font-medium text-gray-900">{mockTransaction.card.issuer}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Recent Transactions</h4>
                  <div className="space-y-3">
                    {mockTransactionHistory.map((transaction) => {
                      const statusColors = {
                        approved: 'bg-green-100 text-green-800',
                        flagged: 'bg-yellow-100 text-yellow-800',
                        blocked: 'bg-red-100 text-red-800'
                      };

                      return (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{transaction.id}</p>
                              <p className="text-sm text-gray-600">{transaction.merchant}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(transaction.date).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              ${transaction.amount.toLocaleString()}
                            </p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[transaction.status]}`}>
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'device' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Device Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Smartphone className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">Device Fingerprint</p>
                          <p className="text-sm font-mono text-gray-900 break-all">
                            {mockTransaction.device.fingerprint}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Globe className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">IP Address</p>
                          <p className="text-sm font-mono text-gray-900">{mockTransaction.device.ipAddress}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Activity className="w-4 h-4 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">User Agent</p>
                          <p className="text-xs text-gray-900 break-all leading-relaxed">
                            {mockTransaction.device.userAgent}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Geographic Analysis</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="text-sm font-medium text-gray-900">
                            {mockTransaction.device.location.city}, {mockTransaction.device.location.country}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Hash className="w-4 h-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-600">Coordinates</p>
                          <p className="text-sm font-mono text-gray-900">
                            {mockTransaction.device.location.coordinates.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Mock map placeholder */}
                    <div className="mt-4 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Interactive map would be here</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Investigation Timeline</h4>
                  <div>
                    <TimelineItem
                      icon={<AlertTriangle className="w-5 h-5 text-blue-600" />}
                      title="Transaction Flagged"
                      description="High-risk transaction detected by ML model"
                      time="2024-09-14 at 2:32 PM"
                    />
                    <TimelineItem
                      icon={<Eye className="w-5 h-5 text-blue-600" />}
                      title="Assigned to Analyst"
                      description="Case assigned to Sarah Chen for investigation"
                      time="2024-09-14 at 2:35 PM"
                    />
                    <TimelineItem
                      icon={<FileText className="w-5 h-5 text-blue-600" />}
                      title="Customer Contact Attempted"
                      description="Email sent to customer for transaction verification"
                      time="2024-09-14 at 2:45 PM"
                    />
                    <TimelineItem
                      icon={<Activity className="w-5 h-5 text-blue-600" />}
                      title="Similar Pattern Detected"
                      description="System identified similar transaction patterns"
                      time="2024-09-14 at 3:12 PM"
                      isLast
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <div className="space-y-6">
            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 mr-2" />
                  View Customer Profile
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Card Transaction History
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4 mr-2" />
                  Geographic Analysis
                </button>
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Investigation Notes</h3>
              <div className="space-y-3 mb-4">
                {mockTransaction.notes.map((note) => (
                  <div key={note.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{note.author}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(note.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{note.text}</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add investigation note..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  rows={3}
                />
                <button
                  onClick={addNote}
                  disabled={!newNote.trim()}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Add Note
                </button>
              </div>
            </div>

            {/* Case Status */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Case Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 capitalize">
                    {mockTransaction.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Priority</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    High
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Assigned To</span>
                  <span className="text-sm font-medium text-gray-900">{mockTransaction.assignedTo}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm text-gray-600">
                    {new Date(mockTransaction.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmAction && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full"
          >
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm {showConfirmAction.charAt(0).toUpperCase() + showConfirmAction.slice(1)}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to {showConfirmAction} this transaction? This action will be logged in the audit trail.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmAction(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className="flex-1 px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Investigator;