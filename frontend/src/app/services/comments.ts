import { Inject, Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { HttpClient, HttpParams } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { Pagination } from "../models/pagination";
import { MqttService } from "./mqtt";

@Injectable()
export class CommentsService {
    constructor(private http: HttpClient) { }

    getCommentsByPhoto(photoId,  {limit = 5, lastEvaluatedKey}: Pagination = {}): Observable<any> {
        const params = new HttpParams()
            .append("photoId", photoId)
            .append("limit", limit && limit.toString())
            .append("lastEvaluatedKey", lastEvaluatedKey && lastEvaluatedKey.toString());

        return this.http.get("/comments", {params});
    }

    createComment(photoId, message): Observable<any>  {
        return this.http.post("/comments", { photoId, message });
    }

    getSubscription(photoId): Observable<MqttService<any>> {
        return this.http
            .get("/mqtt-links")
            .map((response: any) => new MqttService(response.url, `/photos/${photoId}/comments`));
    }
}