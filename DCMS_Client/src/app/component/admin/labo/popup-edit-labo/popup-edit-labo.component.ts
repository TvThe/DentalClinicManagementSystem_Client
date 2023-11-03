import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IEditLabo, ILabos, IPostLabo } from 'src/app/model/ILabo';
import { LaboService } from 'src/app/service/LaboService/Labo.service';

@Component({
  selector: 'app-popup-edit-labo',
  templateUrl: './popup-edit-labo.component.html',
  styleUrls: ['./popup-edit-labo.component.css']
})
export class PopupEditLaboComponent implements OnInit, OnChanges {

  @Input() LaboEdit: any;

  PutLabo:ILabos;

  EditLaboErrors: {
    labo_name: string,
    address: string,
    phone_number: string,
    email: string
  } = {
    labo_name: '',
    address: '',
    phone_number: '',
    email: ''
  };

  constructor(
    private EditLaboService:LaboService,
    private toastr:ToastrService
  ) {
    this.PutLabo = {
      labo_id: '',
      name:'',
      address:'',
      phone_number:'',
      email:'',
      description:'',
      active: 1
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['LaboEdit']) {
      this.PutLabo = {
        labo_id: this.LaboEdit.labo_id,
        name: this.LaboEdit.name,
        address: this.LaboEdit.address,
        phone_number: this.LaboEdit.phone_number,
        email: this.LaboEdit.email,
        description: '',
        active: 1
      }
    }
  }

  ngOnInit(): void {


  }

  PutLaboAPI() {
    this.resetErrors(); // Đặt lại thông báo lỗi trước khi kiểm tra lại
    // if (!this.PutLabo.name) {
    //   this.EditLaboErrors.labo_name = 'Tên labo không được để trống';
    // }
    // if (!this.PutLabo.address) {
    //   this.EditLaboErrors.address = 'Địa chỉ không được để trống';
    // }
    // if (!this.PutLabo.phone_number) {
    //   this.EditLaboErrors.phone_number = 'Số điện thoại không được để trống';
    // }
    // if (!this.PutLabo.email) {
    //   this.EditLaboErrors.email = 'Email không được để trống';
    // } else if (!this.isValidEmail(this.PutLabo.email)) {
    //   this.EditLaboErrors.email = 'Địa chỉ email không hợp lệ';
    // }

    // console.log()
    // if (this.hasErrors()) {
    //   this.showErrorToast("Vui lòng kiểm tra và điền đầy đủ thông tin cần thiết.");
    // } else {
      console.log(this.LaboEdit);
      this.EditLaboService.putLabo(this.LaboEdit.labo_id, this.PutLabo)
        .subscribe(
          (res) => {
            this.showSuccessToast("Sửa Labo thành công");
            this.PutLabo = {
              labo_id: "",
              name: "",
              address: "",
              phone_number: "",
              email: "",
              description: "",
              active: 1
            };
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          },
          () => {
            this.showErrorToast("Sửa Labo thất bại");
          }
        );
    // }
  }

  private resetErrors() {
    this.EditLaboErrors = {
      labo_name: '',
      address: '',
      phone_number: '',
      email: ''
    };
  }

  private hasErrors() {
    return Object.values(this.EditLaboErrors).some((error) => error !== '');
  }

  private isValidEmail(email: string): boolean {
    // Thực hiện kiểm tra địa chỉ email ở đây, có thể sử dụng biểu thức chính quy
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
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
}
