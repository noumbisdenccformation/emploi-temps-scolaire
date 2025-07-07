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
          <div class="form-row">
            <mat-form-field>
              <mat-select placeholder="Pays" formControlName="country">
                <mat-option value="+237">🇨🇲 Cameroun (+237)</mat-option>
                <mat-option value="+225">🇨🇮 Côte d'Ivoire (+225)</mat-option>
                <mat-option value="+221">🇸🇳 Sénégal (+221)</mat-option>
                <mat-option value="+226">🇧🇫 Burkina Faso (+226)</mat-option>
                <mat-option value="+223">🇲🇱 Mali (+223)</mat-option>
                <mat-option value="+227">🇳🇪 Niger (+227)</mat-option>
                <mat-option value="+228">🇹🇬 Togo (+228)</mat-option>
                <mat-option value="+229">🇧🇯 Bénin (+229)</mat-option>
                <mat-option value="+224">🇬🇳 Guinée (+224)</mat-option>
                <mat-option value="+240">🇬🇶 Guinée Équatoriale (+240)</mat-option>
                <mat-option value="+235">🇹🇩 Tchad (+235)</mat-option>
                <mat-option value="+236">🇨🇫 Centrafrique (+236)</mat-option>
                <mat-option value="+242">🇨🇬 Congo (+242)</mat-option>
                <mat-option value="+241">🇬🇦 Gabon (+241)</mat-option>
                <mat-option value="+269">🇰🇲 Comores (+269)</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field>
              <input matInput placeholder="Numéro" formControlName="phone">
            </mat-form-field>
          </div>
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
    country: ['+237', Validators.required],
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
    console.log('Form valid:', this.registerForm.valid);
    console.log('Password mismatch:', this.passwordMismatch);
    console.log('Form values:', this.registerForm.value);
    
    if (this.registerForm.valid && !this.passwordMismatch) {
      const { confirmPassword, country, phone, ...userData } = this.registerForm.value;
      const fullPhone = country + phone;
      const dataToSend = { ...userData, phone: fullPhone };
      
      console.log('Sending data:', dataToSend);
      
      this.authService.register(dataToSend).subscribe({
        next: (response) => {
          console.log('Success:', response);
          this.isLogin = true;
          this.error = 'Inscription réussie ! Connectez-vous maintenant.';
        },
        error: (err) => {
          console.error('Error:', err);
          this.error = err.error?.error || 'Erreur de connexion';
        }
      });
    } else {
      this.error = 'Veuillez remplir tous les champs correctement';
    }
  }
}