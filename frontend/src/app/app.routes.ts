import { Routes } from "@angular/router";
import { TopBarComponent } from "./top-bar/top-bar.component";
import { AlbumsComponent } from "./albums/albums.component";
import { AlbumComponent } from "./album/album.component";
import { LoginComponent } from "./login/login.component";
import { OnlyAuthorized } from "./guards/authorized";

export const applicationRoutes: Routes = [
    {
        path: "",
        children: [
            {
                path: "",
                redirectTo: "login",
                pathMatch: "full"
            },
            {
                path: "login",
                component: LoginComponent,
            }
        ]
    },
    {
        path: "app",
        component: TopBarComponent,
        canActivate: [OnlyAuthorized],
        children: [
            {
                path: "",
                redirectTo: "users/me/albums",
                pathMatch: "full"
            },
            {
                path: "users/:userId/albums",
                component: AlbumsComponent,
            },
            {
                path: "users/:userId/albums/:albumId",
                component: AlbumComponent,
            },
        ]
    }
];
