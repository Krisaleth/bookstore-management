# Bookstore Frontend

A modern Next.js frontend application for the Bookstore Backend API.

## Features

- **User Authentication**: Login and registration with JWT
- **Book Browsing**: Browse books by category, author, or search
- **Shopping Cart**: Add items to cart and checkout
- **Order Management**: View and track orders
- **Admin Panel**: Manage books, authors, categories, and users (admin only)
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Built with Tailwind CSS and Lucide icons

## Technology Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **js-cookie** - Cookie management

## Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running (see main README)

## Setup Instructions

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   # or
   yarn install
   ```

2. **Configure environment variables:**
   Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin pages
│   ├── authors/           # Author pages
│   ├── books/             # Book pages
│   ├── cart/              # Shopping cart
│   ├── categories/        # Category pages
│   ├── login/             # Login page
│   ├── orders/            # Order pages
│   ├── register/          # Registration page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── BookCard.tsx      # Book card component
│   └── Navbar.tsx        # Navigation bar
├── contexts/            # React contexts
│   ├── AuthContext.tsx   # Authentication context
│   └── CartContext.tsx   # Shopping cart context
├── lib/                  # Utilities and API client
│   ├── api.ts            # API client
│   └── auth.ts            # Authentication utilities
└── package.json          # Dependencies
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features Overview

### Public Pages
- **Home** (`/`) - Featured books and homepage
- **Books** (`/books`) - Browse all books with search
- **Book Detail** (`/books/[id]`) - View book details
- **Authors** (`/authors`) - Browse authors
- **Author Detail** (`/authors/[id]`) - View author and their books
- **Categories** (`/categories`) - Browse categories
- **Category Detail** (`/categories/[id]`) - View category and books

### Authenticated Pages
- **Cart** (`/cart`) - Shopping cart and checkout
- **Orders** (`/orders`) - List of user orders
- **Order Detail** (`/orders/[id]`) - Order details

### Admin Pages
- **Admin Panel** (`/admin`) - Admin dashboard
- **Manage Books** (`/admin/books`) - CRUD operations for books
- **Manage Authors** (`/admin/authors`) - CRUD operations for authors
- **Manage Categories** (`/admin/categories`) - CRUD operations for categories
- **Manage Users** (`/admin/users`) - User management

## API Integration

The frontend communicates with the backend API through the `lib/api.ts` file. All API calls are configured to:
- Include JWT tokens in requests automatically
- Handle authentication errors
- Redirect to login on 401 errors

## Authentication

Authentication is handled through:
- JWT tokens stored in cookies
- AuthContext for global auth state
- Protected routes using client-side checks

## Shopping Cart

The shopping cart uses:
- LocalStorage for persistence
- CartContext for global cart state
- Automatic stock validation

## Styling

The application uses Tailwind CSS with:
- Custom color scheme (primary colors)
- Responsive design
- Utility classes for common patterns

## Building for Production

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm run start
   ```

3. **Deploy:**
   - The application can be deployed to Vercel, Netlify, or any Node.js hosting
   - Make sure to set `NEXT_PUBLIC_API_URL` environment variable

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8080)

## Troubleshooting

### API Connection Issues
- Verify the backend is running
- Check `NEXT_PUBLIC_API_URL` environment variable
- Check CORS settings on the backend

### Authentication Issues
- Clear cookies and try logging in again
- Check browser console for errors
- Verify JWT token is being stored

### Build Issues
- Delete `.next` folder and rebuild
- Clear `node_modules` and reinstall dependencies

## License

This project is part of the Bookstore application.

