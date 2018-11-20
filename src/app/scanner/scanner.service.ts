import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AngularFireDatabase} from 'angularfire2/database';
import {Contact} from '../Model/Contact';



@Injectable({
  providedIn: 'root'
})
export class ScannerService {
  contactRef : any;
  
  constructor(private http: HttpClient,  private db: AngularFireDatabase ) { 
    this.contactRef = this.db.list('/contact');
  }

  getLabels(base64String) {
    const body = {
      "requests": [
        {
          "image": {
            "content": base64String
          },
          "features": [
            {
              "type": "TEXT_DETECTION"
            }
          ]
        }
      ]
    }
    return this.http.post('https://vision.googleapis.com/v1/images:annotate?key='+ environment.googleVisionApiKey,body);
  }


  saveContact (contact : Contact){
    this.contactRef.push({
      name : contact.name,
      address : contact.address,
      phone : contact.phone,
      email : contact.email
    });
  }

  getContact (){
    return this.contactRef.valueChanges();
  }

}
