import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Servicing } from '../../interfaces/servicing';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  servicing: Servicing[]=[];

  constructor(private auth: SupabaseService){}
  logout(): void {
    this.auth.signOut();
  }

  ngOnInit(): void {
    this.fetchServicingTickets();
  }

  fetchServicingTickets():void{
    this.auth.getAllServicing().subscribe((response)=>{
      this.servicing = response.data.map((item: any)=>{
        return {
          serviceId: item.serviceId,
          customerName: item.customerName,
          address: item.address,
          phoneNumber: item.phoneNumber,
          carType: item.carType,
          serviceType: item.serviceType,
          timeSlot: item.timeSlot
        } as Servicing
      });
    },
      (error)=>{
        console.log('Error fetching',error);
      });
  }
}
