import {PrismaClient, Prisma} from '@prisma/client'

import {common} from "../../type/common";
import controller = common.controller;


const prisma = new PrismaClient()

const job: controller = {
	getJobList: async (req, res) => {
		const jobList = await prisma.job.findMany()
		res.send(jobList)
	},
	
	addJob: async (req, res) => {
		try {
			const addJob = await prisma.job.create({data: req.body})
			res.status(201).send(addJob)
		} catch (e) {
			res.send(e)
		}
	},
	deleteJob: async (req, res) => {
		const {id} = req.params
		try {
			const delJob = await prisma.job.delete({
				where: {
					id: parseInt(id)
				}
			})
			res.send(delJob)
		} catch (e) {
			res.send(e)
		}
	}
}


export default job