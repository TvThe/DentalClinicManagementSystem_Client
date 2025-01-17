import { Component, OnInit } from '@angular/core';


import { Auth } from 'aws-amplify';
import { CognitoService } from 'src/app/service/cognito.service';
import { Router } from '@angular/router';
import { ReceptionistWaitingRoomService } from 'src/app/service/ReceptionistService/receptionist-waitingroom.service';
import { IPostWaitingRoom } from 'src/app/model/IWaitingRoom';
import { ToastrService } from 'ngx-toastr';
import { MedicalProcedureGroupService } from 'src/app/service/MedicalProcedureService/medical-procedure-group.service';
import {ResponseHandler} from "../../utils/libs/ResponseHandler";

@Component({
  selector: 'app-receptionist-waiting-room',
  templateUrl: './receptionist-waiting-room.component.html',
  styleUrls: ['./receptionist-waiting-room.component.css']
})
export class ReceptionistWaitingRoomComponent implements OnInit {

  waitingRoomData: any;
  loading: boolean = false;
  procedure: string = '0';
  listGroupService : any[] = [];
  status: string = '1';
  filteredWaitingRoomData: any[] = [];
  listPatientId: any[] = [];
  PUT_WAITINGROOM: IPostWaitingRoom;
  dataStorage: string ='';
  constructor(private waitingRoomService: ReceptionistWaitingRoomService,
    private cognitoService: CognitoService,
    private router: Router,
    private toastr: ToastrService,
    private medicaoProcedureGroupService:MedicalProcedureGroupService
  ) {

    this.PUT_WAITINGROOM = {
      epoch: 0,
      produce_id: "1",
      produce_name:'',
      patient_id: '',
      patient_name: '',
      reason: '',
      status: 1
    } as IPostWaitingRoom
  }

  ngOnInit(): void {
    this.getListGroupService();
    this.getWaitingRoomData();
  }
  getWaitingRoomData() {
    this.loading = true;
    this.waitingRoomService.getWaitingRooms().subscribe(
      data => {
        this.waitingRoomData = data;
        const statusOrder: {[key: number]: number} = {2: 1, 3: 2, 1: 3, 4: 4};
        this.waitingRoomData.sort((a:any, b:any) => {
          const orderA = statusOrder[a.status] ?? Number.MAX_VALUE; // Fallback if status is not a valid key
          const orderB = statusOrder[b.status] ?? Number.MAX_VALUE; // Fallback if status is not a valid key
          return orderA - orderB;
        });
        this.listPatientId = this.waitingRoomData.map((item:any) => item.patient_id);
        localStorage.setItem('listPatientId', JSON.stringify(this.listPatientId));
        this.filteredWaitingRoomData = [...this.waitingRoomData]; // Update the filtered list as well
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        ResponseHandler.HANDLE_HTTP_STATUS(this.waitingRoomService.apiUrl+"/waiting-room", error);
      }
    );
  }

  getListGroupService() {
    this.medicaoProcedureGroupService.getMedicalProcedureGroupList().subscribe((res:any) => {
      this.listGroupService = res.data;
    },
      error => {
        ResponseHandler.HANDLE_HTTP_STATUS(this.medicaoProcedureGroupService.url+"/medical-procedure-group", error);
      }
      )
  }
  filterProcedure() {
    if (this.procedure === '0') {
      this.filteredWaitingRoomData = [...this.waitingRoomData];
      this.loading = false;
    } else {
      this.filteredWaitingRoomData = this.waitingRoomData.filter((item: IPostWaitingRoom) => item.produce_id === this.procedure);
      this.loading = false;
    }
  }

  selectedColor: string = '#000';
  onPutStatus(wtr: any, epoch: number) {
    // switch (wtr.status) {
    //   case 1:
    //     this.selectedColor = '#cfe7f3'; // Màu chữ cho trạng thái 1
    //     break;
    //   case 2:
    //     this.selectedColor = '#ffeb3b'; // Màu chữ cho trạng thái 2
    //     break;
    //   case 3:
    //     this.selectedColor = '#d1c4e9'; // Màu chữ cho trạng thái 3
    //     break;
    //   case 4:
    //     this.selectedColor = '#000'; // Màu chữ cho trạng thái 4
    //     break;
    //   default:
    //     this.selectedColor = '#000'; // Màu chữ mặc định
    //     break;
    // }

    this.PUT_WAITINGROOM = {
      epoch: epoch,
      produce_id: wtr.produce_id,
      produce_name: wtr.produce_name,
      patient_id: wtr.patient_id,
      patient_name: wtr.patient_name,
      reason: wtr.reason,
      status: Number(wtr.status)
    } as IPostWaitingRoom
    this.loading = true;
    if (this.PUT_WAITINGROOM.status == 4) {
      this.waitingRoomService.deleteWaitingRooms(this.PUT_WAITINGROOM)
        .subscribe((data) => {
          this.loading = false;
          this.waitingRoomData.sort((a: any, b: any) => a.epoch - b.epoch);
          this.showSuccessToast('Xóa hàng chờ thành công');
          this.getWaitingRoomData();
        },
          (error) => {
            this.loading = false;
            //this.showErrorToast('Xóa hàng chờ thất bại');
            ResponseHandler.HANDLE_HTTP_STATUS(this.waitingRoomService.apiUrl+"/waiting-room/"+this.PUT_WAITINGROOM, error);
          }
        )
    } else {
      this.waitingRoomService.putWaitingRoom(this.PUT_WAITINGROOM)
        .subscribe(data => {
          this.loading = false;
          this.waitingRoomData.sort((a: any, b: any) => a.epoch - b.epoch);
          this.showSuccessToast('Chỉnh sửa hàng chờ thành công');
          this.getWaitingRoomData();
        },
          (error) => {
            this.loading = false;
            //this.showErrorToast('Chỉnh sửa hàng chờ thất bại');
            ResponseHandler.HANDLE_HTTP_STATUS(this.waitingRoomService.apiUrl+"/waiting-room/"+this.PUT_WAITINGROOM, error);
          }
        )
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


  signOut() {
    this.cognitoService.signOut().then(() => {
      this.router.navigate(['dangnhap']);
    })
  }
}
