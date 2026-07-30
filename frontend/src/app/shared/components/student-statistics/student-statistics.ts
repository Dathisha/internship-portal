import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

interface Statistic {
  value: number;
  label: string;
  icon: string;
  displayValue: number;
}

@Component({
  selector: 'app-student-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-statistics.html',
  styleUrl: './student-statistics.css',
})
export class StudentStatisticsComponent implements OnInit {
  @ViewChild('statsSection', { static: false }) statsSection!: ElementRef;

  statistics: Statistic[] = [
    {
      value: 500,
      label: 'Students Completed',
      icon: '👥',
      displayValue: 0,
    },
    {
      value: 100,
      label: 'Real-Time Projects',
      icon: '💼',
      displayValue: 0,
    },
    {
      value: 95,
      label: 'Industry Mentors',
      icon: '🎓',
      displayValue: 0,
    },
    {
      value: 100,
      label: 'Placement Training',
      icon: '🚀',
      displayValue: 0,
    },
  ];

  private hasAnimated = false;

  ngOnInit(): void {
    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            this.animateCounters();
          }
        });
      });

      setTimeout(() => {
        if (this.statsSection) {
          observer.observe(this.statsSection.nativeElement);
        }
      }, 100);
    } else {
      this.animateCounters();
    }
  }

  private animateCounters(): void {
    this.statistics.forEach((stat) => {
      const increment = stat.value / 30;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          stat.displayValue = stat.value;
          clearInterval(interval);
        } else {
          stat.displayValue = Math.floor(current);
        }
      }, 30);
    });
  }
}
