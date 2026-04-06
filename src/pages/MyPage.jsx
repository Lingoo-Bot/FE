import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStatistics } from '../api'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'
import './MyPage.css'

function getYearMonth() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export default function MyPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [yearMonth, setYearMonth] = useState(getYearMonth())

  useEffect(() => {
    getStatistics(yearMonth)
      .then((res) => setStats(res.data?.message === 'success' ? res.data.data : null))
      .catch(() => setStats(null))
  }, [yearMonth])

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const formatTime = (seconds) => {
    if (!seconds) return '0시간 0분'
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    return `${h}시간 ${m}분`
  }

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })

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
          <p className="section-title">학습 통계</p>
          <select
            className="month-select"
            value={yearMonth}
            onChange={(e) => setYearMonth(e.target.value)}
          >
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="stats-card">
          {stats ? (
            <>
              <div className="stat-item">
                <span className="stat-icon">⏱</span>
                <div>
                  <p className="stat-value">{formatTime(stats.studyTime)}</p>
                  <p className="stat-label">총 학습 시간</p>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">📅</span>
                <div>
                  <p className="stat-value">{stats.month}</p>
                  <p className="stat-label">기준 월</p>
                </div>
              </div>
            </>
          ) : (
            <p className="no-stats">이 달의 학습 기록이 없습니다.</p>
          )}
        </div>
      </div>

      <div className="mypage-actions">
        <button className="btn btn-outline" onClick={() => navigate('/pairing')}>
          🔗 디바이스 관리
        </button>
        <button className="btn btn-danger" onClick={handleLogout}>
          로그아웃
        </button>
      </div>

      <BottomNav active="mypage" />
    </div>
  )
}
