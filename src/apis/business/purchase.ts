import http from '..'
import { PurchaseCreate, PurchaseUpdate } from '@/views/business/type'

export async function getPurchaseList() {
  return new Promise((resolve, reject) => {
    http
      .get('/api/purchase', {
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

export async function getPurchaseDetailRefer(id: number) {
  return new Promise((resolve, reject) => {
    http
      .get(`/api/purchaseDetailsRefer/${id}`, {
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

export async function postPurchase(form: PurchaseCreate) {
  return new Promise((resolve, reject) => {
    http
      .post('/api/purchase', form, {
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

export async function putPurchase(form: PurchaseCreate | PurchaseUpdate) {
  return new Promise((resolve, reject) => {
    http
      .put(`/api/purchase`, form)
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

export async function deletePurchase(id: number) {
  return new Promise((resolve, reject) => {
    http
      .delete(`/api/purchase/${id}`)
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

export async function deletePurchaseDetail(id: number, purchaseId: number) {
  return new Promise((resolve, reject) => {
    http
      .delete(`/api/purchase?id=${id}&saleId=${purchaseId}`)
      .then((res) => {
        return resolve(res.data)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}
