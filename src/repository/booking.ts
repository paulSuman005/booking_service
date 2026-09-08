import { prismaClient } from "../prisma/client.ts";
import { Prisma } from "../prisma/generated/client.ts";


export async function createBooking(bookingInput: Prisma.BookingCreateInput) {
    const booking = await prismaClient.booking.create({
        data: bookingInput
    });

    return booking;
}

export async function createIdempotencyKey(key: string, bookingId: number) {
    const idempotencyKey = await prismaClient.idempotencyKey.create({
        data: {
            key,
            booking: {
                connect: {
                    id: bookingId
                }
            }
        }
    })

    return idempotencyKey;
}

export async function getIdempotencyKey(key: string) {
    const idempotencyKey = await prismaClient.idempotencyKey.findUnique({
        where: {
            key
        }
    })

    return idempotencyKey;
}

export async function confirmBooking(bookingId: number) {
    const booking = await prismaClient.booking.update({
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

export async function finalizeIdempotencyKey(key: string) {
    const idempotencyKey = await prismaClient.idempotencyKey.update({
        where: {
            key
        },
        data: {
            finalized: true
        }
    });

    return idempotencyKey;
}