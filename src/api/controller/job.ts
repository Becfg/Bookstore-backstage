import {PrismaClient} from '@prisma/client'

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
			res.send(addJob)
		} catch (e) {
			res.status(400).send(e)
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
			res.status(400).send(e)
		}
	}
}


export default job