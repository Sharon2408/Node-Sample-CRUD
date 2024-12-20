import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/api/chat';

  constructor(private http: HttpClient) {}

  getChatHistory(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }
  sendMessage(userId: string, message: string): Observable<any> {
    const body = { message, userId };
    return this.http.post<any>(this.apiUrl, body);
  }

  // streamResponse(userId: string, message: string): Observable<string> {
  //   const body = { userId, message };

  //   return new Observable((observer) => {
  //     this.http
  //       .post(this.apiUrl, body, {
  //         headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  //         responseType: 'text', // Ensure the response is treated as text
  //         observe: 'events', // To track progress events
  //         reportProgress: true, // To monitor progress (for large responses)
  //       })
  //       .subscribe({
  //         next: (event: any) => {
  //           if (event.type === 4 && event.body) {
  //             // Handle the streamed response
  //             observer.next(event.body);
  //           }
  //         },
  //         error: (err) => {
  //           console.error('Error with HttpClient request:', err);
  //           observer.error(err);
  //         },
  //         complete: () => observer.complete(),
  //       });
  //   });
  // }
}

