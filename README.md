# 📝 Note-Taking Application

A modern, responsive note-taking application built with Next.js 15, featuring secure authentication, real-time note management, and a clean user interface.

🌐 **Live Demo**: [https://note-taking-application-roan.vercel.app](https://note-taking-application-roan.vercel.app)

## ✨ Features

### 🔐 Authentication
- **Dual Authentication Methods**:
  - Email + OTP verification via Brevo email service
  - Google OAuth integration
- **Secure Session Management** with NextAuth.js
- **JWT Token-based** authentication

### 📱 Responsive Design
- **Mobile-First Approach**: Optimized for all device sizes
- **Desktop Layout**: Split-screen design with form (40%) and image (60%)
- **Mobile Layout**: Full-width form with centered branding, image hidden
- **Clean UI**: Modern, minimalist design with Tailwind CSS

### 📝 Note Management
- **Create Notes**: Modal-based note creation with title and content
- **View Notes**: Click any note to view full content in a modal
- **Delete Notes**: One-click note deletion with trash bin icon
- **Real-time Updates**: Instant UI updates after CRUD operations

### 🎨 User Experience
- **Professional Modals**: React Modal library for better UX
- **Loading States**: Visual feedback for all async operations
- **Error Handling**: Comprehensive error messages and validation
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **React Modal** - Professional modal components
- **Lucide React** - Modern icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js** - Authentication library
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Authentication & Email
- **NextAuth.js** - Authentication provider
- **Google OAuth** - Social login
- **Brevo** - Email service for OTP delivery
- **bcryptjs** - Password/OTP hashing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or cloud)
- Google OAuth credentials
- Brevo account for email service

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/HarshGeed/Note-taking-application.git
   cd note-taking-application
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # NextAuth
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Brevo Email
   BREVO_API_KEY=your_brevo_api_key
   BREVO_EMAIL=your_sender_email
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
note-taking/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/[...nextauth]/   # NextAuth configuration
│   │   ├── notes/                # Notes CRUD operations
│   │   └── user/                 # User management & OTP
│   ├── signin/                   # Sign-in page
│   ├── signup/                   # Sign-up page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Dashboard (home page)
├── models/                       # Mongoose models
│   ├── userModel.ts              # User schema
│   ├── noteModel.ts              # Note schema
│   └── otpModel.ts               # OTP schema
├── utils/                        # Utility functions
│   ├── dbConnect.ts              # MongoDB connection
│   ├── otp.ts                    # OTP generation & validation
│   └── sendEmail.ts              # Brevo email service
├── public/                       # Static assets
├── auth.ts                       # NextAuth configuration
├── middleware.ts                 # Route protection
└── README.md                     # Project documentation
```

## 🔧 Configuration

### Database Models

#### User Model
```typescript
{
  name: string,
  email: string (unique),
  notes: ObjectId[] (references to Note model)
}
```

#### Note Model
```typescript
{
  title: string,
  content: string,
  author: ObjectId (reference to User),
  createdAt: Date
}
```

#### OTP Model
```typescript
{
  email: string,
  otp: string (hashed),
  expiresAt: Date
}
```

### API Endpoints

- `POST /api/user/signup` - User registration with OTP
- `POST /api/user/login` - User login with OTP
- `POST /api/user/send-otp` - Send OTP to email
- `GET /api/notes` - Fetch user's notes
- `POST /api/notes` - Create new note
- `DELETE /api/notes/[id]` - Delete specific note

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (md breakpoint)
  - Form takes full width
  - Image hidden
  - Centered logo and content
  
- **Desktop**: ≥ 768px
  - Form: 40% width
  - Image: 60% width
  - Left-aligned content

## 🔒 Security Features

- **OTP Validation**: 6-digit OTP with 10-minute expiration
- **Password Hashing**: bcryptjs for secure OTP storage
- **JWT Tokens**: Secure session management
- **Route Protection**: Middleware-based authentication
- **Input Validation**: Server-side validation for all inputs

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Deploy to Netlify
1. Build the project: `npm run build`
2. Deploy the `.next` folder to Netlify
3. Configure environment variables

<!--
## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
-->
## 👤 Author

**Harsh Geed**
- GitHub: [@HarshGeed](https://github.com/HarshGeed)
- Repository: [Note-taking-application](https://github.com/HarshGeed/Note-taking-application)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- NextAuth.js for authentication solutions
- Brevo for email services
- MongoDB for database solutions

---

## 📊 Performance

- **Lighthouse Score**: Optimized for performance
- **Bundle Size**: Minimized with Next.js optimization
- **First Load JS**: ~121KB (main page)
- **Static Generation**: Optimized build with 10 routes

## 🐛 Known Issues

- None currently reported
<!--
## 🔮 Future Enhancements

- [ ] Rich text editor for notes
- [ ] Note categories and tags
- [ ] Search functionality
- [ ] Export notes to PDF
- [ ] Dark mode support
- [ ] Note sharing capabilities
- [ ] Real-time collaboration
-->
---

Made with ❤️ using Next.js 15 and TypeScript
