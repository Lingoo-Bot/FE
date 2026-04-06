import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signUp, checkUsername } from '../api'
import './AuthPage.css'

export default function SignUpPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nickname: '',
    username: '',
    password: '',
    passwordConfirm: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState(null) // 'available' | 'taken' | null
  const [checkingUsername, setCheckingUsername] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    if (e.target.name === 'username') setUsernameStatus(null)
  }

  const handleCheckUsername = async () => {
    if (!form.username) return
    setCheckingUsername(true)
    try {
      const res = await checkUsername(form.username)
      if (res.data?.message === 'success') {
        setUsernameStatus('taken')
      } else {
        setUsernameStatus('available')
      }
    } catch {
      setUsernameStatus('available')
    } finally {
      setCheckingUsername(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { nickname, username, password, passwordConfirm } = form
    if (!nickname || !username || !password || !passwordConfirm) {
      setError('모든 항목을 입력해주세요.')
      return
    }
    if (usernameStatus !== 'available') {
      setError('아이디 중복확인을 해주세요.')
      return
    }
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    setLoading(true)
    try {
      await signUp(form)
      navigate('/login', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message
      setError(msg || '회원가입에 실패했습니다.')
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
        <h1 className="page-title">회원가입</h1>
        <p className="auth-desc">Lingua Bot과 함께 영어를 배워요</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>닉네임</label>
          <input
            name="nickname"
            placeholder="사용할 닉네임"
            value={form.nickname}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>아이디</label>
          <div className="username-row">
            <input
              name="username"
              placeholder="사용할 아이디"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />
            <button
              type="button"
              className="check-btn"
              onClick={handleCheckUsername}
              disabled={!form.username || checkingUsername}
            >
              {checkingUsername ? '확인 중' : '중복확인'}
            </button>
          </div>
          {usernameStatus === 'taken' && (
            <p className="username-msg taken">이미 사용 중인 아이디입니다.</p>
          )}
          {usernameStatus === 'available' && (
            <p className="username-msg available">사용 가능한 아이디입니다.</p>
          )}
        </div>

        <div className="form-group">
          <label>비밀번호</label>
          <input
            name="password"
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </div>

        <div className="form-group">
          <label>비밀번호 확인</label>
          <input
            name="passwordConfirm"
            type="password"
            placeholder="비밀번호 재입력"
            value={form.passwordConfirm}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? '처리 중...' : '회원가입'}
        </button>
      </form>

      <p className="auth-switch">
        이미 계정이 있으신가요?{' '}
        <Link to="/login" className="auth-link">로그인</Link>
      </p>
    </div>
  )
}
