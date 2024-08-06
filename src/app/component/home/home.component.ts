import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Servicing } from '../../interfaces/servicing';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatChipsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  servicing: Servicing[] = [];
  filteredServicing: Servicing[] = [];
  selectedDate: Date | null = null;

  constructor(private auth: SupabaseService) {}

  logout(): void {
    this.auth.signOut();
  }

  ngOnInit(): void {
    this.fetchServicingTickets();
    setInterval(() => {
      this.fetchServicingTickets();
    }, 60000);
  }

  fetchServicingTickets(): void {
    this.auth.getAllServicing().subscribe((response) => {
      this.servicing = response.data.map((item: any) => {
        return {
          id:item.id,
          servicedate: item.servicedate,
          phonenumber: item.phonenumber,
          fullname: item.fullname,
          carmodel: item.carmodel[0].name,
          price: item.price[0].Service_cost,
          car_purchase_time: item.car_purchase_time,
          car_reg_no: item.car_reg_no,
          servicetype: item.servicetype,
          IsServiceCancelled: item.IsServiceCancelled,
          Is_Seasonal_service_added: item.Is_Seasonal_service_added,
          IsCompleted: item.IsCompleted,
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
}
