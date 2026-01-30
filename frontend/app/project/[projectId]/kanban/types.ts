export interface BoardHeader {
  id: string | number
  status: string
  color: string
}

export interface CardData {
  id: string | number
  title?: string  
  first_name: string
  last_name: string
  company: string
  email: string
  phone: string
  priority: "high" | "medium" | "low"
  assigned_to: {
    first_name: string
    last_name: string
  }
  created_on: string
}

export interface BoardCardData {
  [boardId: string]: {
    columnData: CardData[]
    total_count: number
  }
}
