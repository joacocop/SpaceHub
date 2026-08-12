import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface ChatMessage {
  id: number;
  sender: 'system' | 'user' | 'mission';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  private destroy$ = new Subject<void>();
  private messageSubject = new Subject<ChatMessage>();

  messages: ChatMessage[] = [];
  userInput = '';
  messageIdCounter = 0;

  private systemMessages = [
    'Sistema de navegación: Trayectoria óptima confirmada',
    'Telemetría: Todos los sistemas operativos al 100%',
    'Comunicaciones: Señal estable con Houston',
    'Energía: Paneles solares generando 2400W',
    'Temp. exterior: -157°C detectados',
    'Próximo eclipse solar en 45 minutos',
    'Sistema de soporte vital: CO2 en niveles normales',
    'Escudo térmico: Integridad confirmada',
    'Inyección de órbita: Exitosa',
    'Calibration: Sensores magnetométricos ajustados'
  ];

  constructor() { }

  ngOnInit(): void {
    this.addSystemMessage('Conexión establecida con SpaceHub Mission Control');
    this.startRandomMessages();

    this.messageSubject.pipe(takeUntil(this.destroy$)).subscribe(msg => {
      this.messages.push(msg);
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private startRandomMessages(): void {
    interval(8000).pipe(takeUntil(this.destroy$)).subscribe(() => {
      const randomMsg = this.systemMessages[Math.floor(Math.random() * this.systemMessages.length)];
      this.addSystemMessage(randomMsg);
    });
  }

  private addSystemMessage(content: string): void {
    const msg: ChatMessage = {
      id: ++this.messageIdCounter,
      sender: 'system',
      content,
      timestamp: new Date()
    };
    this.messageSubject.next(msg);
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    const userMsg: ChatMessage = {
      id: ++this.messageIdCounter,
      sender: 'user',
      content: this.userInput,
      timestamp: new Date()
    };
    this.messages.push(userMsg);

    this.processCommand(this.userInput.toLowerCase().trim());
    this.userInput = '';
  }

  private processCommand(command: string): void {
    setTimeout(() => {
      let response = '';

      switch (command) {
        case 'status':
          response = 'Estado de la misión: NOMINAL | Órbita: Estable | Tripulación: Saludable';
          break;
        case 'help':
          response = 'Comandos disponibles: status, help, time, fuel, crew, systems, abort';
          break;
        case 'time':
          response = `Tiempo mision: ${Math.floor(Math.random() * 30) + 1} días | UTC: ${new Date().toUTCString()}`;
          break;
        case 'fuel':
          response = `Combustible restante: ${(75 + Math.random() * 20).toFixed(1)}% | ETA: ${Math.floor(Math.random() * 50) + 10} días`;
          break;
        case 'crew':
          response = 'Tripulación: 4 astronautas | Estado: Todos operativos';
          break;
        case 'systems':
          response = 'Sistemas: Navegación ✓ | Comunicaciones ✓ | Energía ✓ | Soporte vital ✓';
          break;
        case 'abort':
          response = '⚠️ Secuencia de aborto no iniciada. Confirmar con "abort confirm"';
          break;
        case 'abort confirm':
          response = '🚨 ABORTO CONFIRMADO - Iniciando protocolo de retorno';
          break;
        default:
          response = `Comando recibido: "${command}" - Procesando...`;
      }

      const missionMsg: ChatMessage = {
        id: ++this.messageIdCounter,
        sender: 'mission',
        content: response,
        timestamp: new Date()
      };
      this.messages.push(missionMsg);
    }, 1000);
  }

  private scrollToBottom(): void {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}