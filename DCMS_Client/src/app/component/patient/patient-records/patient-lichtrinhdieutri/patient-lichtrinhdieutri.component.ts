import { ITreatmentCourse } from './../../../../model/ITreatment-Course';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TreatmentCourseService } from 'src/app/service/TreatmentCourseService/TreatmentCourse.service';
import { CognitoService } from 'src/app/service/cognito.service';

@Component({
  selector: 'app-patient-lichtrinhdieutri',
  templateUrl: './patient-lichtrinhdieutri.component.html',
  styleUrls: ['./patient-lichtrinhdieutri.component.css']
})
export class PatientLichtrinhdieutriComponent implements OnInit {
  id: string = "";

  href_profile = "/benhnhan/danhsach/tab/hosobenhnhan/";
  href_treatment_course = "/benhnhan/danhsach/tab/lichtrinhdieutri"
  ITreatmentCourse: ITreatmentCourse = [];

  constructor(
    private cognitoService: CognitoService, private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private treatmentCourseService: TreatmentCourseService
  ) { }

  navigateHref(href: string) {
    this.router.navigate(['' + href + this.id]);
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getTreatmentCourse();

    // this.ITreatmentCourse = [
    //   {
    //     "treatment_course_id": "T-00000001",
    //     "patient_id": "P-000001",
    //     "description": "Mô tả điều trị",
    //     "status": 1,
    //     "created_date": "2023-10-26 19:02:42",
    //     "name": "Điều trị răng"
    //   },
    // ]

  }

  getTreatmentCourse() {
    this.treatmentCourseService.getTreatmentCourse(this.id)
      .subscribe((data) => {
        console.log(data);
        this.ITreatmentCourse = data;
      }
      )
  }

  Patient_Id: string = "";
  addTreatmentCourse() {
    this.Patient_Id = this.ITreatmentCourse[0].patient_id;
  }

  TreatmentCourse: any;
  editTreatmentCourse(course: any) {
    this.TreatmentCourse = course;
  }

  deleteTreatmentCourse(treatment_course_id: string) {
    console.log("course treatment id", treatment_course_id);
    const cf = confirm('Bạn có muốn xóa lộ trình này không?');
    if (cf) {
      this.treatmentCourseService.deleteTreatmentCourse(treatment_course_id)
        .subscribe
    }
  }

  navigateTreatmentCourse_Detail(tc_id:string) {
    // this.router.navigate(['chitiet']);
    this.router.navigate(['/benhnhan/danhsach/tab/lichtrinhdieutri/' + this.id + '/chitiet/' + tc_id]);

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

  signOut() {
    this.cognitoService.signOut().then(() => {
      console.log("Logged out!");
      this.router.navigate(['dangnhap']);
    })
  }

}
