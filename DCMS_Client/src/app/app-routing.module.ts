import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutsComponent } from "./component/shared/layouts/layouts.component";
import { ChatComponent } from './component/chat/chat.component';
import { RegisterWorkScheduleComponent } from './component/shared/register-work-schedule/register-work-schedule.component';
import { ProfilePersonalComponent } from './component/shared/profile-personal/profile-personal.component';

const routes: Routes = [
  {

    path: '', component: LayoutsComponent, children: [

      {
        path: 'doctor',
        loadChildren: () => import('./component/doctor/doctor.module').then(m => m.DoctorModule)
      },

      {
        path: 'nurse',
        loadChildren: () => import('./component/nurse/nurse.module').then(m => m.NurseModule)
      },
    ]
  },
  {
    path:"edit-profile",
    component: ProfilePersonalComponent
  },
  {
    path: 'register-work-schedule',
    component: RegisterWorkScheduleComponent
  },
  {
    path:'chat',
    component: ChatComponent
  },
  {
    path: 'admin',
    loadChildren: () => import('./component/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'receptionist',
    loadChildren: () => import('./component/receptionist/receptionist.module').then(m => m.ReceptionistModule)
  },
  {
    path: 'patient',
    loadChildren: () => import('./component/patient/patient.module').then(m => m.PatientModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./component/auth/auth.module').then(m => m.AuthModule)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
