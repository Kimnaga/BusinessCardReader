import { Component, OnInit } from '@angular/core';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from 'angularfire2/storage';
import {ScannerService} from './scanner.service';
import {Observable} from 'rxjs';
import {Contact} from '../Model/Contact';
import {LoginService} from '../login/login.service';


@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent implements OnInit {
  selectedFile = null;
  url = '';
  ref : AngularFireStorageReference;
  task : AngularFireUploadTask;
  contacts : Observable<any[]>;
  searchText : string ="";
  admin : Observable <boolean>;

  constructor(private afStorage : AngularFireStorage, private service : ScannerService, private loginService : LoginService) {
    
    this.admin = loginService.admin;
    console.log (this.admin);
   }

  base64textString :string ='';
  onSelected (event){
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile){
        const reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(this.selectedFile);
      }
    }
  }

  handleReaderLoaded(e) {
    var binaryString = e.target.result;
    this.base64textString= btoa(binaryString);
    //console.log(btoa(binaryString));
  }

    //  var reader = new FileReader();

    //  reader.readAsDataURL(this.selectedFile); // read file as data url

    //  reader.onload = (event) => { // called once readAsDataURngis completed
    //    this.url = event.target.addEventListener.name;
    //  }

  resArr: string[];
  contact : Contact = new Contact();
  responses : Observable<any[]>;

  onUpload (){
    //const id = Math.random().toString(36).substring(2);
    //this.ref = this.afStorage.ref(id);
    //this.task = this.ref.put(this.selectedFile);
    
    this.service.getLabels(this.base64textString).subscribe ((result) => {
      console.log(result);
      this.responses =  result['responses'];
      //console.log ( this.responses[0].fullTextAnnotation.text.split("\n"));
      this.resArr = this.responses[0].fullTextAnnotation.text.split("\n");
      this.createContact();
    });
  }
  
  createContact (){
    //for (var i=0; i<this.resArr.length; i++){
    //  console.log (i+" "+this.resArr[i]);
    //}

    this.contact.companyName = this.resArr[0]+" "+this.resArr[1];
    var name = this.resArr[3]; 
    this.contact.firstName = name.split(" ")[0];
    this.contact.lastName = name.split(" ")[1];
    this.contact.Address = this.resArr[5];
    this.service.saveContact (this.contact);
  }

  ngOnInit() {
    this.contacts = this.service.getContact();
  }

  filterCondition (contact : Contact){
    var firstName = contact.firstName;
    return firstName.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1;
  }
}
