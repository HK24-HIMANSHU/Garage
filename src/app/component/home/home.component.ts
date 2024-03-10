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
          servicedate: item.servicedate,
          phonenumber: item.phonenumber,
          fullname: item.fullname,
          carmodel: item.carmodel[0].name,
          price: item.price,
          car_purchase_time: item.car_purchase_time,
          car_reg_no: item.car_reg_no,
          servicetype:item.servicetype,
        } as Servicing
      });
      console.log(response);
    },
      (error)=>{
        console.log('Error fetching',error);
      });
  }
}
