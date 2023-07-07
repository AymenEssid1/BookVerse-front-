import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/SERVICE/UserService';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Subject, Observable, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { PageUpdateService } from 'src/app/SERVICE/page-update.service';
import { AddUserComponent } from '../add-user/add-user.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';


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
export class UsersComponent  {
  

  @ViewChild(MatSort) sort: MatSort;

  users: usersData[];
  displayedColumns: string[] = ['user', 'email', 'role', 'action'];
  dataSource: MatTableDataSource<usersData>;
  userId: number;
  user: any;
  searchQuery: string;
  searchQuerySubject: Subject<string> = new Subject<string>();

  constructor(
    private userService: UserService,
    private pageUpdateService: PageUpdateService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(
      (response) => {
        this.users = response;
        this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error retrieving books:', error);
      }
    );

    this.pageUpdateService.pageUpdated$.subscribe(() => {
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

    openAddUser(): void {

      const dialogRef = this.dialog.open(AddUserComponent, {
        width: '500px',
        height: '620px',
        disableClose: false,
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The popup was closed');
        if (result === 'updated') {
          this.refreshUsers(); // Call the refreshBooks() method when the book is updated
        }
      });
    }

    onSearchQueryChanged(searchQuery: string) {
      if (searchQuery.trim() === '') {
        // If the search query is empty, reset the table to display all users
        this.dataSource.data = this.users;
        return;
      }
  
      const query = searchQuery.toLowerCase().trim();
  
      // Filter users based on search query
      const filteredUsers = this.users.filter(user => {
        const { firstname, lastname, email, role } = user;
  
        // Check if the search query matches any of the user properties
        return (
          role.toLowerCase() === query ||
          firstname.toLowerCase().startsWith(query) ||
          lastname.toLowerCase().startsWith(query) ||
          email.toLowerCase().startsWith(query)
        );
      });
  
      // Update the table data source with the filtered users
      this.dataSource.data = filteredUsers;
    }
}
