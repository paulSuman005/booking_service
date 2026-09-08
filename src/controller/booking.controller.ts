import type { Request, Response } from "express"
import { confirmBookingService, createBookingService } from "../services/booking.service.ts"

export const createBookingHandler = async (req: Request, res: Response) => {
    
    const booking = await createBookingService(req.body);

    res.status(201).json({
        bookingId: booking.bookingId,
        idempotencyKey: booking.idempotencyKey
    })
}

interface ConfirmBookingParams {
  idempotencyKey: string;
}

export const confirmBookingHandler = async (req: Request<ConfirmBookingParams>, res: Response) => {
    
    const booking = await confirmBookingService(req.params.idempotencyKey);

    res.status(200).json({
        bookingId: booking.id,
        status: booking.status
    });
}