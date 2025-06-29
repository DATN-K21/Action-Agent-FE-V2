// import { AI_ENDPOINT_V1 } from '@/constants/response-constant';
// import { io, Socket } from 'socket.io-client';

// class SocketService {
//   private socket: Socket | null = null;
//   private namespace: string = "extension";

//   constructor(namespace: string = "extension") {
//     this.namespace = namespace;
//     this.connect();
//   }

//   connect() {
//     this.socket = io(`${AI_ENDPOINT_V1}/${this.namespace}`, {
//       withCredentials: true,
//       transports: ['websocket'],
//     });

//     this.socket.connect();

//     this.socket.on('connect', () => {
//       if (!this.socket) {
//         console.error('Socket is NOT connected to server successfully!');
//         return;
//       }

//       console.log('Connected to server successfully on namespace: ', this.namespace);
//       // Get current timezone, for example: Asia/Ho_Chi_Minh
//       const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//       this.socket.emit('set_timezone', timezone);
//     });

//     this.socket.on('disconnect', () => {
//       console.log('Disconnected from server');
//     });

//     this.socket.on('error', (error) => {
//       console.error('Error from server: ', JSON.stringify(error));
//     });
//   }

//   onChatResponse(callback: (data: any) => void) {
//     if (this.socket) {
//       this.socket.on('chat_response', callback);
//     }
//   }

//   onChatInterrupt(callback: (data: any) => void) {
//     if (this.socket) {
//       this.socket.on('chat_interrupt', callback);
//     }
//   }

//   onStreamResponse(callback: (data: any) => void) {
//     console.log("check this.socket.id; ", this.socket?.id);
//     if (this.socket) {
//       this.socket.on('stream_response', callback);
//     }
//   }

//   offStreamResponse(callback: (data: any) => void) {
//     if (this.socket) {
//       this.socket.off('stream_response', callback);
//     }
//   }

//   onStreamInterrupt(callback: (data: any) => void) {
//     console.log("check this.socket.id; ", this.socket?.id);
//     if (this.socket) {
//       this.socket.on('stream_interrupt', callback);
//     }
//   }

//   offStreamInterrupt(callback: (data: any) => void) {
//     if (this.socket) {
//       this.socket.off('stream_interrupt', callback);
//     }
//   }

//   emitStream(data: any) {
//     if (this.socket) {
//       this.socket.emit('stream', data);
//     }
//   }

//   emitStreamInterrupt(data: any) {
//     if (this.socket) {
//       this.socket.emit('handle_stream_interrupt', data);
//     }
//   }

//   disconnect() {
//     if (this.socket) {
//       this.socket.disconnect();
//     }
//   }
// }

// export const ExtensionSocketService = new SocketService();
