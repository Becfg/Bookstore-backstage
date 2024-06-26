import {PrismaClient, Prisma} from '@prisma/client'

import {common} from "../../type/common";
import controller = common.controller;


const prisma = new PrismaClient()

const book: controller = {
	getBookList: async (req, res) => {
		const bookList = await prisma.book.findMany()
		const toNum = bookList.map((book) => {
			const price = book.price.toNumber()
			return {...book, price}
		})
		res.send(toNum)
	},
	
	addBook: async (req, res) => {
		try {
			const book =  await prisma.book.create({data: req.body})
			res.send(book)
		} catch
			(e) {
			res.status(400).send(e)
		}
	},
	
	modifyBookInfo: async (req, res) => {
		const {id, ...data} = req.body
		let bookU: Prisma.bookUpdateArgs = {
			where: {
				id
			},
			data
		}
		try {
			const book = await prisma.book.update(bookU)
			res.send(book)
		} catch (e) {
			res.status(400).send(e)
		}
	},
	
	deleteBook: async (req, res) => {
		const {id} = req.params
		try {
			const book = await prisma.book.delete({
				where: {
					id: parseInt(id)
				}
			})
			res.send(book)
		} catch (e) {
			res.status(400).send(e)
		}
	}
}


export default book