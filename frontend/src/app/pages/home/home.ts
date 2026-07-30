import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header';
import { FooterComponent } from '../../shared/components/footer/footer';
import { StudentStatisticsComponent } from '../../shared/components/student-statistics/student-statistics';
import { PartnerCollegesComponent } from '../../shared/components/partner-colleges/partner-colleges';
import { ProgramsSectionComponent } from '../../shared/components/programs-section/programs-section';
import Swiper from 'swiper';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    FooterComponent,
    StudentStatisticsComponent,
    PartnerCollegesComponent,
    ProgramsSectionComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('heroSlider') heroSlider!: ElementRef<HTMLElement>;
  @ViewChild('heroPrevious') heroPrevious!: ElementRef<HTMLButtonElement>;
  @ViewChild('heroNext') heroNext!: ElementRef<HTMLButtonElement>;
  @ViewChild('heroPagination') heroPagination!: ElementRef<HTMLElement>;

  readonly heroImages = [
    {
      alt: 'Students collaborating on artificial intelligence and machine learning',
      src: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1920&q=80',
    },
    {
      alt: 'Developer writing software on a laptop',
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80',
    },
    {
      alt: 'Software engineer working with modern code',
      src: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1920&q=80',
    },
    {
      alt: 'Team collaborating in a modern technology workspace',
      src: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80',
    },
    {
      alt: 'Data science visualization on a laptop screen',
      src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80',
    },
    {
      alt: 'Technology team working together in an office',
      src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1920&q=80',
    },
  ];

  private heroSwiper?: Swiper;

  ngAfterViewInit(): void {
    this.heroImages.forEach(({ src }) => {
      const image = new Image();
      image.src = src;
    });

    this.heroSwiper = new Swiper(this.heroSlider.nativeElement, {
      modules: [Autoplay, EffectFade, Navigation, Pagination],
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        waitForTransition: false,
      },
      effect: 'fade',
      fadeEffect: { crossFade: true },
      loop: true,
      observer: true,
      observeParents: true,
      slidesPerGroup: 1,
      slidesPerView: 1,
      navigation: {
        nextEl: this.heroNext.nativeElement,
        prevEl: this.heroPrevious.nativeElement,
      },
      pagination: {
        clickable: true,
        el: this.heroPagination.nativeElement,
      },
      speed: 1100,
    });
    this.heroSwiper.autoplay.start();
  }

  ngOnDestroy(): void {
    this.heroSwiper?.destroy(true, true);
  }
}

