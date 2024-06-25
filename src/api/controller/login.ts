import {PrismaClient, Prisma} from '@prisma/client'

import {common} from "../../type/common";
import request = common.request;
import jwt from "../../util/jwt";

const prisma = new PrismaClient()

const login: request = async (req, res) => {
	const {username, password} = req.body
	
	const userlogin = await prisma.staff.findUnique({
			where: {
				phoneNumber: username ? username.replace(/\s/g, '') : "",
				passwd: password ? password.replace(/\s/g, '') : ""
			}
		}
	)
	if (userlogin != null) {
		const token = jwt.creat({username, password})
		res.header("Authorization", token)
		res.send({
			success: true
		})
	} else {
		res.send({
			success: false
		});
	}
}

export default login