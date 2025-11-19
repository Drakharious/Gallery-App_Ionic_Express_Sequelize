import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {

  user: any = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

  async editProfile() {
    const alert = await this.alertCtrl.create({
      header: 'Editar Perfil',
      inputs: [
        { name: 'name', value: this.user.name, placeholder: 'Nombre' },
        { name: 'email', value: this.user.email, placeholder: 'Email', type: 'email' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.name && data.email) {
              this.userService.update(this.user.id, data.name, data.email).subscribe({
                next: (res) => {
                  this.user = res;
                  const currentUser = { ...this.user };
                  localStorage.setItem('user', JSON.stringify(currentUser));
                },
                error: async (err) => {
                  const errorAlert = await this.alertCtrl.create({
                    header: 'Error',
                    message: 'No se pudo actualizar el perfil',
                    buttons: ['OK']
                  });
                  await errorAlert.present();
                }
              });
            }
          }
        },
        {
          text: 'Eliminar Cuenta',
          role: 'destructive',
          handler: () => {
            setTimeout(() => this.deleteAccount(), 100);
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salir',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteAccount() {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Cuenta',
      message: 'Esta acción es PERMANENTE y eliminará todos tus datos (galerías, imágenes y categorías). Para confirmar, escribe: Eliminar cuenta',
      inputs: [
        {
          name: 'confirmation',
          type: 'text',
          placeholder: 'Escribe: Eliminar cuenta'
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: (data) => {
            if (data.confirmation === 'Eliminar cuenta') {
              this.userService.delete(this.user.id).subscribe({
                next: () => {
                  this.authService.logout();
                  this.router.navigate(['/login']);
                },
                error: async () => {
                  const errorAlert = await this.alertCtrl.create({
                    header: 'Error',
                    message: 'No se pudo eliminar la cuenta',
                    buttons: ['OK']
                  });
                  await errorAlert.present();
                }
              });
              return true;
            } else {
              this.showIncorrectConfirmation();
              return false;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async showIncorrectConfirmation() {
    const alert = await this.alertCtrl.create({
      header: 'Texto incorrecto',
      message: 'Debes escribir exactamente: Eliminar cuenta',
      buttons: ['OK']
    });
    await alert.present();
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
