import {Prisma} from '@prisma/client'

export const decimalToFloatExtension = Prisma.defineExtension({
	name: 'DecimalToFloat',
	result: {
		book: {
			price: {
				needs: {price: true},
				compute(model) {
					return parseFloat(model.price.toString());
				}
			}
		}, salesDetail: {
			price: {
				needs: {price: true},
				compute(model) {
					return parseFloat(model.price.toString());
				}
			}
		}, purchaseDetails: {
			price: {
				needs: {price: true},
				compute(model) {
					return parseFloat(model.price.toString());
				}
			}
		}
	}
});


