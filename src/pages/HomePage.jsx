import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDevice, createSession } from '../api'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'
import './HomePage.css'

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [connected, setConnected] = useState(false)
  const [sessionStatus, setSessionStatus] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getDevice()
      .then((res) => { if (res.data?.message === 'success') setConnected(true) })
      .catch(() => {})
  }, [])

  const handleStartSession = async () => {
    if (!connected) {
      navigate('/pairing')
      return
    }
    setLoading(true)
    setSessionStatus('')
    try {
      const res = await createSession()
      const sessionId = res.data?.message === 'success' ? res.data.data : null
      setSessionStatus(`세션 시작됨 (ID: ${sessionId})`)
    } catch {
      setSessionStatus('세션 시작에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <h2 className="home-title">Lingua</h2>
        <div
          className={`bt-icon ${connected ? 'connected' : ''}`}
          onClick={() => navigate('/pairing')}
          title="디바이스 연결"
        >
          {connected ? '🔵' : '🔗'}
        </div>
      </div>

      <div className="home-penguin-area">
        <div className="home-penguin">
          <img src="/링구.png" className="penguin-emoji" alt="링구" style={{ width: 260, height: 260 }} />
          <div className="penguin-platform" />
        </div>
      </div>

      <div className="home-status">
        <div className={`status-dot ${connected ? 'on' : 'off'}`} />
        <span className="status-label">
          {connected ? '디바이스 연결됨' : '디바이스 미연결'}
        </span>
      </div>

      <button
        className={`btn ${connected ? 'btn-primary' : 'btn-secondary'} start-btn`}
        onClick={handleStartSession}
        disabled={loading}
      >
        {loading ? '시작 중...' : connected ? '회화 시작' : '디바이스 연결'}
      </button>

      {sessionStatus && (
        <p className={`session-status ${sessionStatus.includes('실패') ? 'fail' : 'success'}`}>
          {sessionStatus}
        </p>
      )}

      <BottomNav active="home" />
    </div>
  )
}
