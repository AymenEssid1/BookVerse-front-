import { Component } from '@angular/core';

@Component({
  selector: 'app-client-sidebar',
  templateUrl: './client-sidebar.component.html',
  styleUrls: ['./client-sidebar.component.scss']
})
export class ClientSidebarComponent {




  handleStarClick(event: MouseEvent): void {
    const clickedStar = event.target as HTMLElement;
    const stars = document.querySelectorAll('.star');

    const starIndex = Array.from(stars).indexOf(clickedStar);

    // Fill the clicked star and all preceding stars
    for (let i = 0; i <= starIndex; i++) {
      stars[i].classList.add('filled');
    }

    // Remove fill from all stars after the clicked star
    for (let i = starIndex + 1; i < stars.length; i++) {
      stars[i].classList.remove('filled');
    }
  }

}
