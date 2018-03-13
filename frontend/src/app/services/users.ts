import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Pagination } from "../models/pagination";

@Injectable()
export class UsersService {
    constructor(private http: HttpClient) { }

    getList(filter = "dsfdsdf", {limit = 10, lastEvaluatedKey}: Pagination = {}): Observable<any> {
        const params = new HttpParams()
            .append("filter", filter)
            .append("limit", limit && limit.toString())
            .append("lastEvaluatedKey", lastEvaluatedKey && lastEvaluatedKey.toString());

        return this.http.get(`/users`, { params });
    }
}