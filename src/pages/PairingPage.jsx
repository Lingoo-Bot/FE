import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerDevice, getDevice } from '../api'
import './PairingPage.css'

// 실제 블루투스/네트워크 디바이스 탐색을 시뮬레이션
const MOCK_DEVICES = [
  { id: 1001, name: 'Device 1' },
  { id: 1002, name: 'Device 2' },
]

export default function PairingPage() {
  const navigate = useNavigate()
  const [devices, setDevices] = useState([])
  const [scanning, setScanning] = useState(false)
  const [selected, setSelected] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [paired, setPaired] = useState(false)

  useEffect(() => {
    // 이미 페어링된 디바이스 확인
    getDevice()
      .then((res) => {
        if (res.data?.message === 'success') setPaired(true)
      })
      .catch(() => {})
  }, [])

  const handleScan = () => {
    setScanning(true)
    setDevices([])
    setStatus('')
    // 스캔 시뮬레이션
    setTimeout(() => {
      setDevices(MOCK_DEVICES)
      setScanning(false)
    }, 1500)
  }

  const handlePair = async () => {
    if (!selected) {
      setStatus('디바이스를 선택해주세요.')
      return
    }
    setLoading(true)
    setStatus('')
    try {
      await registerDevice(selected.id, selected.name)
      setStatus('페어링 성공!')
      setPaired(true)
      setTimeout(() => navigate('/home'), 1200)
    } catch {
      setStatus('페어링에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pairing-page">
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate('/home')}>←</button>
        <span className="bar-title">Device Pairing</span>
      </div>

      <div className="pairing-penguin">
        <img src="/링구.png" className="penguin-emoji" alt="링구" style={{ width: 80, height: 80 }} />
        {paired && <div className="paired-badge">연결됨</div>}
      </div>

      <div className="pairing-signal">
        <span className={`signal-icon ${scanning ? 'scanning' : ''}`}>📡</span>
        <p className="signal-text">
          {scanning ? '디바이스 검색 중...' : '근처 디바이스를 검색하세요'}
        </p>
      </div>

      <button
        className="btn btn-primary scan-btn"
        onClick={handleScan}
        disabled={scanning}
      >
        {scanning ? '검색 중...' : '스캔 시작'}
      </button>

      {devices.length > 0 && (
        <div className="device-list">
          <p className="device-list-title">Found Devices:</p>
          {devices.map((d) => (
            <div
              key={d.id}
              className={`device-item ${selected?.id === d.id ? 'selected' : ''}`}
              onClick={() => setSelected(d)}
            >
              <span>{d.name}</span>
              <span className="device-check">
                {selected?.id === d.id ? '✓' : '↻'}
              </span>
            </div>
          ))}
        </div>
      )}

      {status && (
        <p className={`pair-status ${status.includes('성공') ? 'success' : 'fail'}`}>
          {status}
        </p>
      )}

      <div className="pairing-actions">
        <button
          className="btn btn-primary"
          onClick={handlePair}
          disabled={loading || !selected}
        >
          {loading ? '연결 중...' : '페어링'}
        </button>
        <button className="btn btn-outline" onClick={() => navigate('/home')}>
          CANCEL
        </button>
      </div>
    </div>
  )
}
