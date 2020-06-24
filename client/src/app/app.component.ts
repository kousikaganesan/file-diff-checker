import { Component, ViewChild } from '@angular/core';
import { FileUploadService } from './service/file-upload.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  @ViewChild('fileInputOne') fileInputOne;
  @ViewChild('fileInputTwo') fileInputTwo;
  fileContent: {};
  showError: boolean = false;
  isShowSpinner: boolean = false;
  formData: any;
  constructor(
    private fileUploadService: FileUploadService
  ) { }

  compareFiles() {
    this.showError = false;
    this.isShowSpinner = true;
    this.formData = new FormData();
    this.formData.append("fileOne", this.fileInputOne.nativeElement.files[0]);
    this.formData.append("fileTwo", this.fileInputTwo.nativeElement.files[0]);
    this.uploadFiles();
  }

  uploadFiles() {

    if (this.fileInputOne.nativeElement.files[0] === undefined ||
      this.fileInputTwo.nativeElement.files[0] === undefined) {
      this.showError = true;
    }
    else if (this.fileInputOne.nativeElement.files[0].type ===
      this.fileInputTwo.nativeElement.files[0].type) {
      this.fileUploadService.upload(this.formData).subscribe((response) => {
        this.fileContent = response;
      });

    }
    else {
      this.showError = true;
    }
  }

  clearError() {
    this.showError = false;
    this.isShowSpinner = false;
  }

}

