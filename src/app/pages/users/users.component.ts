import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/SERVICE/UserService';
import { EditBookComponent } from 'src/app/pages/Books/edit-book/edit-book.component';
import { MatDialog } from '@angular/material/dialog';
import { BookUpdateService } from 'src/app/SERVICE/book-update.service';
import { MatSort } from '@angular/material/sort';
import { Subject, Observable, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';




export interface usersData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
}


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  users: usersData[];
  displayedColumns: string[] = ['user', 'email',  'role'];




  constructor(private userService: UserService,
    private dialog: MatDialog) { }

    ngOnInit() {
      this.userService.getUsers().subscribe(
        (response) => {
          this.users = response;
        },
        (error) => {
          console.error('Error retrieving books:', error);
        }
      );
    }
    getImageUrl(role: string): string {
      if (role === 'ADMIN') {
        return 'assets/images/profile/user-1.jpg'; 
      } else if (role === 'USER') {
        return 'assets/images/profile/user-3.jpg'; 
      } else {
        return 'assets/images/profile/user-3.jpg'; 
      }
    }
    
  
  

}
