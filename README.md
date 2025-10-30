# Allocat ERP Frontend - Vue 3

A modern business management system built with Vue 3, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Vue 3** with Composition API and TypeScript
- **Pinia** for state management
- **Vue Router 4** for routing
- **Tailwind CSS** for styling
- **Vite** for fast development and building
- **Authentication** with JWT tokens
- **Role-based access control**
- **Responsive design** with dark mode support
- **Internationalization** ready

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment files:
```bash
# Copy environment template
cp src/environments/index.ts src/environments/.env.local
```

3. Update environment variables in `.env.local`:
```env
VITE_API_URL=http://localhost:3000/api
```

## 🚀 Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:4200`.

## 🏗️ Building

Build for production:

```bash
npm run build
```

Build for staging:

```bash
npm run build:staging
```

## 🧪 Testing

Run unit tests:

```bash
npm run test
```

Run tests with coverage:

```bash
npm run test:coverage
```

Run E2E tests:

```bash
npm run test:e2e
```

## 📁 Project Structure

```
src/
├── assets/           # Static assets
│   ├── styles/       # Global styles
│   └── images/       # Images
├── core/             # Core functionality
│   ├── stores/       # Pinia stores
│   ├── services/     # API services
│   └── types/        # TypeScript types
├── features/         # Feature modules
│   ├── auth/         # Authentication
│   ├── dashboard/    # Dashboard
│   ├── products/     # Product management
│   ├── inventory/   # Inventory management
│   ├── pos/          # Point of sale
│   ├── purchases/    # Purchase management
│   ├── customers/    # Customer management
│   ├── reports/      # Reports
│   └── admin/        # Administration
├── layouts/          # Layout components
│   └── components/   # Layout-specific components
├── router/           # Vue Router configuration
└── environments/     # Environment configurations
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The design system includes:

- **Colors**: Primary, secondary, success, warning, error, and info variants
- **Typography**: Inter font family with multiple weights
- **Components**: Pre-built component classes
- **Dark mode**: Automatic dark mode support
- **Responsive**: Mobile-first responsive design

## 🔐 Authentication

The application uses JWT-based authentication with:

- **Login/Logout** functionality
- **Token refresh** mechanism
- **Role-based access control**
- **Route guards** for protected routes
- **User preferences** management

## 🌐 Internationalization

The application is ready for internationalization with Vue I18n:

- **English** (default)
- **Spanish** (configured)
- **Easy to add** more languages

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile-first** approach
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly** interface
- **Progressive enhancement**

## 🚀 Deployment

### Environment Variables

Set the following environment variables:

```env
VITE_API_URL=https://api.allocat.com/api
VITE_APP_NAME=Allocat ERP
VITE_APP_VERSION=1.0.0
```

### Build Commands

```bash
# Development build
npm run build

# Staging build
npm run build:staging

# Production build
npm run build:prod
```

## 🔧 Configuration

### Vite Configuration

The project uses Vite with the following plugins:

- **@vitejs/plugin-vue**: Vue 3 support
- **TypeScript**: Full TypeScript support
- **Path aliases**: Configured for easy imports

### Tailwind Configuration

Tailwind is configured with:

- **Custom colors**: Primary and gray palettes
- **Custom fonts**: Inter font family
- **Custom animations**: Fade, slide, and bounce effects
- **Dark mode**: Class-based dark mode

## 📚 API Integration

The application integrates with a REST API:

- **Base URL**: Configurable via environment variables
- **Authentication**: JWT token-based
- **Error handling**: Global error handling
- **Loading states**: Automatic loading management
- **Request/Response interceptors**: Automatic token handling

## 🧩 State Management

State is managed with Pinia stores:

- **Auth Store**: User authentication and permissions
- **Theme Store**: Theme and UI preferences
- **Loading Store**: Global loading states
- **Notification Store**: Toast notifications

## 🎯 Features

### Dashboard
- **Overview statistics**
- **Recent activity**
- **Quick actions**
- **Charts and graphs**

### Point of Sale
- **Product selection**
- **Cart management**
- **Payment processing**
- **Receipt generation**

### Product Management
- **Product catalog**
- **Categories**
- **Pricing management**
- **Image uploads**

### Inventory Management
- **Stock tracking**
- **Low stock alerts**
- **Inventory reports**
- **Barcode scanning**

### Customer Management
- **Customer database**
- **Contact information**
- **Purchase history**
- **Customer groups**

### Reports
- **Sales reports**
- **Inventory reports**
- **Customer reports**
- **Financial reports**

### Administration
- **User management**
- **Role management**
- **System settings**
- **Backup and restore**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.