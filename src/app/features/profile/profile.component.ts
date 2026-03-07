import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { PostComponent } from '../../shared/ui/post/post.component';
import { initFlowbite } from 'flowbite';
import { FormsModule } from '@angular/forms';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { Iuser } from '../../core/models/iuser.interface';
import { UserService } from '../../core/services/user/user.service';
import { Ipost } from '../../core/models/ipost.interface';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [PostComponent, FormsModule, UserDetailsComponent, ChangePasswordComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  userData!: Iuser;
  myPosts: Ipost[] = [];
  bookmarksPosts: Ipost[] = [];

  uploadedFile: File | null = null;
  coverPreview: string | null = null;
  selectedCoverFile!: File;

  @ViewChild('avatarInput') avatarInput!: ElementRef<HTMLInputElement>;

  avatarPreview: string | null = null;
  selectedAvatarFile!: File;
  avatarPreviewModal: boolean = false;
  isLoading = false;

  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);

  activeTab: string = 'details';
  ngOnInit(): void {
    initFlowbite();
    this.getProfile();

    this.route.fragment.subscribe((fragment) => {
      if (fragment === 'change-password-tab') {
        this.setActiveTab('password');
        const el = document.getElementById(fragment);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ^Set active tab (posts, savedPosts, details, change Password)
  setActiveTab(tab: string) {
    this.activeTab = tab;

    if (tab === 'posts') {
      this.getMyPosts(this.userData.id);
    } else if (tab === 'savedPosts') {
      this.getBookmarks(this.userData.id);
    }
  }

  // ^Get Profile Data
  getProfile() {
    this.userService.getMyProfile().subscribe({
      next: (res) => {
        this.userData = res.data.user;
        console.log(this.userData);
        this.getMyPosts(this.userData.id);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // ^Get my posts
  getMyPosts(userId: string) {
    this.userService.getUserPosts(userId).subscribe({
      next: (res) => {
        console.log(res);
        this.myPosts = [...res.data.posts];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // ^Get my saved posts
  getBookmarks(userId: string) {
    this.userService.getBookmarks().subscribe({
      next: (res) => {
        console.log(res);
        this.bookmarksPosts = res.data.bookmarks;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // ^ Theme Mode
  bgColor: string = '#f9f9fb';
  themeMode() {
    const theme = localStorage.getItem('theme');

    if (theme === 'light' || theme === null) {
      this.bgColor = '#f9f9fb';
    } else if (theme === 'dark') {
      this.bgColor = '#1a1625';
    }
  }

  // !================ User Cover Logic ==============

  // ^Prepare cover file
  prepareUploadedFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.selectedCoverFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.coverPreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedCoverFile);
    }
  }

  // ^Update Cover Image
  uploadCover() {
    if (!this.selectedCoverFile) return;

    this.isLoading = true;
    const formData = new FormData();
    formData.append('cover', this.selectedCoverFile);

    this.userService.updateUserCover(formData).subscribe({
      next: (res) => {
        console.log(res);
        this.coverPreview = null;
        this.selectedCoverFile = null as any;
        this.isLoading = false;
        this.getProfile();
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  // ^Cancel cover preview
  cancelPreview() {
    this.coverPreview = null;
    this.selectedCoverFile = null as any;
  }

  // ^Delete Cover Image
  deleteCover() {
    this.themeMode();

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will delete your Cover!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4b3b7b',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it',
      cancelButtonText: 'Cancel',
      background: this.bgColor,
      color: '#6e55b2',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUserCover().subscribe({
          next: (res) => {
            console.log(res);
            if (res.success) {
              this.getProfile();

              Swal.fire({
                title: 'Cover Deleted!',
                text: 'You have been successfully Deleted Cover.',
                icon: 'success',
                timer: 4000,
                showConfirmButton: false,
              });
            }
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    });
  }

  // !================ User Photo Logic ==============

  // ^prepare avatar image
  prepareAvatarFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.selectedAvatarFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
        this.avatarPreviewModal = true;
      };
      reader.readAsDataURL(this.selectedAvatarFile);
    }
  }

  // ^Cancel avatar preview
  cancelAvatarPreview() {
    this.avatarPreviewModal = false;
    this.avatarPreview = null;
    this.selectedAvatarFile = null as any;

    if (this.avatarInput && this.avatarInput.nativeElement) {
      this.avatarInput.nativeElement.value = '';
    }
  }

  // ^update user photo
  confirmAvatarUpload() {
    if (!this.selectedAvatarFile) return;

    const formData = new FormData();
    formData.append('photo', this.selectedAvatarFile);

    this.userService.uploadProfilePhoto(formData).subscribe({
      next: (res) => {
        console.log(res);
        this.avatarPreviewModal = false;
        this.avatarPreview = null;
        this.selectedAvatarFile = null as any;
        this.getProfile();
      },
      error: (err) => console.log(err),
    });
  }

  // ^View Image Logic
  selectedImage: string | null = null;
  openImageModal(imageUrl: string) {
    this.selectedImage = imageUrl;
  }
  closeImageModal() {
    this.selectedImage = null;
  }
}
