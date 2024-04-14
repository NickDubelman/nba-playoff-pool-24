// YYYY-MM-DD (ex: 2024-04-20)
export function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const haventPlayedYet: { name: string; team: string }[] = []
