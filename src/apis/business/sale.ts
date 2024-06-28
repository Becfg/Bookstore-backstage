import http from '..'
import { SaleCreate, SaleUpdate } from '@/views/business/type'

export async function getSaleList() {
  return new Promise((resolve, reject) => {
    http
      .get('/api/sale', {
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

export async function getSaleDetailRefer(id: number) {
  return new Promise((resolve, reject) => {
    http
      .get(`/api/saleDetailRefer/${id}`, {
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

export async function postSale(form: SaleCreate) {
  return new Promise((resolve, reject) => {
    http
      .post('/api/sale', form, {
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

export async function putSale(form: SaleCreate | SaleUpdate) {
  return new Promise((resolve, reject) => {
    http
      .put(`/api/sale`, form)
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

export async function deleteSale(id: number) {
  return new Promise((resolve, reject) => {
    http
      .delete(`/api/sale/${id}`)
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

export async function deleteSaleDetail(id: number, saleId: number) {
  return new Promise((resolve, reject) => {
    http
      .delete(`/api/salesDetail?id=${id}&saleId=${saleId}`)
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}
