import type { CreateBookingDTO } from "../dto/booking.dto.ts";
import { confirmBooking, createBooking, createIdempotencyKey, finalizeIdempotencyKey, getIdempotencyKey } from "../repository/booking.ts";
import { BadRequestError, NotFoundError } from "../utils/error/app.error.ts";
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey.ts";


export async function createBookingService(createBookingDTO: CreateBookingDTO) {
    const booking = await createBooking({
        userId: createBookingDTO.userId,
        hotelId: createBookingDTO.hotelId,
        totalGuests: createBookingDTO.totalGuests,
        bookingAmount: createBookingDTO.bookingAmount
    });

    const idempotencyKey = generateIdempotencyKey();

    await createIdempotencyKey(idempotencyKey, booking.id);

    return {
        bookingId: booking.id,
        idempotencyKey
    }
};

export async function confirmBookingService(idempotencyKey: string) {
    const idempotencyKeyData = await getIdempotencyKey(idempotencyKey);

    if(!idempotencyKeyData){
        throw new NotFoundError("Idempotency Key is not found");
    }

    if(idempotencyKeyData.finalized){
        throw new BadRequestError("Idempotency key already finalized");
    }

    const booking = await confirmBooking(idempotencyKeyData.bookingId);
    await finalizeIdempotencyKey(idempotencyKey);

    return booking;
}