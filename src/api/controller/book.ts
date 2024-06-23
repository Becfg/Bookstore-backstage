import {PrismaClient, Prisma} from '@prisma/client'

import {common} from "../../type/common";
import controller = common.controller;


const prisma = new PrismaClient()

const book: controller = {
	getBookList: async (req, res) => {
		const bookList = await prisma.book.findMany()
		res.send(bookList)
	},
	
	addBook: async (req, res) => {
		try {
			const addBook = await prisma.book.create({data: req.body})
			res.send(addBook)
		} catch
			(e) {
			res.status(400).send(e)
		}
	},
	
	modifyBookInfo: async (req, res) => {
		const {id, ...data} = req.body
		let book: Prisma.bookUpdateArgs = {
			where: {
				id
			},
			data
		}
		try {
			const modifyBook = await prisma.book.update(book)
			res.send(modifyBook)
		} catch (e) {
			res.status(400).send(e)
		}
	},
	
	deleteBook: async (req, res) => {
		const {id} = req.params
		try {
			const delBook = await prisma.book.delete({
				where: {
					id: parseInt(id)
				}
			})
			res.send(delBook)
		} catch (e) {
			res.status(400).send(e)
		}
	}
}


export default book