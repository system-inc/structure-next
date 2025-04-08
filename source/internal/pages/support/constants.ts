// Description: Constants for the support page
import { SupportTicketStatus } from "@project/source/api/graphql";

const ticketStatusOptions = Object.values(SupportTicketStatus).map((status) => ({
    value: status,
    label: status,
}));

export { ticketStatusOptions };