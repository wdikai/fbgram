
import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {FacebookService, LoginStatus, LoginResponse} from "ngx-facebook";

import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/do";

import { environment } from "environments/environment";

export enum AuthStatuses {
    authorized = "connected",
    notAuthorized = "not_authorized",
    unknown = "unknown"
}
@Injectable()
export class AuthService {
    public token: string;
    public statusChanged: BehaviorSubject<LoginStatus | null> = new BehaviorSubject(null);
    private status: LoginStatus;
    private user: any;

    constructor(private fb: FacebookService,
                private http: HttpClient) {
        this.fb.init({ appId: environment.FB_APP_ID, version: environment.FB_VERSION});
        this.init();
    }

    get loginStatus () {
        return this.status;
    }

    set loginStatus (value: LoginStatus | null) {
        this.status = value;
        if (value && value.authResponse) {
            this
                .login(value.authResponse.accessToken)
                .map(() => this.statusChanged.next(value))
                .subscribe();
        }
    }

    fbLogin(): Observable<any> {
        return Observable
            .fromPromise(this.fb.login({ scope: environment.FB_SCOPES }))
            .map(status => this.loginStatus = status);
    }

    login(accessToken: string): Observable<any> {
        return this.http
            .post("/login", {accessToken: accessToken})
            .map((response: any) => {
                localStorage.setItem("token", response.credentials.token);
                return this.user = response.profile;
            });
    }

    getStatus(): Observable<LoginStatus> {
        return Observable.fromPromise(this.fb.getLoginStatus());
    }

    logout(): Observable<any> {
        return Observable
            .fromPromise(this.fb.logout())
            .do(() => this.loginStatus = null);
    }

    private init(): void {
        this
            .getStatus()
            .do(status => this.loginStatus = status)
            .subscribe();
    }

    initSession() {
        const token = localStorage.getItem("token");
        if (token) {
            return;
        }

        this.login(this.loginStatus.authResponse.accessToken);
    }
}