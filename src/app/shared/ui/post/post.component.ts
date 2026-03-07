import { Component, inject, Input, OnInit } from '@angular/core';
import { Ipost } from '../../../core/models/ipost.interface';
import { initFlowbite } from 'flowbite';
import { PostsService } from '../../../core/services/posts/posts.service';
import Swal from 'sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreatePostComponent } from '../create-post/create-post.component';
import { PostCommentsComponent } from '../post-comments/post-comments.component';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../core/services/user/user.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-post',
  imports: [
    ReactiveFormsModule,
    CreatePostComponent,
    PostCommentsComponent,
    DatePipe,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly userService = inject(UserService);

  @Input() source: 'feed' | 'profile' | 'bookmarks' | 'community' = 'feed';
  @Input() postList: Ipost[] = [];
  userData: any = null;
  showModal = false;
  postLikes: any[] | null = null;
  loadingLikes = false;

  //  Share Modal
  selectedPostToShare: Ipost | null = null;
  shareComment: string = '';
  sharingLoading = false;

  ngOnInit(): void {
    this.getUserData();

    if (this.source === 'feed') {
      this.getAllPosts();
    } else if (this.source === 'community') {
      this.loadCommunityPosts();
    }
  }

  getUserData(): void {
    this.userService.getMyProfile().subscribe({
      next: (res) => {
        this.userData = res.data.user;

        if (this.source === 'feed') {
          this.getAllPosts();
        }
        setTimeout(() => {
          initFlowbite();
        });
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // Theme Mode
  bgColor: string = '#f9f9fb';
  themeMode() {
    const theme = localStorage.getItem('theme');

    if (theme === 'light' || theme === null) {
      this.bgColor = '#f9f9fb';
    } else if (theme === 'dark') {
      this.bgColor = '#1a1625';
    }
  }

  // ^Delete Post and show posts again
  deletePostItem(postId: string): void {
    this.themeMode();

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will delete this post!',
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
        this.postsService.deletePost(postId).subscribe({
          next: (res) => {
            console.log(res);
            if (res.success) {
              //Get All posts Again
              this.postList = this.postList.filter((post) => post.id !== postId);

              Swal.fire({
                title: 'Post Deleted!',
                text: 'You have been successfully Deleted post.',
                icon: 'success',
                background: this.bgColor,
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

  // ^Get User and followers Posts from API
  getAllPosts() {
    this.postsService.getFeedPosts().subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.userData.postsCount = this.postList.length;
          this.postList = res.data.posts.map((post: Ipost) => ({
            ...post,
            isLiked: post.likes.includes(this.userData?._id),
          }));
          setTimeout(() => {
            initFlowbite();
          });
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // ^Get all Posts from API
  loadCommunityPosts(): void {
    this.postsService.getAllPosts().subscribe({
      next: (res) => {
        if (res.success) {
          this.postList = res.data.posts.map((post: Ipost) => ({
            ...post,
            isLiked: post.likes.includes(this.userData?._id),
          }));

          this.userData.postsCount = this.postList.length;

          setTimeout(() => initFlowbite(), 0);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // ^View Post Button Logic
  selectedPost: Ipost | null = null;

  openModal(post: Ipost) {
    this.selectedPost = post;
  }
  closeModal() {
    this.selectedPost = null;
  }

  // ^View Image Logic
  selectedImage: string | null = null;
  openImageModal(imageUrl: string) {
    this.selectedImage = imageUrl;
  }
  closeImageModal() {
    this.selectedImage = null;
  }

  // ^Bookmark/UnBookmark Post:
  savePost(postId: string, postData: any): void {
    this.postsService.savePost(postId, postData).subscribe({
      next: (res) => {
        console.log(res);
        this.postList = this.postList.filter((post) => post.id !== postId);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // ^Edit Post:
  selectedPostEdit: Ipost | null = null;
  openModalEdit(post: Ipost) {
    this.selectedPostEdit = post;
  }
  closeModalEdit() {
    this.selectedPostEdit = null;
  }

  // ^when privacy Post change:
  onChangePrivacy(post: Ipost, event: Event) {
    const select = event.target as HTMLSelectElement;
    const newPrivacy = select.value;

    post.privacy = newPrivacy;

    const updatedData = { privacy: newPrivacy };

    this.postsService.updatePost(post._id, updatedData).subscribe({
      next: () => {
        console.log('Privacy updated');
      },
      error: (err) => console.log(err),
    });
  }

  // ^open reacts modal:
  openLikesModal(post: Ipost) {
    this.showModal = true;
    this.loadingLikes = true;
    this.postLikes = null;
    this.getPostLikes(post._id);
  }

  getPostLikes(postId: string) {
    this.postsService.getPostLikes(postId).subscribe({
      next: (res) => {
        console.log(res);
        this.postLikes = res.data.likes || [];
        this.loadingLikes = false;
      },
      error: (err) => {
        console.log(err);
        this.postLikes = [];
        this.loadingLikes = false;
      },
    });
  }

  // ^Like Post:
  likeUnlikePost(post: Ipost) {
    this.postsService.likeUnlikePost(post._id, post.body).subscribe({
      next: () => {
        // toggle like
        post.isLiked = !post.isLiked;

        // update likes count
        if (post.isLiked) {
          post.likesCount++;
        } else {
          post.likesCount--;
        }

        console.log(post.likes);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // ^Share Post
  openShareModal(post: Ipost) {
    this.selectedPostToShare = post;
    this.shareComment = '';
  }

  confirmShare() {
    if (!this.selectedPostToShare) return;

    this.sharingLoading = true;

    const data = {
      body: this.shareComment,
    };

    this.postsService.sharePost(this.selectedPostToShare._id, data).subscribe({
      next: (res) => {
        this.sharingLoading = false;
        this.selectedPostToShare = null;
        this.shareComment = '';
        this.getAllPosts();
      },
      error: (err) => {
        console.log(err);
        this.sharingLoading = false;
      },
    });
  }

  closeShareModal() {
    this.selectedPostToShare = null;
    this.shareComment = '';
  }
}
