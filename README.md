# Sarana Notes - Frontend

A modern note-taking application built with Next.js 15, TypeScript, and Tailwind CSS. This frontend integrates with the Notes API backend for user authentication and note management.

## Features

- **User Authentication**: Sign up, login, logout with JWT tokens
- **Note Management**: Create, read, update, delete notes
- **Search**: Search notes by title and content
- **Image Upload**: Upload images to notes
- **Pagination**: Paginated note listing
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: React Query for optimistic updates and caching

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (@tanstack/react-query)
- **HTTP Client**: Axios
- **Authentication**: JWT tokens stored in cookies (universal-cookie)
- **Icons**: Lucide React
- **UI Components**: Headless UI

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   ├── signup/            # Registration page
│   ├── notes/             # Notes dashboard
│   ├── layout.tsx         # Root layout with QueryProvider
│   └── page.tsx           # Root page (redirects based on auth)
├── components/
│   └── AuthGuard.tsx      # Authentication middleware
├── hooks/                 # React Query custom hooks
│   ├── useAuth.ts         # Authentication hooks
│   ├── useNotes.ts        # Notes management hooks
│   └── useUser.ts         # User profile hooks
├── interfaces/            # TypeScript interfaces
│   ├── auth.ts            # Authentication types
│   ├── note.ts            # Note types
│   └── user.ts            # User types
├── providers/
│   └── QueryProvider.tsx  # React Query client provider
└── services/              # API services
    ├── api/
    │   ├── axiosClient.ts  # Configured Axios instance
    │   └── index.ts        # API exports
    └── modules/
        ├── authService.ts  # Authentication API calls
        ├── noteService.ts  # Notes API calls
        └── userService.ts  # User API calls
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# Security Configuration
NEXT_PUBLIC_SECURE_COOKIES=false
```

## Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:

   ```bash
   cp .env.example .env.local
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000`

## API Integration

The frontend integrates with the Notes API backend with the following endpoints:

### Authentication

- `POST /v1/auth/register` - User registration
- `POST /v1/auth/login` - User login

### Notes

- `GET /v1/notes` - Get paginated notes with search
- `POST /v1/notes` - Create new note
- `GET /v1/notes/{id}` - Get specific note
- `PATCH /v1/notes/{id}` - Update note
- `DELETE /v1/notes/{id}` - Delete note
- `POST /v1/notes/{id}/images` - Upload image to note

## Features Implemented

### Authentication System

- JWT token management with secure cookies
- Automatic token refresh handling
- Route protection with AuthGuard component
- Redirect logic based on authentication status

### Notes Management

- **CRUD Operations**: Full create, read, update, delete functionality
- **Search**: Real-time search across note titles and content
- **Pagination**: Efficient pagination with page navigation
- **Image Upload**: Support for JPEG, PNG, WebP images up to 5MB
- **Optimistic Updates**: Immediate UI updates with React Query

### User Experience

- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Proper loading indicators for all operations
- **Error Handling**: User-friendly error messages
- **Form Validation**: Client-side validation for forms
- **Modal Interfaces**: Clean modal dialogs for create/edit/preview

## React Query Implementation

The app uses React Query for efficient data management:

- **Caching**: Automatic caching of API responses
- **Background Updates**: Automatic refetching on window focus
- **Optimistic Updates**: Immediate UI updates before server confirmation
- **Error Boundaries**: Proper error handling and retry logic
- **Pagination**: Smart pagination with cache management

## Security Features

- **JWT Token Management**: Secure token storage in httpOnly cookies
- **Automatic Logout**: Logout on token expiration (401 responses)
- **Route Protection**: Authentication guards on protected routes
- **CSRF Protection**: Secure cookie configuration
- **Input Validation**: Client-side validation for all forms

## Development

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Style

The project follows these conventions:

- TypeScript strict mode
- ESLint with Next.js configuration
- Tailwind CSS for styling
- Component-based architecture
- Custom hooks for reusable logic

## Deployment

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Set production environment variables**:

   ```env
   NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
   NEXT_PUBLIC_SECURE_COOKIES=true
   ```

3. **Deploy to your preferred platform** (Vercel, Netlify, etc.)

## API Service Architecture

### AxiosClient

- Centralized HTTP client configuration
- Automatic Bearer token injection
- Global error handling
- Request/response interceptors

### Service Modules

- **AuthService**: Authentication operations
- **NoteService**: Note CRUD operations
- **UserService**: User profile management

### React Query Hooks

- **useAuth**: Login, logout, registration
- **useNotes**: Note operations with caching
- **useUser**: User profile management

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
