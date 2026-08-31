import { Router } from 'express';
import { healthcheck } from '../controller/healthcheck.controller.js';

const router = Router();

router.route("/").get(healthcheck);

export { router as healthcheckRouter };