// Dependencies - Main Components
import Button from '@structure/source/common/buttons/Button';
import { BorderContainer } from '../BorderContainer';

// Dependencies - Assets
import { DotsThreeVertical, CaretLeft, CaretRight } from '@phosphor-icons/react';

// Component - TicketHeader
export interface TicketHeaderInterface {
    subject: string;
    ticketIndex?: number;
    onTicketIndexChange: (ticketIndex: number) => void;
}
export function TicketHeader(properties: TicketHeaderInterface) {
    // Properties
    const { subject } = properties;

    // Render the component
    return (
        <BorderContainer>
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-base font-medium">{subject}</h2>
                </div>

                { properties.ticketIndex !== undefined && (
                    <div className="flex items-center gap-2">
                        {/* Previous Ticket */}
                        <Button
                            size="icon"
                            icon={CaretLeft}
                            disabled={properties.ticketIndex === 0}
                            onClick={
                                async function () {
                                    properties.onTicketIndexChange(properties.ticketIndex! - 1);
                                }
                            }
                        />

                        {/* Next Ticket */}
                        <Button
                            size="icon"
                            icon={CaretRight}
                            // disabled={}
                            onClick={
                                async function () {
                                    properties.onTicketIndexChange(properties.ticketIndex! + 1);
                                }
                            }
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="focus:border-0"
                            icon={DotsThreeVertical}
                            onClick={async function () {
                                alert('More options clicked');
                            }}
                        />
                    </div>
                )}
            </div>
        </BorderContainer>
    );
}
