import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Slot {
  slotID: number;
  startTime: string;
  endTime: string;
  createdBy: string;
  isBooked: boolean;
}

export interface Appointment {
  appointmentID: number;
  slotStartTime: string;
  slotEndTime: string;
  status: string;
  bookedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private baseUrl = 'http://localhost:5142/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const token = localStorage.getItem('token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getSlots(): Observable<ApiResponse<Slot[]>> {
    return this.http.get<ApiResponse<Slot[]>>(
      `${this.baseUrl}/appointments/slots`,
      { headers: this.getHeaders() }
    );
  }

  bookSlot(slotId: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}/appointments/book`,
      { slotId },
      { headers: this.getHeaders() }
    );
  }

  getMyAppointments(): Observable<ApiResponse<Appointment[]>> {
    return this.http.get<ApiResponse<Appointment[]>>(
      `${this.baseUrl}/appointments/my`,
      { headers: this.getHeaders() }
    );
  }

  cancelAppointment(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${this.baseUrl}/appointments/${id}`,
      { headers: this.getHeaders() }
    );
  }
}
