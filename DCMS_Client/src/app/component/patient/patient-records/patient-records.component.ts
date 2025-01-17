import { Component, OnInit,ViewChild  } from '@angular/core';
import { PatientService } from "../../../service/PatientService/patient.service";
import { IPatient } from "../../../model/IPatient";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PopupAddPatientComponent } from "../../utils/pop-up/patient/popup-add-patient/popup-add-patient.component";
import { CognitoService } from 'src/app/service/cognito.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ResponseHandler } from '../../utils/libs/ResponseHandler';
import { PopupDeletePatientComponent } from '../../utils/pop-up/patient/popup-delete-patient/popup-delete-patient.component';
@Component({
  selector: 'app-patient-records',
  templateUrl: './patient-records.component.html',
  styleUrls: ['./patient-records.component.css']
})
export class PatientRecordsComponent implements OnInit {
  currentPage: number = 1;
  hasNextPage: boolean = false;
  constructor(private patientService: PatientService,
    private toastr: ToastrService,
    private router: Router,
    private cognitoService: CognitoService,
    private modalService: NgbModal) { }
  searchPatientsList: any[] = [];
  pagingSearch = {
    paging: 1,
    total: 0
  }
  count: number = 1;
  id: any;
  search: string = '';
  @ViewChild(PopupDeletePatientComponent) popupDeletePatientComponent!: PopupDeletePatientComponent;
  ngOnInit(): void {
    this.loadPage(this.pagingSearch.paging);
  }
  checkNextPage() {
    this.hasNextPage = this.searchPatientsList.length > 10;
  }
  loadPage(paging: number) {
    this.currentPage = paging;
    this.pagingSearch.paging = paging;
    if (this.search.trim() !== "") {
      this.searchPatient();
    }
    this.patientService.getPatientList(paging).subscribe(patients => {
      this.searchPatientsList = [];
      this.searchPatientsList = patients.data;
      this.checkNextPage();
      if (this.searchPatientsList.length > 10) {
        this.searchPatientsList.pop();
      }
    },
      error => {
        ResponseHandler.HANDLE_HTTP_STATUS(this.patientService.test+"/patient/name/"+paging, error);
      }
      )
  }
  searchPatient() {
    console.log(this.search)
    this.patientService.getPatientByName(this.search, this.currentPage).subscribe(patients => {
      console.log(this.pagingSearch.paging);
      this.searchPatientsList = [];
      this.searchPatientsList = patients.data;
      this.checkNextPage();
      if (this.searchPatientsList.length > 10) {
        this.searchPatientsList.pop();
      }
    }, error => {
       ResponseHandler.HANDLE_HTTP_STATUS(this.patientService.test+"/patient/name/"+this.search+"/"+this.pagingSearch.paging, error)

    }
    )
  }
  ngAfterViewInit() {
    this.popupDeletePatientComponent.patientDeleted.subscribe(() => {
      this.loadPage(this.pagingSearch.paging);
    });
  }
  pageChanged(event: number) {
    if (event >= 1) {
      this.loadPage(event);
    }
  }
  openDeletePatient(id: any) {
    this.id = id;
  }

  detail(id: any) {
    const userGroupsString = sessionStorage.getItem('userGroups');

    if (userGroupsString) {
      const userGroups = JSON.parse(userGroupsString) as string[];

      if (userGroups.includes('dev-dcms-doctor')) {
        this.router.navigate(['/benhnhan/danhsach/tab/hosobenhnhan', id])
      } else if (userGroups.includes('dev-dcms-nurse')) {
        this.router.navigate(['/benhnhan/danhsach/tab/hosobenhnhan', id])
      } else if (userGroups.includes('dev-dcms-receptionist')) {
        this.router.navigate(['/benhnhan/danhsach/tab/hosobenhnhan', id])
      } else if (userGroups.includes('dev-dcms-admin')) {
        this.router.navigate(['/benhnhan/danhsach/tab/hosobenhnhan', id])
      }
    } else {
      console.error('Không có thông tin về nhóm người dùng.');
      this.router.navigate(['/default-route']);
    }
  }

  signOut() {
    this.cognitoService.signOut().then(() => {
      console.log("Logged out!");
      this.router.navigate(['dangnhap']);
    })
  }
}
