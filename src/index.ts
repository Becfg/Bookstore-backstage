import {PrismaClient} from '@prisma/client'

const prismaC = new PrismaClient()

async function main() {
	// const user = await prisma.staff.createMany({
	// 		data: [
	// 			{name: "bob", jobId: 1, phoneNumber: "13612342361", passwd: "123456"},
	//
	// 		],
	// 		skipDuplicates: true
	// 	}
	// )
	
	// const user = await  prismaC.staff.findUnique({
	// 	where:{
	// 		id:1
	// 	}
	// })
	const user = await prismaC.staff.findMany()
	console.dir(user)
}

main()
	.catch((e) => {
		throw e
	})
	.finally(async () => {
		await prismaC.$disconnect()
	})