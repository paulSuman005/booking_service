import express from "express";
import { validateRequestBody } from "../../validators/index.ts";
import { createBookingSchema } from "../../validators/booking.validator.ts";
import { confirmBookingHandler, createBookingHandler } from "../../controller/booking.controller.ts";


const bookingRouter = express.Router();

bookingRouter.post("/", validateRequestBody(createBookingSchema), createBookingHandler);
bookingRouter.post("/confirm/:idempotencyKey", confirmBookingHandler);

export default bookingRouter;