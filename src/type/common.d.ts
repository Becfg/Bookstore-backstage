import {Request, Response} from "express";

declare namespace common {
	interface controller {
		[key: string]: request;
	}
	
	interface request {
		(req: Request, res: Response,next?) : any |void
	}
}
declare module 'jsonwebtoken'