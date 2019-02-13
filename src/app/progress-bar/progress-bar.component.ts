import {
  Component,
  Input,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  progressBarList: any[] = [{"route":"Getting Started", "progress": "1"},
  {"route":"Your request", "progress": "2"},
  {"route":"Contact Info", "progress": "3"},
  {"route":"Review & Submit", "progress": "4"}
];
  @Input() public currentProgress: String;

  ngOnInit() {}

  ngAfterViewInit() {}

  progressClass(itemProgress: string) {
    if (itemProgress === this.currentProgress) {
      return 'active';
    } 
    if (itemProgress < this.currentProgress) {
      return 'was-active';
    }
    return 'inactive'
  }

  isActiveProgress(itemProgress: string) {
    let ret = (itemProgress === this.currentProgress)
    return ret;
  }

}
