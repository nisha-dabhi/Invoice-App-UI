import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CompanyService } from '../../../services/company-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-user',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-user.html',
  styleUrl: './add-user.css',
})
export class AddUser {

  userForm!: FormGroup;
  user: User = {} as User;
  isEdit = false;
  users: User[] = [];
  companies: { id: number; companyName: string }[] = [];
  companyName: string = '';
  detailUser: User | null = null;
  showDetail = false;

  constructor(private companyService: CompanyService, private service: UserService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.loadUsers();
    this.loadCompanies();
  }

  loadUsers() {
    this.service.getAllUsers().subscribe(res => {
      this.users = res;

    });
  }

  loadCompanies(): void {
    this.companyService.getAllCompany().subscribe({
      next: (data) => {
        this.companies = data;
      },
      error: (err) => {
        console.error('Failed to load companies', err);
      }
    });
  }

  addUser() {
    if (this.isEdit) {

      this.service.updateUser(this.user.id, this.user).subscribe(() => {
        alert('Updated Successfully');
        this.toastr.success('User updated successfully!', 'Updated');
        this.loadUsers();
      });
    } else {
      debugger
      this.service.addUser(this.user).subscribe(() => {
        alert('Saved Successfully');
        this.toastr.success('User added successfully!', 'Success');
        this.loadUsers();
      });
    }
  }

  deleteUser(id: number) {
    if (confirm('Are you sure to delete?')) {
      this.service.deleteUser(id).subscribe(() => {
        alert('Deleted Successfully');
        this.toastr.error('User deleted!', 'Deleted');
        this.loadUsers();
      });
    }
  }
 
  updateUser(u: User) {
    this.user = { ...u };
    this.isEdit = true;
  }

  onlyNumbers(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }

    if (event.target.value.length >= 10) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  openModal(user: User) {
    this.detailUser = user;
    this.showDetail = true;
  }

  closeModal() {
    this.detailUser = null;
    this.showDetail = false;
  }

  resetForm() {
    this.user = {} as User;
  }

  closeCard() {
    this.resetForm();
    this.isEdit = false;
  }

  openForm() {
    this.user = {} as User;
    this.isEdit = false;
  }

  get f() { return this.userForm.controls; }
  showPassword = false;
  isInvalid(field: string): boolean {
    return this.userForm.get(field)!.invalid && this.userForm.get(field)!.touched;
  }

  onCompIdChange() {
    const comp = this.companies.find(c => c.id === this.user.compId);
    this.companyName = comp ? comp.companyName : '';
  }

}
