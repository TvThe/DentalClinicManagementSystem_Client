import { Component, OnInit, Renderer2, ViewChild, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReceptionistAppointmentService } from 'src/app/service/ReceptionistService/receptionist-appointment.service';
import { IAddAppointment } from 'src/app/model/IAppointment';
import { PatientService } from 'src/app/service/PatientService/patient.service';
import * as moment from 'moment-timezone';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import {
  NgbDatepickerConfig,
  NgbCalendar,
  NgbDate,
  NgbDateStruct
} from "@ng-bootstrap/ng-bootstrap";

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-popup-add-appointment',
  templateUrl: './popup-add-appointment.component.html',
  styleUrls: ['./popup-add-appointment.component.css']
})
export class PopupAddAppointmentComponent implements OnInit, OnChanges {
  phoneRegex = /^[0-9]{10}$|^[0-9]{4}\s[0-9]{3}\s[0-9]{3}$/;

  procedure: string = "1";
  isPatientInfoEditable: boolean = false;


  @Input() datesDisabled: any;
  AppointmentBody: IAddAppointment;
  appointmentTime = "";

  model!: NgbDateStruct;
  datePickerJson = {};
  markDisabled: any;
  isDisabled: any;
  json = {
    disable: [6, 7],
    disabledDates: [
      { year: 2020, month: 8, day: 13 },
      { year: 2020, month: 8, day: 19 },
      { year: 2020, month: 8, day: 25 }
    ]
  };


  seedDateDisabled = [
    {
        "date": 1698836571,
        "appointments": [
            {
                "procedure": 1,
                "count": 4,
                "details": [
                    {appointment_id:"6e005b74-dc60-4ad9-9a4f-11954b94c2a7",
                     patient_id:"P-000001",
                     patient_name: "Nguyễn Văn An",
                     phone_number:"0123456789", procedure: 1,
                     doctor:"Bác sĩ A",
                     time:"1698688620",
                     attribute_name: "",
                     epoch: 0,
                     migrated: "false"
                    }
                ]
            }
        ]
    },
    {
      "date": 1698836571,
      "appointments": [
          {
              "procedure": 1,
              "count": 4,
              "details": [
                  {appointment_id:"6e005b74-dc60-4ad9-9a4f-11954b94c2a7",
                   patient_id:"P-000001",
                   patient_name: "Nguyễn Văn An",
                   phone_number:"0123456789", procedure: 1,
                   doctor:"Bác sĩ A",
                   time:"1698688620",
                   attribute_name: "",
                   epoch: 0,
                   migrated: "false"
                  }
              ]
          }
      ]
  },
  ]

  //Convert Date
  dateToTimestamp(dateStr: string): number {
    const format = 'YYYY-MM-DD HH:mm:ss'; // Định dạng của chuỗi ngày
    const timeZone = 'Asia/Ho_Chi_Minh'; // Múi giờ
    const timestamp = moment.tz(dateStr, format, timeZone).valueOf();
    return timestamp;
  }

  timestampToDate(timestamp: number): string {
    const format = 'YYYY-MM-DD HH:mm:ss'; // Định dạng cho chuỗi ngày đầu ra
    const timeZone = 'Asia/Ho_Chi_Minh'; // Múi giờ
    const dateStr = moment.tz(timestamp, timeZone).format(format);
    return dateStr;
  }


  timestampToTime(timestamp: number): string {
    const timeZone = 'Asia/Ho_Chi_Minh';
    const timeStr = moment.tz(timestamp, timeZone).format('HH:mm');
    return timeStr;
  }

  timeAndDateToTimestamp(timeStr: string, dateStr: string): number {
    const format = 'YYYY-MM-DD HH:mm'; // Định dạng của chuỗi ngày và thời gian
    const timeZone = 'Asia/Ho_Chi_Minh';
    const dateTimeStr = `${dateStr} ${timeStr}`;
    const timestamp = moment.tz(dateTimeStr, format, timeZone).valueOf();
    return timestamp;
  }

  mindate: Date;
  minTime: string;
  constructor(private APPOINTMENT_SERVICE: ReceptionistAppointmentService,
    private PATIENT_SERVICE: PatientService,
    private renderer: Renderer2,
    private toastr: ToastrService,
    private router: Router,
    private config: NgbDatepickerConfig,
    private calendar: NgbCalendar
  ) {
    this.isDisabled = (
      date: NgbDateStruct
      //current: { day: number; month: number; year: number }
    ) => {
      return this.json.disabledDates.find(x =>
        (new NgbDate(x.year, x.month, x.day).equals(date))
        || (this.json.disable.includes(calendar.getWeekday(new NgbDate(date.year, date.month, date.day))))
      )
        ? true
        : false;
    };

    this.AppointmentBody = {
      epoch: 0,    //x
      appointment: {
        patient_id: '',  //x
        patient_name: '', //x
        phone_number: '', //x
        procedure: 1,  //x
        doctor: '', //x
        time: 0  //x
      }
    } as IAddAppointment;

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.minTime = `${hours}:${minutes}`;
    this.mindate = new Date();

  }


  ngOnChanges(changes: SimpleChanges): void {
    if (this.datesDisabled && this.datesDisabled.length == 0) {
      this.datesDisabled.push(1698681910);
      console.log("Date disabled: ", this.datesDisabled);
    }
    if (changes['datesDisabled'] && this.datesDisabled && this.datesDisabled.length > 0) {
      this.datesDisabled = this.datesDisabled.map((timestamp: number) => {
        const date = new Date(timestamp * 1000); // Chuyển đổi timestamp sang date
        return date.toISOString().slice(0, 10); // Lấy phần yyyy-MM-dd
      });
      console.log("Date Parse: ", this.datesDisabled);
    }
  }
  ngOnInit(): void {
  }


