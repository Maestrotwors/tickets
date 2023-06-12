import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TicketsStoreService } from 'src/app/services/tickets/tickets.store';
import { TicketsService } from '../../../../services/tickets/tickets.service';

@Component({
  selector: 'app-ticket-new-page',
  templateUrl: './new-ticket-page.component.html',
  styleUrls: ['./new-ticket-page.component.scss'],
  imports: [AsyncPipe, NgIf, NgForOf, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TicketNewPageComponent {
  private ticketsStoreService = inject(TicketsStoreService);
  private ticketsService = inject(TicketsService);
  protected ticketsStatusTypes$ = this.ticketsStoreService.ticketsStatusTypes$;

  ticketForm: FormGroup = new FormGroup({
    id: new FormControl(0, [Validators.required]),
    title: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(1000),
    ]),
    status: new FormControl(0, [Validators.required]),
  });

  createTicket(form: FormGroup) {
    console.log(form.value);
    this.ticketsService.createTicket(form.value);
    this.ticketForm.reset();
    this.ticketForm.controls['status'].patchValue(0);
  }
}
