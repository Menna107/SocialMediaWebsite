import { NotificationService } from './../../core/services/notification/notification.service';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CreatePostComponent } from '../../shared/ui/create-post/create-post.component';
import { PostComponent } from '../../shared/ui/post/post.component';
import { UserService } from '../../core/services/user/user.service';
import { Iuser } from '../../core/models/iuser.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CreatePostComponent, PostComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  userData!: Iuser;

  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);

  followSuggestion: Iuser[] = [];
  followingLoading: string | null = null;
  isFollowModalOpen: boolean = false;

  searchTerm: string = '';
  filteredUsers: any[] = [];
  unreadCount: number = 0;

  ngOnInit(): void {
    this.getProfile();
    this.getUnreadNotification();
    this.getFollowSuggestion();
  }

  @ViewChild(PostComponent) postComponent!: PostComponent;

  showCommunity() {
    if (this.postComponent) {
      this.postComponent.source = 'community';
      this.postComponent.loadCommunityPosts();
    }
  }

  // ^Search Logic
  filterUsers() {
    if (!this.searchTerm) {
      this.filteredUsers = this.followSuggestion;
      return;
    }

    const term = this.searchTerm.toLowerCase();

    this.filteredUsers = this.followSuggestion.filter((user: any) =>
      user.name.toLowerCase().includes(term),
    );
  }

  // ^Get Follow Suggestion
  getFollowSuggestion() {
    this.userService.getFollowSuggestion().subscribe({
      next: (res) => {
        console.log(res);
        this.followSuggestion = res.data.suggestions;
        this.filteredUsers = this.followSuggestion;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // ^follow / inFollow User
  followUnFollow(userId: string) {
    this.followingLoading = userId;
    this.userService.followUnfollow(userId).subscribe({
      next: (res) => {
        console.log(res);
        this.followingLoading = null;
        this.getProfile();
      },
      error: (err) => {
        console.log(err);
        this.followingLoading = null;
      },
    });
  }

  // ^Get Profile Data
  getProfile() {
    this.userService.getMyProfile().subscribe({
      next: (res) => {
        this.userData = res.data.user;
        console.log(this.userData);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // ^Get user Profile
  getUserProfile(userId: string) {
    this.userService.getUserProfile(userId).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // ^ Modal open and close
  openFollowModal() {
    this.isFollowModalOpen = true;
  }
  closeFollowModal() {
    this.isFollowModalOpen = false;
  }

  // ^notification number
  getUnreadNotification() {
    this.notificationService.getUnreadCount().subscribe({
      next: (res) => {
        this.unreadCount = res.data.unreadCount;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
