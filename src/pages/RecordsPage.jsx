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
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchRecords = () => {
    setLoading(true)
    getRecords()
      .then((res) =>
        setRecords(res.data?.message === 'success' ? res.data.data : [])
      )
      .catch(() => setRecords([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchRecords()
  }, [])

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
                  <p className="record-date">
                    {formatDate(record.date)} 대화 내용
                  </p>
                </div>
              </div>

              <button
                className="record-delete"
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteTarget(record.recordId)
                }}
                title="삭제"
              >
                🗑
              </button>
            </div>
          ))}
        </div>
      )}
        {deleteTarget && (
          <div className="modal-backdrop">
            <div className="modal-card">
              <p className="modal-title">삭제할까요?</p>
              <p className="modal-sub">이 기록은 복구할 수 없습니다.</p>

              <div className="modal-actions">
                <button
                  className="modal-btn danger"
                  onClick={async () => {
                    try {
                      await deleteRecord(deleteTarget)

                      setRecords((prev) =>
                        prev.filter((r) => r.recordId !== deleteTarget)
                      )

                      setDeleteTarget(null)
                    } catch {
                      alert('삭제에 실패했습니다')
                    }
                  }}
                >
                  삭제
                </button>

                <button
                  className="modal-btn cancel"
                  onClick={() => setDeleteTarget(null)}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      <BottomNav active="records" />
    </div>
  )
}