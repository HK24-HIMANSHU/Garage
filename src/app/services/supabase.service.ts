import { Injectable, Output } from '@angular/core';
import { AuthChangeEvent, AuthError, AuthResponse, AuthTokenResponse, PostgrestResponse, Session, SupabaseClient, User, createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable, from, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Servicing } from '../interfaces/servicing';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase_client: SupabaseClient
  constructor(private routes: Router) { 
    this.supabase_client = createClient(environment.supabaseKeys.url, environment.supabaseKeys.key)
  }

  async login(email: string, password: string) {
    try {
      const { data, error } = await this.supabase_client.auth.signInWithPassword({ email, password });
      if (error) {
        // Handle invalid credentials or other auth errors
        console.log('Login failed:', error.message);
        return false; // Indicate login failure
      }
      if (data) {
        console.log('Login successful:', data);
        this.routes.navigate(['/home']);
        return true; // Indicate login success
      }
    } catch (ex: any) {
      console.log('An error occurred:', ex.message);
      return false; // Indicate login failure
    }
    return false;
  }
  

  async getUserBruh(){
    const { data: { user } } = await this.supabase_client.auth.getUser();
    console.log('this is user details',user);
  }

  async signOut(){
    await this.supabase_client.auth.signOut();
    this.routes.navigate(['/login']);
  }

  getAllServicing(): Observable<any>{
    try{
      return from(
        this.supabase_client
        .from('service_orders_table')
        .select()
      )
    } catch(ex){
      return throwError(Error);
    }
  }
  updateServicing(servicing: Servicing): Observable<any> {
    console.log('update ran');
    return from(this.supabase_client
      .from('service_orders_table')
      .update({ IsCompleted: servicing.IsCompleted })
      .eq('id', servicing.id) // Assuming you have an id field in your servicing table
    );
  }

  getUserProfile(userId: number): Observable<any> {
    return from(this.supabase_client
      .from('user_profiles') 
      .select('*')      
      .eq('id', userId) // Filter where the 'id' column matches the provided userId
    );
  }  
}