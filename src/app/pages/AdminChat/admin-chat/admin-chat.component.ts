import { Component, ElementRef, ViewChild } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ChatService } from 'src/app/SERVICE/ChatService';

import { Client, StompConfig, StompHeaders, StompSubscription } from '@stomp/stompjs';

@Component({
  selector: 'app-admin-chat',
  templateUrl: './admin-chat.component.html',
  styleUrls: ['./admin-chat.component.scss']
})
export class AdminChatComponent {

  constructor(private chatService: ChatService) { }


  id: number;
  email: string;
  private stompClient: Client;
  messages: any[] = [];
  message: any;




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
  ngOnInit() {

    this.getid()
    if (this.id === 1) {
      // this.getChatByBoth(this.getid(),1);
      this.getAdmiChats(this.id)
    }

    //this.getmessages();

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
      this.stompClient.subscribe('/topic/room/*', (message) => {
        this.handleIncomingMessage(message.body);
        setTimeout(() => {
          this.scrollChatToBottom();
        }, 10);
      });
    };
    this.stompClient.activate();


    console.log('Chats array:', this.chats);


  }




  chat: any;
  getChatByBoth(id1: number, id2: number) {

    this.chatService.getChatByBoth(id1, id2).subscribe(
      (response) => {
        this.chat = response;
        console.log(response);
        console.log(this.chat.id);
        this.getmessages(this.chat.id)

      },
      (error) => {
        console.error('Error retrieving chat:', error);
      }
    );
  }

  chats: any


  getAdmiChats(userId: number) {
    this.chatService.getAdminChat(userId).subscribe((chats: any) => {
      this.chats = chats;

      console.log(this.chats);
      if (this.chats && this.chats.length > 0) {
        const firstChatId = this.chats[0].id;
        this.getmessages(firstChatId);
        this.chatidTosendTo = firstChatId
      } else {
        console.log('No chats or empty chats array.');
      }

    });
  }



  unreadMessages: { [chatId: number]: boolean } = {};
  markAsRead(chatId: number) {
    this.unreadMessages[chatId] = false; // Mark chat as read
  }

  handleIncomingMessage(message: any) {
    // Handle the incoming message from the server
    const parsedMessage = JSON.parse(message); //
    console.log('Received message from server:', parsedMessage);
    console.log('Parsed chatid:', parsedMessage.chatid);
    console.log('Chatid to send to:', this.chatidTosendTo);
    if(parsedMessage.email!==this.email)
    {this.unreadMessages[parsedMessage.chatid] = true; }// Mark chat as unread
    try {
      if (parsedMessage.chatid === +this.chatidTosendTo) {
        this.messages.push(parsedMessage);
        
        console.log(this.messages);
        setTimeout(() => {
          this.scrollChatToBottom();
        }, 10);
      }
    } catch (error) {
      console.error('Error in if statement:', error);
    }
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


  newMessage: string = '';
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


  
  Read(chatId: number) {
    this.getid();
   
      const messagePayload = {
        chatId: chatId,
        message: 0,
        senderId: 0
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




  chatidTosendTo: number
  changechatid(id: number) {
    console.log("changedddddddddddddddddddddddddddddd");

    this.chatidTosendTo = id;
  }

}
