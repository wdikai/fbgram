import { Component, OnInit, HostListener } from "@angular/core";
import { BsModalService } from "ngx-bootstrap";
import { PhotoModalComponent } from "../photo-modal/photo-modal.component";
import { AlbumsService } from "app/services/albums";
import { ActivatedRoute } from "@angular/router";

const LOAD_PHOTOS_EDGE = 200;

@Component({
  selector: "app-album",
  templateUrl: "./album.component.html",
  styleUrls: ["./album.component.css"]
})
export class AlbumComponent implements OnInit {
  inLoading: any;
  cursor: any;
  params: any;
  pictures: any;
  pmRef: any;

  constructor(private ms: BsModalService,
    private albumsService: AlbumsService,
    private route: ActivatedRoute, ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.params = params;
      this.pictures = [];
      this.loadAlbum();
    });
  }

  loadAlbum() {
    this.albumsService
      .getAlbumPhotos(this.params.albumId, {after: this.cursor && this.cursor.after})
      .subscribe((response) => {
        this.pictures = this.pictures.concat(response.data);
        this.cursor = response.cursor;
      });
  }

  openPhotoDialog(image, index = 0) {
    let photoComponent: PhotoModalComponent;
    this.pmRef = this.ms.show(PhotoModalComponent, { class: "modal-lg" });
    photoComponent = <PhotoModalComponent>(this.pmRef.content);

    photoComponent.setPhoto(image);

    photoComponent.next.subscribe(() => {
      index = (index + 1) % this.pictures.length;
      photoComponent.setPhoto(this.pictures[index]);
    });

    photoComponent.previous.subscribe(() => {
      index = (this.pictures.length + index - 1) % this.pictures.length;
      photoComponent.setPhoto(this.pictures[index]);
    });
  }

  @HostListener("window:scroll", ["$event"])
  onScroll($event: any): void {
    const height = $event.srcElement.scrollingElement.clientHeight;
    const scrollBottom = $event.srcElement.scrollingElement.scrollHeight - $event.srcElement.scrollingElement.scrollTop - height;
    if (!this.inLoading && this.cursor && scrollBottom < LOAD_PHOTOS_EDGE) {
      this.loadAlbum();
    }
  }

}
