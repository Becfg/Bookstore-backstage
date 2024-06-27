import {common} from "../type/common";
import request = common.request;
import jwt from "./jwt";

const interC: request = (req, res, next) => {
	// 过滤登录接口
	if (req.url === "/api/login") {
		next();
		return;
	}
	// 从headers中拿token
	const token = req.headers["authorization"];
	// 解析token
	const paload = jwt.verify(token!.split(" ")[1] || '');
	// 重新生成token
	if (token && paload) {
		const {username, password}: any = paload
		const newToken = jwt.creat({username, password})
		// 重新设置token
		res.setHeader('Authorization', newToken);
		next();
	} else {
		// 返回错误
		res.status(401);
		res.send({
			success: false,
			message: 'token失效'
		});
	}
}

export default interC