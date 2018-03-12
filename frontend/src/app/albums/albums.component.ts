import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AlbumsService } from "../services/albums";

const SIZES = { max: 600, min: 200 };

@Component({
  selector: "app-albums",
  templateUrl: "./albums.component.html",
  styleUrls: ["./albums.component.css"]
})
export class AlbumsComponent implements OnInit {
  params: any;
  albums: any;

  constructor(private route: ActivatedRoute, private albumsService: AlbumsService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.params = params;
      this.loadAlbums();
    });
  }

  loadAlbums() {
    this.albumsService
      .getAlbums(this.params.userId)
      .subscribe((response) => {
        this.albums = response.data;
      });
  }

}
