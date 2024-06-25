import express from "express";
import cors from "cors";
import api from './api'
import interC from "./util/interceptor";

const app = express();
const port = 8000;
app.use(cors())
app.use(express.json())

app.use("/api",api)
app.use(interC)

app.listen(port, () => {
	console.log("listening at http://localhost:" + port);
});

