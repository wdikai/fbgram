import { Routes } from "@angular/router";
import { LayoutComponent } from "app/components/layout/layout.component";
import { AlbumsComponent } from "app/components/albums/albums.component";
import { AlbumComponent } from "app/components/album/album.component";
import { LoginComponent } from "app/components/login/login.component";
import { OnlyAuthorized } from "app/guards/authorized";

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
        component: LayoutComponent,
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
