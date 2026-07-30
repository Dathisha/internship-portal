import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-ai-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chatbot.html',
  styleUrl: './ai-chatbot.css',
})
export class AIChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessages', { static: false }) private chatMessages?: ElementRef;

  isOpen = false;
  messages: Message[] = [];
  userInput = '';
  isLoading = false;
  private shouldScroll = false;

  private readonly botResponses: { [key: string]: string } = {
    'internship programs': 'We offer internship programs in Web Development and AI. Our programs include real-time projects, industry mentorship, and professional certificates. Duration varies based on your schedule.',
    'long term program': 'Our Long Term Program includes placement training, interview skills, resume building, personality development, aptitude training, and mock interviews with career guidance.',
    'eligibility': 'Any student from 1st to final year in IT, CSE, or related fields is eligible. No prior experience needed - we train from basics to advanced.',
    'duration': 'Our programs are flexible. Short-term internships typically last 3-6 months, while Long-Term programs can be extended based on your availability.',
    'fees': 'Pricing varies by program. We offer affordable rates and financing options. Contact us for detailed pricing information.',
    'technologies': 'We cover Angular, Laravel, REST APIs, MySQL, Python, Machine Learning, and more. All technologies are industry-relevant and in-demand.',
    'certificate': 'Yes! Upon completion, you receive a professional internship certificate from Crescent Technosoft that strengthens your resume.',
    'placement': 'We provide placement-oriented training, resume building, mock interviews, and career guidance to help you secure opportunities.',
    'application process': 'Simply fill out the application form with your details and upload your resume. Our team reviews it and gets back to you with updates.',
    'apply': 'Visit our Apply Now page to submit your application. Fill in your personal details, academic information, and upload your resume.',
    'contact': 'Feel free to reach out to us on our Contact page. We respond to all inquiries within 24 hours.',
    'default': 'I\'m here to help! You can ask me about our internship programs, eligibility, duration, fees, technologies, certificates, placement assistance, or the application process.',
  };

  ngOnInit(): void {
    this.addMessage(
      "Hi! 👋 I'm the Intern 2 Expert AI Assistant. How can I help you today?",
      'bot'
    );
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.shouldScroll = true;
    }
  }

  closeChat(): void {
    this.isOpen = false;
  }

  sendMessage(): void {
    if (!this.userInput.trim()) {
      return;
    }

    const message = this.userInput.trim();
    this.addMessage(message, 'user');
    const userQuestion = message.toLowerCase();
    this.userInput = '';

    // Respond immediately without delay
    const botResponse = this.getBotResponse(userQuestion);
    this.addMessage(botResponse, 'bot');
  }

  private getBotResponse(question: string): string {
    const lowerQuestion = question.toLowerCase();
    
    for (const [key, response] of Object.entries(this.botResponses)) {
      if (key !== 'default' && lowerQuestion.includes(key.toLowerCase())) {
        return response;
      }
    }
    return this.botResponses['default'];
  }

  private addMessage(text: string, sender: 'user' | 'bot'): void {
    this.messages.push({
      text,
      sender,
      timestamp: new Date(),
    });
    this.shouldScroll = true;
  }

  private scrollToBottom(): void {
    try {
      if (this.chatMessages?.nativeElement) {
        const element = this.chatMessages.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
