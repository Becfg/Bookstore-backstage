import express from "express";
import cors from "cors";
import api from './api'

const app = express();
const port = 8000;
app.use(cors())
app.use(express.json())


app.use("/api",api)
app.get("/", (req, res) => {
	res.send("hello world");
});


app.listen(port, () => {
	console.log("listening at http://localhost:" + port);
});

