// Dependencies - Main Components
import { Badge } from '@structure/source/components/badges/Badge';
import { BorderContainer } from '../BorderContainer';

// Component - TicketHeader
export interface TicketHeaderProperties {
    subject: string;
    status: string;
}
export function TicketHeader(properties: TicketHeaderProperties) {
    // Render the component
    return (
        <BorderContainer>
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-base font-medium">{properties.subject}</h2>
                    <Badge variant="Informative">{properties.status}</Badge>
                </div>
            </div>
        </BorderContainer>
    );
}
