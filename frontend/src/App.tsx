import React, { Component } from 'react';
import './App.css';
import * as StompJs from '@stomp/stompjs';

const clientVariables = (window as any).variables ||
                        { brokerURL: "wss://localhost:3000/chat/websocket" };

interface ChatMessage {
  name: string;
  timestamp: string;
  contents: string;
}

interface AppState {
  name: string;
  message: string;
  messages: ChatMessage[];
}

class App extends Component<any, AppState> {

  state = {
    name: "",
    message: "",
    messages: [] as ChatMessage[]
  };

  client: StompJs.Client = new StompJs.Client({
    brokerURL: clientVariables.brokerURL,
    connectHeaders: {
      login: "user",
      passcode: "password"
    },
    debug: function (str) {
      console.log(str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000
  });
  private chatTable: HTMLDivElement | null = null;


  componentDidMount() {
    console.log("*** connecting ***");

    this.client.onConnect = frame => {
      console.log('Connected: ' + frame);
      this.client.subscribe('/app/chatMessages', greeting => {
        const messages: Array<ChatMessage> = JSON.parse(greeting.body);
        console.log(messages);
        this.setState({ messages: this.state.messages.concat(messages) }, () => {
          if (this.chatTable) {
            this.chatTable.scrollTop = this.chatTable.scrollHeight;
          }
        });
      });
    };

    this.client.activate();
  }

  private onMessageKeyPress = (e: any) => {
    if (e.key == 'Enter' && this.state.message) {
      e.preventDefault();
      this.client.publish({
        destination: '/app/chatMessage',
        body: JSON.stringify({name: this.state.name, contents: e.target.value})
      });
      this.setState({ message: "" });
    }
  };

  private onNameChange = (e: any) => this.setState({ name: e.target.value });
  private onMessageChange = (e: any) => this.setState({ message: e.target.value });

  private formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);

    const hour = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

    let hourStr = (hour < 10 ? "0" : "") + hour;
    let minStr = (min < 10 ? "0" : "") + min;
    let secStr = (sec < 10 ? "0" : "") + sec;

    return hourStr + ":" + minStr + ":" + secStr;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>CHAT</h1>

          <div className="Chat-table-container" ref={ref => this.chatTable = ref}>
            <table className="Chat-table">
              <thead>
              <tr>
                <th style={{width: 100}} />
                <th style={{width: 100}} />
                <th/>
              </tr>
              </thead>
              <tbody>
              {
                this.state.messages.map((msg, i) =>
                  <tr key={i}>
                    <td style={{textAlign: 'center'}}>
                      {this.formatTimestamp(msg.timestamp)}
                    </td>
                    <td style={{textAlign: 'center'}}>
                      {msg.name}
                    </td>
                    <td>
                      {msg.contents}
                    </td>
                  </tr>
                )
              }
              {
                this.state.messages.length === 0 &&
                <tr>
                  <td colSpan={3} style={{textAlign: 'center'}}><em>-- Ei viestejä --</em></td>
                </tr>
              }
              </tbody>
            </table>
          </div>

          <form className="Chat-controls" onSubmit={() => {}}>
            <label>Nimesi:</label>{' '}
            <input onChange={this.onNameChange}
                   value={this.state.name} />
            {' '}
            <label>Viestisi:</label>{' '}
            <input onKeyPress={this.onMessageKeyPress}
                   onChange={this.onMessageChange}
                   value={this.state.message}
                   disabled={!this.state.name} />
          </form>
        </header>
      </div>
    );
  }
}

export default App;
