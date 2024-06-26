import express from "express";
import cors from "cors";
import api from './api'
import interC from "./util/interceptor";

const app = express();
const port = 8000;
app.use(cors(
	{
		origin: '*', // 允许所有来源  
		methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'], // 允许的HTTP方法  
		allowedHeaders: ['Content-Type', 'Authorization'],
		exposedHeaders: ['Content-Type', 'Authorization']
	}))
app.use(express.json())

app.use("/api", api)
app.use(interC)

app.listen(port, () => {
	console.log("listening at port:" + port);
});

