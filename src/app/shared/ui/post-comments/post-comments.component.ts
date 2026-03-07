import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommentsService } from '../../../core/services/comments/comments.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import Swal from 'sweetalert2';
import { Icomment } from '../../../core/models/icomment.interface';
import { comment } from 'postcss';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-comments',
  imports: [ReactiveFormsModule, FormsModule, DatePipe, RouterLink],
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.css'],
})
export class PostCommentsComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);
  userData: any = null;
  @Input() postId!: string;
  @Output() commentAdded = new EventEmitter<void>();
  @Output() commentDeleted = new EventEmitter<void>();
  commentToEdit: Icomment | null = null;

  postCommentsList: Icomment[] = [];
  CommentReplaysList: Icomment[] = [];
  loadingComments = false;

  replyPreviewImage: string | null = null;
  replySelectedFile: File | null = null;

  // 1- UploadedFile
  uploadedFile: File | null = null;
  previewImage: string | null = null;

  commentContent: FormControl = new FormControl(null);
  repliesLoading: { [key: string]: boolean } = {};
  replySubmitting: { [key: string]: boolean } = {};

  ngOnInit(): void {
    const storedUser = localStorage.getItem('socialUser');
    if (storedUser) {
      this.userData = JSON.parse(storedUser);
    }
    if (this.postId) {
      this.getAllPostComments(this.postId);
    }
  }

  prepareUploadedFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.uploadedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(this.uploadedFile);
    }
  }

  saveData(event: SubmitEvent) {
    event.preventDefault();
    if (!this.commentContent.value && !this.previewImage) return;

    // 3- Create Form Data
    let formData = new FormData(); //(Empty Container)
    formData.append('content', this.commentContent.value);
    if (this.uploadedFile) {
      formData.append('image', this.uploadedFile);
    } else if (this.commentToEdit?.image && !this.previewImage) {
      formData.append('image', '');
    }

    if (this.commentToEdit) {
      this.updateComment(this.postId, this.commentToEdit._id, formData);
    } else {
      this.createComment(formData);
    }
  }

  // ^Create new comment
  createComment(formData: FormData) {
    // Send to back end:
    this.commentsService.createComment(this.postId, formData).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success && res.data.comment) {
          this.postCommentsList = [res.data.comment, ...this.postCommentsList];
        }
        setTimeout(() => {
          initFlowbite();
        }, 0);
        this.commentAdded.emit();
        this.clearData();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // ^Get all Comments from API
  getAllPostComments(postId: string) {
    this.loadingComments = true;
    this.commentsService.getPostComments(postId).subscribe({
      next: (res) => {
        console.log(res);
        if (res.success) {
          this.postCommentsList = res.data.comments;
          this.loadingComments = false;

          setTimeout(() => {
            initFlowbite();
          });
        }
      },
      error: (err) => {
        console.log(err);
        this.loadingComments = false;
      },
    });
  }

  // ^Theme Mode for Delete Modal
  bgColor: string = '#f9f9fb';
  themeMode() {
    const theme = localStorage.getItem('theme');

    if (theme === 'light' || theme === null) {
      this.bgColor = '#f9f9fb';
    } else if (theme === 'dark') {
      this.bgColor = '#1a1625';
    }
  }

  // ^Delete Comment
  deleteCommentItem(postId: string, commentId: string): void {
    this.themeMode();

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will delete this Comment!',
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
        this.commentsService.deleteComment(postId, commentId).subscribe({
          next: (res) => {
            console.log(res);
            if (res.success) {
              this.postCommentsList = this.postCommentsList.filter((c) => c._id !== commentId);
              this.commentDeleted.emit();
            }
          },
          error: (err) => {
            console.log(err);
          },
        });
        Swal.fire({
          title: 'Comment Deleted!',
          text: 'You have been successfully Deleted Comment.',
          icon: 'success',
          background: this.bgColor,
          color: '#6e55b2',
          timer: 4000,
          showConfirmButton: false,
        });
      }
    });
  }

  // ^Edit Comment
  updateComment(postId: string, commentId: string, formData: FormData) {
    this.commentsService.updateComment(postId, commentId, formData).subscribe({
      next: (res) => {
        console.log(res);
        this.clearData();
        if (res.success && res.data.comment) {
          this.postCommentsList = this.postCommentsList.map((c) =>
            c._id === commentId ? res.data.comment : c,
          );
        }
        this.commentToEdit = null;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  editComment(comment: Icomment) {
    this.commentToEdit = comment;
    this.commentContent.setValue(comment.content || '');
    this.previewImage = comment.image || null;
  }

  // ^EdReset Inputs when edit Comment
  clearData() {
    this.commentContent.reset();
    this.previewImage = null;
    this.uploadedFile = null;
  }

  // ^Remove Image
  removeImage() {
    this.previewImage = null;
    this.uploadedFile = null;
  }

  // ^View Image Logic
  selectedImage: string | null = null;
  openImageModal(imageUrl: string) {
    this.selectedImage = imageUrl;
  }
  closeImageModal() {
    this.selectedImage = null;
  }

  activeReplyId: string | null = null;
  replyContent: string = '';

  // ^ View and Hide comment Replies
  toggleReply(commentId: string) {
    if (this.activeReplyId === commentId) {
      this.activeReplyId = null;
      return;
    }

    this.activeReplyId = commentId;
    if (!this.getCommentById(commentId)?.replies) {
      this.getCommentReplies(commentId);
    }
  }
  // helper functions
  isLiked(comment: Icomment): boolean {
    return comment.likes?.some((like: any) => like._id === this.userData?._id);
  }
  getCommentById(id: string) {
    return this.postCommentsList.find((c) => c._id === id);
  }

  getCommentReplies(commentId: string) {
    this.repliesLoading[commentId] = true;

    this.commentsService.getCommentReplay(this.postId, commentId).subscribe({
      next: (res) => {
        if (res.success) {
          this.postCommentsList = this.postCommentsList.map((comment) =>
            comment._id === commentId ? { ...comment, replies: res.data.replies } : comment,
          );
        }
        this.repliesLoading[commentId] = false;
      },
      error: () => {
        this.repliesLoading[commentId] = false;
      },
    });
  }

  createReply(commentId: string) {
    if (!this.replyContent.trim() && !this.replySelectedFile) return;

    this.replySubmitting[commentId] = true;

    const formData = new FormData();
    formData.append('content', this.replyContent);
    if (this.replySelectedFile) {
      formData.append('image', this.replySelectedFile);
    }

    this.commentsService.createReplay(this.postId, commentId, formData).subscribe({
      next: (res) => {
        if (res.success && res.data.reply) {
          this.postCommentsList = this.postCommentsList.map((comment) => {
            if (comment._id === commentId) {
              return {
                ...comment,
                replies: [res.data.reply, ...(comment.replies || [])],
                repliesCount: comment.repliesCount + 1,
              };
            }
            return comment;
          });
        }
        this.replyContent = '';
        this.removeReplyImage();
        this.replySubmitting[commentId] = false;
      },
      error: () => {
        this.replySubmitting[commentId] = false;
      },
    });
  }

  toggleLike(comment: Icomment) {
    const isLiked = this.isLiked(comment);

    // Optimistic Update
    if (isLiked) {
      comment.likes = comment.likes.filter((like: any) => like._id !== this.userData._id);
    } else {
      comment.likes = [...(comment.likes || []), this.userData];
    }

    this.commentsService.likeUnlikeComment(this.postId, comment._id, {}).subscribe({
      error: () => {
        if (isLiked) {
          comment.likes = [...comment.likes, this.userData];
        } else {
          comment.likes = comment.likes.filter((like: any) => like._id !== this.userData._id);
        }
      },
    });
  }

  // ^replay Image:
  prepareReplyImage(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.replySelectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.replyPreviewImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeReplyImage() {
    this.replyPreviewImage = null;
    this.replySelectedFile = null;
  }
}
