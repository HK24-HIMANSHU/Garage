import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validator, Form, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
    constructor(private formBuilder: FormBuilder,private routes: Router,private auth: SupabaseService){
      this.loginForm = this.formBuilder.group({
        email:formBuilder.control('',[Validators.required,Validators.email,Validators.minLength(5)]),
        password:formBuilder.control('',[Validators.required,Validators.minLength(8)]),
      })     
    }
    async onSubmit() {
      const success = await this.auth.login(this.loginForm.value.email, this.loginForm.value.password);
      
      if (!success) {
        // Show an error message if login failed
        alert('Invalid email or password. Please try again.');
      }
    }
    
}
