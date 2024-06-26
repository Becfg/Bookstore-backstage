import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient().$extends({
		result: {
			book: {
				price: {
					needs: {price: true},
					compute(model) {
						return parseFloat(model.price.toString())
					}
				}
			},
			purchaseDetails: {
				price: {
					needs: {price: true},
					compute(model) {
						return parseFloat(model.price.toString())
					}
				}
			}, salesDetail: {
				price: {
					needs: {price: true},
					compute(model) {
						return parseFloat(model.price.toString())
					}
				}
			}
		}
	}
)


export default prisma