  phoneErr: string = "";
  onPhoneInput() {

    if (this.AppointmentBody.appointment.phone_number === "") {
      this.phoneErr = "Phone is required";
    } else if (!this.phoneRegex.test(this.AppointmentBody.appointment.phone_number)) {
      this.phoneErr = "Số điện thoại không đúng định dạng. Vui lòng kiểm tra lại";
    } else {
      this.phoneErr = "";
      console.log(this.AppointmentBody.appointment.phone_number);
      this.PATIENT_SERVICE.getPatientPhoneNumber(this.AppointmentBody.appointment.phone_number).subscribe((data) => {
        this.AppointmentBody.appointment.patient_id = data[0].patient_id;
        this.AppointmentBody.appointment.patient_name = data[0].patient_name;

        console.log(data)
      },
        (err) => {
          this.showErrorToast("Không tìm thấy số điện thoại");
          this.phoneErr = "";
        }
      )
    }
  }


  selectedDoctor: any = null;
  selectDoctor(doctor: any) {
    this.selectedDoctor = doctor;
    console.log(this.AppointmentBody.appointment.doctor = doctor.name)
    this.AppointmentBody.appointment.doctor = doctor.name;
  }

  appointmentDate: string = '';
  timestamp2: number = 0;
  onPostAppointment() {

    const gmt7Moment = moment.tz(this.appointmentDate, 'Asia/Ho_Chi_Minh'); // GMT+7

    // Lấy timestamp
    this.timestamp2 = gmt7Moment.valueOf();
    console.log("new", this.timestamp2);

    // Chuyển đổi ngày cố định sang timestamp
    const fixedDate = new Date(this.appointmentDate);
    const dateTimestamp = (fixedDate.getTime() / 1000); // Chuyển đổi sang timestamp (giây)

    // Lấy giá trị thời gian từ biến appointmentTime và chuyển đổi thành timestamp
    const timeParts = this.appointmentTime.split(":");
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    // Khởi tạo một đối tượng Date với ngày cố định
    const combinedDateTime = new Date(fixedDate);

    // Đặt giờ và phút cho combinedDateTime
    combinedDateTime.setHours(hours, minutes, 0, 0);

    // Chuyển đổi thành timestamp
    const combinedTimestamp = combinedDateTime.getTime() / 1000; // Chuyển đổi sang timestamp (giây)

    this.AppointmentBody.epoch = dateTimestamp;
    console.log(this.AppointmentBody.epoch = dateTimestamp); // Chứa giá trị ngày (date)
    this.AppointmentBody.appointment.time = combinedTimestamp; // Chứa giá trị giờ trong ngày

    console.log("a ", dateTimestamp);
    // Gọi API POST

    if (this.AppointmentBody.appointment.phone_number === "") {
      this.phoneErr = "Phone is required";
    } else if (!this.phoneRegex.test(this.AppointmentBody.appointment.phone_number)) {
      this.phoneErr = "Số điện thoại không đúng định dạng. Vui lòng kiểm tra lại";
    } else {
      this.phoneErr = "";

      this.APPOINTMENT_SERVICE.postAppointment(this.AppointmentBody).subscribe(
        (response) => {
          console.log('Lịch hẹn đã được tạo:', response);
          this.showSuccessToast('Lịch hẹn đã được tạo thành công!');
          this.AppointmentBody = {
            epoch: 0,    //x
            appointment: {
              patient_id: '',  //x
              patient_name: '', //x
              phone_number: '', //x
              procedure: 1,  //x
              doctor: '', //x
              time: 0  //x
            }
          } as IAddAppointment;
          this.procedure = '';
          this.appointmentTime = '';
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        },
        (error) => {
          console.error('Lỗi khi tạo lịch hẹn:', error);
          this.showErrorToast('Lỗi khi tạo lịch hẹn!');
        }
      );
    }
  }


  showSuccessToast(message: string) {
    this.toastr.success(message, 'Thành công', {
      timeOut: 3000, // Adjust the duration as needed
    });
  }

  showErrorToast(message: string) {
    this.toastr.error(message, 'Lỗi', {
      timeOut: 3000, // Adjust the duration as needed
    });
  }


  close() {
    this.AppointmentBody = {
      epoch: 0,    //x
      appointment: {
        patient_id: '',  //x
        patient_name: '', //x
        phone_number: '', //x
        procedure: 1,  //x
        doctor: '', //x
        time: 0  //x
      }
    } as IAddAppointment;
  }

  doctors = [
    { name: 'Bác sĩ A. Nguyễn', specialty: 'Nha khoa', image: 'https://th.bing.com/th/id/OIP.62F1Fz3e5gRZ1d-PAK1ihQAAAA?pid=ImgDet&rs=1' },
    { name: 'Bác sĩ B. Trần', specialty: 'Nha khoa', image: 'https://gamek.mediacdn.vn/133514250583805952/2020/6/8/873302766563216418622655364023183338578077n-15915865604311972647945.jpg' },
    { name: 'Bác sĩ C. Lê', specialty: 'Nha khoa', image: 'https://img.verym.com/group1/M00/03/3F/wKhnFlvQGeCAZgG3AADVCU1RGpQ414.jpg' },
  ];
}
