import { Component, OnInit, HostListener } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AlbumsService } from "app/services/albums";

const LOAD_ALBUMS_EDGE = 200;

@Component({
  selector: "app-albums",
  templateUrl: "./albums.component.html",
  styleUrls: ["./albums.component.css"],
})
export class AlbumsComponent implements OnInit {
  params: any;
  albums: any;
  cursor: any;
  inLoading: any;

  constructor(private route: ActivatedRoute, private albumsService: AlbumsService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.params = params;
      this.albums = [];
      this.loadAlbums();
    });
  }

  loadAlbums() {
    this.inLoading = true;
    this.albumsService
      .getAlbums(this.params.userId, {after: this.cursor && this.cursor.after})
      .subscribe((response) => {
        this.albums = this.albums.concat(response.data);
        this.cursor = response.cursor;
        this.inLoading = false;
      });
  }

  @HostListener("window:scroll", ["$event"])
  onScroll($event: any): void {
    const height = $event.srcElement.scrollingElement.clientHeight;
    const scrollBottom = $event.srcElement.scrollingElement.scrollHeight - $event.srcElement.scrollingElement.scrollTop - height;
    if (!this.inLoading && this.cursor && scrollBottom < LOAD_ALBUMS_EDGE) {
      this.loadAlbums();
    }
  }
}
