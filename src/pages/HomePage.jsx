import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDevice, startConversation, recordConversation, stopConversation } from '../api'
import BottomNav from '../components/BottomNav'
import './HomePage.css'

export default function HomePage() {
  const navigate = useNavigate()
  const [connected, setConnected] = useState(false)
  const [talking, setTalking] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    getDevice()
      .then((res) => { if (res.data?.message === 'success') setConnected(true) })
      .catch(() => {})
  }, [])

  const handleStart = async () => {
    if (!connected) { navigate('/pairing'); return }
    try {
      await startConversation()
      setTalking(true)
      setStatus('로봇이 준비됐습니다. 녹음 버튼을 누르세요.')
    } catch {
      setStatus('로봇에 연결할 수 없습니다. 로봇이 켜져 있는지 확인하세요.')
    }
  }

  const handleRecord = async () => {
    setStatus('녹음 중...')
    try {
      await recordConversation()
      setStatus('응답 대기 중...')
    } catch {
      setStatus('녹음 전송에 실패했습니다.')
    }
  }

  const handleStop = async () => {
    try {
      await stopConversation()
    } catch { /* 이미 종료된 경우 무시 */ }
    setTalking(false)
    setStatus('')
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

      {!talking ? (
        <button
          className={`btn ${connected ? 'btn-primary' : 'btn-secondary'} start-btn`}
          onClick={handleStart}
        >
          {connected ? '대화 시작' : '디바이스 연결'}
        </button>
      ) : (
        <div className="conversation-controls">
          <button className="btn btn-primary record-btn" onClick={handleRecord}>
            대화 종료
          </button>
          <button className="btn btn-outline stop-btn" onClick={handleStop}>
            로봇 비활성화
          </button>
        </div>
      )}

      {status && <p className="session-status">{status}</p>}

      <BottomNav active="home" />
    </div>
  )
}
