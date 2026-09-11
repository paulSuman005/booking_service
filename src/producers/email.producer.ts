import type { NotificationDTO } from "../dto/notification.dto.ts";
import { mailerQueue } from "../queues/mailer.queue.ts";



export const MAILER_PAYLOAD = "payload:mailer";

export const addMailToQueue = async (payload: NotificationDTO) => {
    await mailerQueue.add(MAILER_PAYLOAD, payload);
}