import { Router } from "express";
import {verifyJwt} from "../middlewares/auth.middleware.js"
import { healthcheck } from "../controllers/helthcheck.controller.js";
const router = Router()

router.route("/helth-check").get(verifyJwt,healthcheck)
export default router