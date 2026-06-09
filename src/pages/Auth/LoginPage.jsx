import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login, getDevice } from '../../api'
import { useAuth } from '../../context/AuthContext'
import './AuthPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { saveUser } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      setError('아이디와 비밀번호를 입력해주세요.')
      return
    }
    setLoading(true)
    try {
      const res = await login(form.username, form.password)
      saveUser(res.data)
      try {
        const deviceRes = await getDevice()
        navigate(deviceRes.data?.message === 'success' ? '/home' : '/pairing', { replace: true })
      } catch {
        navigate('/pairing', { replace: true })
      }
    } catch {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-top">
        <button className="back-btn" onClick={() => navigate('/')}>←</button>
      </div>

      <div className="auth-header">
        <img src="/링구.png" className="penguin-emoji small" alt="링구" />
        <h1 className="page-title">Lingua Bot</h1>
        <p className="auth-desc">로그인하고 영어 회화를 시작하세요</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>아이디</label>
          <input
            name="username"
            placeholder="아이디를 입력하세요"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label>비밀번호</label>
          <input
            name="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <p className="auth-switch">
        계정이 없으신가요?{' '}
        <Link to="/signup" className="auth-link">회원가입</Link>
      </p>
    </div>
  )
}
