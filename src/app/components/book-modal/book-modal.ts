import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentService, Slot } from '../../services/appointment';

@Component({
  selector: 'app-book-modal',
  imports: [CommonModule],
  templateUrl: './book-modal.html',
  styleUrl: './book-modal.css'
})
export class BookModal {
  @Input() availableSlots: Slot[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() booked = new EventEmitter<void>();

  selectedSlotId: number | null = null;
  booking = false;
  error = '';

  constructor(private appointmentService: AppointmentService) {}

  selectSlot(slotId: number) {
    this.selectedSlotId = slotId;
    this.error = '';
  }

  confirmBooking() {
    if (!this.selectedSlotId) return;
    this.booking = true;
    this.error = '';

    this.appointmentService.bookSlot(this.selectedSlotId).subscribe({
      next: (res) => {
        if (res.success) {
          this.booked.emit();
        } else {
          this.error = res.message || 'Booking failed';
        }
        this.booking = false;
      },
      error: () => {
        this.error = 'Something went wrong';
        this.booking = false;
      }
    });
  }

  formatTime(time: string): string {
    const parts = time.split(':');
    let hours = parseInt(parts[0]);
    const mins = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${mins} ${ampm}`;
  }

  closeModal() {
    this.close.emit();
  }
}
