import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

  // 개발용 임시 로그인 유저
  const DEV_USER = {
    id: 1,
    nickname: 'test',
    accessToken: 'dev-token'
  }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const saveUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('accessToken', userData.accessToken)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, saveUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
