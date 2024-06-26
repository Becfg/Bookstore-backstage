export interface Book {
  id?: number
  name: string
  author: string
  publisher: string
  ISBN: string
  version: string
  price: number
  categoryId: number
}


export interface BookCategory {
  id?: number
  name: string
}