import { TreatmentCourseDetailService } from './../../../../../service/ITreatmentCourseDetail/treatmentcoureDetail.service';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConvertTimestamp } from 'src/app/service/Lib/ConvertDateToTimestamp';
import { CognitoService } from 'src/app/service/cognito.service';
import * as moment from 'moment-timezone';
import 'moment/locale/vi';
import { PaidMaterialUsageService } from 'src/app/service/PatientService/patientPayment.service';
@Component({
  selector: 'app-popup-payment-tab',
  templateUrl: './popup-payment.component.html',
  styleUrls: ['./popup-payment.component.css']
})
export class PopupPaymentComponent implements OnInit, OnChanges {
  @Input() MaterialUsage: any
  @Input() TreatmentCourse: any
  @Input() Patient: any

  total: number = 0
  totalPaid: number = 0
  remaining: number = 0
  currentDate: string = ""

  Body_Paid_MU: Paid_material_usage[] = [];

  constructor(
    private toastr: ToastrService,
    private examinationService: TreatmentCourseDetailService,
    private paidMaterialUsageService: PaidMaterialUsageService,
    private modalService: NgbModal
  ) {
    this.currentDate = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');
  }

  ngOnInit(): void {
    console.log("Material :", this.MaterialUsage);
    console.log("Patient :", this.Patient);
    console.log("TreatmentCourse :", this.TreatmentCourse);
    this.MaterialUsage.sort((a: any, b: any) => {
      const dateA = new Date(a.created_date).getTime();
      const dateB = new Date(b.created_date).getTime();
      return dateB - dateA;
    })
    console.log("Material Usage Sort: ", this.MaterialUsage);
    this.totalPaid = this.MaterialUsage.reduce((acc:any, mu:any) => acc + (Number(mu.mu_total_paid) || 0), 0);
    this.total = this.MaterialUsage.reduce((acc:any, mu:any) => acc + (Number(mu.mu_total) || 0), 0);
    this.remaining = this.total - this.totalPaid;

    console.log("Total Paid: ", this.totalPaid);
    console.log("Total: ", this.total);
    console.log("Remaining: ", this.remaining);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }

  postPayment() {
    this.paidMaterialUsageService.postPaidMaterialUsage(this.MaterialUsage)
    .subscribe((res:any) => {
      this.toastr.success(res.message, "Thanh toán thành công!")
    },
    (err) => {
      this.toastr.error(err.error.message, "Thanh toán thất bại!")
    })
  }

  close() {
    this.modalService.dismissAll('Modal closed');
  }

  dismiss() {
    this.modalService.dismissAll('Cross click');
  }

}

// interface MaterialUsage {
//   created_date: string;
//   description: string;
//   examination_id: string;
//   material_usage_id: string;
//   material_warehouse_id: string;
//   price: number;
//   quantity: number;
//   status: number;
//   total: number;
//   total_paid: number;
//   treatment_course_id: string;
// }

interface Paid_material_usage {
  material_usage_id: string,
  examination_id: string,
  total_paid: number
}
