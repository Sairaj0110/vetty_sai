import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { OrderService } from '../../clientservices/order.service';
import CONSTANTS from '../../constants';
import { AdmindashboardService } from '../../adminservices/admindashboard.service';
import { NotificationsService } from 'angular2-notifications';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-addnewuser',
  templateUrl: './addnewuser.component.html',
  styleUrls: ['./addnewuser.component.css'],
  providers: [AdmindashboardService, OrderService]
})

export class AddnewuserComponent implements OnInit {
  public formAddNewUser: FormGroup;
  endpointParams = {};
  params = {};
  emailerror;

  constructor(public fb: FormBuilder, private adminservice: AdmindashboardService, private notfy: NotificationsService, private router: Router, private activatedRoute: ActivatedRoute, private orderService: OrderService, ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.endpointParams['client_id'] = params['id'];
      this.endpointParams['type'] = params['type'];
    });

    // this.formAddNewUser = this.fb.group({

    //   firstname: ['', [Validators.required]],
    //   lastname: ['', [Validators.required]],
    //   usertype: ['', [Validators.required]],
    //   email: ['', [Validators.required, Validators.email]],

    // });
    this.formAddNewUser = this.fb.group({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      usertype: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });


  }

  sendInvitation() {

    this.params = {
      first_name: this.formAddNewUser.get('firstname').value,
      role: this.formAddNewUser.get('usertype').value,
      last_name: this.formAddNewUser.get('lastname').value,
      email: this.formAddNewUser.get('email').value,

    }

    this.orderService.addNewUser(this.params)
      .subscribe((data: any) => {
        if (data.status) {
          // this.notfy.success(CONSTANTS.NOTFY_TITLE.DONE, CONSTANTS.SUCCESS_MSG.SUBMITTED);
          this.router.navigateByUrl('/client/settings/myaccount');
          window.location.reload();
          window.scroll(0, 0);

        } else {
          this.emailerror = "Applicant with this email already exists, cannot add this email."
        }
      }, err => {
        console.log(err);
        // this.notfy.error(CONSTANTS.NOTFY_TITLE.OOPS, CONSTANTS.ERR_MSG.GENERAL);
      });
  }




  cancel() {
    this.router.navigateByUrl('/client/dashboard');
  }

  route(){
    this.router.navigateByUrl('/client/settings/myaccount');
  }

}
