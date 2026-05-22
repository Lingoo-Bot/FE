import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getRecordDetail } from '../../api'
import './FeedbackPage.css'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function FeedbackPage() {
  const { recordId } = useParams()
  const navigate = useNavigate()
  const [record, setRecord] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRecordDetail(recordId)
      .then((res) => setRecord(res.data?.message === 'success' ? res.data.data : null))
      .catch(() => setRecord(null))
      .finally(() => setLoading(false))
  }, [recordId])

  // content를 대화 형식으로 파싱 (JSON 배열 or 일반 텍스트)
  const parseContent = (content) => {
    if (!content) return []
    try {
      return JSON.parse(content)
    } catch {
      return [{ role: 'system', text: content }]
    }
  }

  const messages = record ? parseContent(record.content) : []

  return (
    <div className="feedback-page">
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate('/records')}>←</button>
        <span className="bar-title">FeedBack</span>
      </div>

      {loading ? (
        <div className="feedback-loading">
          <span>🐧</span>
          <p>불러오는 중...</p>
        </div>
      ) : !record ? (
        <div className="feedback-loading">
          <p>기록을 찾을 수 없습니다.</p>
          <button className="btn btn-primary" onClick={() => navigate('/records')}>
            목록으로
          </button>
        </div>
      ) : (
        <>
          <div className="feedback-date-badge">
            <span className="date-main">{formatDate(record.date)}</span>
            <span className="date-time">{formatTime(record.date)}</span>
          </div>

          <div className="feedback-content">
            {messages.length > 0 ? (
              <div className="message-list">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`message-bubble ${
                      msg.role === 'user' ? 'user-msg' : 'bot-msg'
                    }`}
                  >
                    {msg.role !== 'user' && (
                      <span className="msg-avatar">🐧</span>
                    )}
                    <div className="msg-text">{msg.text || msg.content || String(msg)}</div>
                    {msg.role === 'user' && (
                      <span className="msg-avatar user-av">👤</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="raw-content">
                <p>{record.content}</p>
              </div>
            )}
          </div>

          <div className="feedback-penguin">
            <span style={{ fontSize: 48 }}>🐧</span>
          </div>
        </>
      )}
    </div>
  )
}
