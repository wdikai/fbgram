import * as mqtt from "mqtt";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

export class MqttService<T> {
    public client: mqtt.MqttClient;
    public newMessage = new BehaviorSubject<T>(null);

    constructor(url, chanel) {
        this.client = mqtt.connect(url);

        this.client.on("connect", () => {
            this.client.subscribe(chanel);
            this.client.on("message", (topic: string, payload: T) => {
                if (topic === chanel) {
                    try {
                        const message = JSON.parse(payload.toString());
                        this.newMessage.next(message);
                    } catch (error) {
                        console.error("Broker error:", error);
                    }
                }
            });
        });
    }

    close() {
        this.client.removeAllListeners();
        this.client.end(true);
    }
}