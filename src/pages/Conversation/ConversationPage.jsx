import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { startConversation, recordConversation, stopConversation } from '../../api/'
import './ConversationPage.css'

// phase: 'idle' | 'listening' | 'sending' | 'waiting'
export default function ConversationPage() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('idle')
  const [status, setStatus] = useState('말하기 버튼을 눌러 대화를 시작하세요.')

  const handleStartTalking = async () => {
    setPhase('sending')
    setStatus('로봇 준비 중...')
    try {
      await startConversation()
      setPhase('listening')
      setStatus('듣고 있어요. 말이 끝나면 말하기 종료를 누르세요.')
    } catch {
      setPhase('idle')
      setStatus('로봇 연결에 실패했습니다. 다시 시도해 주세요.')
    }
  }

  const handleDoneTalking = async () => {
    setPhase('sending')
    setStatus('음성을 전송하는 중...')
    try {
      await recordConversation()
      setPhase('waiting')
      setStatus('링구가 생각하는 중... 잠시 기다려 주세요.')
    } catch {
      setPhase('listening')
      setStatus('전송에 실패했습니다. 다시 시도해 주세요.')
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
        <div className={`conv-penguin ${phase === 'listening' ? 'speaking' : ''}`}>
          <img src="/링구.png" alt="링구" style={{ width: 200, height: 200 }} />
          <div className="conv-glow-ring" />
        </div>
      </div>

      <div className="conv-status-box">
        <p className="conv-status-text">{status}</p>
      </div>

      <div className="conv-actions">
        {phase === 'idle' && (
          <button className="btn conv-record-btn ready" onClick={handleStartTalking}>
            말하기
          </button>
        )}
        {phase === 'listening' && (
          <button className="btn conv-record-btn" onClick={handleDoneTalking}>
            말하기 종료
          </button>
        )}
        {phase === 'sending' && (
          <button className="btn conv-record-btn" disabled>
            처리 중...
          </button>
        )}
        {phase === 'waiting' && (
          <button className="btn conv-record-btn ready" onClick={handleStartTalking}>
            다시 말하기
          </button>
        )}
        <button className="btn btn-outline" onClick={handleStop}>
          대화 종료 (로봇 비활성화)
        </button>
      </div>
    </div>
  )
}
