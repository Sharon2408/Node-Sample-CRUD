import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/services/auth-service.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileUpload') fileUpload!: ElementRef;

  selectedFile: File | null = null;
  userForm!: FormGroup;
  userDetail: UserDetail = {
    id: 0,
    name: '',
    email: '',
    profile_image: ''
  };

  apiUrl = environment.authUrl;

  constructor(public authService: AuthService, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getUserDetail();  // Fetch the user details
    this.initForm();       // Initialize form without prefilled data yet
  }

  // Initialize form with validation but empty values initially
  initForm() {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]], 
      email: ['', [Validators.required, Validators.email]]         
    });
  }

  // Fetch user details and patch values into the form once received
  getUserDetail() {
    this.authService.getUserDetail().subscribe({
      next: (res) => {
        this.userDetail = res;
        // Patch the form with user details once available
        this.userForm.patchValue({
          name: this.userDetail.name,
          email: this.userDetail.email
        });
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      }
    });
  }

  // Trigger the file upload input when the button is clicked
  uploadImage() {
    this.fileUpload.nativeElement.click();
  }

  // Handle file selection and upload
  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];

      if (!this.selectedFile) {
        alert('Please select a file first');
        return;
      }

      // Upload the selected file
      this.authService.uploadFile(this.selectedFile, this.userDetail.id)
        .subscribe({
          next: (response) => {
            console.log('Upload success:', response);
            // Refresh user detail to reflect the uploaded image
            this.getUserDetail();
          },
          error: (error) => {
            console.error('Upload error:', error);
          }
        });
    }
  }

  // Submit user details form
  onSubmit() {
    if (this.userForm.valid) {
      const updatedUserData = {
        ...this.userDetail,   // Preserve the profile image and ID
        ...this.userForm.value // Overwrite name and email
      };
      
      this.authService.updateUser(updatedUserData).subscribe({
        next: (res) => {
          console.log('User details updated successfully');
        },
        error: (err) => {
          console.error('Error updating user details', err);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }

  // Getters for form controls (useful for validation)
  get name() {
    return this.userForm.get('name');
  }

  get email() {
    return this.userForm.get('email');
  }
}

// Interface for user details
export interface UserDetail {
  id: number;
  name: string;
  email: string;
  profile_image: string;
}

