# 🎬 Netflix GPT

> A modern, AI-powered movie discovery platform inspired by Netflix's sleek interface, featuring intelligent recommendations and personalized content curation.

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-purple.svg)](https://redux-toolkit.js.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9.x-orange.svg)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-cyan.svg)](https://tailwindcss.com/)

## 🌟 Features

- **🔐 Secure Authentication**: Firebase-powered user registration and login
- **🤖 AI-Powered Recommendations**: Gemini API integration for personalized movie suggestions
- **🎭 Rich Movie Database**: Complete movie information from TMDB API
- **📱 Responsive Design**: Netflix-inspired UI that works across all devices
- **🔍 Smart Search**: Advanced filtering and search capabilities
- **⚡ Real-time Updates**: Live data synchronization with Firebase Firestore
- **📊 User Analytics**: Track viewing preferences and behavior
- **🎨 Modern UI/UX**: Clean, intuitive interface with smooth animations

> Try it out here at [LINK](https://moviegpt-90547.web.app)
## 🚀 Tech Stack

### Frontend
- **React 18** - Component-based UI library
- **Redux Toolkit** - State management with RTK Query
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling framework

### Backend & APIs
- **Firebase Authentication** - User management and security
- **Firestore Database** - NoSQL document database
- **Firebase Analytics** - User behavior tracking
- **TMDB API v4** - Movie database and metadata
- **Gemini API** - AI-powered features and recommendations

### Required API Keys

You'll need to obtain the following API keys:

1. **Firebase Project**: [Firebase Console](https://console.firebase.google.com/)
2. **TMDB API Key**: [The Movie Database](https://www.themoviedb.org/settings/api)
3. **Gemini API Key**: [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/harshilarora2005/netflix-gpt.git
cd netflix-gpt
```

### 2. Install Dependencies

```bash
# Using npm
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and add your API keys:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# External API Keys
VITE_TMDB_KEY=your_tmdb_bearer_token
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication with Email/Password provider
4. Create a Firestore database in production mode
5. Enable Analytics (optional)
6. Copy your config keys to the `.env` file

### 5. TMDB API Setup

1. Sign up at [TMDB](https://www.themoviedb.org/signup)
2. Go to Settings → API
3. Request an API key (choose "Developer" option)
4. Use the **Bearer Token** (v4 auth) in your `.env` file

## 🎮 Usage

### Development Server

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Configuration

### Firebase Rules

Update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | ✅ |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | ✅ |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | ✅ |
| `VITE_TMDB_KEY` | TMDB Bearer Token | ✅ |
| `VITE_GEMINI_API_KEY` | Gemini API key | ✅ |

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Harshil Arora**
- GitHub: [@harshilarora2005](https://github.com/harshilarora2005)
- LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/your-profile)
