import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerDevice, getDevice } from '../../api'
import './PairingPage.css'

export default function PairingPage() {
  const navigate = useNavigate()
  const [deviceId, setDeviceId] = useState('')
  const [deviceName, setDeviceName] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [paired, setPaired] = useState(false)

  useEffect(() => {
    getDevice()
      .then((res) => { if (res.data?.message === 'success') setPaired(true) })
      .catch(() => {})
  }, [])

  const handlePair = async () => {
    if (!deviceId || !deviceName) {
      setStatus('Device ID와 이름을 입력해주세요.')
      return
    }
    setLoading(true)
    setStatus('')
    try {
      await registerDevice(Number(deviceId), deviceName)
      setStatus('장치 등록 성공!')
      setPaired(true)
      setTimeout(() => navigate('/home'), 1200)
    } catch {
      setStatus('장치 등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pairing-page">
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate('/home')}>←</button>
        <span className="bar-title">장치 등록</span>
      </div>

      <div className="pairing-penguin">
        <img src="/링구.png" className="penguin-emoji" alt="링구" style={{ width: 80, height: 80 }} />
        {paired && <div className="paired-badge">연결됨</div>}
      </div>

      <div className="pairing-form">
        <div className="form-group">
          <label>Device ID</label>
          <input
            type="number"
            placeholder="숫자 ID를 입력하세요"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Device 이름</label>
          <input
            type="text"
            placeholder="기기 이름을 입력하세요"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
          />
        </div>
      </div>

      {status && (
        <p className={`pair-status ${status.includes('성공') ? 'success' : 'fail'}`}>
          {status}
        </p>
      )}

      <div className="pairing-actions">
        <button
          className="btn btn-primary"
          onClick={handlePair}
          disabled={loading || !deviceId || !deviceName}
        >
          {loading ? '등록 중...' : '장치 등록'}
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/home')}>
          CANCEL
        </button>
      </div>
    </div>
  )
}
