import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { authGuard } from 'src/guards/auth.guard';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NotfoundComponent } from './notfound/notfound.component';




const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import("./auth/auth.module").then((m) => m.AuthModule)
      },
      {
        path: 'view-products',
        loadChildren: () =>
          import("./products/products.module").then((m) => m.ProductsModule),
        canActivate: [authGuard],
      },
      {
        path: 'profile',
        loadChildren: () =>
          import("./profile/profile.module").then((m) => m.ProfileModule),
        canActivate: [authGuard],
      },
    ]
  },
  { path: 'home', component: LandingPageComponent },
  { path: '**', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
