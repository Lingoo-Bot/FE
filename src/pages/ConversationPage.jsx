import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { recordConversation, stopConversation } from '../api'
import './ConversationPage.css'

export default function ConversationPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('로봇이 준비됐습니다. 녹음 버튼을 누르세요.')
  const [recording, setRecording] = useState(false)

  const handleRecord = async () => {
    setRecording(true)
    setStatus('녹음 중...')
    try {
      await recordConversation()
      setStatus('응답 대기 중...')
    } catch {
      setStatus('녹음 전송에 실패했습니다.')
    } finally {
      setRecording(false)
    }
  }

  const handleStop = async () => {
    try {
      await stopConversation()
    } catch { /* 이미 종료된 경우 무시 */ }
    navigate('/home')
  }

  return (
    <div className="conversation-page">
      <div className="top-bar">
        <button className="back-btn" onClick={handleStop}>←</button>
        <span className="bar-title">대화 중</span>
      </div>

      <div className="conv-penguin-area">
        <div className={`conv-penguin ${recording ? 'speaking' : ''}`}>
          <img src="/링구.png" alt="링구" style={{ width: 200, height: 200 }} />
          <div className="conv-glow-ring" />
        </div>
      </div>

      <div className="conv-status-box">
        <p className="conv-status-text">{status}</p>
      </div>

      <div className="conv-actions">
        <button
          className={`btn conv-record-btn ${recording ? 'recording' : ''}`}
          onClick={handleRecord}
          disabled={recording}
        >
          {recording ? '녹음 중...' : '녹음'}
        </button>
        <button className="btn btn-outline" onClick={handleStop}>
          대화 종료
        </button>
      </div>
    </div>
  )
}
