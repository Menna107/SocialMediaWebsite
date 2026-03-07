import {
  Component,
  Output,
  Input,
  inject,
  OnInit,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostsService } from '../../../core/services/posts/posts.service';
import { Ipost } from '../../../core/models/ipost.interface';

@Component({
  selector: 'app-create-post',
  imports: [ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  @Input() postToEdit: Ipost | null = null;
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() refreshPostsEvent = new EventEmitter<void>();
  userData: any = null;

  // 1- UploadedFile
  uploadedFile: File | null = null;
  imagePreview: string | null = null;

  postDescription: FormControl = new FormControl(null);

  // privacy option
  postPrivacy: FormControl = new FormControl('public');

  ngOnChanges(changes: SimpleChanges) {
    if (changes['postToEdit'] && this.postToEdit) {
      this.postDescription.setValue(this.postToEdit.body);
      this.postPrivacy.setValue(this.postToEdit.privacy);

      this.imagePreview = this.postToEdit.image || null;
      this.uploadedFile = null;
    }
  }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('socialUser');
    if (storedUser) {
      this.userData = JSON.parse(storedUser);
    }
  }

  prepareUploadedFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      this.uploadedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.uploadedFile);
    }
  }

  saveData(event: SubmitEvent) {
    event.preventDefault();
    if (this.postDescription.invalid) return;

    // 3- Create Form Data
    let formData = new FormData(); //(Empty Container)
    formData.append('body', this.postDescription.value);
    formData.append('privacy', this.postPrivacy.value);
    if (this.uploadedFile) {
      formData.append('image', this.uploadedFile);
    }

    if (this.postToEdit) {
      this.updatePost(this.postToEdit._id, formData);
    } else {
      this.createPost(formData);
    }
  }

  createPost(formData: FormData) {
    // Send to back end:
    this.postsService.createPost(formData).subscribe({
      next: (res) => {
        console.log(res);
        this.clearData();

        this.refreshPostsEvent.emit();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updatePost(postId: string, post: any) {
    this.postsService.updatePost(postId, post).subscribe({
      next: (res) => {
        console.log(res);
        this.clearData();
        this.closeModalEvent.emit();
        this.refreshPostsEvent.emit();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  clearData() {
    this.postDescription.reset();
    this.postPrivacy.reset('public');
    this.imagePreview = null;
    this.uploadedFile = null;
  }

  removeImage() {
    this.imagePreview = null;
    this.uploadedFile = null;
  }
}
