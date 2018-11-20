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
  


  notNameWords = ["company","consulting","co","corporation","companies","corp","engineer","software","lawyer","president","ceo","&","construction"];
  notNameSet =  new Set (this.notNameWords);
  createContact (){
    for (var i=0; i<this.resArr.length; i++){
      console.log(i +" "+this.resArr[i]);
    }

    let maxLen = 0;
    let addressIndex = 0;

    for (var i=0; i<this.resArr.length; i++){
      let currentString = this.resArr[i].toLowerCase();
      let currentArr =  currentString.split(" ");
      if (currentArr.length > maxLen){
        maxLen = currentArr.length;
        addressIndex = i;
      }
      if (/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi.test(currentString)){
        this.contact.email = currentString.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi).toString();
      } else if (/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(currentString)){
        this.contact.phone = currentString.match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g).toString();
      } else if (currentArr.length == 2 || (currentArr.length == 3 && currentArr[1].includes("."))){
        if (!this.notNameSet.has(currentArr[0]) && !this.notNameSet.has(currentArr[currentArr.length-1])){
          this.contact.name = currentString;
        }
      } 
    }
    this.contact.address = this.resArr[addressIndex];
    this.service.saveContact (this.contact);
    this.contact= new Contact();
  }

  ngOnInit() {
    this.contacts = this.service.getContact();
  }

  filterCondition (contact : Contact){
    var firstName = contact.name;
    return firstName.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1;
  }
}
