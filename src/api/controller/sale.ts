import {Prisma, PrismaClient} from '@prisma/client'

import {common} from "../../type/common";
import controller = common.controller;
import {decimalToFloatExtension} from "../client";

const prisma = new PrismaClient().$extends(decimalToFloatExtension)

const sale: controller = {
	getSaleList: async (_req, res) => {
		// 查询所有销售数据，包括其销售明细
		const sales = await prisma.sale.findMany({
			include: {
				salesDetail: true
			}
		});
		// 计算每个销售的总金额
		const salesWithTotalAmount = sales.map(sale => {
			const totalAmount = sale.salesDetail.reduce((acc, detail) => {
				return acc + (detail.quantity * detail.price);
			}, 0);
			const {salesDetail, ...res} = sale
			return {...res, theTotalAmount: parseFloat(totalAmount.toFixed(2))}
		});
		
		res.send(salesWithTotalAmount)
	},
	getSalesDetail: async (req, res) => {
		const saleId = Number(req.params.saleId)
		const salesDetail = await prisma.salesDetail.findMany({
			where: {
				saleId: saleId
			}
			
		})
		res.send(salesDetail)
	},
	getSalesDetailRefer: async (req, res) => {
		const saleId = Number(req.params.saleId)
		const salesDetail = await prisma.salesDetail.findMany({
			where: {
				saleId: saleId
			},
			include: {
				book: true,
				sale: true
			},
			omit: {
				saleId: true,
				bookId: true
			}
		})
		res.send(salesDetail)
	},
	
	addSale: async (req, res) => {
		const {body} = req
		try {
			const addSale = await prisma.sale.create({
				data: {
					salespersonId: body.salespersonId,
					date: new Date(body?.date),
					salesDetail: {
						createMany: {
							data: body?.salesDetail ?? [] //默认值
						}
					}
				}
			})
			res.send(addSale)
		} catch (e) {
			res.status(400).send(e)
		}
	},
	
	modifySaleInfo: async (req, res) => {
		const {body} = req
		const sale: Prisma.saleUpdateArgs = body?.salesDetail ? {
			where: {
				id: body?.id
			},
			data: {
				salespersonId: body?.salespersonId,
				date: new Date(body?.date),
				salesDetail: {
					upsert: {
						create: {
							bookId: body?.salesDetail.bookId,
							quantity: body?.salesDetail.quantity,
							price: body?.salesDetail.price,
						},
						where: {
							id: body?.salesDetail.id ?? 0,//默认值
						},
						update: {
							bookId: body?.salesDetail.bookId,
							quantity: body?.salesDetail.quantity,
							price: body?.salesDetail.price,
						}
					}
				}
			}
		} : { //处理空明细
			where: {
				id: body?.id
			},
			data: {
				salespersonId: body?.salespersonId,
				date: new Date(body?.date),
			}
		}
		try {
			const modifySale = await prisma.sale.update(sale)
			res.send(modifySale)
		} catch (e) {
			res.status(400).send(e)
		}
	},
	
	deleteSale: async (req, res) => {
		const {id} = req.params
		try {
			const delSale = await prisma.sale.delete({
				where: {
					id: parseInt(id)
				}
			})
			res.send(delSale)
		} catch (e) {
			res.status(400).send(e)
		}
	},
	deleteSalesDetail: async (req, res) => {
		const {saleId, id} = req.query
		try {
			const delSale = await prisma.salesDetail.delete({
				where: {
					saleId: Number(saleId),
					id: Number(id)
				}
			})
			res.send(delSale)
		} catch (e) {
			res.status(400).send(e)
		}
	}
}
export default sale