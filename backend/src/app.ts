import express, { Express } from "express"
import bodyParser from "body-parser"
import cors from "cors"
import "dotenv/config"
import userRoutes from "./http/routes/userRoutes"
import courseRoutes from "./http/routes/courseRoutes"

export const app: Express = express()

app.use(cors())
app.use(bodyParser.json())

userRoutes(app)
courseRoutes(app)
