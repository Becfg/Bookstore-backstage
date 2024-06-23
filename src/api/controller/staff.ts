import {PrismaClient, Prisma} from '@prisma/client'

import {common} from "../../type/common";
import controller = common.controller;


const prisma = new PrismaClient()

const staff: controller = {
	getStaffList: async (req, res) => {
		const staffList = await prisma.staff.findMany()
		res.send(staffList)
	},
	
	addStaff: async (req, res) => {
		try {
			const addStaff = await prisma.staff.create({data: req.body})
			res.send(addStaff)
		} catch
			(e) {
			res.status(400).send(e)
		}
	},
	
	modifyStaffInfo: async (req, res) => {
		const {id, ...data} = req.body
		let staff: Prisma.staffUpdateArgs = {
			where: {
				id
			},
			data
		}
		try {
			const modifyStaff = await prisma.staff.update(staff)
			res.send(modifyStaff)
		} catch (e) {
			res.status(400).send(e)
		}
	},
	
	deleteStaff: async (req, res) => {
		const {id} = req.params
		try {
			const delStaff = await prisma.staff.delete({
				where: {
					id: parseInt(id)
				}
			})
			res.send(delStaff)
		} catch (e) {
			res.status(400).send(e)
		}
	}
}


export default staff