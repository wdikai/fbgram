import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth";
import { UsersService } from "../services/users";

const LOAD_NEW_USERS_EDGE = 200; // px

@Component({
  selector: "app-top-bar",
  templateUrl: "./top-bar.component.html",
  styleUrls: ["./top-bar.component.css"]
})
export class TopBarComponent {
  inLoading: boolean;
  showSidebar: boolean;
  pagination: any;

  users = [];

  constructor(private auth: AuthService,
    private router: Router,
    private usersService: UsersService) {
    this.getUsers();
  }

  logout() {
    this.auth
      .logout()
      .subscribe(() => this.router.navigate(["login"]));
  }
  public onScroll($event: Event): void {
    const top = $event.srcElement.scrollTop;
    const height = $event.srcElement.scrollHeight;
    if (!this.inLoading && height - top < 300) {
      this.getUsers();
    }
  }

  getUsers(search = "") {
    if (this.pagination && !this.pagination.lastEvaluatedKey) {
      return;
    }

    this.inLoading = true;
    this.usersService
      .getList(search)
      .subscribe(response => {
        this.inLoading = false;
        this.users = response.data
      });
  }
}
