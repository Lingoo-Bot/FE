import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import InitialPage from './pages/InitialPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import PairingPage from './pages/PairingPage'
import HomePage from './pages/HomePage'
import MyPage from './pages/MyPage'
import RecordsPage from './pages/RecordsPage'
import FeedbackPage from './pages/FeedbackPage'
import ConversationPage from './pages/ConversationPage'

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
