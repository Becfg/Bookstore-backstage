import { Book } from '../book/type'

export interface SaleCreate {
  id?: number
  date: string
  salespersonId: number
  theTotalAmount?: number
  salesDetail?: SalesDetails[]
  [property: string]: any
}

export interface SalesDetails {
  id?: number
  sale?: SaleCreate
  book?: Book
  quantity: number
  price: number
  [property: string]: any
}

export interface SalesDetail {
  id?: number
  saleId?: number
  bookId?: number
  quantity: number
  price: number
  [property: string]: any
}

export interface SaleUpdate {
  id?: number
  date?: string
  salespersonId: number
  salesDetail?: SalesDetail
  [property: string]: any
}

export interface PurchaseCreate {
  id?: number
  date?: string
  vendorId: number
  operatorId: number
  theTotalAmount?: number
  purchaseDetails?: PurchaseDetails[]
  [property: string]: any
}

export interface PurchaseDetails {
  id?: number
  quantity: number
  price: number
  book?: Book
  purchase?: PurchaseCreate
  [property: string]: any
}

export interface PurchaseUpdate {
  id?: number
  date?: string
  vendorId: number
  operatorId: number
  purchaseDetails?: PurchaseDetail
  [property: string]: any
}

export interface PurchaseDetail {
  id?: number
  purchaseId?: number
  bookId?: number
  price: number
  quantity: number
  [property: string]: any
}
