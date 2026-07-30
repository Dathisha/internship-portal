import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AIChatbotComponent } from './shared/components/ai-chatbot/ai-chatbot';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AIChatbotComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}

