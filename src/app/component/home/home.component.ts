import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Servicing } from '../../interfaces/servicing';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatChipsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] // Corrected to styleUrls
})
export class HomeComponent implements OnInit {
  servicing: Servicing[] = [];
  filteredServicing: Servicing[] = [];
  selectedDate: Date | null = null;
  private audio = new Audio('assets/mixkit-bell-notification-933.wav');

  constructor(private auth: SupabaseService, public router: Router) {}

  logout(): void {
    this.auth.signOut();
  }

  ngOnInit(): void {
    this.playNotificationSound();
    this.fetchServicingTickets();
    setInterval(() => {
      this.fetchServicingTickets();
    }, 60000);

    // Subscribe to real-time updates
    const channel = this.auth.client
    .channel('public:service_orders_table') // Channel name based on your table
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'service_orders_table' }, payload => {
      console.log('New servicing record added:', payload.new);
      this.fetchServicingTickets();  // Refresh data
      this.playNotificationSound();  // Play sound for new record
    })
    .subscribe();
}

  fetchServicingTickets(): void {
    this.auth.getAllServicing().subscribe((response) => {
      this.servicing = response.data.map((item: any) => {
        return {
          id: item.id,
          servicedate: item.servicedate,
          phonenumber: item.phonenumber,
          fullname: item.fullname,
          carmodel: item.carmodel[0]?.name,
          price: item.price[0].Service_cost,
          car_purchase_time: item.car_purchase_time,
          car_reg_no: item.car_reg_no,
          servicetype: item.servicetype,
          IsServiceCancelled: item.IsServiceCancelled,
          Is_Seasonal_service_added: item.Is_Seasonal_service_added,
          IsCompleted: item.IsCompleted,
          user_profile_id: item.user_profile_id,
        } as Servicing;
      });
      this.filterServicingTickets();
      console.log(response);
    },
    (error) => {
      console.log('Error fetching', error);
    });
  }

  onDateChange(event: any): void {
    this.selectedDate = new Date(event.value);
    this.filterServicingTickets();
  }

  filterServicingTickets(): void {
    if (this.selectedDate) {
      this.filteredServicing = this.servicing.filter(s => {
        const servicingDate = new Date(s.servicedate);
        return servicingDate.toDateString() === this.selectedDate!.toDateString();
      });
    } else {
      this.filteredServicing = this.servicing;
    }
  }

  markAsCompleted(servicing: Servicing): void {
    servicing.IsCompleted = true;
    this.auth.updateServicing(servicing).subscribe((response) => {
      console.log('Servicing ticket updated', response);
      this.filterServicingTickets();
    }, (error) => {
      console.log('Error updating servicing ticket', error);
    });
  }

  viewProfile(servicing: Servicing): void {
    this.router.navigate(['/profile'], {
      queryParams: {
        id: servicing.user_profile_id,
        carModel: servicing.carmodel,
        registrationNo: servicing.car_reg_no,
      }
    });
  }

  // Play notification sound
  playNotificationSound(): void {
    this.audio.play();
  }
}
