# Quality Audit System - Frontend

A modern, scalable Next.js application for automated document verification and compliance checking. This is a complete rewrite of the legacy HTML/CSS/JavaScript frontend using React, TypeScript, and Tailwind CSS.

## 🎯 Features

- **Multi-Document Audit**: Upload and validate up to 4 documents (CE1, CE2, CE3, RW)
- **Source Comparison**: Compare two document sources with individual validations
- **Academic Qualification Auditor**: Verify CPD against CV records
- **13 Validation Tasks**:
  - Grammar Check
  - Title Validation
  - Section Validation
  - Format Comparison
  - Google Validation
  - Visual Validation
  - AI Math Validation
  - Reference Validation
  - Code Validation
  - Accessibility Validation
  - Figure Placement
  - Title Comparison
  - Visual Comparison

- **Report Generation**: Generate detailed audit reports for each document
- **File Type Support**: PDF and DOCX formats
- **Responsive Design**: Mobile-friendly interface
- **Real-time Status**: Visual feedback for upload and processing status

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher
- **Git**: For version control

### Installation

```bash
# Clone or navigate to the project
cd nextjs-frontend

# Install dependencies
npm install

# Create environment file
cp env.example .env.local

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout component
│   ├── page.tsx             # Home/Main audit page
│   ├── globals.css          # Global styles
│   ├── comparison/
│   │   └── page.tsx         # Source comparison page
│   └── cpd-cv/
│       └── page.tsx         # CPD CV comparison page
├── components/              # React components
│   ├── common/             # Reusable shared components
│   │   ├── Header.tsx
│   │   ├── FileTypeToggle.tsx
│   │   └── FileUpload.tsx
│   └── audit/              # Feature-specific components
│       ├── UploadSection.tsx
│       └── ResultsTable.tsx
├── config/                 # Configuration
│   └── api.ts             # API endpoints
├── hooks/                 # Custom React hooks
│   └── useAuditStore.ts  # Global state with Zustand
├── services/              # Business logic
│   └── api.service.ts    # API communication layer
├── types/                 # TypeScript definitions
│   └── index.ts          # All type definitions
└── utils/                # Utility functions
```

## 🎨 Pages

### Home Page (`/`)
Main audit interface for validating multiple documents.
- Upload 4 documents (CE1, CE2, CE3, RW)
- Run 13 different validation tasks
- View results in a comprehensive table
- Generate individual reports

### Comparison Page (`/comparison`)
Compare two document sources side-by-side.
- Upload "Our Source" and "Client Source"
- Run individual validations on each file
- Run comparison validations
- View results for both sources

### CPD CV Page (`/cpd-cv`)
Verify CPD entries against CV records.
- Upload CV document
- Upload CPD document
- Run verification
- View detailed verification results

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```env
# API Base URL (Required)
NEXT_PUBLIC_API_URL=https://quality-audit-api-production.up.railway.app/api/documents

# Application Settings (Optional)
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=Quality Audit System
NEXT_PUBLIC_APP_VERSION=1.0.0
```

See `env.example` for all available options.

## 📦 Dependencies

### Production
- **next**: ^16.1.1 - React framework
- **react**: ^19.2.3 - UI library
- **react-dom**: ^19.2.3 - React DOM
- **axios**: ^1.6.0 - HTTP client
- **zustand**: ^4.4.0 - State management
- **clsx**: ^2.0.0 - Utility for className

### Development
- **tailwindcss**: ^4 - Utility-first CSS
- **@tailwindcss/postcss**: ^4 - Tailwind PostCSS plugin
- **typescript**: ^5 - Type checking
- **eslint**: ^9 - Code linting
- **eslint-config-next**: Latest - Next.js ESLint config

## 🏃 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix
```

## 🎯 Architecture

### State Management
Global state is managed using **Zustand** in `src/hooks/useAuditStore.ts`:
- Current file type (PDF/DOCX)
- Uploaded files
- Validation results
- Loading and error states

```typescript
const { files, results, setFile, setResult } = useAuditStore();
```

### API Service
Centralized API communication in `src/services/api.service.ts`:
- Single axios instance
- Error handling
- Task endpoint mapping
- Report generation

```typescript
await apiService.runValidationTask(file, taskId, fileType);
```

### Components
All components are:
- **Functional**: React functional components
- **Type-safe**: Full TypeScript coverage
- **Reusable**: Designed for composition
- **Styled**: Using Tailwind CSS

## 🎨 Styling

### Tailwind CSS
All styling uses Tailwind CSS utility classes. Benefits:
- No CSS file bloat
- Consistent design tokens
- Rapid development
- Responsive design built-in

### Custom Animations
Defined in `src/app/globals.css`:
- `animate-spin`: Loading spinner
- `animate-fade-in`: Fade in animation
- `animate-slide-up`: Slide up animation

## 🔒 Security

- Environment variables for sensitive config
- No sensitive data in code
- Input validation on client and server
- CORS handled by backend API
- Type safety reduces runtime errors

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

### Railway, AWS Amplify, Netlify
See deployment provider documentation.

## 🐛 Troubleshooting

### Port Already in Use
```bash
npm run dev -- -p 3001
```

### API Connection Issues
1. Check `NEXT_PUBLIC_API_URL` in `.env.local`
2. Verify backend is running
3. Check browser console for CORS errors

### Build Failures
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Type Errors
```bash
npm run lint -- --fix
npx tsc --noEmit
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 🔄 Migration from Old Frontend

This is a complete rewrite from the legacy HTML/CSS/JavaScript frontend. See `MIGRATION_GUIDE.md` for:
- Detailed architecture changes
- Component mapping
- Feature comparison
- Performance improvements

## 📝 License

This project is part of the Quality Audit System. All rights reserved.

## 👥 Support

For issues or questions:
1. Check the MIGRATION_GUIDE.md
2. Review component source code
3. Check API service implementation
4. Verify environment configuration

---

**Built with ❤️ using Next.js, React, and TypeScript**
