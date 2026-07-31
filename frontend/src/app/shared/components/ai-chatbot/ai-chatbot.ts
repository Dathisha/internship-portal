import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface Intent {
  key: string;
  keywords: string[];
  patterns?: RegExp[];
  response: string;
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

  private readonly offTopicResponse =
    "I'm the Intern 2 Expert website assistant. I can help you with questions related to our internship programs and website.";

  private readonly intents: Intent[] = [
    {
      key: 'about',
      keywords: [
        'what is intern 2 expert',
        'intern 2 expert',
        'crescent technosoft',
        'about company',
        'who are you',
        'what is this website',
        'about intern2expert',
        'about crescent',
      ],
      patterns: [
        /what\s+(is|about)\s+intern\s*2\s*expert/i,
        /what\s+(is|about)\s+crescent\s+technosoft/i,
        /who\s+are\s+you/i,
        /tell\s+me\s+about\s+intern/i,
      ],
      response:
        'Intern 2 Expert is an industry-focused professional internship and career development platform powered by Crescent Technosoft. We empower ambitious students with hands-on real-time project experience, expert mentorship, and verified completion certificates.',
    },
    {
      key: 'apply',
      keywords: [
        'how to apply',
        'apply for internship',
        'apply now',
        'how do i apply',
        'registration process',
        'how to register',
        'application form',
        'submit application',
        'signup',
        'register',
      ],
      patterns: [
        /how\s+(can|do)\s+i\s+apply/i,
        /how\s+to\s+apply/i,
        /registration\s+process/i,
        /how\s+to\s+register/i,
        /where\s+to\s+apply/i,
        /process\s+to\s+apply/i,
      ],
      response:
        "To apply for an internship: 1. Go to our 'Apply Now' page (/apply). 2. Fill in your Personal Information (Name, Email, Mobile). 3. Fill in Academic Details (College Name, Department, Year). 4. Select your Internship Domain (Web Development or AI) and Mode (Hybrid/Online/Offline). 5. Enter your Internship Duration in months. 6. Upload your Resume (PDF/DOC/DOCX up to 5MB) and submit! Our HR team will review your application and send your Application ID upon approval.",
    },
    {
      key: 'programs',
      keywords: [
        'available programs',
        'internship programs',
        'what programs',
        'web development',
        'artificial intelligence',
        'ai program',
        'courses',
        'domains',
        'which domain',
      ],
      patterns: [
        /what\s+internship\s+programs/i,
        /available\s+(programs|courses|internships)/i,
        /what\s+programs/i,
        /tell\s+me\s+about\s+web\s+dev/i,
        /tell\s+me\s+about\s+ai/i,
      ],
      response:
        'We offer two flagship internship programs: 1. Web Development (Full-Stack Angular, Laravel, PHP, REST APIs, MySQL, Git). 2. Artificial Intelligence (Python, Machine Learning, Data Science, Neural Networks, Computer Vision, NLP). Both programs include real-world project work, flexible modes (Hybrid/Online/Offline), and 1-on-1 industry mentorship.',
    },
    {
      key: 'long_term',
      keywords: [
        'long-term program',
        'long term program',
        'placement training',
        'interview skills',
        'aptitude',
        'career guidance',
        'resume building',
      ],
      patterns: [
        /long\s*term\s*program/i,
        /placement\s*training/i,
        /career\s*guidance/i,
      ],
      response:
        'Our Long-Term Program is an end-to-end career accelerator. It combines technical internship projects with comprehensive Placement Training, Aptitude & Reasoning practice, Resume Building, Mock Interviews, and dedicated Career Guidance to help you secure top tech roles.',
    },
    {
      key: 'download_certificate',
      keywords: [
        'download my certificate',
        'how to download certificate',
        'download certificate',
        'get my certificate',
        'get certificate',
        'print certificate',
        'receive certificate',
      ],
      patterns: [
        /how\s+(can|do)\s+i\s+download\s+(my\s+)?certificate/i,
        /how\s+to\s+download\s+certificate/i,
        /download\s+pdf\s+certificate/i,
        /get\s+(my\s+)?certificate/i,
      ],
      response:
        "To download your certificate: 1. Visit the 'AI Certificate Generator' page (/certificate-generator). 2. Enter your unique Application ID (e.g. INTERN-2026-ABCD) provided by Crescent Technosoft via email. 3. Click 'Generate Certificate'. 4. Preview your certificate and click 'Download PDF' or 'Print'.",
    },
    {
      key: 'verify_certificate',
      keywords: [
        'verify my certificate',
        'verify certificate',
        'how to verify',
        'certificate verification',
        'check certificate',
        'qr code verification',
      ],
      patterns: [
        /how\s+(can|do)\s+i\s+verify\s+(my\s+)?certificate/i,
        /how\s+to\s+verify/i,
        /certificate\s+verification/i,
        /is\s+certificate\s+valid/i,
      ],
      response:
        "You, your college, or employers can verify an internship certificate in two ways: 1. Visit our 'Verify Certificate' page (/verify-certificate) or navigate directly to /verify-certificate/{certificate_id}. 2. Scan the official QR code printed at the bottom of the certificate.",
    },
    {
      key: 'certificate_generator',
      keywords: [
        'ai certificate generator',
        'what is ai certificate generator',
        'certificate generator',
        'generate certificate',
      ],
      patterns: [
        /what\s+is\s+(the\s+)?ai\s+certificate\s+generator/i,
        /tell\s+me\s+about\s+certificate\s+generator/i,
      ],
      response:
        "The AI Certificate Generator (/certificate-generator) is our automated portal where students retrieve their verified Internship Certificate after completing their program. Simply enter your Application ID to view, print, or download your official PDF certificate instantly.",
    },
    {
      key: 'duration',
      keywords: [
        'how long is the internship',
        'internship duration',
        'how many months',
        'duration',
        'period of internship',
        'months',
      ],
      patterns: [
        /how\s+long\s+is\s+(the\s+)?internship/i,
        /internship\s+duration/i,
        /how\s+many\s+months/i,
        /duration\s+of\s+internship/i,
      ],
      response:
        'Our internship duration is flexible! Applicants manually specify their preferred duration in months (e.g., 1, 2, 3, 6, or 12 months) when submitting their application on the Apply Now page. The exact duration is stored in our database and automatically calculated on your final certificate.',
    },
    {
      key: 'eligibility',
      keywords: [
        'eligibility',
        'who can apply',
        'who is eligible',
        'qualification',
        'can 1st year apply',
        'prerequisites',
        'requirements to join',
      ],
      patterns: [
        /who\s+(can|is)\s+eligible/i,
        /who\s+can\s+apply/i,
        /eligibility\s+criteria/i,
        /can\s+(first|1st|2nd|3rd|final)\s+year/i,
      ],
      response:
        'Students from 1st year to final year in Computer Science (CSE), Information Technology (IT), Software Engineering, AI/DS, or related fields are eligible. No prior professional experience is required — we train you from fundamental concepts to advanced project execution.',
    },
    {
      key: 'application_status',
      keywords: [
        'application status',
        'check status',
        'application id',
        'status update',
        'where is my application id',
        'when will i get application id',
      ],
      patterns: [
        /application\s+status/i,
        /how\s+to\s+check\s+status/i,
        /where\s+(is|do\s+i\s+get)\s+(my\s+)?application\s+id/i,
        /status\s+of\s+my\s+application/i,
      ],
      response:
        'After submitting your application on the Apply Now page, our Admissions & HR team reviews it. Once approved, your official Application ID is sent to your registered email address by Crescent Technosoft. You use this Application ID to access your certificate upon completion.',
    },
    {
      key: 'contact',
      keywords: [
        'contact',
        'how to contact',
        'phone number',
        'email address',
        'reach out',
        'support',
        'contact crescent technosoft',
        'address',
        'helpline',
      ],
      patterns: [
        /how\s+(do|can)\s+i\s+contact/i,
        /contact\s+information/i,
        /phone\s+number/i,
        /email\s+address/i,
        /contact\s+crescent/i,
      ],
      response:
        'You can contact Crescent Technosoft via: Phone: +91 9944992460 | Email: intern2expert.portal@gmail.com | Website: Visit our Contact Us page (/contact) to send a message directly. Our support team responds within 24 hours.',
    },
    {
      key: 'website_features',
      keywords: [
        'website features',
        'features',
        'what can i do on this website',
        'pages on website',
      ],
      patterns: [
        /website\s+features/i,
        /what\s+can\s+i\s+do\s+on\s+this\s+website/i,
      ],
      response:
        'Our website features include: 1. Internship & Long-Term Programs Information (/programs). 2. Online Internship Application Portal (/apply). 3. AI Certificate Generator (/certificate-generator). 4. Public Certificate Verification System (/verify-certificate). 5. Student Support & Contact Desk (/contact).',
    },
    {
      key: 'terms_privacy',
      keywords: [
        'terms and conditions',
        'terms & conditions',
        'privacy policy',
        'data security',
        'policy',
      ],
      patterns: [
        /terms\s+(and|&)\s+conditions/i,
        /privacy\s+policy/i,
        /data\s+security/i,
      ],
      response:
        'Privacy Policy: We safeguard all student personal information, resumes, and academic details strictly for internship processing and certificate issuance. Terms & Conditions: Students must complete all assigned project milestones and maintain academic integrity to receive an official completion certificate.',
    },
    {
      key: 'faqs',
      keywords: ['faq', 'faqs', 'frequently asked questions', 'help'],
      patterns: [/faq/i, /frequently\s+asked\s+questions/i],
      response:
        'Frequently Asked Questions: 1. How do I apply? Visit /apply. 2. What are the domains? Web Development & Artificial Intelligence. 3. How do I get my certificate? Enter your Application ID on /certificate-generator. 4. How to contact us? Call +91 9944992460 or email intern2expert.portal@gmail.com.',
    },
  ];

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
    if (!this.userInput.trim() || this.isLoading) {
      return;
    }

    const message = this.userInput.trim();
    this.addMessage(message, 'user');
    const userQuestion = message.toLowerCase();
    this.userInput = '';

    this.isLoading = true;

    // Fast simulated AI response delay for natural interaction
    setTimeout(() => {
      this.isLoading = false;
      const botResponse = this.getBotResponse(userQuestion);
      this.addMessage(botResponse, 'bot');
    }, 250);
  }

  private getBotResponse(question: string): string {
    const cleanQuestion = question.trim().toLowerCase();

    // First check regex patterns for exact natural intent matching
    for (const intent of this.intents) {
      if (intent.patterns) {
        for (const pattern of intent.patterns) {
          if (pattern.test(cleanQuestion)) {
            return intent.response;
          }
        }
      }
    }

    // Second check keywords
    for (const intent of this.intents) {
      for (const kw of intent.keywords) {
        if (cleanQuestion.includes(kw.toLowerCase())) {
          return intent.response;
        }
      }
    }

    // Check individual key tokens (e.g. 'certificate', 'verify', 'apply', 'duration', 'contact')
    if (cleanQuestion.includes('certificate') && (cleanQuestion.includes('download') || cleanQuestion.includes('get'))) {
      return this.findIntent('download_certificate')?.response || '';
    }
    if (cleanQuestion.includes('certificate') && cleanQuestion.includes('verify')) {
      return this.findIntent('verify_certificate')?.response || '';
    }
    if (cleanQuestion.includes('certificate') && (cleanQuestion.includes('generator') || cleanQuestion.includes('ai'))) {
      return this.findIntent('certificate_generator')?.response || '';
    }
    if (cleanQuestion.includes('apply') || cleanQuestion.includes('register') || cleanQuestion.includes('join')) {
      return this.findIntent('apply')?.response || '';
    }
    if (cleanQuestion.includes('program') || cleanQuestion.includes('course') || cleanQuestion.includes('domain')) {
      return this.findIntent('programs')?.response || '';
    }
    if (cleanQuestion.includes('contact') || cleanQuestion.includes('phone') || cleanQuestion.includes('email') || cleanQuestion.includes('number')) {
      return this.findIntent('contact')?.response || '';
    }
    if (cleanQuestion.includes('duration') || cleanQuestion.includes('month') || cleanQuestion.includes('long')) {
      return this.findIntent('duration')?.response || '';
    }
    if (cleanQuestion.includes('eligib') || cleanQuestion.includes('who can')) {
      return this.findIntent('eligibility')?.response || '';
    }
    if (cleanQuestion.includes('status') || cleanQuestion.includes('id')) {
      return this.findIntent('application_status')?.response || '';
    }

    // If query is unrelated to website/internship topics, return mandatory off-topic response
    return this.offTopicResponse;
  }

  private findIntent(key: string): Intent | undefined {
    return this.intents.find((i) => i.key === key);
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
