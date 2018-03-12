import {
  Component,
  OnInit,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import {
  BsModalRef
} from "ngx-bootstrap";

import {
  Observable,
  Subscription
} from "rxjs";
import {
  AuthService
} from "../services/auth";
import {
  CommentsService
} from "../services/comments";

const UPLOAD_NEW_MESSAGES_EDGE = 200; // px

@Component({
  selector: "app-photo-modal",
  templateUrl: "./photo-modal.component.html",
  styleUrls: ["./photo-modal.component.css"]
})
export class PhotoModalComponent implements OnDestroy {

  pagination: any;
  inLoading: boolean;
  photo: any;
  messages: any[] = [];
  newMessageSubscription: Subscription;

  isPlay = false;
  interval: Subscription;

  next = new EventEmitter();
  previous = new EventEmitter();

  constructor(public modalRef: BsModalRef,
    private auth: AuthService,
    private commentsService: CommentsService) {}

  setPhoto(photo) {
    console.log(photo.id, this.auth.loginStatus);

    if (this.newMessageSubscription) {
      this.newMessageSubscription.unsubscribe();
    }

    this.photo = photo;
    this.messages = [];
    this.getComments();
    this.newMessageSubscription = this.commentsService
      .getSubscription(photo.id)
      .map((newMessage: any) => {
          const isNew = newMessage && !this.messages.find(m => m.id === newMessage.id);
          if (isNew) {
              this.messages.push(newMessage);
          }
      })
      .subscribe();
  }

  play() {
    if (!this.isPlay) {
      this.isPlay = true;
      this.interval = Observable
        .interval(5000)
        .subscribe(() => this.next.emit());
    } else {
      this.isPlay = false;
      this.interval.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.isPlay = false;
    if (this.interval) {
      this.interval.unsubscribe();
    }

    if (this.newMessageSubscription) {
      this.newMessageSubscription.unsubscribe();
    }
  }

  public onScroll($event: Event): void {
    if (!this.inLoading && $event.srcElement.scrollTop < UPLOAD_NEW_MESSAGES_EDGE) {
      this.getComments();
    }
  }


  getComments() {
    if (this.pagination && !this.pagination.lastEvaluatedKey) {
      return;
    }

    this.inLoading = true;
    this.commentsService
      .getCommentsByPhoto(this.photo.id, {
        lastEvaluatedKey: this.pagination && this.pagination.lastEvaluatedKey
      })
      .subscribe((messages) => {
        this.inLoading = false;
        this.messages = messages.data.concat(this.messages);
        this.pagination = messages.pagination;
      });
  }

  sendComment(messageField): void {
    if (!messageField || !messageField.value) {
      return;
    }

    this.commentsService
      .createComment(this.photo.id, messageField.value)
      .subscribe((response) => messageField.value = "");
  }

}