import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { environment } from "environments/environment";

import { AuthService } from "../auth";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiReq = req.clone({
      headers: req.headers.append("Authorization", localStorage.getItem("token") || "")
    });
    return next.handle(apiReq);
  }
}

@Injectable()
export class UrlInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiReq = req.clone({ url: `${environment.baseUrl}/api${req.url}` });
    console.log("UrlInterceptor", apiReq);
    return next.handle(apiReq);
  }
}