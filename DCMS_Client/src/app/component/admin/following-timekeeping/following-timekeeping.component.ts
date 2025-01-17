import { Component, OnInit } from '@angular/core';
import { TimeKeepingService } from "../../../service/Follow-TimeKeepingService/time-keeping.service";
import { count } from "rxjs";
import * as moment from "moment-timezone";
import { RequestBodyTimekeeping } from "../../../model/ITimekeeping";
import { Router } from "@angular/router";
interface TimekeepingDetail {
  clock_in?: string;
  clock_out?: string;
  staff_name?: string;
  // Thêm các thuộc tính khác tùy thuộc vào dữ liệu của bạn
}
interface TimekeepingSubRecord {
  subId: string;
  details: TimekeepingDetail;
}

interface TimekeepingRecord {
  epoch: string;
  type?: string;
  records: TimekeepingSubRecord[];
}
@Component({
  selector: 'app-following-timekeeping',
  templateUrl: './following-timekeeping.component.html',
  styleUrls: ['./following-timekeeping.component.css']
})
export class FollowingTimekeepingComponent implements OnInit {
  followingTimekeepings: any[] = [];
  totalHoursByEmployee: { [key: string]: number } = {};
  constructor(private timekeepingService: TimeKeepingService, private router: Router,) { }

  ngOnInit(): void {
    const current = new Date();
    const daysInMonth = new Date(current.getFullYear(), (current.getMonth() + 1), 0).getDate();
    this.totalDate = daysInMonth + '';
    const frDate = current.getFullYear() + "-" + (current.getMonth() + 1) + "-" + current.getDay();
    const tDate = current.getFullYear() + "-" + (current.getMonth() + 1) + "-" + daysInMonth;
    this.setDefaultMonth();
    this.getDateinFromDatetoToDate(frDate, tDate);
  }
  selectedMonth: string = '';
  startTime: string = '';
  endTime: string = '';
  fromDate: string = '';
  toDate: string = '';

  fromDateFilter: string = '';
  toDateFilter: string = '';
  date: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  ngaylamviec: number[] = [2, 4, 6, 8, 10]
  listNgaylamviec: any[] = []
  hienThi = {
    clock_in: '',
    clock_out: '',
    nghi: '',
  }
  nhanVienChamCong = {
    tenNhanVien: '',
    role: '',
    ngayLamViec: [],

  }
  objectList: any[] = [];
  count: number = 0;
  countChange() {
    this.count = 1;
  }
  countChange2() {
    this.count = 0;
  }

  dateToTimestamp(dateStr: string): number {
    const format = 'YYYY-MM-DD HH:mm:ss'; // Định dạng của chuỗi ngày
    const timeZone = 'Asia/Ho_Chi_Minh'; // Múi giờ
    const timestamp = moment.tz(dateStr, format, timeZone).valueOf() / 1000;
    return timestamp;
  }

  timestampToGMT7String(timestamp: number): string {
    // Chuyển timestamp thành chuỗi ngày và thời gian dsựa trên múi giờ GMT+7
    const dateTimeString = moment.tz(timestamp * 1000, 'Asia/Ho_Chi_Minh').format('HH:mm');
    return dateTimeString;
  }

