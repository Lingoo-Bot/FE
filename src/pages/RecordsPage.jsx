import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRecords, deleteRecord } from '../api'
import BottomNav from '../components/BottomNav'
import './RecordsPage.css'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const y = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}.${mo}.${day} ${h}:${min}`
}

export default function RecordsPage() {
  const navigate = useNavigate()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRecords = () => {
    setLoading(true)
    getRecords()
      .then((res) => setRecords(res.data?.message === 'success' ? res.data.data : []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchRecords() }, [])

  const handleDelete = async (e, recordId) => {
    e.stopPropagation()
    if (!window.confirm('이 기록을 삭제할까요?')) return
    try {
      await deleteRecord(recordId)
      setRecords((prev) => prev.filter((r) => r.recordId !== recordId))
    } catch {
      alert('삭제에 실패했습니다.')
    }
  }

  return (
    <div className="records-page">
      <div className="records-header">
        <h2 className="home-title">지난 회화 기록</h2>
      </div>

      {loading ? (
        <div className="records-loading">
          <img src="/펭귄.png" alt="펭귄" style={{ width: 60, height: 60 }} />
          <p>불러오는 중...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="records-empty">
          <img src="/펭귄.png" alt="펭귄" style={{ width: 60, height: 60 }} />
          <p>아직 회화 기록이 없어요!</p>
          <button className="btn btn-primary" onClick={() => navigate('/home')}>
            첫 회화 시작하기
          </button>
        </div>
      ) : (
        <div className="records-list">
          {records.map((record) => (
            <div
              key={record.recordId}
              className="record-item"
              onClick={() => navigate(`/records/${record.recordId}`)}
            >
              <div className="record-left">
                <span className="record-icon">💬</span>
                <div>
                  <p className="record-date">{formatDate(record.date)}</p>
                  <p className="record-id">회화 #{record.recordId}</p>
                </div>
              </div>
              <button
                className="record-delete"
                onClick={(e) => handleDelete(e, record.recordId)}
                title="삭제"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}

      <BottomNav active="records" />
    </div>
  )
}
