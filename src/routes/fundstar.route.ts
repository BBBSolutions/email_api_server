import express from "express"
import { fundstarContactController } from "../controllers/fundstar.controller"

const router = express.Router()

router.post("/contact", fundstarContactController)

export default router