export class Album {
    id: string;
    name: string;
    photoCount: number;
    coverUrl: string;

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.photoCount = data.photo_count;
        this.coverUrl = data.picture.data.url;
    }
}