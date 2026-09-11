import { serverConfig } from "../config/index.ts";
import { redlock } from "../config/redis.config.ts";
import type { CreateBookingDTO } from "../dto/booking.dto.ts";
import { prismaClient } from "../prisma/client.ts";
import { confirmBooking, createBooking, createIdempotencyKey, finalizeIdempotencyKey, getIdempotencyKeyWithLock } from "../repository/booking.ts";
import { BadRequestError, InternalServerError, NotFoundError } from "../utils/error/app.error.ts";
import { generateIdempotencyKey } from "../utils/generateIdempotencyKey.ts";


export async function createBookingService(createBookingDTO: CreateBookingDTO) {

    const bookingResource = `hotel:${createBookingDTO.hotelId}`;

    try {
        // we try to acquire lock on the booking resource
        await redlock.acquire([bookingResource], serverConfig.LOCK_TTL);
        
        // if we succeed to acquire lock on the booking resource then below code will execute
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
    } catch (err) {
        // if failed to acquire lock on booking resouce then it throw this error
        console.log("Error in aquiring lock on booking resource: ", err);
        throw new InternalServerError("Failed to aquire lock on booking resource");
    }

    // problem with the below code is when the callback is executed it automatically released the lock
    // return await redlock.using([bookingResource], serverConfig.LOCK_TTL, async () => {
    //     const booking = await createBooking({
    //         userId: createBookingDTO.userId,
    //         hotelId: createBookingDTO.hotelId,
    //         totalGuests: createBookingDTO.totalGuests,
    //         bookingAmount: createBookingDTO.bookingAmount
    //     });

    //     const idempotencyKey = generateIdempotencyKey();

    //     await createIdempotencyKey(idempotencyKey, booking.id);

    //     return {
    //         bookingId: booking.id,
    //         idempotencyKey
    //     }
    // });
};

export async function confirmBookingService(idempotencyKey: string) {
    // const idempotencyKeyData = await getIdempotencyKey(idempotencyKey);

    // if(!idempotencyKeyData){
    //     throw new NotFoundError("Idempotency Key is not found");
    // }

    // if(idempotencyKeyData.finalized){
    //     throw new BadRequestError("Idempotency key already finalized");
    // }

    // const booking = await confirmBooking(idempotencyKeyData.bookingId);
    // await finalizeIdempotencyKey(idempotencyKey);

    // return booking;

    /**
     * Only with the above implementation a problem can arise when user hit the payment button multiple times with very less time
     * let's say in micro sec then It can do twice booking against the single idempotency key, so for prevent concurrency from user
     * we have to implement some locking technique as there only one user can do this and it very less no. of req so we can go with
     * pessamistic locking, we lock on idempotency key so that only one transaction can be performed.
     */

    return await prismaClient.$transaction(async (tx) => {
        const idempotencyKeyData = await getIdempotencyKeyWithLock(tx, idempotencyKey);

        if (!idempotencyKeyData) {
            throw new NotFoundError("Idempotency Key is not found");
        }

        if (idempotencyKeyData.finalized) {
            throw new BadRequestError("Idempotency key already finalized");
        }

        const booking = await confirmBooking(tx, idempotencyKeyData.bookingId);
        await finalizeIdempotencyKey(tx, idempotencyKey);

        return booking;
    })
}