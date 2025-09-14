// Mock API Server for FraudX Frontend
const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const { faker } = require('@faker-js/faker');

const app = express();
const PORT = process.env.PORT || 3001;
const WS_PORT = process.env.WS_PORT || 3002;

app.use(cors());
app.use(express.json());

// Mock data
const generateAlert = () => ({
  id: `ALT-${faker.string.alphanumeric(8).toUpperCase()}`,
  transactionId: `TXN-2024-${faker.string.numeric(6)}`,
  amount: faker.number.float({ min: 10, max: 50000, precision: 0.01 }),
  currency: 'USD',
  merchantName: faker.company.name(),
  riskScore: faker.number.int({ min: 60, max: 100 }),
  status: faker.helpers.arrayElement(['pending', 'investigating', 'flagged']),
  timestamp: new Date().toISOString(),
  country: faker.location.countryCode()
});

const alerts = Array.from({ length: 100 }, generateAlert);

// API Routes
app.get('/api/kpis', (req, res) => {
  setTimeout(() => {
    res.json({
      success: true,
      data: {
        totalAlerts: 1247,
        confirmedFraud: 89,
        falsePositives: 156,
        avgResponseTime: 4.2,
        fraudRate: 0.071,
        blockedAmount: 2847392,
        timestamp: new Date().toISOString()
      }
    });
  }, 300);
});

app.get('/api/alerts', (req, res) => {
  const { limit = 50, cursor, sortBy = 'timestamp' } = req.query;
  
  setTimeout(() => {
    const startIndex = cursor ? alerts.findIndex(a => a.id === cursor) + 1 : 0;
    const paginatedAlerts = alerts.slice(startIndex, startIndex + parseInt(limit));
    
    res.json({
      success: true,
      data: paginatedAlerts,
      pagination: {
        cursor: paginatedAlerts.length > 0 ? paginatedAlerts[paginatedAlerts.length - 1].id : null,
        hasMore: startIndex + parseInt(limit) < alerts.length,
        total: alerts.length
      }
    });
  }, 400);
});

app.get('/api/alerts/:id', (req, res) => {
  const { id } = req.params;
  
  setTimeout(() => {
    const alert = alerts.find(a => a.id === id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    // Generate full transaction details
    const transaction = {
      ...alert,
      customer: {
        id: `CUST-${faker.string.numeric(6)}`,
        email: `${faker.internet.userName()}@example.com`,
        verified: true,
        accountAge: 847
      },
      card: {
        bin: '424242',
        last4: '4242',
        type: 'visa',
        issuer: 'Chase Bank'
      },
      device: {
        fingerprint: `fp_${faker.string.alphanumeric(16)}`,
        ipAddress: faker.internet.ip(),
        location: {
          country: 'United States',
          city: faker.location.city(),
          coordinates: [faker.location.latitude(), faker.location.longitude()]
        }
      },
      riskAssessment: {
        overallScore: alert.riskScore,
        confidence: 0.89,
        modelVersion: 'v2.4.1',
        features: [
          { name: 'Transaction Amount', value: alert.amount, impact: 0.32, description: 'High-value transaction' },
          { name: 'Velocity Score', value: 0.87, impact: 0.28, description: 'Multiple transactions detected' },
          { name: 'Geographic Risk', value: 0.45, impact: 0.15, description: 'Transaction from new location' }
        ]
      },
      rules: [
        { id: 'RULE-001', name: 'High Value Transaction', triggered: true, severity: 'high' },
        { id: 'RULE-003', name: 'Velocity Check Failed', triggered: true, severity: 'medium' }
      ],
      notes: [
        { id: 1, author: 'Sarah Chen', text: 'Customer contacted via email', timestamp: new Date().toISOString() }
      ]
    };

    res.json({
      success: true,
      data: transaction
    });
  }, 500);
});

app.post('/api/alerts/:id/actions', (req, res) => {
  const { id } = req.params;
  const { action, note } = req.body;
  
  setTimeout(() => {
    const alert = alerts.find(a => a.id === id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    // Update alert status
    if (action === 'flag') alert.status = 'flagged';
    else if (action === 'block') alert.status = 'blocked';
    else if (action === 'approve') alert.status = 'approved';

    res.json({
      success: true,
      data: {
        success: true,
        auditId: `AUD-${faker.string.alphanumeric(8).toUpperCase()}`
      }
    });
  }, 800);
});

app.post('/api/cases', (req, res) => {
  setTimeout(() => {
    const newCase = {
      id: `CASE-${faker.string.alphanumeric(8).toUpperCase()}`,
      title: req.body.title || 'New Investigation',
      status: 'open',
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: newCase
    });
  }, 600);
});

// Start HTTP server
app.listen(PORT, () => {
  console.log(`🚀 Mock API server running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   GET  /api/kpis`);
  console.log(`   GET  /api/alerts`);
  console.log(`   GET  /api/alerts/:id`);
  console.log(`   POST /api/alerts/:id/actions`);
  console.log(`   POST /api/cases`);
});

// WebSocket server for real-time alerts
const wss = new WebSocketServer({ port: WS_PORT });

wss.on('connection', (ws) => {
  console.log('🔌 WebSocket client connected');
  
  // Send new alerts every 30 seconds
  const interval = setInterval(() => {
    const newAlert = generateAlert();
    alerts.unshift(newAlert);
    
    ws.send(JSON.stringify({
      type: 'new_alert',
      data: newAlert
    }));
  }, 30000);

  ws.on('close', () => {
    console.log('🔌 WebSocket client disconnected');
    clearInterval(interval);
  });
});

console.log(`🔌 WebSocket server running on ws://localhost:${WS_PORT}`);