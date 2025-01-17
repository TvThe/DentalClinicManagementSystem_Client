import { Component, OnInit } from '@angular/core';
import { PaidMaterialUsageService } from 'src/app/service/PaidMaterialUsageService/paid-material-usage.service';
import { ToastrService } from 'ngx-toastr';
import { ConvertJson } from 'src/app/service/Lib/ConvertJson';
import { error } from '@angular/compiler-cli/src/transformers/util';
import * as moment from 'moment-timezone';
import { IsThisSecondPipeModule } from 'ngx-date-fns';

@Component({
  selector: 'app-report-expenditure',
  templateUrl: './report-expenditure.component.html',
  styleUrls: ['./report-expenditure.component.css']
})
export class ReportExpenditureComponent implements OnInit {

  billEdit:any;
  fromDate: string = '';
  toDate: string = '';
  endDate: any;
  constructor(private paidMaterialUsageService: PaidMaterialUsageService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getListExpense();
  }


  billObject = {
    epoch: '', 
    createDate: '', 
    createBy: '', 
    typeExpense: '', 
    note: '', 
    totalAmount: ''
  }

  totalBill: number = 0;

  listExpense: any[] = [];
  ex:any;
  listDisplayExpense: any[] = [];
  listFilterDate: any[] = [];

  getListExpense() {
    const currentDateGMT7 = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');
    
    const currentDate1 = parseInt(currentDateGMT7.split('-')[0])+"-"+parseInt(currentDateGMT7.split('-')[1])+"-"+(parseInt(currentDateGMT7.split('-')[2])-1)+ " 00:00:00";
    const currentDate2 = parseInt(currentDateGMT7.split('-')[0])+"-"+parseInt(currentDateGMT7.split('-')[1])+"-"+parseInt(currentDateGMT7.split('-')[2])+ " 23:59:59" ;
    this.paidMaterialUsageService.getListExpense(this.dateToTimestamp(currentDate1).toString(), this.dateToTimestamp(currentDate2).toString()).subscribe((res) => {
      this.listExpense = res.Items;
      const itemsString = res.match(/Items=\[(.*?)\]/);
      if (itemsString && itemsString.length > 1) {
        this.listExpense = JSON.parse(`[${itemsString[1]}]`);
        this.listExpense.forEach((item:any) => {
          //console.log(ConvertJson.formatAndParse(item.expenses.S));
          this.ex = ConvertJson.formatAndParse(item.expenses.S);
          this.billObject = {
            epoch: item.epoch.N,
            createDate: this.timestampToDate(this.ex.createDate), 
            createBy: this.ex.createBy, 
            typeExpense: this.ex.typeExpense, 
            note: this.ex.note, 
            totalAmount: this.ex.totalAmount
          }
          this.totalBill += parseInt(this.ex.totalAmount);
          this.listDisplayExpense.push(this.billObject);
          this.billObject = {
            epoch: '',
            createDate: '',
            createBy: '',
            typeExpense: '',
            note: '',
            totalAmount: ''
          }
        })
        this.listFilterDate = this.listDisplayExpense;
      } else {
        console.error('Items not found in the JSON string.');
      }
    },
    )
  }

  openEditBill(bill:any) {
    this.billEdit = bill;
  }

  deleteBill(epoch: any) {
    this.paidMaterialUsageService.deletePaidMaterialUsage(epoch).subscribe((res) => {
      this.showSuccessToast("Xóa Labo thành công!");
      window.location.reload();
    },
      (err) => {
        this.showErrorToast("xóa không thành công");
      }
    )
  }

  onChangeFromDate(fromDate: any) {
    this.fromDate = this.dateToTimestamp(fromDate+" 00:00:00").toString();
    this.filterByDate(this.fromDate, this.endDate);
  }

  onChangeToDate(toDate:any) {
    this.endDate = this.dateToTimestamp(toDate+" 23:59:59").toString();
    this.filterByDate(this.fromDate, this.endDate);
  }

  filterByDate(fromDate: string, toDate:string) {
    const currentDateGMT7 = moment().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');
    const currentDate = parseInt(currentDateGMT7.split('-')[0])+"-"+parseInt(currentDateGMT7.split('-')[1])+"-"+parseInt(currentDateGMT7.split('-')[2]);

    if (this.toDate == '' && this.endDate != '') {
      const currentDate1 = currentDate+" 00:00:00";
      this.paidMaterialUsageService.getListExpense(this.dateToTimestamp(currentDate1).toString(), this.dateToTimestamp(toDate).toString()).subscribe((res) => {
        this.listExpense = res.Items;
        const itemsString = res.match(/Items=\[(.*?)\]/);
        if (itemsString && itemsString.length > 1) {
          this.listExpense = JSON.parse(`[${itemsString[1]}]`);
        }
      })
    } else if (this.toDate != '' && this.endDate == '') {
      const currentDate2 = currentDate+" 23:59:59";
      this.paidMaterialUsageService.getListExpense(this.dateToTimestamp(fromDate).toString(), this.dateToTimestamp(currentDate2).toString()).subscribe((res) => {
        this.listExpense = res.Items;
        const itemsString = res.match(/Items=\[(.*?)\]/);
        if (itemsString && itemsString.length > 1) {
          this.listExpense = JSON.parse(`[${itemsString[1]}]`);
        }
      })
    } else if (this.toDate != '' && this.endDate != '') {
      const currentDate1 = currentDate + " 00:00:00";
      const currentDate2 = currentDate +" 23:59:59";
      this.paidMaterialUsageService.getListExpense(this.dateToTimestamp(currentDate1).toString(), this.dateToTimestamp(currentDate2).toString()).subscribe((res) => {
        this.listExpense = res.Items;
        const itemsString = res.match(/Items=\[(.*?)\]/);
        if (itemsString && itemsString.length > 1) {
          this.listExpense = JSON.parse(`[${itemsString[1]}]`);
        }
      })
    } 

    this.listExpense.forEach((item:any) => {
      console.log(ConvertJson.formatAndParse(item.expenses.S));
      this.ex = ConvertJson.formatAndParse(item.expenses.S);
      this.billObject = {
        epoch: item.epoch.N,
        createDate: this.timestampToDate(this.ex.createDate), 
        createBy: this.ex.createBy, 
        typeExpense: this.ex.typeExpense, 
        note: this.ex.note, 
        totalAmount: this.ex.totalAmount
      }
      this.totalBill += parseInt(this.ex.totalAmount);
      this.listDisplayExpense.push(this.billObject);
      this.billObject = {
        epoch: '',
        createDate: '',
        createBy: '',
        typeExpense: '',
        note: '',
        totalAmount: ''
      }
    })
    this.listFilterDate = this.listDisplayExpense;
  }

  dateToTimestamp(dateStr: string): number {
    const format = 'YYYY-MM-DD HH:mm'; // Định dạng của chuỗi ngày   const format = 'YYYY-MM-DD HH:mm:ss';
    const timeZone = 'Asia/Ho_Chi_Minh'; // Múi giờ
    var timestamp = moment.tz(dateStr, format, timeZone).valueOf() / 1000;
    return timestamp;
  }

  timestampToDate(timestamp: number): string {
    const date = moment.unix(timestamp);
    const dateStr = date.format('YYYY-MM-DD');
    return dateStr;
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
