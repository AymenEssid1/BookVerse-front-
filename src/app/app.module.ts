import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

//Import all material modules
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Import Layouts
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';

// Vertical Layout
import { SidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { HeaderComponent } from './layouts/full/header/header.component';
import { BrandingComponent } from './layouts/full/sidebar/branding.component';
import { AppNavItemComponent } from './layouts/full/sidebar/nav-item/nav-item.component';
import { FrontPageComponent } from './pages/Client/front-page/front-page.component';
import { BooksComponent } from './pages/Books/books/books.component';
import { EditBookComponent } from './pages/Books/edit-book/edit-book.component';

import { MatDialogModule } from '@angular/material/dialog';
import { AddBookComponent } from './pages/Books/add-book/add-book.component';

import { MatSortModule } from '@angular/material/sort';
import { UsersComponent } from './pages/User/users/users.component';
import { EditUserComponent } from './pages/User/edit-user/edit-user.component';
import { AddUserComponent } from './pages/User/add-user/add-user.component';

import { MatTableModule } from '@angular/material/table';
import { ClientSidebarComponent } from './pages/Client/client-sidebar/client-sidebar.component';
import { BookdetailComponent } from './pages/Client/bookdetail/bookdetail.component';



@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    BlankComponent,
    SidebarComponent,
    HeaderComponent,
    BrandingComponent,
    AppNavItemComponent,
    FrontPageComponent,
    ClientSidebarComponent,
    BooksComponent,
    EditBookComponent,
    AddBookComponent,
    UsersComponent,
    EditUserComponent,
    AddUserComponent,
    BookdetailComponent
  ],
  imports: [
    
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    TablerIconsModule.pick(TablerIcons),
  ],
  exports: [TablerIconsModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
