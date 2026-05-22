import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDevice } from '../../api'
import BottomNav from '../../components/BottomNav'
import './HomePage.css'

export default function HomePage() {
  const navigate = useNavigate()
  const [connected, setConnected] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    getDevice()
      .then((res) => { if (res.data?.message === 'success') setConnected(true) })
      .catch(() => {})
  }, [])

  const handleStart = () => {
    if (!connected) { navigate('/pairing'); return }
    navigate('/conversation')
  }

  return (
    <div className="home-page">
      <div className="home-header">
        <h2 className="home-title">Lingua</h2>
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
        onClick={handleStart}
      >
        {connected ? '대화 시작' : '디바이스 연결'}
      </button>

      {status && <p className="session-status">{status}</p>}

      <BottomNav active="home" />
    </div>
  )
}
