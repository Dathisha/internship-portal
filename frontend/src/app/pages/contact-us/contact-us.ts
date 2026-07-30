import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header';
import { FooterComponent } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css',
})
export class ContactUsComponent {}
