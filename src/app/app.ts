import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { InvoiceComponent } from './in-voice/in-voice';
import { CommonModule   } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule ,RouterLink, RouterLinkActive ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'inVoice';
}
