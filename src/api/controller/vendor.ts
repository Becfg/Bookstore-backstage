import {PrismaClient, Prisma} from '@prisma/client'

import {common} from "../../type/common";
import controller = common.controller;


const prisma = new PrismaClient()

const vendor: controller = {
	getVendorList: async (req, res) => {
		const vendorList = await prisma.vendor.findMany()
		res.send(vendorList)
	},
	
	addVendor: async (req, res) => {
		try {
			const addVendor = await prisma.vendor.create({data: req.body})
			res.send(addVendor)
		} catch
			(e) {
			res.status(400).send(e)
		}
	},
	
	modifyVendorInfo: async (req, res) => {
		const {id, ...data} = req.body
		let vendor: Prisma.vendorUpdateArgs = {
			where: {
				id
			},
			data
		}
		try {
			const modifyVendor = await prisma.vendor.update(vendor)
			res.send(modifyVendor)
		} catch (e) {
			res.status(400).send(e)
		}
	},
	
	deleteVendor: async (req, res) => {
		const {id} = req.params
		try {
			const delVendor = await prisma.vendor.delete({
				where: {
					id: parseInt(id)
				}
			})
			res.send(delVendor)
		} catch (e) {
			res.status(400).send(e)
		}
	}
}


export default vendor