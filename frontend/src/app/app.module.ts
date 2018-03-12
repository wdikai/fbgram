import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { ModalModule } from "ngx-bootstrap";

import { AppComponent } from "app/app.component";

import { applicationRoutes } from "app/app.routes";
import { TopBarComponent } from "./top-bar/top-bar.component";
import { LoginComponent } from "./login/login.component";
import { AlbumsComponent } from "./albums/albums.component";
import { AlbumComponent } from "./album/album.component";
import { PhotoModalComponent } from "./photo-modal/photo-modal.component";
import { AuthService } from "./services/auth";
import { AlbumsService } from "./services/albums";
import { CommentsService } from "./services/comments";
import { UsersService } from "./services/users";
import { OnlyAuthorized } from "./guards/authorized";
import { FacebookModule } from "ngx-facebook";
import { AuthenticationInterceptor, UrlInterceptor } from "./services/interseptors/interseptor";

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    AlbumsComponent,
    AlbumComponent,
    PhotoModalComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,

    ModalModule.forRoot(),
    FacebookModule.forRoot(),

    RouterModule.forRoot(applicationRoutes),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UrlInterceptor,
      multi: true,
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    },
    AuthService,
    AlbumsService,
    CommentsService,
    UsersService,
    OnlyAuthorized
  ],
  bootstrap: [AppComponent],
  entryComponents: [PhotoModalComponent]
})
export class AppModule { }
