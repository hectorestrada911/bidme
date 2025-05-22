export interface FormData {
  title: string
  description: string
  quantity: number
  budget: number
  deadline: string
  category: string
}

export interface FormErrors {
  title?: string
  description?: string
  quantity?: string
  budget?: string
  deadline?: string
  category?: string
}
