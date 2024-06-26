export interface Sale {
  id?: number
  date: string
  salespersonId: number
  salesDetail?: SalesDetail
  [property: string]: any
}

export interface SalesDetail {
  id: number
  saleId?: number
  bookId: number
  quantity: number
  price: number
  [property: string]: any
}
