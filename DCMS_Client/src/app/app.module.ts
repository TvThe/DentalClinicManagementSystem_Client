import { Component, NgModule, OnInit } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { ReceptionistModule } from './component/receptionist/receptionist.module';
import { SharedModule } from "./component/shared/shared.module";
import { AdminModule } from './component/admin/admin.module';
import { DoctorModule } from './component/doctor/doctor.module';
import { NurseModule } from './component/nurse/nurse.module';
import { PatientModule } from './component/patient/patient.module';
import { AuthModule } from './component/auth/auth.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import * as AWS from 'aws-sdk';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule,
    ReceptionistModule,
    AdminModule,
    DoctorModule,
    NurseModule,
    PatientModule,
    AuthModule,
    CommonModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule implements OnInit {
  ngOnInit() {
    // Cấu hình AWS SDK ở đây
    // AWS.config.region = 'ap-southeast-1';
    // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    //   IdentityPoolId: 'ap-southeast-1:54518664-3eb5-47fd-bc15-5b48ec109d8a' // Thay thế bằng Identity Pool ID của bạn
    // });
  }
}
