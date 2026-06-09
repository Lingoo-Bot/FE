import { useNavigate } from 'react-router-dom'

const HomeIcon = ({ active }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V10.5Z"
      fill={active ? '#dbeeff' : 'none'}
      stroke={active ? '#4da8ff' : '#94a3b8'}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
)

const ChatIcon = ({ active }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 15C21 15.55 20.55 16 20 16H7L3 20V4C3 3.45 3.45 3 4 3H20C20.55 3 21 3.45 21 4V15Z"
      fill={active ? '#dbeeff' : 'none'}
      stroke={active ? '#4da8ff' : '#94a3b8'}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />

    <line
      x1="7"
      y1="8"
      x2="14"
      y2="8"
      stroke={active ? '#4da8ff' : '#94a3b8'}
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    <line
      x1="7"
      y1="12"
      x2="17"
      y2="12"
      stroke={active ? '#4da8ff' : '#94a3b8'}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

const UserIcon = ({ active }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="7"
      r="4"
      fill={active ? '#dbeeff' : 'none'}
      stroke={active ? '#4da8ff' : '#94a3b8'}
      strokeWidth="1.8"
    />

    <path
      d="M4 21C4 17.134 7.582 14 12 14C16.418 14 20 17.134 20 21"
      stroke={active ? '#4da8ff' : '#94a3b8'}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

const NAV_ITEMS = [
  { key: 'home', Icon: HomeIcon, label: '홈', path: '/home' },
  { key: 'records', Icon: ChatIcon, label: '기록', path: '/records' },
  { key: 'mypage', Icon: UserIcon, label: '마이', path: '/mypage' },
]

export default function BottomNav({ active }) {
  const navigate = useNavigate()

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(({ key, Icon, label, path }) => (
        <div
          key={key}
          className={`nav-item ${active === key ? 'active' : ''}`}
          onClick={() => navigate(path)}
        >
          <span className="nav-icon">
            <Icon active={active === key} />
          </span>

          <span className="nav-label">
            {label}
          </span>
        </div>
      ))}
    </nav>
  )
}