import {Request, Response} from "express";

declare namespace common {
	interface controller {
		[key:string]: (req: Request, res: Response) => Promise<void>;
	}
}