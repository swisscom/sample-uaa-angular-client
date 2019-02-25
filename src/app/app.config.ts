import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AppConfig {
  private config: Object = null;

  constructor(private http: Http) {}

  /**
   * gets any key from the config found in conf.json
   */
  public getConfig(key: any) {
    return this.config[key];
  }

  /**
   * loads conf.json
   */
  public load() {
    return new Promise((resolve, reject) => {
      this.http
        .get('conf.json')
        .pipe(map(res => res.json()))
        .subscribe(responseData => {
          this.config = responseData;
          resolve(true);
        });
    });
  }
}
