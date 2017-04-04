import { Meteor } from "meteor/meteor";
import { MeteorComponent } from 'angular2-meteor';
import { Component, Input, OnInit, OnDestroy, NgZone, AfterViewInit, AfterViewChecked } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from "@angular/core";
import { Tour } from "../../../../both/models/tour.model";
import * as moment_ from 'moment';
import { showAlert } from "../shared/show-alert";

const moment:moment.MomentStatic = (<any>moment_)['default'] || moment_;

import template from "./table.html";

@Component({
  selector: 'tours-table',
  template
})
export class ToursTableComponent extends MeteorComponent {
    @Input() pageArr: Tour[];
    @Input() itemsSize: number = -1;
    @Input() showAction: boolean = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  canEdit(tour: Tour) {
    let date = tour.createdAt;
    let createdDate = new moment.utc(date).add(6, 'hours');
    let currentDate = new moment.utc();
    // console.log(createdDate);
    if (createdDate > currentDate) {
      // console.log("can edit", tour.name);
      return true;
    }
  }

  canDelete(tour: Tour) {
    if (tour.approved == false)
    {
      return true;
    }
  }

  deleteTour(tour: Tour, index) {
    if (!confirm("Are you sure, do you want to continue?")) {
      return false;
    }

    Meteor.call("tours.delete", tour._id, (err, res) => {
      if (err) {
          showAlert(err.reason, "danger");
          return;
      }

      let pageArr = this.pageArr;
      for (let i=0; i<pageArr.length; i++) {
        if (pageArr[i]._id == tour._id) {
          pageArr.splice(i, 1);
          this.changeDetectorRef.detectChanges();
        }
      }

      this.pageArr = pageArr;
      showAlert("Tour has been deleted.", "success");
    });
  }
}
