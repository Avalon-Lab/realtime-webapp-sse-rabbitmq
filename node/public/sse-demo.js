import { LitElement, html } from "https://cdn.pika.dev/lit-element/^2.2.1";

class SseDemo extends LitElement {
  static get properties() {
    return {
      count: { type: Number, attribute: false },
      notifications: { type: Array, attribute: false }
    };
  }

  constructor() {
    super();
    this.notifications = [];
    this.count = 0;
    this.clientId = null;
  }

  _connect() {
    console.log(this.clientId);

    const sseSource = new EventSource("/event-stream/" + this.clientId);

    sseSource.onopen = e => {
      console.log("The connection has been established.");
    };

    sseSource.addEventListener("notif", e => {
      console.log(e);
      this.count = this.count + 1;
      this.notifications = [...this.notifications, e.data];
    });
  }

  render() {
    return html`
      <div>
        <label for="clientId">Client ID : </label>
        <input
          type="text"
          name="clientId"
          id="clientId"
          @change="${e => (this.clientId = e.target.value)}"
        />
        <button @click="${() => this._connect()}">Valider</button>
      </div>
      <div>
        <p> Nombre de notification(s) : ${this.count}</p>
      </div>
      <div>
        ${this.notifications.map(
          notif => html`
            <p>${notif}</p>
          `
        )}
      </div>
    `;
  }
}

customElements.define("sse-demo", SseDemo);
