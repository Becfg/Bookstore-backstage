import {PrismaClient, Prisma} from '@prisma/client'

import {common} from "../../type/common";
import controller = common.controller;
import book from "./book";


const prisma = new PrismaClient()

const dailyCounting: controller = {
	getDailyCountingList: async (req, res) => {
		const dailyCountingList = await prisma.dailyCounting.findMany()
		
		let reslist: any = []
		for (const i of dailyCountingList) {
			// 获取昨日库存数
			const yesterday = await prisma.dailyCounting.findUnique({
				where: {
					bookId_date: {
						bookId: i.bookId,
						date: new Date(new Date(i.date).setDate(new Date(i.date).getDate() - 1))
					}
				},
				select: {
					countRealNumbers: true
				}
			})
			
			// const purchase = await prisma.$queryRaw`SELECT  DATE(purchase.date) AS isDate, purchaseDetails.bookId, Sum(purchaseDetails.quantity) AS 本日进货数
			// FROM purchase INNER JOIN purchaseDetails ON purchase.id = purchaseDetails.purchaseId
			// GROUP BY isDate, purchaseDetails.bookId
			// HAVING (isDate = DATE(${i.date})) AND (purchaseDetails.bookId=${i.bookId});`
			
			// 获取今日进货数
			const purchase = await prisma.purchaseDetails.aggregate({
				where: {
					purchase: {
						date: {
							gte: i.date,
							lte: new Date(new Date(i.date).setHours(23, 59, 59))
						}
					},
					bookId: i.bookId
				},
				_sum: {quantity: true}
			})
			
			const sale = await prisma.salesDetail.aggregate({
				where: {
					sale: {
						date: {
							gte: i.date,
							lte: new Date(new Date(i.date).setHours(23, 59, 59))
						}
					},
					bookId: i.bookId
				},
				_sum: {quantity: true}
			})
			
			let yesterdayInventory = yesterday ? yesterday.countRealNumbers : 0
			let todaySArrival = purchase._sum.quantity ? purchase._sum.quantity : 0
			let saleToday = sale._sum.quantity ? sale._sum.quantity : 0
			let currentInventory = yesterdayInventory + todaySArrival - saleToday
			let waxingAndWaning = i.countRealNumbers - currentInventory
			
			reslist.push({...i, yesterdayInventory, todaySArrival, saleToday,currentInventory,waxingAndWaning})
		}
		
		
		// console.log(reslist)
		res.send(reslist
			// dailyCountingList
		)
	},
	
	addDailyCounting: async (req, res) => {
		req.body.date = new Date(req.body.date)
		try {
			const addDailyCounting = await prisma.dailyCounting.create({data: req.body})
			res.send(addDailyCounting)
		} catch
			(e) {
			res.status(400).send(e)
		}
	},
	
	modifyDailyCountingInfo: async (req, res) => {
		req.body.date ? req.body.date = new Date(req?.body.date) : null
		const {id, ...data} = req?.body
		let dailyCounting: Prisma.dailyCountingUpdateArgs = {
			where: {
				id
			},
			data
		}
		try {
			const modifyDailyCounting = await prisma.dailyCounting.update(dailyCounting)
			res.send(modifyDailyCounting)
		} catch (e) {
			res.status(400).send(e)
		}
	},
	
	deleteDailyCounting: async (req, res) => {
		const {id} = req.params
		try {
			const delDailyCounting = await prisma.dailyCounting.delete({
				where: {
					id: parseInt(id)
				}
			})
			res.send(delDailyCounting)
		} catch (e) {
			res.status(400).send(e)
		}
	}
}


export default dailyCounting