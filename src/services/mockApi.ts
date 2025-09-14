// Mock API service for FraudX Frontend
// This simulates backend API calls with realistic data and response times

import { faker } from '@faker-js/faker';

// Types
export interface KPIData {
  totalAlerts: number;
  confirmedFraud: number;
  falsePositives: number;
  avgResponseTime: number;
  fraudRate: number;
  blockedAmount: number;
  timestamp: string;
}

export interface Alert {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  timestamp: string;
  merchantName: string;
  merchantId: string;
  merchantCategory: string;
  cardBin: string;
  cardLast4: string;
  customerId: string;
  riskScore: number;
  confidence: number;
  status: 'pending' | 'investigating' | 'flagged' | 'approved' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string | null;
  country: string;
  ipAddress: string;
  deviceFingerprint: string;
  ruleTriggers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Transaction extends Alert {
  customer: {
    id: string;
    email: string;
    phone: string;
    accountAge: number;
    verified: boolean;
    riskLevel: 'low' | 'medium' | 'high';
  };
  card: {
    bin: string;
    last4: string;
    type: 'visa' | 'mastercard' | 'amex' | 'discover';
    issuer: string;
    country: string;
  };
  merchant: {
    id: string;
    name: string;
    category: string;
    country: string;
    riskLevel: 'low' | 'medium' | 'high';
    mcc: string;
  };
  device: {
    fingerprint: string;
    ipAddress: string;
    userAgent: string;
    location: {
      country: string;
      city: string;
      coordinates: [number, number];
    };
  };
  riskAssessment: {
    overallScore: number;
    confidence: number;
    modelVersion: string;
    features: Array<{
      name: string;
      value: number | string;
      impact: number;
      description: string;
    }>;
  };
  rules: Array<{
    id: string;
    name: string;
    triggered: boolean;
    severity: 'low' | 'medium' | 'high';
  }>;
  notes: Array<{
    id: number;
    author: string;
    text: string;
    timestamp: string;
  }>;
  timeline: Array<{
    id: number;
    action: string;
    description: string;
    author: string;
    timestamp: string;
  }>;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'investigating' | 'closed' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  createdBy: string;
  transactionIds: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface FilterOptions {
  status?: string[];
  priority?: string[];
  assignedTo?: string[];
  merchantCategory?: string[];
  country?: string[];
  riskScoreMin?: number;
  riskScoreMax?: number;
  amountMin?: number;
  amountMax?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginationParams {
  cursor?: string;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    cursor: string | null;
    hasMore: boolean;
    total: number;
  };
}

// Mock data generators
const generateMockAlert = (): Alert => {
  const riskScore = faker.number.int({ min: 1, max: 100 });
  const amount = faker.number.float({ min: 10, max: 50000, precision: 0.01 });
  
  return {
    id: `ALT-${faker.string.alphanumeric(8).toUpperCase()}`,
    transactionId: `TXN-2024-${faker.string.numeric(6)}`,
    amount,
    currency: faker.helpers.arrayElement(['USD', 'EUR', 'GBP', 'CAD']),
    timestamp: faker.date.recent({ days: 7 }).toISOString(),
    merchantName: faker.company.name(),
    merchantId: `MRC-${faker.string.numeric(4)}`,
    merchantCategory: faker.helpers.arrayElement([
      'Online Retail', 'Gas Station', 'Restaurant', 'ATM', 'Grocery Store',
      'Electronics', 'Pharmacy', 'Hotel', 'Airlines', 'Insurance'
    ]),
    cardBin: faker.finance.creditCardNumber().substring(0, 6),
    cardLast4: faker.finance.creditCardNumber().slice(-4),
    customerId: `CUST-${faker.string.numeric(6)}`,
    riskScore,
    confidence: faker.number.float({ min: 0.5, max: 0.99, precision: 0.01 }),
    status: faker.helpers.arrayElement(['pending', 'investigating', 'flagged', 'approved', 'blocked']),
    priority: riskScore > 80 ? 'critical' : riskScore > 60 ? 'high' : riskScore > 40 ? 'medium' : 'low',
    assignedTo: faker.helpers.maybe(() => faker.person.fullName(), { probability: 0.7 }),
    country: faker.location.countryCode(),
    ipAddress: faker.internet.ip(),
    deviceFingerprint: `fp_${faker.string.alphanumeric(16)}`,
    ruleTriggers: faker.helpers.arrayElements([
      'HIGH_VALUE_TRANSACTION', 'VELOCITY_CHECK', 'GEOGRAPHIC_ANOMALY', 
      'DEVICE_RISK', 'MERCHANT_RISK', 'TIME_PATTERN'
    ], { min: 1, max: 3 }),
    createdAt: faker.date.recent({ days: 7 }).toISOString(),
    updatedAt: faker.date.recent({ days: 1 }).toISOString()
  };
};

const generateMockTransaction = (alertData?: Partial<Alert>): Transaction => {
  const baseAlert = alertData ? { ...generateMockAlert(), ...alertData } : generateMockAlert();
  
  return {
    ...baseAlert,
    customer: {
      id: baseAlert.customerId,
      email: `${faker.internet.userName()}@${faker.internet.domainName()}`,
      phone: faker.phone.number('+1-###-###-####'),
      accountAge: faker.number.int({ min: 30, max: 2000 }),
      verified: faker.datatype.boolean({ probability: 0.8 }),
      riskLevel: baseAlert.riskScore > 70 ? 'high' : baseAlert.riskScore > 40 ? 'medium' : 'low'
    },
    card: {
      bin: baseAlert.cardBin,
      last4: baseAlert.cardLast4,
      type: faker.helpers.arrayElement(['visa', 'mastercard', 'amex', 'discover']),
      issuer: faker.helpers.arrayElement(['Chase Bank', 'Wells Fargo', 'Bank of America', 'Citibank']),
      country: baseAlert.country
    },
    merchant: {
      id: baseAlert.merchantId,
      name: baseAlert.merchantName,
      category: baseAlert.merchantCategory,
      country: faker.location.countryCode(),
      riskLevel: faker.helpers.arrayElement(['low', 'medium', 'high']),
      mcc: faker.string.numeric(4)
    },
    device: {
      fingerprint: baseAlert.deviceFingerprint,
      ipAddress: baseAlert.ipAddress,
      userAgent: faker.internet.userAgent(),
      location: {
        country: faker.location.country(),
        city: faker.location.city(),
        coordinates: [faker.location.latitude(), faker.location.longitude()]
      }
    },
    riskAssessment: {
      overallScore: baseAlert.riskScore,
      confidence: baseAlert.confidence,
      modelVersion: `v${faker.system.semver()}`,
      features: [
        {
          name: 'Transaction Amount',
          value: baseAlert.amount,
          impact: faker.number.float({ min: 0.1, max: 0.4, precision: 0.01 }),
          description: 'Impact of transaction amount on risk assessment'
        },
        {
          name: 'Velocity Score',
          value: faker.number.float({ min: 0.1, max: 1.0, precision: 0.01 }),
          impact: faker.number.float({ min: 0.05, max: 0.3, precision: 0.01 }),
          description: 'Frequency and pattern of recent transactions'
        },
        {
          name: 'Geographic Risk',
          value: faker.number.float({ min: 0.1, max: 1.0, precision: 0.01 }),
          impact: faker.number.float({ min: -0.1, max: 0.2, precision: 0.01 }),
          description: 'Risk associated with transaction location'
        },
        {
          name: 'Device Risk',
          value: faker.number.float({ min: 0.1, max: 1.0, precision: 0.01 }),
          impact: faker.number.float({ min: -0.05, max: 0.15, precision: 0.01 }),
          description: 'Device fingerprint and behavioral analysis'
        },
        {
          name: 'Merchant Risk',
          value: faker.number.float({ min: 0.1, max: 1.0, precision: 0.01 }),
          impact: faker.number.float({ min: -0.05, max: 0.1, precision: 0.01 }),
          description: 'Historical risk associated with merchant'
        },
        {
          name: 'Time Pattern',
          value: faker.number.float({ min: 0.1, max: 1.0, precision: 0.01 }),
          impact: faker.number.float({ min: -0.1, max: 0.08, precision: 0.01 }),
          description: 'Temporal patterns and anomalies'
        }
      ]
    },
    rules: baseAlert.ruleTriggers.map(trigger => ({
      id: `RULE-${faker.string.numeric(3)}`,
      name: trigger.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
      triggered: true,
      severity: faker.helpers.arrayElement(['low', 'medium', 'high'])
    })),
    notes: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, (_, i) => ({
      id: i + 1,
      author: faker.person.fullName(),
      text: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
      timestamp: faker.date.recent({ days: 3 }).toISOString()
    })),
    timeline: Array.from({ length: faker.number.int({ min: 2, max: 8 }) }, (_, i) => ({
      id: i + 1,
      action: faker.helpers.arrayElement([
        'Transaction Detected', 'Risk Assessment Completed', 'Assigned to Analyst',
        'Customer Contacted', 'Additional Analysis', 'Status Updated'
      ]),
      description: faker.lorem.sentence(),
      author: faker.helpers.arrayElement(['System', faker.person.fullName()]),
      timestamp: faker.date.recent({ days: 2 }).toISOString()
    }))
  };
};

// Mock API functions with realistic delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockApiService {
  private alerts: Alert[] = [];
  private transactions: Map<string, Transaction> = new Map();
  private cases: Case[] = [];

