/**
 * Utilitários para formatação de dados
 */

/**
 * Remove todos os caracteres não numéricos de uma string
 */
export const removeNonNumeric = (value: string): string => {
  return value.replace(/\D/g, "")
}

/**
 * Aplica máscara de telefone brasileiro
 * Formato: (XX)XXXXXXXXX
 * 
 * @param value - Valor a ser formatado
 * @returns Telefone formatado
 * 
 * @example
 * aplicarMascaraTelefone("11999316632") // "(11)999316632"
 */
export const aplicarMascaraTelefone = (value: string): string => {
  const apenasNumeros = removeNonNumeric(value)
  const numerosLimitados = apenasNumeros.slice(0, 11)

  if (numerosLimitados.length <= 2) {
    return numerosLimitados
  }

  return `(${numerosLimitados.slice(0, 2)})${numerosLimitados.slice(2)}`
}

/**
 * Aplica máscara de CPF
 * Formato: XXX.XXX.XXX-XX
 * 
 * @param value - Valor a ser formatado
 * @returns CPF formatado
 * 
 * @example
 * aplicarMascaraCPF("12948461758") // "129.484.617-58"
 */
export const aplicarMascaraCPF = (value: string): string => {
  const apenasNumeros = removeNonNumeric(value)
  const numerosLimitados = apenasNumeros.slice(0, 11)

  if (numerosLimitados.length <= 3) {
    return numerosLimitados
  }

  if (numerosLimitados.length <= 6) {
    return `${numerosLimitados.slice(0, 3)}.${numerosLimitados.slice(3)}`
  }

  if (numerosLimitados.length <= 9) {
    return `${numerosLimitados.slice(0, 3)}.${numerosLimitados.slice(3, 6)}.${numerosLimitados.slice(6)}`
  }

  return `${numerosLimitados.slice(0, 3)}.${numerosLimitados.slice(3, 6)}.${numerosLimitados.slice(6, 9)}-${numerosLimitados.slice(9, 11)}`
}

/**
 * Remove máscara de telefone, retornando apenas números
 */
export const removerMascaraTelefone = (value: string): string => {
  return removeNonNumeric(value)
}

/**
 * Remove máscara de CPF, retornando apenas números
 */
export const removerMascaraCPF = (value: string): string => {
  return removeNonNumeric(value)
}
