// import { Router } from 'express';
// import { healthcheck } from '../controller/healthcheck.controller.js';

// const router = Router();

// router.route("/").get(healthcheck);

// export default healthcheckRouter 
import { Router } from 'express';
import { healthcheck } from '../controller/healthcheck.controller.js';

const healthcheckRouter = Router();

healthcheckRouter.route("/").get(healthcheck);

export default healthcheckRouter;