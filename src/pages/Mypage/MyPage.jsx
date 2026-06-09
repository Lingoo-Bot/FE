import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStatistics, getWeekly, login } from '../../api'
import { useAuth } from '../../context/AuthContext'
import BottomNav from '../../components/BottomNav'
import './MyPage.css'

function getYearMonth() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

// 테스트 데이터
const mockStats = {
  studyTime: 9800,
  month: '2026-05',
  weeklyStudy: [
    { day: 'Mon', time: 1200 },
    { day: 'Tue', time: 300 },
    { day: 'Wed', time: 900 },
    { day: 'Thu', time: 1500 },
    { day: 'Fri', time: 600 },
    { day: 'Sat', time: 2000 },
    { day: 'Sun', time: 800 },
  ]
}

export default function MyPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [stats, setStats] = useState(null)
  const [weekly, setWeekly] = useState([])
  const [yearMonth, setYearMonth] = useState(getYearMonth())
  const [showModal, setShowModal] = useState(false)
  const [pwForm, setPwForm] = useState({ username: '', password: '' })
  const [pwError, setPwError] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  // 테스트용
  const isDev = false

  useEffect(() => {
    if (isDev) {
      setStats(mockStats)
      setWeekly(mockStats.weeklyStudy)
      return
    }

    // 월간
    getStatistics(yearMonth)
      .then((res) =>
        setStats(res.data?.message === 'success' ? res.data.data : null)
      )
      .catch(() => setStats(null))
  
    // 주간
    getWeekly()
      .then((res) =>
        setWeekly(res.data?.message === 'success' ? res.data.data : [])
      )
      .catch(() => setWeekly([]))
  }, [yearMonth])


  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const openDeviceModal = () => {
    setPwForm({ username: '', password: '' })
    setPwError('')
    setShowModal(true)
  }

  const handleVerifyPassword = async (e) => {
    e.preventDefault()
    if (!pwForm.username || !pwForm.password) {
      setPwError('아이디와 비밀번호를 입력해주세요.')
      return
    }
    setPwLoading(true)
    setPwError('')
    try {
      await login(pwForm.username, pwForm.password)
      setShowModal(false)
      navigate('/pairing')
    } catch {
      setPwError('아이디 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setPwLoading(false)
    }
  }

  const formatTime = (seconds) => {
    if (!seconds) return '0시간 0분'
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return `${h}시간 ${m}분`
  }

  const maxTime = weekly.length
    ? Math.max(...weekly.map(d => Number(d.time) || 0))
    : 0

  return (
    <div className="mypage">

      <div className="mypage-header">
        <h2 className="home-title">MyPage</h2>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          <span>👤</span>
        </div>
        <div className="profile-info">
          <p className="profile-nickname">{user?.nickname || '사용자'}님</p>
          <p className="profile-username">@{user?.username}</p>
        </div>
      </div>

      <div className="stats-section">
        <div className="stats-header">
          <p className="section-title">월간 학습 통계</p>

            <select
              className="month-select"
              value={yearMonth}
              onChange={(e) => setYearMonth(e.target.value)}
            >
            {Array.from({ length: 6 }, (_, i) => {
              const d = new Date()
              d.setMonth(d.getMonth() - i)
              const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
              return <option key={m} value={m}>{m}</option>
            })}
          </select>
        </div>

        <div className="stats-card">
          {stats ? (
            <div className="stat-item">
              <span className="stat-icon">⏱</span>
              <div>
                <p className="stat-value">
                  {formatTime(stats.studyTime)}
                </p>
                <p className="stat-label">총 학습 시간</p>
              </div>
            </div>
          ) : (
            <p className="no-stats">데이터 없음</p>
          )}
        </div>
      </div>

      <div className="stats-section">
        <p className="section-title">주간 학습 그래프</p>

        <div className="weekly-graph">
          {weekly.map((d) => {
            const value = Number(d.time) || 0
            const height = maxTime ? (value / maxTime) * 100 : 0

            return (
              <div className="bar-item" key={d.day}>
                <div
                  className="bar"
                  style={{ height: `${height}%` }}
                />
                <span className="bar-label">{d.day}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mypage-actions">
        <button className="btn btn-outline" onClick={openDeviceModal}>
          🔗 디바이스 관리
        </button>

        <button className="btn btn-danger" onClick={handleLogout}>
          로그아웃
        </button>
      </div>

      <BottomNav active="mypage" />

      {showModal && (
        <div className="pw-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="pw-modal" onClick={(e) => e.stopPropagation()}>
            <p className="pw-modal-title">본인 확인</p>
            <p className="pw-modal-desc">디바이스 변경을 위해 비밀번호를 입력해주세요.</p>
            <form onSubmit={handleVerifyPassword}>
              <input
                className="pw-modal-input"
                type="text"
                placeholder="아이디"
                value={pwForm.username}
                onChange={(e) => { setPwForm(f => ({ ...f, username: e.target.value })); setPwError('') }}
                autoComplete="username"
                autoFocus
              />
              <input
                className="pw-modal-input"
                type="password"
                placeholder="비밀번호"
                value={pwForm.password}
                onChange={(e) => { setPwForm(f => ({ ...f, password: e.target.value })); setPwError('') }}
                autoComplete="current-password"
              />
              {pwError && <p className="pw-modal-error">{pwError}</p>}
              <div className="pw-modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={pwLoading}
                >
                  {pwLoading ? '확인 중...' : '확인'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}