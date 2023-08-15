import { Injectable } from '@angular/core';
import { ToastrService, GlobalConfig  } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message:any, title:any){
      this.toastr.success(message, title)
  }

  showError(message:any, title:any){
    console.log("SUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
    this.toastr.error(message, title)
}


showInfo(message:any, title:any){
    console.log("SUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
    this.toastr.info(message, title)
}
}