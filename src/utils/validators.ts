/**
 * Utilitários para validação de dados
 */

/**
 * Valida se um CPF é válido
 * Verifica formato e dígitos verificadores
 * 
 * @param cpf - CPF a ser validado (com ou sem máscara)
 * @returns true se o CPF é válido
 */
export const validarCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cpfLimpo = cpf.replace(/\D/g, "")

  // Verifica se tem 11 dígitos
  if (cpfLimpo.length !== 11) {
    return false
  }

  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1{10}$/.test(cpfLimpo)) {
    return false
  }

  // Validação dos dígitos verificadores
  let soma = 0
  let resto

  // Valida primeiro dígito verificador
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i)
  }
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false

  // Valida segundo dígito verificador
  soma = 0
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i)
  }
  resto = (soma * 10) % 11
  if (resto === 10 || resto === 11) resto = 0
  if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false

  return true
}

/**
 * Valida se um telefone brasileiro é válido
 * Aceita telefones com 10 ou 11 dígitos (com DDD)
 * 
 * @param telefone - Telefone a ser validado (com ou sem máscara)
 * @returns true se o telefone é válido
 */
export const validarTelefone = (telefone: string): boolean => {
  const telefoneLimpo = telefone.replace(/\D/g, "")
  
  // Telefone deve ter 10 ou 11 dígitos (com DDD)
  return telefoneLimpo.length === 10 || telefoneLimpo.length === 11
}

/**
 * Valida se um email é válido
 * 
 * @param email - Email a ser validado
 * @returns true se o email é válido
 */
export const validarEmail = (email: string): boolean => {
  if (!email) return true // Email é opcional
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
