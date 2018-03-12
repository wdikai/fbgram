import {CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {AuthService, AuthStatuses} from "../services/auth";

@Injectable()
export class OnlyAuthorized implements CanActivate, CanActivateChild {
    constructor (private auth: AuthService,
                 private router: Router) { }

    public canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.isUserSignedIn(route, state);
    }

    public canActivateChild (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.isUserSignedIn(route, state);
    }

    private isUserSignedIn (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.auth.loginStatus || this.auth.loginStatus.status !== AuthStatuses.authorized) {
            this.router.navigate(["/login"]);
        }

        return this.auth.loginStatus && this.auth.loginStatus.status === AuthStatuses.authorized;
    }

}