  updateStartAndEndTime() {
    const year = parseInt(this.selectedMonth.split('-')[0]);
    const month = parseInt(this.selectedMonth.split('-')[1]);

    // Cập nhật startTime và endTime
    this.startTime = `${year}-${month.toString().padStart(2, '0')}-01 00:00:00`;
    const endDate = new Date(year, month, 0); // Lưu ý: tháng trong JavaScript bắt đầu từ 0
    this.endTime = `${year}-${month.toString().padStart(2, '0')}-${endDate.getDate()} 23:59:59`;

    // Gọi API
    this.getFollowingTimekeeping();
  }
  setDefaultMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    this.selectedMonth = `${year}-${month.toString().padStart(2, '0')}`;
    this.updateStartAndEndTime();
  }

  getFollowingTimekeeping() {
    this.fromDate = '';
    this.toDate = '';
    const current = new Date();
    const daysInMonth = new Date(current.getFullYear(), (current.getMonth() + 1), 0).getDate();
    if (this.fromDateFilter != '' && this.toDateFilter != '') {
      this.fromDate = this.fromDateFilter;
      this.toDate = this.toDateFilter;
      this.first = 0;
    } else if (this.fromDateFilter != '' && this.toDateFilter == '') {
      this.fromDate = this.fromDateFilter;
      this.toDate = current.getFullYear() + "-" + (current.getMonth() + 1) + "-" + daysInMonth;
      this.first = 0;
    } else if (this.fromDateFilter == '' && this.toDateFilter != '') {
      this.fromDate = current.getFullYear() + "-" + (current.getMonth() + 1) + "-" + 1;
      this.toDate = this.toDateFilter;
      this.first = 0;
    } else {
      this.fromDate = '';
      this.toDate = '';
      this.first = 1;
    }

    if (this.fromDate != '' && this.toDate != '') {
      this.getDateinFromDatetoToDate(this.fromDate, this.toDate);
      const startTime = this.dateToTimestamp(this.fromDate + ' 00:00:00');
      const endTime = this.dateToTimestamp(this.toDate + ' 23:59:59');
      this.timekeepingService.getFollowingTimekeeping(startTime, endTime).subscribe(data => {
        this.followingTimekeepings = this.organizeData(data);
      });
    }
    else {
      const current = new Date();
      const daysInMonth = new Date(current.getFullYear(), (current.getMonth() + 1), 0).getDate();
      this.totalDate = daysInMonth + '';
      const frDate = current.getFullYear() + "-" + (current.getMonth() + 1) + "-" + current.getDay();
      const tDate = current.getFullYear() + "-" + (current.getMonth() + 1) + "-" + daysInMonth;
      this.getDateinFromDatetoToDate(frDate, tDate);
      const startTime = this.dateToTimestamp(this.startTime);
      console.log(startTime);
      const endTime = this.dateToTimestamp(this.endTime);
      console.log(endTime)
      this.timekeepingService.getFollowingTimekeeping(startTime, endTime).subscribe(data => {
        this.followingTimekeepings = this.organizeData(data);
        console.log("67", this.followingTimekeepings)
        this.followingTimekeepings.forEach((item: any) => {
          item.records.forEach((detail: any) => {
            const currentObject = detail;
            console.log("checkObject", currentObject)
            if (!this.uniqueList.includes(currentObject.subId)) {
              this.uniqueList.push(currentObject.subId);
              let newtimeKeepingObject = {
                epoch: item.epoch,
                clock_in: currentObject.details.clock_in,
                clock_out: currentObject.details.clock_out,
              }
              this.staffTimeKeeping.sub_id = currentObject.subId,
                this.staffTimeKeeping.staff_name = currentObject.details.staff_name,
                this.staffTimeKeeping.role_name = '',
                this.staffTimeKeeping.timeKeeping.push(newtimeKeepingObject);
              this.listStaffTimeKeeping.push(this.staffTimeKeeping);
              newtimeKeepingObject = {
                epoch: '',
                clock_in: '',
                clock_out: '',
              }
              this.staffTimeKeeping = {
                sub_id: '',
                staff_name: '',
                role_name: '',
                timeKeeping: [] as timeKeepingObject[]
              }
            } else {
              this.listStaffTimeKeeping.forEach((it: any) => {
                if (it.sub_id == currentObject.subId) {
                  let newtimeKeepingObject = {
                    epoch: item.epoch,
                    clock_in: currentObject.details.clock_in,
                    clock_out: currentObject.details.clock_out,
                  }
                  this.staffTimeKeeping.timeKeeping.push(newtimeKeepingObject);
                  newtimeKeepingObject = {
                    epoch: '',
                    clock_in: '',
                    clock_out: '',
                  }
                }
              })
            }
          })
        })
        console.log(this.listStaffTimeKeeping);
      })
    }
  }

  uniqueList: string[] = [];

  listStaffTimeKeeping: any[] = [];

  staffTimeKeeping = {
    sub_id: '',
    staff_name: '',
    role_name: '',
    timeKeeping: [] as timeKeepingObject[]
  }


  organizeData(data: any[]): TimekeepingRecord[] {
    return data.map((item): TimekeepingRecord => {
      // Tạo một đối tượng mới cho mỗi phần tử
      const timekeepingEntry: TimekeepingRecord = {
        epoch: item.epoch?.N,
        type: item.type?.S,
        records: []
      };

      // Thêm tất cả các sub-ids vào mảng 'records'
      Object.keys(item).forEach((key: string) => {
        if (key !== 'epoch' && key !== 'type') {
          const details: TimekeepingDetail = {
            clock_in: item[key]?.M?.clock_in?.N,
            clock_out: item[key]?.M?.clock_out?.N,
            staff_name: item[key]?.M?.staff_name?.S,
          };
          timekeepingEntry.records.push({
            subId: key,
            details: details
          });
        }
      });

      return timekeepingEntry;
    });
  }
  daysInMonth: number[] = [];
  totalDate: string = '';
  // calculateDaysInMonth() {
  //   const currentDate = new Date();
  //   const daysInMonth = new Date(currentDate.getFullYear(), (currentDate.getMonth() + 1), 0).getDate();
  //   this.totalDate = daysInMonth.toString();
  //   this.daysInMonth = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  // }

  changeFromDate(fromDate: any) {
    this.fromDateFilter = fromDate;
  }

  changeToDate(toDate: any) {
    this.toDateFilter = toDate;
  }


  listDayInMonth: string[] = [];
  first: number = 1;
  getDateinFromDatetoToDate(frDate: string, tDate: string) {
    this.listDayInMonth.splice(0, this.listDayInMonth.length);
    const current = new Date();
    const startDateParts = frDate.split('-');
    const endDateParts = tDate.split('-');
    const startDate = new Date(
      parseInt(startDateParts[0]),
      parseInt(startDateParts[1]) - 1,
      parseInt(startDateParts[2])
    );
    const endDate = new Date(
      parseInt(endDateParts[0]),
      parseInt(endDateParts[1]) - 1,
      parseInt(endDateParts[2])
    );
    var count = 0;
    let currentDate = startDate;
    while (currentDate <= endDate) {
      if (count == 0 && this.first == 1) {
        this.listDayInMonth.push("1" + "/" + (current.getMonth() + 1) + "/" + current.getFullYear())
      }
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
      this.listDayInMonth.push(formattedDate);
      currentDate.setDate(currentDate.getDate() + 1);
      count++;
    }
  }

  isSameDay(epoch: number, compareDate: Date): boolean {
    const epochDate = new Date(this.timestampToDate(epoch));
    return (
      epochDate.getFullYear() === compareDate.getFullYear() &&
      epochDate.getMonth() === compareDate.getMonth() &&
      epochDate.getDate() === compareDate.getDate()
    );
  }
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  isClockInDay(day: string, epoch: string): boolean {
    const date = day.split('/');
    const epochInt = parseInt(epoch, 10);
    const timestamp = new Date(this.currentYear, this.currentMonth, parseInt(date[0])).getTime();
    return this.isSameDay(epochInt, new Date(timestamp));
  }
  isClockOutDay(day: string, epoch: string): boolean {
    const date = day.split('/');
    const epochInt = parseInt(epoch, 10);
    const timestamp = new Date(this.currentYear, this.currentMonth, parseInt(date[0])).getTime();
    return this.isSameDay(epochInt, new Date(timestamp));
  }

  navigateHref(href: string) {
    const userGroupsString = sessionStorage.getItem('userGroups');

    if (userGroupsString) {
      const userGroups = JSON.parse(userGroupsString) as string[];

      if (userGroups.includes('dev-dcms-doctor')) {
        this.router.navigate(['nhanvien' + href]);
      } else if (userGroups.includes('dev-dcms-nurse')) {
        this.router.navigate(['nhanvien' + href]);
      } else if (userGroups.includes('dev-dcms-receptionist')) {
        this.router.navigate(['nhanvien' + href]);
      } else if (userGroups.includes('dev-dcms-admin')) {
        this.router.navigate(['admin' + href]);
      }
    } else {
      console.error('Không có thông tin về nhóm người dùng.');
      this.router.navigate(['/default-route']);
    }
  }
  calculateTotalHours() {
    // Khởi tạo/reset đối tượng chứa tổng giờ làm việc
    this.totalHoursByEmployee = {};

    // Duyệt qua từng bản ghi chấm công
    this.followingTimekeepings.forEach(record => {
      record.records.forEach((detail: any) => {
        const staffName = detail.details.staff_name;
        const clockIn = this.timeToTimestamp(detail.details.clock_in);
        const clockOut = this.timeToTimestamp(detail.details.clock_out);

        // Tính toán tổng giờ làm việc của nhân viên
        const hoursWorked = (clockOut - clockIn) / (1000 * 60 * 60); // Chuyển đổi từ milliseconds sang giờ

        // Cập nhật tổng giờ làm việc trong đối tượng
        if (this.totalHoursByEmployee[staffName]) {
          this.totalHoursByEmployee[staffName] += hoursWorked;
        } else {
          this.totalHoursByEmployee[staffName] = hoursWorked;
        }
      });
    });
  }

  timeToTimestamp(timeStr: string): number {
    const time = moment(timeStr, "HH:mm:ss");
    const timestamp = time.unix(); // Lấy timestamp tính bằng giây
    return timestamp;
  }

  timestampToDate(timestamp: number): string {
    const date = moment.unix(timestamp);
    const dateStr = date.format('YYYY-MM-DD');
    return dateStr;
  }

  convertToTimestamp(time: string): number {
    // Giả định rằng time là một chuỗi định dạng 'HH:mm:ss' hoặc một timestamp
    // Thay đổi logic nếu cần để phù hợp với định dạng dữ liệu của bạn
    if (typeof time === 'string') {
      // Chuyển đổi chuỗi giờ thành timestamp
      // Lưu ý: bạn cần cung cấp ngày cụ thể nếu thời gian không bao gồm ngày
      return new Date('1970-01-01T' + time + 'Z').getTime();
    } else {
      // Nếu thời gian đã là một timestamp, chỉ cần trả về nó
      return time;
    }
  }
}
interface timeKeepingObject {
  epoch: string;
  clock_in: string;
  clock_out: string;
}