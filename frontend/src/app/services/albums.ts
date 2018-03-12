import { FacebookService } from "ngx-facebook";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { Inject, Injectable } from "@angular/core";

import {Album} from "../models/album";
import {Photo} from "../models/photo";
import { debug } from "util";

export class Cursor {
    before: string;
    after: string;

    constructor(cursor: any = {}) {
        this.after = cursor.after;
        this.before = cursor.before;
    }
}

@Injectable()
export class AlbumsService {

    constructor(private fb: FacebookService) {}

    getAlbums(userId, {after = null, before = null, limit = 20} = {}) {
        const fields = ["picture{width,height,url}", "photo_count", "name", "id", "source"];
        return Observable
            .fromPromise(this.fb.api(`/${userId}/albums`, "get", { fields, after, before, limit}))
            .map((response: any) => {
                let cursor;
                const data = response.data.map(item => new Album(item));
                if (response.paging && response.paging.cursors && (response.paging.next || response.paging.previous)) {
                    cursor = new Cursor(response.paging.cursors);
                }

                return {data, cursor};
            });
    }

    getAlbumPhotos(albumId, {after = null, before = null, limit = 20 } = {}): Observable<any> {
        const fields = ["source", "id"];
        const url = `/${albumId}/photos`;

        return Observable
            .fromPromise(this.fb.api(url, "get", { fields, after, before, limit }))
            .map((response) => {
                let cursor;
                const data = response.data.map(item => Photo.fromFbResponse(item));
                if (response.paging && response.paging.cursors && (response.paging.next || response.paging.previous)) {
                    cursor = new Cursor(response.paging.cursors);
                }

                console.log(JSON.stringify({data, cursor}));

                return {data, cursor};
            });
    }
}