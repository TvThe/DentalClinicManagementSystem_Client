import { Component, OnInit } from '@angular/core';
import {MaterialService} from "../../../../service/MaterialService/material.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-popup-add-material',
  templateUrl: './popup-add-material.component.html',
  styleUrls: ['./popup-add-material.component.css']
})
export class PopupAddMaterialComponent implements OnInit {

  material = {
    name:'',
    description:'',
    unit:'',
    quantity:'',
    unitPrice:''
  }
  materialBody={

  }
  validateMaterial={
    name:'',
    unit:'',
    quantity:'',
    unitPrice:''
  }
  isSubmitted:boolean = false;
  constructor(private materialSerivce:MaterialService,
              private toastr:ToastrService) { }

  ngOnInit(): void {
  }
  addMaterial(){
    this.resetValidate();
    if (!this.material.name){
      this.validateMaterial.name = "Vui lòng nhập tên vật liệu!";
      this.isSubmitted = true;
    }
    if (!this.material.unit){
      this.validateMaterial.unit = "Vui lòng nhập đơn vị!";
      this.isSubmitted = true;
    }
    if (!this.material.quantity){
      this.validateMaterial.quantity = "Vui lòng nhập số lượng!";
      this.isSubmitted = true;
    }
    else if (!this.checkNumber(this.material.quantity)){
      this.validateMaterial.quantity = "Số lượng không hợp lệ!";
      this.isSubmitted = true;
    }
    if (!this.material.unitPrice){
      this.validateMaterial.unitPrice = "Vui lòng nhập đơn giá!";
      this.isSubmitted = true;
    }
    else if (!this.checkNumber(this.material.unitPrice)){
      this.validateMaterial.unitPrice = "Đơn giá không hợp lệ!";
      this.isSubmitted = true;
    }
    if (this.isSubmitted){
      return;
    }
    this.materialSerivce.addMaterial(this.materialBody).subscribe(data=>{
      this.toastr.success('Thêm mới vật liệu thành công!');
    },
      error => {
      this.toastr.error('Thêm mới vật liệu thất bại!');
      }
      )
  }
  private resetValidate(){
    this.validateMaterial = {
      name:'',
      unit:'',
      quantity:'',
      unitPrice:''
    }
    this.isSubmitted = false;
  }
  private checkNumber(number:any):boolean{
    return /^[1-9]\d*$/.test(number);
  }
}
