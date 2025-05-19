// Description: Constants for the support page

// Dependencies - API
import { SupportTicketStatus } from "@project/source/api/graphql";

// const ticketStatusOptions =
//     Object.values(SupportTicketStatus)
//         .filter((status) => status !== SupportTicketStatus.Deleted)
//         .map((status) => ({
//             value: status,
//             label: status,
//         }));

const ticketStatusOptions = [
    {
        value: SupportTicketStatus.Open,
        label: 'Open',
    },
    {
        value: SupportTicketStatus.Closed,
        label: 'Closed',
    },
]

export { ticketStatusOptions };