import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { CONFIG } from '../constants';

@Injectable()
export class FileUploadService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public upload(formData) {
    return this.httpClient.post(CONFIG.DOMAIN + 'files', formData)
      .map((response: any) => response);
  }

}
