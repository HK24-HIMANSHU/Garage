export interface Servicing {
    // serviceId: string,
    // customerName: string,
    // address: string,
    // phoneNumber: string,
    // carType: string,
    // serviceType: string,
    // timeSlot: string
    id:number,
    servicedate: string,
    user_profile_id: number,
    phonenumber: number,
    fullname: string,
    carmodel: JSON,
    price: JSON,
    car_purchase_time: string,
    car_reg_no: string,
    servicetype:string,
    IsServiceCancelled:boolean,
    Is_Seasonal_service_added:boolean,
    IsCompleted:boolean,
}
