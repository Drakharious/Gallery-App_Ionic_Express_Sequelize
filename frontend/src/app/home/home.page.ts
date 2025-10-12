import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GalleryService } from '../services/gallery.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  galleries: any[] = [];
  loading = false;

  constructor(
    private router: Router,
    private galleryService: GalleryService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.loadGalleries();
  }

  ionViewWillEnter() {
    this.loadGalleries();
  }

  loadGalleries() {
    this.loading = true;
    this.galleryService.getAll().subscribe({
      next: (res) => {
        this.galleries = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  async createGallery() {
    const alert = await this.alertCtrl.create({
      header: 'Nueva Galería',
      inputs: [{ name: 'name', placeholder: 'Nombre de la galería' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Crear',
          handler: (data) => {
            if (data.name) {
              this.galleryService.create(data.name).subscribe(() => this.loadGalleries());
            }
          }
        }
      ]
    });
    await alert.present();
  }

  openGallery(id: number) {
    this.router.navigate(['/gallery-detail', id]);
  }

  async openGalleryMenu(gallery: any, event: Event) {
    event.stopPropagation();
    const actionSheet = await this.alertCtrl.create({
      header: gallery.name,
      buttons: [
        {
          text: 'Editar',
          handler: async () => {
            const alert = await this.alertCtrl.create({
              header: 'Editar Galería',
              inputs: [{ name: 'name', value: gallery.name, placeholder: 'Nombre' }],
              buttons: [
                { text: 'Cancelar', role: 'cancel' },
                {
                  text: 'Guardar',
                  handler: (data) => {
                    if (data.name) {
                      this.galleryService.update(gallery.id, data.name).subscribe(() => this.loadGalleries());
                    }
                  }
                }
              ]
            });
            await alert.present();
          }
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            const imageCount = gallery.images?.length || 0;
            const message = imageCount > 0 
              ? `Esta galería contiene ${imageCount} imagen${imageCount > 1 ? 'es' : ''}. Se eliminarán permanentemente.`
              : '¿Eliminar esta galería?';
            
            const alert = await this.alertCtrl.create({
              header: '¿Eliminar galería?',
              message: message,
              buttons: [
                { text: 'Cancelar', role: 'cancel' },
                {
                  text: 'Eliminar',
                  role: 'destructive',
                  handler: () => this.galleryService.delete(gallery.id).subscribe(() => this.loadGalleries())
                }
              ]
            });
            await alert.present();
          }
        },
        { text: 'Cancelar', role: 'cancel' }
      ]
    });
    await actionSheet.present();
  }
}
