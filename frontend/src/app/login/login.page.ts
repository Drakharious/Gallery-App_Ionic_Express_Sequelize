import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  isLogin = true;
  name = '';
  email = '';
  password = '';

  nameError = '';
  emailError = '';
  passwordError = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ionViewWillEnter() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.clearErrors();
  }

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.name = '';
    this.email = '';
    this.password = '';
    this.clearErrors();
  }

  clearErrors() {
    this.nameError = '';
    this.emailError = '';
    this.passwordError = '';
  }

  validateName() {
    if (!this.isLogin) {
      this.nameError = this.name.trim() ? '' : 'El nombre es requerido';
    }
  }

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email) {
      this.emailError = 'El email es requerido';
    } else if (!emailRegex.test(this.email)) {
      this.emailError = 'Formato de email inválido';
    } else {
      this.emailError = '';
    }
  }

  validatePassword() {
    if (!this.password) {
      this.passwordError = 'La contraseña es requerida';
    } else if (this.password.length < 6) {
      this.passwordError = 'La contraseña debe tener un mínimo de 6 caracteres';
    } else {
      this.passwordError = '';
    }
  }

  async onSubmit() {
    this.clearErrors();

    if (!this.isLogin) {
      this.validateName();
    }
    this.validateEmail();
    this.validatePassword();

    if (this.nameError || this.emailError || this.passwordError) {
      return;
    }

    if (this.isLogin) {
      this.login();
    } else {
      this.register();
    }
  }

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: async (err) => {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'Credenciales inválidas',
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }

  register() {
    if (!this.name || !this.email || !this.password) {
      return;
    }
    this.authService.register(this.name, this.email, this.password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: async (err) => {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: err.error?.message || 'Error al registrarse',
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }
}
