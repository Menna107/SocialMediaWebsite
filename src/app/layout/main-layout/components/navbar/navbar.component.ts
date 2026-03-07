import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { initFlowbite } from 'flowbite';
import { RouterLink, RouterLinkActive } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements AfterViewInit, OnInit {
  private readonly authService = inject(AuthService);

  ngAfterViewInit(): void {
    initFlowbite();
  }

  userData: any = null;

  // Theme Mode
  isDark = false;
  bgColor: string = '#f9f9fb';

  ngOnInit(): void {
    this.isDark = document.documentElement.classList.contains('dark');

    const storedUser = localStorage.getItem('socialUser');
    if (storedUser) {
      this.userData = JSON.parse(storedUser);
    }
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    if (this.isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      this.bgColor = '#1a1625';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      this.bgColor = '#f9f9fb';
    }
  }

  // logOut Logic:
  logOut(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4b3b7b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel',
      background: this.bgColor,
      color: '#6e55b2',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.signOut();

        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
