import { useNavigate } from 'react-router-dom'
import './InitialPage.css'

export default function InitialPage() {
  const navigate = useNavigate()

  return (
    <div className="initial-page">
      <div className="initial-brand">
        <p className="initial-subtitle">AI 영어 회화 파트너</p>
        <h1 className="initial-logo"><span>L</span>ingua Bot</h1>
      </div>

      <div className="initial-penguin">
        <div className="penguin-wrapper">
          <img src="/링구.png" className="penguin-emoji" alt="링구" />
          <div className="penguin-shadow" />
        </div>
      </div>

      <div className="initial-buttons">
        <button className="btn btn-primary" onClick={() => navigate('/login')}>
          로그인
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/signup')}>
          회원가입
        </button>
      </div>
    </div>
  )
}
