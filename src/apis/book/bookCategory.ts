import { BookCategory } from '@/views/book/type'
import http from '../'

export async function getbookCategoryList() {
  return new Promise((resolve, reject) => {
    http
      .get('/api/category', {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

export async function postBookCategory(form: BookCategory) {
  return new Promise((resolve, reject) => {
    http
      .post('/api/category', form, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

export async function deleteCategory(id: number) {
  return new Promise((resolve, reject) => {
    http
      .delete(`/api/category/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}
