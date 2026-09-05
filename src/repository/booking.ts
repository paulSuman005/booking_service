import { prisma } from "../prisma/client.ts";
import { Prisma } from "../prisma/generated/client.ts";


export async function createBooking(bookingInput: Prisma.BookingCreateInput){
    const booking = await prisma.booking.create({
        data: bookingInput
    });

    return booking;
}