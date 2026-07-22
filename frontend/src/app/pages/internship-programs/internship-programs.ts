import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header';
import { FooterComponent } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-internship-programs',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './internship-programs.html',
  styleUrl: './internship-programs.css',
})
export class InternshipProgramsComponent {
  programs = [
    {
      title: 'Web Development',
      description: 'Build modern websites and web applications using the latest front-end and back-end tools.',
      learning: ['HTML5', 'CSS3', 'JavaScript', 'Angular', 'Laravel', 'REST APIs', 'MySQL', 'Real-time projects'],
      duration: '6 Weeks',
      mode: 'Hybrid',
      domain: 'Web Development',
    },
    {
      title: 'Artificial Intelligence',
      description: 'Learn the foundations of AI and create applications powered by smart models and data.',
      learning: ['Python for AI', 'Machine Learning Basics', 'AI Tools & Frameworks', 'Build AI-powered applications', 'Real datasets'],
      duration: '6 Weeks',
      mode: 'Hybrid',
      domain: 'Artificial Intelligence',
    },
  ];

  constructor(private router: Router) {}

  goToApply(domain: string): void {
    this.router.navigate(['/apply'], { queryParams: { domain } });
  }
}
