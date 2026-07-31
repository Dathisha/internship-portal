import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, ViewChild, inject } from '@angular/core';

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
export class StudentStatisticsComponent implements AfterViewInit {
  @ViewChild('statsSection', { static: false }) statsSection!: ElementRef;

  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);

  statistics: Statistic[] = [
    {
      value: 600,
      label: 'Students',
      icon: '👥',
      displayValue: 600,
    },
    {
      value: 100,
      label: 'Real-Time Projects',
      icon: '💼',
      displayValue: 100,
    },
    {
      value: 20,
      label: 'Mentors',
      icon: '🎓',
      displayValue: 20,
    },
  ];

  private hasAnimated = false;

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !this.hasAnimated) {
              this.hasAnimated = true;
              this.ngZone.run(() => {
                this.animateCounters();
              });
            }
          });
        },
        { threshold: 0.1 }
      );

      if (this.statsSection?.nativeElement) {
        observer.observe(this.statsSection.nativeElement);
      } else {
        this.animateCounters();
      }
    } else {
      this.animateCounters();
    }
  }

  private animateCounters(): void {
    this.statistics.forEach((stat) => {
      stat.displayValue = 0;
      const duration = 1000;
      const steps = 30;
      const increment = stat.value / steps;
      const stepTime = duration / steps;
      let current = 0;

      const interval = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          stat.displayValue = stat.value;
          clearInterval(interval);
        } else {
          stat.displayValue = Math.floor(current);
        }
        this.cdr.detectChanges();
      }, stepTime);
    });
  }
}
