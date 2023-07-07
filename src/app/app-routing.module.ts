import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { FrontPageComponent } from './pages/Client/front-page/front-page.component';
import { BooksComponent } from './pages/Books/books/books.component';
import { UsersComponent } from './pages/User/users/users.component';
import { AuthGuard } from './SERVICE/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.module').then((m) => m.PagesModule),
           canActivate: [AuthGuard]
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.module').then(
            (m) => m.UicomponentsModule
          ),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.module').then((m) => m.ExtraModule),
      },
      {
        path: 'books',
        pathMatch: 'full',
        component: BooksComponent, canActivate: [AuthGuard]
      },
      {
        path: 'users',
        pathMatch: 'full',
        component: UsersComponent
      }
    ],
  },
  //////////////////////////////////////////
  { path: 'front-page', component: FrontPageComponent },
  ///////////////////////////////////////////////
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
