import { useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { key: 'home', icon: '🏠', label: '홈', path: '/home' },
  { key: 'records', icon: '💬', label: '기록', path: '/records' },
  { key: 'mypage', icon: '👤', label: '마이페이지', path: '/mypage' },
]

export default function BottomNav({ active }) {
  const navigate = useNavigate()
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => (
        <div
          key={item.key}
          className={`nav-item ${active === item.key ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </div>
      ))}
    </nav>
  )
}
