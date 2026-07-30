import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ProgramFeature {
  icon: string;
  title: string;
}

interface Program {
  title: string;
  description: string;
  features: ProgramFeature[];
  buttonText: string;
  color: string;
}

@Component({
  selector: 'app-programs-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './programs-section.html',
  styleUrl: './programs-section.css',
})
export class ProgramsSectionComponent {
  Math = Math;

  programs: Program[] = [
    {
      title: 'Internship Program',
      description:
        'Hands-on learning experience with industry mentors. Work on real-time projects and build your portfolio.',
      features: [
        { icon: '💻', title: 'Real-Time Projects' },
        { icon: '👨‍🏫', title: 'Industry Mentorship' },
        { icon: '🏆', title: 'Certificate' },
        { icon: '⏰', title: 'Flexible Learning' },
        { icon: '🎯', title: 'Practical Training' },
      ],
      buttonText: 'Start Internship',
      color: '#007bff',
    },
    {
      title: 'Long Term Program',
      description:
        'Comprehensive training for career growth. Placement-oriented with comprehensive skill development.',
      features: [
        { icon: '🚀', title: 'Placement Training' },
        { icon: '💬', title: 'Interview Skills' },
        { icon: '📄', title: 'Resume Building' },
        { icon: '🎭', title: 'Personality Development' },
        { icon: '⭐', title: 'Motivational Skills' },
        { icon: '🧠', title: 'Aptitude Training' },
        { icon: '🗣️', title: 'Communication Skills' },
        { icon: '💼', title: 'Web Dev Projects' },
        { icon: '🎬', title: 'Mock Interviews' },
        { icon: '🧭', title: 'Career Guidance' },
        { icon: '🏅', title: 'Internship Certificate' },
      ],
      buttonText: 'Explore Long Term',
      color: '#0056b3',
    },
  ];
}
