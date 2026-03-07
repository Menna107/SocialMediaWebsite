import { Input, Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Iuser } from '../../../../core/models/iuser.interface';
import { PostsService } from '../../../../core/services/posts/posts.service';
import { UserService } from '../../../../core/services/user/user.service';

@Component({
  selector: 'app-user-details',
  imports: [DatePipe],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent implements OnInit {
  userData!: Iuser;

  private readonly userService = inject(UserService);
  postsCount: number = 0;
  bookmarkedCount!: number;

  ngOnInit(): void {
    this.getProfile();
  }

  // ^Get Profile Data
  getProfile() {
    this.userService.getMyProfile().subscribe({
      next: (res) => {
        this.userData = res.data.user;

        this.bookmarkedCount = this.userData.bookmarksCount;

        this.getPostsCount();

        console.log(this.userData);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getPostsCount() {
    this.userService.getUserPosts(this.userData._id).subscribe({
      next: (res) => {
        this.postsCount = res.data.posts.length;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
