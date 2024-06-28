import jwt from "jsonwebtoken"

// 加密token的秘钥，任意值
const secretOrPrivateKey = 'nas8y9n32s'
const Jwt={
	/**
	 *
	 * @param {*} value 要加密的值
	 * @param {*} time 过期时间
	 */
	creat:(value:object,time='6h')=>{
		return jwt.sign(value,secretOrPrivateKey,{expiresIn:time})
	},
	/**
	 *
	 * @param {*} token 要解密的token
	 * @returns 返回解析后的值，里面包括创建的时候传的value，和过期时间。如果出错了或过期返回false
	 */
	verify:(token:string)=>{
		try {
			return jwt.verify(token,secretOrPrivateKey)
		} catch (error) {
			return false;
		}
	}
}
 export default Jwt