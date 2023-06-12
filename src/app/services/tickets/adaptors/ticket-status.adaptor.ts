import { Dictionary } from 'src/app/interfaces/dictionary.interface';
import { TicketStatusInterface } from '../../../interfaces/tickets/ticket-status.interface';

export function ticketStatusAdaptor(ticketsStatusTypes: TicketStatusInterface[]): Dictionary {
  return ticketsStatusTypes.map((status) => {
    return {
      key: status.status,
      value: status.title
    };
  });
}