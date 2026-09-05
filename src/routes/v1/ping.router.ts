import express from "express";
import { pingController } from "../../controller/ping.controller.ts";
import { validateRequestBody } from "../../validators/index.ts";
import { pingSchema } from "../../validators/ping.validator.ts";


const pingRouter = express.Router();

pingRouter.get("/", validateRequestBody(pingSchema), pingController);

export default pingRouter;