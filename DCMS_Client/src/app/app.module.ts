import { Component, NgModule, OnInit } from '@angular/core';
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
import { ChatComponent } from './component/chat/chat.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { RegisterWorkScheduleComponent } from './component/shared/register-work-schedule/register-work-schedule.component';
//import {WebSocketSubject} from "rxjs/internal/observable/dom/WebSocketSubject";
import { WebSocketSubject } from 'rxjs/webSocket';
import { ConfirmAppointmentComponent } from './component/confirm-appointment/confirm-appointment.component';
import { AppRoutingModule } from './app-routing.module';
import {NgChartsModule} from "ng2-charts";
import { LOCALE_ID} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import { PopupAddReportExpenditureComponent } from './component/utils/pop-up/revenue/popup-add-report-expenditure/popup-add-report-expenditure.component';
import { PopupConfirmServiceComponent } from './component/utils/pop-up/appointment/popup-confirm-service/popup-confirm-service.component';
import { TableComponent } from './component/shared/table/table.component';

// Register the Vietnamese locale data
registerLocaleData(localeVi);
@NgModule({
  declarations: [
    AppComponent,
    RegisterWorkScheduleComponent,
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
    BrowserAnimationsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgChartsModule
  ],
  providers: [CookieService,{ provide: LOCALE_ID, useValue: 'vi' }],
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
