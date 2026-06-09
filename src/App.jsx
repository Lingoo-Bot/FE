import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import InitialPage from './pages/InitialPage'
import LoginPage from './pages/Auth/LoginPage'
import SignUpPage from './pages/Auth/SignUpPage'
import PairingPage from './pages/Pairing/PairingPage'
import HomePage from './pages/Home/HomePage'
import MyPage from './pages/Mypage/MyPage'
import RecordsPage from './pages/Record/RecordsPage'
import FeedbackPage from './pages/Feedback/FeedbackPage'
import ConversationPage from './pages/Conversation/ConversationPage'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/" replace />
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <div className="phone-container">
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <InitialPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/pairing" element={<PrivateRoute><PairingPage /></PrivateRoute>} />
        <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
        <Route path="/records" element={<PrivateRoute><RecordsPage /></PrivateRoute>} />
        <Route path="/records/:recordId" element={<PrivateRoute><FeedbackPage /></PrivateRoute>} />
        <Route path="/conversation" element={<PrivateRoute><ConversationPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
