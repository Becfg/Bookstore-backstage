import {Prisma, PrismaClient} from '@prisma/client'

import {common} from "../../type/common";
import controller = common.controller;
import {decimalToFloatExtension} from "../client";

const prisma = new PrismaClient().$extends(decimalToFloatExtension)

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
				return acc + (detail.quantity * detail.price);
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
	getPurchaseDetailsRefer: async (req, res) => {
		const purchaseId = Number(req.params.purchaseId)
		const purchaseDetails = await prisma.purchaseDetails.findMany({
			where: {
				purchaseId: purchaseId
			},
			include: {
				book: true,
				purchase: true
			}, omit: {
				purchaseId: true,
				bookId: true
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
					date: new Date(body?.date),
					purchaseDetails: {
						createMany: {
							data: body.purchaseDetails ?? []//默认值
						}
					}
				}
			})
			res.send(addPurchase)
		} catch (e) {
			res.status(400).send(e)
		}
	},
	
	modifyPurchaseInfo: async (req, res) => {
		let {body} = req
		let {vendorId, operatorId, date, purchaseDetails} = body ?? {}
		let {bookId, quantity, price} = purchaseDetails ?? {}
		date = date ? new Date(date) : undefined
		
		try {
			const purchase: Prisma.purchaseUpdateArgs = body?.purchaseDetails ? {
				where: {
					id: body?.id
				},
				data: {
					vendorId,
					operatorId,
					date,
					purchaseDetails: {
						upsert: {
							where: {
								id: body?.purchaseDetails.id ?? 0//默认值
							},
							create: {
								bookId: body?.purchaseDetails.bookId,
								quantity: body?.purchaseDetails.quantity,
								price: body?.purchaseDetails.price,
							},
							update: {
								bookId,
								quantity,
								price,
							}
						}
					}
				}
			} : {//处理空明细
				where: {
					id: body?.id
				},
				data: {
					operatorId,
					vendorId,
					date,
				}
			}
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