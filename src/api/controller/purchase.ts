import {Prisma, PrismaClient} from '@prisma/client'

import {common} from "../../type/common";
import controller = common.controller;


const prisma = new PrismaClient()

const purchase: controller = {
	getPurchaseList: async (_req, res) => {
		// 查询所有销售数据，包括其销售明细
		const purchases = await prisma.purchase.findMany({
			include: {
				purchaseDetails: true
			}
		});
		// 计算每个销售的总金额
		const purchasesWithTotalAmount = purchases.map(purchase => {
			const totalAmount = purchase.purchaseDetails.reduce((acc, detail) => {
				return acc + (detail.quantity * detail.price.toNumber());
			}, 0);
			const {purchaseDetails, ...res} = purchase
			return {...res, theTotalAmount: parseFloat(totalAmount.toFixed(2))}
		});
		
		res.send(purchasesWithTotalAmount)
	},
	getPurchaseDetails: async (req, res) => {
		const purchaseId = Number(req.params.purchaseId)
		const purchaseDetails = await prisma.purchaseDetails.findMany({
			where: {
				purchaseId: purchaseId
			}
		})
		res.send(purchaseDetails)
	},
	
	addPurchase: async (req, res) => {
		const {body} = req
		try {
			const addPurchase = await prisma.purchase.create({
				data: {
					vendorId: body.vendorId,
					operatorId: body.operatorId,
					purchaseDetails: {
						createMany: {
							data: body.purchaseDetails
						}
					}
				}
			})
			res.send(addPurchase)
		} catch
			(e) {
			res.status(400).send(e)
		}
	},
	
	modifyPurchaseInfo: async (req, res) => {
		const {id, ...data} = req.body
		const purchase: Prisma.purchaseUpdateArgs = data?.purchaseDetails ? {
			where: {
				id
			},
			data: {
				operatorId: data?.operatorId,
				purchaseDetails: {
					update: {
						where: {
							id: data?.purchaseDetails.id
						},
						data: {
							bookId: data?.purchaseDetails.bookId,
							quantity: data?.purchaseDetails.quantity,
							price: data?.purchaseDetails.price
						}
					}
				}
			}
		} : {
			where: {
				id
			},
			data: {
				operatorId: data?.operatorId,
			}
		}
		console.log(purchase)
		try {
			const modifyPurchase = await prisma.purchase.update(purchase)
			res.send(modifyPurchase)
		} catch (e) {
			res.status(400).send(e)
		}
	},
	
	deletePurchase: async (req, res) => {
		const {id} = req.params
		try {
			const delPurchase = await prisma.purchase.delete({
				where: {
					id: parseInt(id)
				}
			})
			res.send(delPurchase)
		} catch (e) {
			res.status(400).send(e)
		}
	},
	deletePurchaseDetails: async (req, res) => {
		const {purchaseId, id} = req.query
		try {
			const delPurchase = await prisma.purchaseDetails.delete({
				where: {
					purchaseId: Number(purchaseId),
					id: Number(id)
				}
			})
			res.send(delPurchase)
		} catch (e) {
			res.status(400).send(e)
		}
	}
}
export default purchase