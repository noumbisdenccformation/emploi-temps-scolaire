import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Emploi du Temps Scolaire</h1>
        
        <div class="tabs">
          <button [class.active]="isLogin" (click)="isLogin = true">Connexion</button>
          <button [class.active]="!isLogin" (click)="isLogin = false">Inscription</button>
        </div>

        <!-- Connexion -->
        <form *ngIf="isLogin" [formGroup]="loginForm" (ngSubmit)="login()">
          <mat-form-field>
            <input matInput placeholder="Email" formControlName="email" type="email">
          </mat-form-field>
          <mat-form-field>
            <input matInput placeholder="Mot de passe" formControlName="password" type="password">
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit" [disabled]="!loginForm.valid">
            Se connecter
          </button>
        </form>

        <!-- Inscription -->
        <form *ngIf="!isLogin" [formGroup]="registerForm" (ngSubmit)="register()">
          <div class="form-row">
            <mat-form-field>
              <input matInput placeholder="Prénom" formControlName="firstName">
            </mat-form-field>
            <mat-form-field>
              <input matInput placeholder="Nom" formControlName="lastName">
            </mat-form-field>
          </div>
          <mat-form-field>
            <input matInput placeholder="Email" formControlName="email" type="email">
          </mat-form-field>
          <mat-form-field>
            <input matInput placeholder="Téléphone" formControlName="phone">
          </mat-form-field>
          <mat-form-field>
            <input matInput placeholder="Mot de passe (6 caractères min)" formControlName="password" type="password">
          </mat-form-field>
          <mat-form-field>
            <input matInput placeholder="Confirmer mot de passe" formControlName="confirmPassword" type="password">
          </mat-form-field>
          <div *ngIf="registerForm.get('confirmPassword')?.touched && passwordMismatch" class="error">
            Les mots de passe ne correspondent pas
          </div>
          <button mat-raised-button color="primary" type="submit" [disabled]="!registerForm.valid || passwordMismatch">
            S'inscrire
          </button>
        </form>

        <div *ngIf="error" [class]="error.includes('réussie') ? 'success' : 'error'">{{error}}</div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .auth-card {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      width: 400px;
    }
    h1 { text-align: center; color: #333; margin-bottom: 2rem; }
    .tabs {
      display: flex;
      margin-bottom: 2rem;
    }
    .tabs button {
      flex: 1;
      padding: 10px;
      border: none;
      background: #f5f5f5;
      cursor: pointer;
    }
    .tabs button.active {
      background: #1976d2;
      color: white;
    }
    .form-row {
      display: flex;
      gap: 1rem;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 1rem;
    }
    button[type="submit"] {
      width: 100%;
      margin-top: 1rem;
    }
    .error {
      color: red;
      text-align: center;
      margin-top: 1rem;
    }
    .success {
      color: green;
      text-align: center;
      margin-top: 1rem;
    }
  `]
})
export class AuthComponent {
  isLogin = true;
  error = '';
  
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  });

  get passwordMismatch() {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return password !== confirmPassword && confirmPassword;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/timetable']),
        error: (err) => this.error = err.error.error
      });
    }
  }

  register() {
    if (this.registerForm.valid && !this.passwordMismatch) {
      const { confirmPassword, ...userData } = this.registerForm.value;
      this.authService.register(userData).subscribe({
        next: () => {
          this.isLogin = true;
          this.error = 'Inscription réussie ! Connectez-vous maintenant.';
        },
        error: (err) => this.error = err.error.error
      });
    }
  }
}