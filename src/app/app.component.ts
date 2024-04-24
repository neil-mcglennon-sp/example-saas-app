import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from './auth.config';
import { SailPointService } from './sailpoint.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  launchers: any[] = [ 
    {
      "name": "Launch a Form!",
      "icon": "plus-square",
      "description": "This launcher launches a form!",
      "button": "Launch",
      "target": {
        "formDefinitionId": "15fb18f3-d101-4bb8-9857-35e10be5bc70",
        "formInput": {
          "Operation": "Create"
        }
      }
    }
  ]

  constructor( private oauthService: OAuthService, private sailpointService: SailPointService ) {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.tryLoginCodeFlow();
    this.oauthService.events.subscribe(e => console.log(e));
}

  get accessToken(): string {
    return this.oauthService.getAccessToken();
  }

  get hasValidAccessToken() {
    return this.oauthService.hasValidAccessToken();
  }

  get isAuthenticated() {
    return this.oauthService.hasValidAccessToken();
  }

  get tokenPayload() {
    const token = this.oauthService.getAccessToken();
    const jsonPayload = JSON.parse( atob( token.split( "." )[1] ) );
    return (jsonPayload) ? jsonPayload : null;
  }

  get authorities() {
    return this.tokenPayload.authorities;
  }

  hasAuthority( value: string ) {
    return this.authorities.includes( value );
  }

  get username() {
    return this.tokenPayload.user_name;
  }

  get identity_id() {
    return this.tokenPayload.identity_id;
  }

  login() {
    this.oauthService.initCodeFlow();
    this.oauthService.tryLoginCodeFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  refresh() {
    this.oauthService.refreshToken();
  }

  launch( launcher: any ): void {
    
    console.log( "Launching " + launcher.name + " for user " + this.username );
    
    var expireDate = new Date();
    expireDate.setDate( expireDate.getDate() +1 );

    var body: Object = {
      "formDefinitionId": launcher.target.formDefinitionId,
      "recipients":[
        {
          "type": "IDENTITY",
          "id": this.identity_id
        }
      ],
      "standAloneForm": true,
      "expire": expireDate.toISOString(),
      "state": "ASSIGNED",
      "formInput": launcher.target.formInput,
      "createdBy": {
        "type": "SOURCE",
        "id": "ff80818155fe8c080155fe8d925b0316"
      },
      "formElements":[],
      "formConditions":[]
    }

    this.sailpointService.post( this.accessToken, "/beta/form-instances", body ).subscribe((data: any) => {
      console.log( "Redirect: " + data["standAloneFormUrl"] );
      window.open( data["standAloneFormUrl"], '_blank' );
    });
  }
}