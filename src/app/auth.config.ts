import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../environments/environment';

export const authCodeFlowConfig: AuthConfig = {
    redirectUri: window.location.origin,
    clientId: environment.appId,
    dummyClientSecret: environment.appToken,
    loginUrl: environment.loginUrl,
    tokenEndpoint: environment.tokenUrl,
    logoutUrl: environment.logoutUrl,  
    scope: environment.scope,
    responseType: 'code',
    showDebugInformation: true,
    oidc: false,
    checkOrigin: false,
    requireHttps: false,
    useSilentRefresh: true,
    clearHashAfterLogin: true,
    strictDiscoveryDocumentValidation: false,
    skipSubjectCheck: true,
    skipIssuerCheck: true
};