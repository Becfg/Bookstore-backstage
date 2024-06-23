import {PrismaClient} from '@prisma/client'

import {common} from "../../type/common";
import controller = common.controller;


const prisma = new PrismaClient()

const category: controller = {
	getCategoryList: async (req, res) => {
		const categoryList = await prisma.category.findMany()
		res.send(categoryList)
	},
	
	addCategory: async (req, res) => {
		try {
			const addCategory = await prisma.category.create({data: req.body})
			res.send(addCategory)
		} catch (e) {
			res.status(400).send(e)
		}
	},
	deleteCategory: async (req, res) => {
		const {id} = req.params
		try {
			const delCategory = await prisma.category.delete({
				where: {
					id: parseInt(id)
				}
			})
			res.send(delCategory)
		} catch (e) {
			res.status(400).send(e)
		}
	}
}


export default category