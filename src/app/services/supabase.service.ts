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

  async login(email:string,password:string){
    try{
      const {data,error} =  await this.supabase_client.auth.signInWithPassword({email,password});
      if(data){
        console.log(data);
        console.log('login successful');
        this.routes.navigate(['/home'])
      }else if(error){
        console.log(error);
      }
    }catch(ex:any){
      console.log(ex.message);
    }
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
      .eq('id', servicing.id) // Assuming you have an `id` field in your `servicing` table
    );
  }
}
