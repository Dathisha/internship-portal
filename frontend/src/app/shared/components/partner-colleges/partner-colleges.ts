import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface College {
  name: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-partner-colleges',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './partner-colleges.html',
  styleUrl: './partner-colleges.css',
})
export class PartnerCollegesComponent {
  colleges: College[] = [
    {
      name: 'Vellore Institute of Technology',
      icon: '🏛️',
      color: '#FF6B6B',
    },
    {
      name: 'Global Institute of Technology',
      icon: '🌍',
      color: '#4ECDC4',
    },
    {
      name: 'Vel Tech University',
      icon: '⚙️',
      color: '#45B7D1',
    },
    {
      name: 'The New College, Chennai',
      icon: '📚',
      color: '#96CEB4',
    },
    {
      name: 'University of Burdwan, Kolkata',
      icon: '🎓',
      color: '#FFEAA7',
    },
    {
      name: 'SRM Institute',
      icon: '🔬',
      color: '#DDA0DD',
    },
    {
      name: 'Dhanalakshmi Srinivasan College',
      icon: '✨',
      color: '#87CEEB',
    },
    {
      name: 'Erode Sengunthar Engineering College',
      icon: '🏗️',
      color: '#F08080',
    },
    {
      name: 'Cape Institute of Technology, Kanyakumari',
      icon: '🌊',
      color: '#20B2AA',
    },
  ];
}
