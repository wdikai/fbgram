import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FacebookModule } from "ngx-facebook";

import { ModalModule } from "ngx-bootstrap";

import { AppComponent } from "app/app.component";

import { applicationRoutes } from "app/app.routes";
import { LayoutComponent } from "app/components/layout/layout.component";
import { AlbumsComponent } from "app/components/albums/albums.component";
import { AlbumComponent } from "app/components/album/album.component";
import { LoginComponent } from "app/components/login/login.component";
import { PhotoModalComponent } from "app/components/photo-modal/photo-modal.component";

import { AuthService } from "app/services/auth";
import { AlbumsService } from "app/services/albums";
import { CommentsService } from "app/services/comments";
import { UsersService } from "app/services/users";
import { OnlyAuthorized } from "app/guards/authorized";
import { AuthenticationInterceptor, UrlInterceptor } from "app/services/interseptors/interseptor";

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
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

    RouterModule.forRoot(applicationRoutes, { useHash: true }),
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
