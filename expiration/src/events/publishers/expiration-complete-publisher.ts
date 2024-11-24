import { ExpirationCompleteEvent, Publisher, Subjects } from "@arjtickets/common";

export class ExpirationCompletePublisher extends Publisher <ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}