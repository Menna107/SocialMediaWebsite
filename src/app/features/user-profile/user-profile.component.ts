import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { UserService } from '../../core/services/user/user.service';
import { Iuser } from '../../core/models/iuser.interface';
import { PostCommentsComponent } from '../../shared/ui/post-comments/post-comments.component';
import { PostComponent } from '../../shared/ui/post/post.component';
import { Ipost } from '../../core/models/ipost.interface';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  imports: [PostCommentsComponent, PostComponent, RouterLink],
})
export class UserProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private location = inject(Location);

  userId!: string;
  userData!: Iuser;

  userPosts: Ipost[] = [];

  isFollowing: boolean = false;
  followingLoading = false;
  showFollowersModal = false;
  showFollowingModal = false;

  selectedImage: string | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('id')!;
      this.getUserData();
    });
  }

  getUserData() {
    this.userService.getUserProfile(this.userId).subscribe({
      next: (res) => {
        this.userData = res.data.user;
        this.isFollowing = res.data.isFollowing;
        this.getUserPosts(this.userData._id);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getUserPosts(userId: string) {
    this.userService.getUserPosts(userId).subscribe({
      next: (res) => {
        this.userPosts = res.data.posts;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  followUnfollow() {
    this.followingLoading = true;

    this.userService.followUnfollow(this.userId).subscribe({
      next: () => {
        this.isFollowing = !this.isFollowing;
        this.followingLoading = false;
      },
      error: () => {
        this.followingLoading = false;
      },
    });
  }

  goBack() {
    this.location.back();
  }

  openImageModal(img: string) {
    this.selectedImage = img;
  }

  closeImageModal() {
    this.selectedImage = null;
  }

  openFollowersModal() {
    this.showFollowersModal = true;
  }

  closeFollowersModal() {
    this.showFollowersModal = false;
  }

  openFollowingModal() {
    this.showFollowingModal = true;
  }

  closeFollowingModal() {
    this.showFollowingModal = false;
  }

  goToUserProfile(userId: string) {
    this.closeFollowersModal();
    this.closeFollowingModal();
    this.router.navigate(['/user', userId]);
  }
}
