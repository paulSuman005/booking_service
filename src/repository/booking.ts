import { prismaClient } from "../prisma/client.ts";
import { Prisma, type IdempotencyKey } from "../prisma/generated/client.ts";
import { validate as isValidUUID } from "uuid";
import { BadRequestError, NotFoundError } from "../utils/error/app.error.ts";


export async function createBooking(bookingInput: Prisma.BookingCreateInput) {
    const booking = await prismaClient.booking.create({
        data: bookingInput
    });

    return booking;
}

export async function createIdempotencyKey(key: string, bookingId: number) {
    const idempotencyKey = await prismaClient.idempotencyKey.create({
        data: {
            idemKey: key,
            booking: {
                connect: {
                    id: bookingId
                }
            }
        }
    })

    return idempotencyKey;
}

export async function getIdempotencyKeyWithLock(tx: Prisma.TransactionClient, key: string) {

    if(!isValidUUID(key)){ // we should keep this validation here bcz we don't what are services going use this and there can be case they have not implemented this.
        throw new BadRequestError("Invalid Idempotency key format");
    }

    // In mysql select for update enable locking on that row
    const idempotencyKey: IdempotencyKey[] = await tx.$queryRaw`
        SELECT * FROM IdempotencyKey WHERE idemKey = ${key} FOR UPDATE
    `; // this is a select query and it will return an array

    if(!idempotencyKey || idempotencyKey.length === 0) {
        throw new NotFoundError("Idempotency key is not found");
    }

    return idempotencyKey[0];
}

export async function confirmBooking(tx: Prisma.TransactionClient, bookingId: number) {
    const booking = await tx.booking.update({
        where: {
            id: bookingId
        },
        data: {
            status: "CONFIRMED"
        }
    });

    return booking;
}

export async function cancelBooking(bookingId: number) {
    const booking = await prismaClient.booking.update({
        where: {
            id: bookingId
        },
        data: {
            status: "CANCELED"
        }
    });

    return booking;
}

export async function finalizeIdempotencyKey(tx: Prisma.TransactionClient, key: string) {
    const idempotencyKey = await tx.idempotencyKey.update({
        where: {
            idemKey: key
        },
        data: {
            finalized: true
        }
    });

    return idempotencyKey;
}