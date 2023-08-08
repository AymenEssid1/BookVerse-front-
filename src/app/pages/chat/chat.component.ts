import { Component, OnInit, OnDestroy, Inject, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from 'src/app/SERVICE/ChatService';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Client, StompConfig, StompHeaders, StompSubscription } from '@stomp/stompjs';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})



export class ChatComponent {



  constructor(public dialogRef: MatDialogRef<ChatComponent>, @Inject(MAT_DIALOG_DATA) public data: { chatId: string }, private chatService: ChatService) { }

  onCloseClick(): void {
    this.dialogRef.close();
  }


  private stompClient: Client;
  messages: any[] = [];
  message: any;

  id: number;


  newMessage: string = ''; // Store new message temporarily

  /*sendMessage3() {
    if (this.newMessage.trim() !== '') {
      this.messages.push({
        sender: this.data.user.username, // Replace with the sender's name or ID
        content: this.newMessage.trim(),
        time: new Date()
      });
      this.stompClient.publish({
        destination: '/app/send',
        body:this.newMessage.trim(),
      });
      this.newMessage = ''; // Clear the input field after sending
    }
  }*/

  sendMessage2(chatId: number) {
    this.getid();
    if (this.newMessage.trim() !== '') {
      const messagePayload = {
        chatId: chatId,
        message: this.newMessage.trim(),
        senderId: this.id
      };

      this.stompClient.publish({
        destination: '/app/send',
        body: JSON.stringify(messagePayload),
      });


      this.newMessage = ''; // Clear the input field after sending
      setTimeout(() => {
        this.scrollChatToBottom();
      }, 10);
    }
  }

  @ViewChild('chatMessages') chatMessagesRef!: ElementRef;

  scrollChatToBottom(): void {
    try {
      // Scroll to the bottom of the chat messages container
      this.chatMessagesRef.nativeElement.scrollTop = this.chatMessagesRef.nativeElement.scrollHeight;
    } catch (err) {
      // Handle any errors that might occur during the scroll
      console.error('Error while scrolling chat messages:', err);
    }
  }

  sendMessage() {
    this.getid();
    // Send the "hello" message to the server
    const message = 'Hello from the frontend! ' + this.id;
    this.stompClient.publish({
      destination: '/app/send',
      body: message,
    });
  }


  ngAfterViewChecked(): void {
    // Scroll to the bottom of the chat messages after the view is checked for changes
    this.scrollChatToBottom();
  }
chat:any;
  ngOnInit() {
    this.getid();
    const config: StompConfig = {
      brokerURL: 'ws://localhost:8080/wss', // Replace with your WebSocket server address
      connectHeaders: {},
      heartbeatIncoming: 1000,
      heartbeatOutgoing: 20000, // Send heartbeats every 20 seconds (if required by the server)
      reconnectDelay: 5000,
      debug: (msg: string) => {
        console.log(msg);
      },
    };
  
    this.stompClient = new Client(config);
    this.stompClient.onConnect = () => {
      if (this.id !== 1) {
        this.getChatByBoth(this.id, 1);
      }
    };
    this.stompClient.activate();
  }
  
  getChatByBoth(id1: number, id2: number) {
    this.chatService.getChatByBoth(id1, id2).subscribe(
      (response) => {
        this.chat = response;
        console.log(response);
        console.log(this.chat.id);
        this.getmessages(this.chat.id);
        
        const roomTopic = `/topic/room/${this.chat.id}`;
        this.stompClient.subscribe(roomTopic, (message) => {
          this.handleIncomingMessage(message.body);
          setTimeout(() => {
            this.scrollChatToBottom();
          }, 10);
        });
      },
      (error) => {
        const user2id = 1; // The user2id parameter value
    this.chatService.addChat(user2id).subscribe(
      (response) => {
        // Handle the response from the server if needed
        console.log('Chat added:', response);
      },
      (error) => {
        // Handle the error if needed
        console.error('Error adding chat:', error);
      }
    );
      }
    );
  }

 
  addChatWithUser2Id() {
    
  }


  handleIncomingMessage(message: any) {
    // Handle the incoming message from the server
    const parsedMessage = JSON.parse(message); //
    console.log('Received message from server:', parsedMessage);
    this.messages.push(parsedMessage);
    console.log(this.messages);

  }

  email: string
  getid() {
    const token: any = localStorage.getItem('jwtToken');
    const jwtHelper = new JwtHelperService();
    const decodedToken = jwtHelper.decodeToken(token);
    const id = decodedToken.id;
    const email = decodedToken.sub;
    this.id = id;
    this.email = email
    return this.id
  }



  ngOnDestroy() {
    this.stompClient.deactivate();
  }
  getmessages(id: number) {

    this.chatService.getChatMessages(id).subscribe(
      (response) => {
        this.messages = response;
        console.log(this.messages);

      },
      (error) => {
        console.error('Error retrieving messages:', error);
      }
    );


  }



}
/********DO NOT TOUCH ****** */
/*

ngOnInit() {
  const config: StompConfig = {
    brokerURL: 'ws://localhost:8080/wss', // Replace with your WebSocket server address
    connectHeaders: {},
    heartbeatIncoming: 1000,
    heartbeatOutgoing: 20000, // Send heartbeats every 20 seconds (if required by the server)
    reconnectDelay: 5000,
    debug: (msg: string) => {
      console.log(msg);
    },
  };

  this.stompClient = new Client(config);
  this.stompClient.onConnect = () => {
    this.stompClient.subscribe('/topic', (message) => {
      this.handleIncomingMessage(message.body);
    });
  };
  this.stompClient.activate();
}

 

sendMessage() {
  this.getid();
  // Send the "hello" message to the server
  const message = 'Hello from the frontend! ' + this.id;
  this.stompClient.publish({
    destination: '/app/send',
    body: message,
  });
}
 
handleIncomingMessage(message: string) {
  // Handle the incoming message from the server
  console.log('Received message from server:', message);
  
}

getid(){
  const token: any = localStorage.getItem('jwtToken');
  const jwtHelper = new JwtHelperService();
  const decodedToken = jwtHelper.decodeToken(token);
  const id = decodedToken.id;
  this.id=id;
}
 
*/



