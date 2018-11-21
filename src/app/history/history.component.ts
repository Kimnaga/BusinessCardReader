import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {HistoryService} from './history.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  history : Observable <any[]>; 
  constructor(private service : HistoryService) { }

  ngOnInit() {
    this.history = this.service.getHistory();
  }

}
