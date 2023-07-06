import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/SERVICE/UserService';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Subject, Observable, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { BookUpdateService } from 'src/app/SERVICE/book-update.service';



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
  displayedColumns: string[] = ['user', 'email',  'role', 'action'];
  userId: number;
  user:any;





  constructor(private userService: UserService,private bookUpdateService: BookUpdateService,
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

      this.bookUpdateService.bookUpdated$.subscribe(() => {
        this.refreshUsers();
      });
      
    }

    refreshUsers(query?: string) {
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
    
    

    deleteUser(userId: number) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          this.fetchUsers();
        },
        (error) => {
          console.log('Error deleting user:', error);
        }
      );
    }
  
    fetchUsers() {
      this.userService.getUsers().subscribe(
        (users) => {
          this.users = users;
        },
        (error) => {
          console.log('Error fetching users:', error);
        }
      );
    }
    




    openEditUser(userId: number): void {
      this.userId = userId;
      const dialogRef = this.dialog.open(EditUserComponent, {
        width: '500px',
        height: '620px',
        disableClose: false,
        data: { userId: this.userId },
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The popup was closed');
        
      });
    }

    

}
