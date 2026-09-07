import { Router, type IRouter } from "express";
import healthRouter from "./health";
import cropguardRouter from "./cropguard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(cropguardRouter);

export default router;
