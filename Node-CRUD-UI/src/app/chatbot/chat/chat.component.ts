import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserDetail } from 'src/app/profile/profile/profile.component';
import { AuthService } from 'src/services/auth-service.service';
import { ChatService } from 'src/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  messages: { user: string; bot: string }[] = [];
  userInput: string = '';
  userDetail: UserDetail = {
    id: 0,
    name: '',
    email: '',
    profile_image: '',
    isAdmin: 0,
  };
  isLoading: boolean = false; // Indicates whether the bot is generating a response
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  constructor(public authService: AuthService, private chatService: ChatService) {}

  ngOnInit(): void {
    this.getUserDetail();
  }

  getUserDetail(): void {
    this.authService.getUserDetail().subscribe({
      next: (res) => {
        this.userDetail = res;
        this.loadChatHistory();
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      },
    });
  }

  sendMessage(): void {
    const trimmedInput = this.userInput.trim();
    if (!trimmedInput) return;

    this.isLoading = true; 
    const userMessage = { user: trimmedInput, bot: '' }; 
    this.messages = [...this.messages, userMessage]; 
    this.userInput = ''; 

    
    this.chatService.sendMessage(this.userDetail.id.toString(), trimmedInput).subscribe({
      next: (response) => {
        this.messages[this.messages.length - 1].bot = response.message;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error communicating with the chatbot:', error);
        this.messages[this.messages.length - 1].bot = 'Error: Unable to connect.';
        this.isLoading = false;
      },
    });
  }

  loadChatHistory(): void {
    this.chatService.getChatHistory(this.userDetail.id).subscribe({
      next: (response) => {
        this.messages = (response.history || []).map((msg: { role: string; message: string }) => ({
          user: msg.role === 'user' ? msg.message : '',
          bot: msg.role === 'ai' ? msg.message : '',
        }));
      },
      error: (error) => {
        console.error('Error fetching chat history:', error);
        this.messages = [];
      },
    });
  }

  scrollToBottom(): void {
    const container = this.messagesContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }
}

