// Description: Constants for the support page
import { SupportTicketStatus } from '@structure/source/api/graphql/GraphQlGeneratedCode';

const ticketStatusOptions = Object.values(SupportTicketStatus).map((status) => ({
    value: status,
    label: status,
}));

export { ticketStatusOptions };
