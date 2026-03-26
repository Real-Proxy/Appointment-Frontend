import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { BookModal } from '../../components/book-modal/book-modal';
import { AppointmentService, Slot, Appointment } from '../../services/appointment';
import { forkJoin, finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Navbar, BookModal],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  userName = '';
  slots: Slot[] = [];
  myAppointments: Appointment[] = [];
  showBookModal = false;
  loading = true;
  error = '';

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userName = user.name || 'User';
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.error = '';

    forkJoin({
      slots: this.appointmentService.getSlots(),
      appointments: this.appointmentService.getMyAppointments()
    }).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (res) => {
        if (res.slots.success) {
          this.slots = res.slots.data || [];
        } else {
          this.error = res.slots.message;
        }

        if (res.appointments.success) {
          this.myAppointments = res.appointments.data || [];
        } else {
          this.error = this.error || res.appointments.message;
        }
      },
      error: (err) => {
        if (err.status === 401) {
          this.error = 'Unauthorized. Please check if your login token is valid.';
        } else {
          this.error = 'Failed to connect to the server. Make sure the backend is running.';
        }
      }
    });
  }

  openBookModal() {
    this.showBookModal = true;
  }

  onModalClose() {
    this.showBookModal = false;
  }

  onSlotBooked() {
    this.showBookModal = false;
    this.loadData();
  }

  cancelAppointment(id: number) {
    this.appointmentService.cancelAppointment(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadData();
        }
      },
      error: () => {
        this.error = 'Failed to cancel appointment';
      }
    });
  }

  getAvailableSlots(): Slot[] {
    return this.slots.filter(s => !s.isBooked);
  }

  getBookedSlots(): Slot[] {
    return this.slots.filter(s => s.isBooked);
  }

  formatTime(time: string): string {
    const parts = time.split(':');
    let hours = parseInt(parts[0]);
    const mins = parts[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${mins} ${ampm}`;
  }
}
