import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InvoiceComponent } from './in-voice/in-voice';
import { CommonModule   } from '@angular/common';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet , InvoiceComponent , CommonModule  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'inVoice';
}
