# FraudX - Credit Card Fraud Detection Frontend

A production-ready, highly polished frontend for credit card fraud detection and investigation. Built with React, TypeScript, and modern enterprise-grade tooling.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Start the mock API server (in another terminal)
npm run mock-server

# Run tests
npm test

# Run e2e tests
npm run test:e2e

# Build for production
npm run build
```

## 📁 Project Structure

```
fraudx-frontend/
├── public/                     # Static assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components (Button, Input, etc.)
│   │   ├── charts/           # Chart wrappers and visualizations
│   │   ├── data-table/       # Virtualized table components
│   │   ├── explainability/   # Model explanation components
│   │   └── layout/           # Layout components (Sidebar, Header)
│   ├── pages/                # Page components
│   │   ├── Dashboard.tsx     # Global dashboard with KPIs
│   │   ├── AlertsQueue.tsx   # Alerts triage queue
│   │   ├── Investigator.tsx  # Single transaction investigator
│   │   ├── CaseManagement.tsx # Case management system
│   │   ├── RulesEditor.tsx   # Rules and thresholds editor
│   │   ├── ModelInsights.tsx # Model insights and explainability
│   │   ├── Admin.tsx         # Admin panel
│   │   └── Settings.tsx      # User settings
│   ├── hooks/                # Custom React hooks
│   ├── services/             # API services and data fetching
│   ├── store/                # Zustand stores for local state
│   ├── utils/                # Utility functions
│   ├── types/                # TypeScript type definitions
│   └── styles/               # Global styles and Tailwind config
├── design/
│   ├── tokens.json           # Design system tokens
│   └── figma-spec.md         # Design specifications
├── mocks/
│   ├── server.js             # Mock API server
│   └── data/                 # Sample data files
├── tests/
│   ├── e2e/                  # Playwright e2e tests
│   └── __tests__/            # Unit tests
└── docs/                     # Additional documentation
```

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS with design tokens
- **State Management**: React Query (server state) + Zustand (local state)
- **Charts**: Recharts with custom wrappers
- **Tables**: TanStack Table with virtualization
- **Real-time**: WebSocket mock implementation
- **Animation**: Framer Motion
- **Testing**: Playwright (e2e) + Jest + React Testing Library
- **Build**: Vite for fast development and optimized builds

## 🎨 Design System

The design system is built around professional, enterprise-grade aesthetics with:

- **Color Palette**: Neutral grays + brand blue + semantic colors (warning, danger, success)
- **Typography**: Clean, readable font scale optimized for data-heavy interfaces
- **Spacing**: Consistent 8px base unit system
- **Components**: Accessible, keyboard-navigable, WCAG AA compliant

See `design/tokens.json` for complete design token definitions.

## 📊 Key Features

### Global Dashboard
- Real-time KPI monitoring (fraud rate, response time, alert volume)
- Live alerts feed with WebSocket updates
- Interactive trend charts and merchant heatmaps
- Risk score distributions and model performance metrics

### Alerts Triage Queue
- Virtualized table handling 10,000+ alerts
- Smart sorting by risk score, confidence, and recency
- Advanced filtering (merchant, geography, card type, amount ranges)
- Bulk operations with progress tracking
- Keyboard-first triage workflow

### Transaction Investigator
- Detailed transaction analysis with risk scoring
- SHAP-like model explainability with waterfall charts
- Customer transaction history and behavior patterns
- Device fingerprinting and geolocation analysis
- One-click actions (flag, block, refund, escalate)
- Comprehensive audit trail

### Case Management
- Link related transactions into investigations
- Collaborative case assignment and escalation
- Evidence attachment and documentation
- Case timeline and status tracking
- Exportable case reports (PDF)

### Model Explainability
- SHAP-style feature contribution analysis
- Interactive waterfall charts showing decision factors
- Plain-English explanations of model decisions
- Model version tracking and provenance
- Feature importance ranking

## 🔒 Security & Compliance

- **Authentication**: SSO-ready with OIDC/SAML hooks
- **Authorization**: Role-based access control (Analyst, Manager, Admin)
- **Audit Trail**: Complete logging of all user actions
- **Data Privacy**: GDPR-compliant data retention controls
- **Security Headers**: CSP, XSS protection, secure defaults
- **Session Management**: Automatic timeout and secure session handling

## 🚦 API Integration

The frontend is designed to work with RESTful APIs and WebSocket connections:

### Key Endpoints
- `GET /api/kpis` - Dashboard KPIs and metrics
- `GET /api/alerts` - Paginated alerts with filtering
- `GET /api/alerts/:id` - Detailed transaction with model explanation
- `POST /api/cases` - Case creation and management
- `POST /api/alerts/:id/actions` - User actions (flag, block, etc.)
- `WS /ws/alerts` - Real-time alert notifications

See `mocks/server.js` for complete API contract examples.

## 📱 Responsive Design

- **Desktop-first**: Optimized for large screens and multiple monitors
- **Tablet**: Condensed layouts with touch-friendly interactions
- **Mobile**: Essential features accessible on mobile devices
- **Progressive Enhancement**: Core functionality works without JavaScript

## ♿ Accessibility

- WCAG AA compliance with comprehensive screen reader support
- Full keyboard navigation with logical tab order
- High contrast mode support
- Semantic HTML structure
- ARIA labels and descriptions for complex interactions

## 🌍 Internationalization

- React-i18next integration ready
- Locale-aware number and date formatting
- RTL language support structure
- Extractable translation strings

## ⚡ Performance

- **Code Splitting**: Route-based and component-based lazy loading
- **Virtual Scrolling**: Efficient rendering of large datasets
- **Optimistic Updates**: Immediate UI feedback for user actions
- **Caching Strategy**: Intelligent data caching with React Query
- **Bundle Optimization**: Tree-shaking and dynamic imports

## 🧪 Testing Strategy

### Unit Tests (Jest + React Testing Library)
- Component behavior testing
- Hook testing with custom testing utilities
- Service layer testing with mocked APIs
- Accessibility testing with jest-axe

### E2E Tests (Playwright)
- Complete user workflows
- Cross-browser compatibility
- Performance regression testing
- Accessibility compliance verification

## 📦 Deployment

### Static Hosting (Recommended)
```bash
npm run build
# Deploy dist/ to Vercel, Netlify, or S3 + CloudFront
```

### Docker Deployment
```bash
docker build -t fraudx-frontend .
docker run -p 3000:3000 fraudx-frontend
```

### Environment Variables
```bash
VITE_API_BASE_URL=https://api.fraudx.com
VITE_WS_URL=wss://ws.fraudx.com
VITE_SENTRY_DSN=your-sentry-dsn
VITE_ENVIRONMENT=production
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with HMR
- `npm run build` - Production build with optimizations
- `npm run preview` - Preview production build locally
- `npm run test` - Run unit tests with coverage
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - ESLint code quality checks
- `npm run type-check` - TypeScript type checking
- `npm run storybook` - Start Storybook component explorer

### Code Quality
- **ESLint**: Airbnb configuration with TypeScript support
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality gates
- **TypeScript**: Strict mode with comprehensive type coverage

## 📈 Analytics Integration

Ready for analytics platforms with suggested event naming:
- `fraudx.alert.view` - Alert detail viewed
- `fraudx.alert.action` - Action taken on alert
- `fraudx.case.create` - New case created
- `fraudx.dashboard.filter` - Dashboard filters applied
- `fraudx.export.request` - Data export initiated

## 🎬 Demo Script

For executive demonstrations:
1. **Dashboard Overview** (30s) - Show real-time metrics and alert feed
2. **Alert Investigation** (60s) - Drill into high-risk transaction with explainability
3. **Quick Action** (15s) - Demonstrate one-click block/flag with audit trail
4. **Case Management** (30s) - Show collaborative investigation features
5. **Model Insights** (45s) - Explain AI decision-making transparency

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🆘 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

---

Built with ❤️ for enterprise fraud detection teams.