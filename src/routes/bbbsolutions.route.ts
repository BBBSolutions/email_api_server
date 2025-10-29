import express from "express"
import { bbbsolutionsContactController } from "../controllers/bbbsolutions.controller" 

const router = express.Router()

router.post("/contact", bbbsolutionsContactController)

export default router