  constructor() {
    // Generate initial mock data
    this.alerts = Array.from({ length: 1000 }, () => generateMockAlert());
    this.alerts.forEach(alert => {
      this.transactions.set(alert.id, generateMockTransaction(alert));
    });
  }

  // KPI endpoints
  async getKPIs(params?: { from?: string; to?: string }): Promise<ApiResponse<KPIData>> {
    await delay(faker.number.int({ min: 200, max: 800 }));
    
    const now = new Date();
    const kpiData: KPIData = {
      totalAlerts: faker.number.int({ min: 800, max: 1500 }),
      confirmedFraud: faker.number.int({ min: 50, max: 150 }),
      falsePositives: faker.number.int({ min: 100, max: 300 }),
      avgResponseTime: faker.number.float({ min: 2.5, max: 8.5, precision: 0.1 }),
      fraudRate: faker.number.float({ min: 0.05, max: 0.12, precision: 0.001 }),
      blockedAmount: faker.number.int({ min: 1000000, max: 5000000 }),
      timestamp: now.toISOString()
    };

    return {
      data: kpiData,
      success: true
    };
  }

  // Alert endpoints
  async getAlerts(
    filters?: FilterOptions,
    pagination?: PaginationParams
  ): Promise<ApiResponse<Alert[]>> {
    await delay(faker.number.int({ min: 300, max: 1000 }));

    let filteredAlerts = [...this.alerts];

    // Apply filters
    if (filters) {
      if (filters.status && filters.status.length > 0) {
        filteredAlerts = filteredAlerts.filter(alert => 
          filters.status!.includes(alert.status)
        );
      }
      if (filters.priority && filters.priority.length > 0) {
        filteredAlerts = filteredAlerts.filter(alert => 
          filters.priority!.includes(alert.priority)
        );
      }
      if (filters.riskScoreMin !== undefined) {
        filteredAlerts = filteredAlerts.filter(alert => 
          alert.riskScore >= filters.riskScoreMin!
        );
      }
      if (filters.riskScoreMax !== undefined) {
        filteredAlerts = filteredAlerts.filter(alert => 
          alert.riskScore <= filters.riskScoreMax!
        );
      }
    }

    // Apply sorting
    const sortBy = pagination?.sortBy || 'timestamp';
    const sortOrder = pagination?.sortOrder || 'desc';
    filteredAlerts.sort((a, b) => {
      const aVal = a[sortBy as keyof Alert];
      const bVal = b[sortBy as keyof Alert];
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Apply pagination
    const limit = pagination?.limit || 50;
    const startIndex = pagination?.cursor ? 
      filteredAlerts.findIndex(alert => alert.id === pagination.cursor) + 1 : 0;
    const paginatedAlerts = filteredAlerts.slice(startIndex, startIndex + limit);
    const hasMore = startIndex + limit < filteredAlerts.length;

    return {
      data: paginatedAlerts,
      success: true,
      pagination: {
        cursor: hasMore ? paginatedAlerts[paginatedAlerts.length - 1].id : null,
        hasMore,
        total: filteredAlerts.length
      }
    };
  }

  async getAlert(id: string): Promise<ApiResponse<Transaction>> {
    await delay(faker.number.int({ min: 200, max: 600 }));

    const transaction = this.transactions.get(id);
    if (!transaction) {
      return {
        data: null as any,
        success: false,
        message: 'Transaction not found'
      };
    }

    return {
      data: transaction,
      success: true
    };
  }

  // Action endpoints
  async executeAction(
    alertId: string, 
    action: 'flag' | 'block' | 'approve' | 'assign' | 'escalate' | 'refund',
    payload?: { note?: string; assignee?: string }
  ): Promise<ApiResponse<{ success: boolean; auditId: string }>> {
    await delay(faker.number.int({ min: 500, max: 1500 }));

    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) {
      return {
        data: null as any,
        success: false,
        message: 'Alert not found'
      };
    }

    // Update alert status based on action
    switch (action) {
      case 'flag':
        alert.status = 'flagged';
        break;
      case 'block':
        alert.status = 'blocked';
        break;
      case 'approve':
        alert.status = 'approved';
        break;
      case 'assign':
        alert.assignedTo = payload?.assignee || null;
        alert.status = 'investigating';
        break;
    }

    alert.updatedAt = new Date().toISOString();

    // Add to transaction notes and timeline
    const transaction = this.transactions.get(alertId);
    if (transaction) {
      const note = {
        id: transaction.notes.length + 1,
        author: 'Current User',
        text: payload?.note || `Action: ${action}`,
        timestamp: new Date().toISOString()
      };
      transaction.notes.unshift(note);

      const timelineEntry = {
        id: transaction.timeline.length + 1,
        action: action.charAt(0).toUpperCase() + action.slice(1),
        description: payload?.note || `Transaction ${action}ed`,
        author: 'Current User',
        timestamp: new Date().toISOString()
      };
      transaction.timeline.unshift(timelineEntry);
    }

    return {
      data: {
        success: true,
        auditId: `AUD-${faker.string.alphanumeric(8).toUpperCase()}`
      },
      success: true
    };
  }

  // Case management endpoints
  async getCases(filters?: FilterOptions): Promise<ApiResponse<Case[]>> {
    await delay(faker.number.int({ min: 400, max: 1000 }));
    
    return {
      data: this.cases,
      success: true
    };
  }

  async createCase(caseData: Partial<Case>): Promise<ApiResponse<Case>> {
    await delay(faker.number.int({ min: 600, max: 1200 }));

    const newCase: Case = {
      id: `CASE-${faker.string.alphanumeric(8).toUpperCase()}`,
      title: caseData.title || 'New Investigation Case',
      description: caseData.description || '',
      status: 'open',
      priority: caseData.priority || 'medium',
      assignedTo: caseData.assignedTo || 'Unassigned',
      createdBy: 'Current User',
      transactionIds: caseData.transactionIds || [],
      tags: caseData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.cases.unshift(newCase);

    return {
      data: newCase,
      success: true
    };
  }

  // WebSocket simulation
  simulateWebSocketUpdates(callback: (alert: Alert) => void): () => void {
    const interval = setInterval(() => {
      const newAlert = generateMockAlert();
      this.alerts.unshift(newAlert);
      this.transactions.set(newAlert.id, generateMockTransaction(newAlert));
      callback(newAlert);
    }, faker.number.int({ min: 10000, max: 60000 })); // Every 10-60 seconds

    return () => clearInterval(interval);
  }
}

export const mockApiService = new MockApiService();
export default mockApiService;