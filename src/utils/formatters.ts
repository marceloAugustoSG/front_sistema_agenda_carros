
export const removeNonNumeric = (value: string): string => {
  return value.replace(/\D/g, "")
}


export const aplicarMascaraTelefone = (value: string): string => {
  const apenasNumeros = removeNonNumeric(value)
  const numerosLimitados = apenasNumeros.slice(0, 11)

  if (numerosLimitados.length <= 2) {
    return numerosLimitados
  }

  return `(${numerosLimitados.slice(0, 2)})${numerosLimitados.slice(2)}`
}


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


export const removerMascaraTelefone = (value: string): string => {
  return removeNonNumeric(value)
}


export const removerMascaraCPF = (value: string): string => {
  return removeNonNumeric(value)
}
