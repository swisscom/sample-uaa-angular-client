import { Injectable, Inject } from '@angular/core';
import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { DOCUMENT } from '@angular/platform-browser';
import { AppConfig } from './app.config';

export { User };

@Injectable({
  providedIn: 'root'
})
export class AppAuthNService {
  _userManager: UserManager;

  constructor(@Inject(DOCUMENT) private document, private config: AppConfig) {
    const protocol = document.location.protocol;
    const hostname = document.location.hostname;
    const port = document.location.port ? ':' + document.location.port : '';
    const auth = config.getConfig('oidc').authorizationEndpoint;
    const settings = {
      authority: auth.substr(0, auth.indexOf('/oauth')),
      client_id: config.getConfig('oidc').clientId,
      redirect_uri: `${protocol}//${hostname}${port}/assets/signin-callback.html`,
      silent_redirect_uri: `${protocol}//${hostname}${port}/assets/silent-callback.html`,
      post_logout_redirect_uri: `${protocol}//${hostname}${port}`,
      response_type: 'token',
      scope: 'openid roles'
    };
    this._userManager = new UserManager(settings);
  }

  public getUser(): Promise<User> {
    return this._userManager.getUser();
  }

  public login(): Promise<void> {
    return this._userManager.signinRedirect();
  }

  public renewToken(): Promise<User> {
    return this._userManager.signinSilent();
  }

  public logout(): Promise<void> {
    return this._userManager.signoutRedirect();
  }
}
