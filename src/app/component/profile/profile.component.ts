import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../../shared/modal/modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  public id!: number;
  public profileData: any;
  public carModel!: string;
  public carRegNo!: string;

  constructor(private route: ActivatedRoute, private auth: SupabaseService,public dialog: MatDialog) {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.carModel = params['carModel'];
      this.carRegNo = params['registrationNo'];
      console.log(this.id,this.carModel,this.carRegNo);
    });
  }

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  fetchUserProfile(): void {
    this.auth.getUserProfile(Number(this.id)).subscribe(
      (response) => {
        if (response.data && response.data.length > 0) {
          this.profileData = response.data; // Assuming that you are getting an array of user data
          console.log(this.profileData, 'Fetched user profile');
        } else {
          console.log('User not found');
        }
      },
      (error) => {
        console.error('Error fetching user profile', error);
      }
    );
  }

  openSendDetailsDialog(profile: any){
    const dialogRef = this.dialog.open(ModalComponent,{
      width:'400px',
      data:{
        fullname: this.profileData[0]?.fullname,
        phonenumber: this.profileData[0]?.phonenumber,
        address: this.profileData[0]?.address,
        carModel: this.carModel,
        carRegNo: this.carRegNo,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
    });
  }
}
