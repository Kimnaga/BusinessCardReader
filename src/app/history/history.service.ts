import { Injectable } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';


@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  searchHistoryRef : any;

  constructor(private db: AngularFireDatabase) { 
    this.searchHistoryRef = this.db.list('/history');
  }

  setHistory (userId : string, name: string){
    var timeStamp = new Date().toDateString();
    this.searchHistoryRef.push({
      uid : userId,
      contactName : name,
      date : timeStamp
    });
  }

  getHistory(){
    return this.searchHistoryRef.valueChanges();
  }
}
