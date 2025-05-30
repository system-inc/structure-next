// Dependencies - Main Components
import Badge from '@project/source/ui/base/Badge';
import { BorderContainer } from '../BorderContainer';

// Component - TicketHeader
export interface TicketHeaderInterface {
    subject: string;
    status: string;
}
export function TicketHeader(properties: TicketHeaderInterface) {
    // Properties
    const { subject, status } = properties;

    // Render the component
    return (
        <BorderContainer>
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-base font-medium">{subject}</h2>
                    <Badge variant="info" size="large">
                        {status}
                    </Badge>
                </div>

                {/* <div className="flex items-center gap-4">

                </div> */}
            </div>
        </BorderContainer>
    );
}
