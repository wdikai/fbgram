import * as mqtt from "mqtt";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

export class MqttService<T> {
    public client: mqtt.MqttClient;
    public newMessage = new BehaviorSubject<T>(null);

    constructor(url, chenel) {
        this.client = mqtt.connect(url);

        this.client.on("connect", () => {
            this.client.subscribe(chenel);
            this.client.on("message", (topic: string, payload: T) => {
                if (topic === chenel) {
                    try {
                        const message = JSON.parse(payload.toString());
                        this.newMessage.next(message);
                    } catch(error) {
                        console.error("Broker error:", error);
                    }
                }
            });
        });
    }


    
}