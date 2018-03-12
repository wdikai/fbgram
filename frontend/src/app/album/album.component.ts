import { Component, OnInit } from "@angular/core";
import { BsModalService } from "ngx-bootstrap";
import { PhotoModalComponent } from "../photo-modal/photo-modal.component";
import { AlbumsService } from "../services/albums";
import { ActivatedRoute } from "@angular/router";

const SIZES = { max: 600, min: 200 };

@Component({
  selector: "app-album",
  templateUrl: "./album.component.html",
  styleUrls: ["./album.component.css"]
})
export class AlbumComponent implements OnInit {
  params: any;
  pictures: any;
  pmRef: any;

  constructor(private ms: BsModalService,
    private albumsService: AlbumsService,
    private route: ActivatedRoute, ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.params = params;
      this.loadAlbum();
    });
  }

  loadAlbum() {
    this.albumsService
      .getAlbumPhotos(this.params.albumId)
      .subscribe((response) => {
        this.pictures = response.data;
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

}
