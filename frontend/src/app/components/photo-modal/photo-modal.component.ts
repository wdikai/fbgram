import {
  Component,
  OnInit,
  EventEmitter,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";
import { BsModalRef } from "ngx-bootstrap";

import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/interval";
import { Subscription } from "rxjs/Subscription";
import { AuthService } from "app/services/auth";
import { CommentsService } from "app/services/comments";

const UPLOAD_NEW_MESSAGES_EDGE = 100; // px

@Component({
  selector: "app-photo-modal",
  templateUrl: "./photo-modal.component.html",
  styleUrls: ["./photo-modal.component.css"]
})
export class PhotoModalComponent implements OnDestroy {
  @ViewChild("messageContainer") messagesContainer: ElementRef;

  mqtt: any;
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
    private commentsService: CommentsService) { }

  setPhoto(photo) {
    console.log(photo.id, this.auth.loginStatus);

    if (this.newMessageSubscription) {
      this.newMessageSubscription.unsubscribe();
    }

    this.photo = photo;
    this.messages = [];
    this.getComments();
    this.commentsService
      .getSubscription(photo.id)
      .subscribe(mqtt => this.changeMqttSubscription(mqtt));
  }

  unsubscribeMqtt(): any {
    if (this.newMessageSubscription) {
      this.newMessageSubscription.unsubscribe();
    }

    if (this.mqtt) {
      this.mqtt.close();
    }
  }

  changeMqttSubscription(mqtt) {
    this.unsubscribeMqtt();

    this.mqtt = mqtt;
    this.newMessageSubscription = mqtt.newMessage.subscribe((newMessage: any) => {
      console.log(newMessage);
      const isNew = newMessage && !this.messages.find(m => m.id === newMessage.id);
      if (isNew) {
        this.messages.unshift(newMessage);
      }
    });
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

    this.unsubscribeMqtt();
  }

  public onScroll($event: Event): void {
    if (!this.inLoading && $event.srcElement.scrollTop < UPLOAD_NEW_MESSAGES_EDGE) {
      this.getComments(false);
    }
  }


  getComments(scrollToBottom = true) {
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
        this.messages = this.messages.concat(messages.data);
        this.pagination = messages.pagination;
        if (scrollToBottom) {
          this.scrollToBottom();
        }
      });
  }

  sendComment(messageField): void {
    if (!messageField || !messageField.value) {
      return;
    }

    this.commentsService
      .createComment(this.photo.id, messageField.value)
      .subscribe((response) => {
        messageField.value = "";
        this.scrollToBottom();
      });
  }

  scrollToBottom() {
    setTimeout(() => {
      console.log({
        scrollTop: this.messagesContainer.nativeElement.scrollTop,
        scrollHeight: this.messagesContainer.nativeElement.scrollHeight
      });
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }, 100);
  }
}