import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header';
import { FooterComponent } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './terms.html',
  styleUrl: './terms.css',
})
export class TermsComponent {}
