import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService, AuthStatuses } from "app/services/auth";
import { AlbumsService } from "app/services/albums";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  constructor(private auth: AuthService,
    private router: Router) { }

  login() {
    this.auth
      .fbLogin()
      .subscribe();
  }

  ngOnInit(): void {
    this.auth.statusChanged.subscribe(auth => {
      if (auth && auth.status === AuthStatuses.authorized) {
        this.router.navigate(["app"]);
      }
    });
  }

}
