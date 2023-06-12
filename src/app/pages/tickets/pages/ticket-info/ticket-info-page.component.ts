import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TicketsStoreService } from 'src/app/services/tickets/tickets.store';
import { TicketsService } from '../../../../services/tickets/tickets.service';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-ticket-info-page',
  templateUrl: './ticket-info-page.component.html',
  styleUrls: ['./ticket-info-page.component.scss'],
  imports: [AsyncPipe, JsonPipe, NgIf, NgForOf, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TicketInfoPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private ticketsService = inject(TicketsService);
  private ticketsStoreService = inject(TicketsStoreService);

  protected selectedTicketId$ = this.ticketsStoreService.selectedTicketId$;
  protected ticketInfo$ = this.ticketsStoreService.ticketInfo$.pipe(
    startWith(null)
  );
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

  updateTicket(form: FormGroup) {
    console.log(form);
  }

  ngOnInit(): void {
    this.route.params.pipe().subscribe((params) => {
      const ticketId = params['ticketId'] || null;
      this.ticketsService.setTicketId(ticketId);
    });

	this.ticketInfo$.subscribe(ticket => {
		this.ticketForm.patchValue({
			id: ticket?.id,
			title: ticket?.title,
			description: ticket?.description,
			status: ticket?.status,
		});
	});
  }

  ngOnDestroy(): void {
    this.ticketsService.setTicketId(null);
    this.ticketsStoreService.ticketInfo$.next(null);
  }
}
