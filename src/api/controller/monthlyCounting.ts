import {PrismaClient, Prisma} from '@prisma/client'

import {common} from "../../type/common";
import controller = common.controller;


const prisma = new PrismaClient()

const monthlyCounting: controller = {
	getMonthlyCountingList: async (req, res) => {
		const monthlyCountingList = await prisma.monthlyCounting.findMany()
		
		function formatDateToYYYYMM(date: Date) {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			return `${year}-${month}`;
		}
		
		let reslist: any = []
		for (const i of monthlyCountingList) {
			// 获取上月库存数
			const lastMonth = await prisma.monthlyCounting.findUnique({
				where: {
					bookId_month: {
						bookId: i.bookId,
						month: formatDateToYYYYMM(new Date(new Date(i.month).setMonth(new Date(i.month).getMonth() - 1)))/*获取上个月*/
					}
				},
				select: {
					countRealNumbers: true
				}
			})
			
			// 获取今日进货数
			const purchase = await prisma.purchaseDetails.aggregate({
				where: {
					purchase: {
						date: {
							gte: new Date(i.month),
							lte: new Date(new Date(i.month).getFullYear(), new Date(i.month).getMonth() + 1, 0)/*获取一个月最后一天*/
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
							gte: new Date(i.month),
							lte: new Date(new Date(i.month).getFullYear(), new Date(i.month).getMonth() + 1, 0)/*获取一个月最后一天*/
						}
					},
					bookId: i.bookId
				},
				_sum: {quantity: true}
			})
			
			let lastMonthInventory = lastMonth ? lastMonth.countRealNumbers : 0
			let MonthSArrival = purchase._sum.quantity ? purchase._sum.quantity : 0
			let saleOfTheMonth = sale._sum.quantity ? sale._sum.quantity : 0
			let currentInventory = lastMonthInventory + MonthSArrival - saleOfTheMonth
			let waxingAndWaning = i.countRealNumbers - currentInventory
			
			reslist.push({
				...i,
				lastMonthInventory,
				MonthSArrival,
				saleOfTheMonth,
				currentInventory,
				waxingAndWaning
			})
		}
		
		
		res.send(reslist)
	},
	
	addMonthlyCounting: async (req, res) => {
		try {
			const addMonthlyCounting = await prisma.monthlyCounting.create({data: req.body})
			res.send(addMonthlyCounting)
		} catch
			(e) {
			res.status(400).send(e)
		}
	},
	
	modifyMonthlyCountingInfo: async (req, res) => {
		req.body.month ? req.body.month : null
		const {id, ...data} = req?.body
		let monthlyCounting: Prisma.monthlyCountingUpdateArgs = {
			where: {
				id
			},
			data
		}
		try {
			const modifyMonthlyCounting = await prisma.monthlyCounting.update(monthlyCounting)
			res.send(modifyMonthlyCounting)
		} catch (e) {
			res.status(400).send(e)
		}
	},
	
	deleteMonthlyCounting: async (req, res) => {
		const {id} = req.params
		try {
			const delMonthlyCounting = await prisma.monthlyCounting.delete({
				where: {
					id: parseInt(id)
				}
			})
			res.send(delMonthlyCounting)
		} catch (e) {
			res.status(400).send(e)
		}
	}
}


export default monthlyCounting