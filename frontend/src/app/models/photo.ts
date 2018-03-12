export class Photo {
    id: string;
    url: string;

    static fromFbResponse(data: any) {
        return new Photo(data.id, data.source);
    }

    constructor(id, url) {
        this.id = id;
        this.url = url;
    }
}