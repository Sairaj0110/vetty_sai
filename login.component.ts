import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RegistrationService } from '../../services/registration.service';
import { CommonService } from '../../services/common.service';
import { AuthGuardService } from '../../../app/services/auth-guard.service';
import { FormstepsService } from '../../../app/services/formsteps.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService, AuthGuardService,FormstepsService]
})
export class LoginComponent implements OnInit {
  
  email: string;
  password: string;
  todaysdate: Date;
  loginuser: boolean;
  ssnInvalid: boolean;
  ssnMessage: string;
  type = 'password';
  show = false;
  firefox = false;
  tokenUsed = false;
  background_data_submitted=false;
  IsOnboardingDocs=false;

  constructor(private authservice: AuthService, private router: Router, private activeRoute: ActivatedRoute,
    private registrationService:RegistrationService, private common: CommonService, private authguard:AuthGuardService,private formStepService: FormstepsService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.firefox = ( (this.common.getBrowser().indexOf('Firefox') > -1) ? true : false);
    // this.activeRoute.params.subscribe(
    //   params => {
    //     this.tokenUsed = params.tokenUsed;
    //   }
    // )
  }

  toggleShow(event) {

    this.show = !this.show;
    if (this.show) {
      this.type = 'text';
    }
    else {
      this.type = 'password';
    }

  }


  applicantLogin() {
    const credentials = {
      password: this.password,
      email: this.email
    };

    this.authservice.loginUser(credentials)
      .subscribe(data => {
        if (data.status) {
          this.registrationService.getApplicantChecksData()
          .subscribe((data: any) => {

            //debugger;

            var applicant=data.applicant;

            if(applicant.hasOwnProperty("filled_status")){
              var filled_status_obj=applicant["filled_status"];          
      
              if(filled_status_obj.hasOwnProperty("background_data_submitted") && applicant["filled_status"]["background_data_submitted"]=="Complete"){      
               this.background_data_submitted=true;
              }     
      
            }

            var applicant_package = data.applicant.package; 
                      
            if(applicant_package.hasOwnProperty("ExtraDocs") && applicant_package["ExtraDocs"]!=null)
            {
              if(applicant_package["ExtraDocs"].length>0){
               this.IsOnboardingDocs=true;
               this.formStepService.getApplicantDocSteps(applicant_package["ExtraDocs"],data.applicant.filled_status);
              }
            }

            
            if(data.applicant['report_meta'] != undefined){
              sessionStorage.setItem('value', "false");
              this.router.navigate(['/verified-profile']);
            }
            
            else if(this.IsOnboardingDocs && this.background_data_submitted){
              this.router.navigate(['/onboarding/companydocs']);
            }
            
            else{
              sessionStorage.setItem('value', "true");
              this.router.navigate(['/applicant-details/background']); 
              // setTimeout(()=> window.location.reload(), 100);   

            }
            
          });
                 
        }
        else {
          this.ssnInvalid = true;
          this.ssnMessage = data.message;
        }
        console.log(data);
      });
  }

}
