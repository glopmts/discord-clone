import { format, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const formatMessageDate = (date: Date) => {
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export const formatFullDateTime = (date: Date) => {
  return format(date, "dd/MM/yyyy, HH:mm", { locale: ptBR })
}

export const formatDateComplete = (date: Date) => {
  return format(date, "dd/MM/yyyy", { locale: ptBR })
}


export const formatTimeOnly = (date: Date) => {
  return format(date, "HH:mm", { locale: ptBR })
}

export const isFirstMessageOfDay = (messages: any[], index: number) => {
  if (index === 0) return true
  const currentDate = new Date(messages[index].createdAt)
  const prevDate = new Date(messages[index - 1].createdAt)
  return !isSameDay(currentDate, prevDate)
}