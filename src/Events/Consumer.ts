import { ConsumeMessage } from 'amqplib'

export class Consumer {
  private static instance: Consumer

  private constructor() {
    this.consume = this.consume.bind(this)
  }

  public consume(msg: ConsumeMessage) {
    const messageId = msg.properties.messageId
    const payload = JSON.parse(msg.content.toString())

    if (!this[messageId]) {
      console.error(`MessageId (${messageId}) not implemented.`)
      return
    }

    this[messageId](payload)
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Consumer()
    }

    return this.instance
  }
}
