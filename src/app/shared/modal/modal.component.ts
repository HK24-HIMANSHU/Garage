import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, MatFormField, MatLabel, FormsModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  phoneNumber: string = '';
  formattedPhoneNumber: string = '';
  details: string;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.details = `User Details:\n
    Full Name: ${data.fullname}\n
    Phone Number: ${data.phonenumber}\n
    Address: ${data.address} \n
    CarModel: ${data.carModel} \n
    Registration No: ${data.carRegNo}`;
  }

  prependCountryCode(value: string): void {
    this.formattedPhoneNumber = value.startsWith('+91') ? value : '+91' + value;
  }

  onSend(): void {
    this.prependCountryCode(this.phoneNumber)
    if (this.formattedPhoneNumber) {
      const message = encodeURIComponent(this.details);
      const url = `https://api.whatsapp.com/send?phone=${encodeURIComponent(this.formattedPhoneNumber)}&text=${message}`;
      window.open(url, '_blank');
      this.dialogRef.close();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
