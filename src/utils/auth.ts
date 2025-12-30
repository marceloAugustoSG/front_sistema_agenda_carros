// Usuário mockado
export const MOCK_USER = {
  email: "admin@concessionaria.com",
  password: "admin123",
  name: "Administrador",
  avatar: "/avatars/shadcn.jpg",
}

export interface User {
  email: string
  name: string
  avatar: string
}

const AUTH_KEY = "auth_user"

// Função para fazer login
export function login(email: string, password: string): boolean {
  if (email === MOCK_USER.email && password === MOCK_USER.password) {
    const user: User = {
      email: MOCK_USER.email,
      name: MOCK_USER.name,
      avatar: MOCK_USER.avatar,
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify(user))
    return true
  }
  return false
}

// Função para fazer logout
export function logout(): void {
  localStorage.removeItem(AUTH_KEY)
}

// Função para verificar se o usuário está autenticado
export function isAuthenticated(): boolean {
  const user = localStorage.getItem(AUTH_KEY)
  return user !== null
}

// Função para obter o usuário atual
export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem(AUTH_KEY)
  if (!userStr) return null
  
  try {
    return JSON.parse(userStr) as User
  } catch {
    return null
  }
}

