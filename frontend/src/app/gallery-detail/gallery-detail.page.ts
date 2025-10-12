import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GalleryService } from '../services/gallery.service';
import { ImageService } from '../services/image.service';
import { AlertController, ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-gallery-detail',
  templateUrl: './gallery-detail.page.html',
  styleUrls: ['./gallery-detail.page.scss'],
  standalone: false
})
export class GalleryDetailPage implements OnInit {

  galleryId!: number;
  gallery: any = null;
  images: any[] = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private galleryService: GalleryService,
    private imageService: ImageService,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.galleryId = +this.route.snapshot.paramMap.get('id')!;
    this.loadGallery();
    this.loadImages();
  }

  loadGallery() {
    this.galleryService.getOne(this.galleryId).subscribe({
      next: (res) => this.gallery = res,
      error: () => this.router.navigate(['/home'])
    });
  }

  loadImages() {
    this.loading = true;
    this.imageService.getAll(this.galleryId).subscribe({
      next: (res) => {
        this.images = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  uploadImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('La imagen es demasiado grande. Máximo 5MB');
          return;
        }
        this.showUploadDialog(file);
      }
    };
    input.click();
  }

  async showUploadDialog(file: File) {
    const alert = await this.alertCtrl.create({
      header: 'Detalles de la imagen',
      inputs: [
        { name: 'name', placeholder: 'Nombre (opcional)' },
        { name: 'description', placeholder: 'Descripción (opcional)' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Subir',
          handler: (data) => {
            this.performUpload(file, data.name, data.description);
          }
        }
      ]
    });
    await alert.present();
  }

  performUpload(file: File, name?: string, description?: string) {
    const formData = new FormData();
    formData.append('image', file);
    if (name) formData.append('name', name);
    if (description) formData.append('description', description);
    
    this.imageService.create(this.galleryId, formData).subscribe({
      next: () => {
        console.log('Image uploaded successfully');
        this.loadImages();
      },
      error: (err) => {
        console.error('Error uploading image:', err);
        alert('Error al subir la imagen: ' + (err.error?.message || err.message));
      }
    });
  }

  selectedImageIndex = -1;
  showViewer = false;

  viewImage(index: number) {
    this.selectedImageIndex = index;
    this.showViewer = true;
  }

  closeViewer() {
    this.showViewer = false;
    this.selectedImageIndex = -1;
  }

  nextImage() {
    if (this.selectedImageIndex < this.images.length - 1) {
      this.selectedImageIndex++;
    }
  }

  prevImage() {
    if (this.selectedImageIndex > 0) {
      this.selectedImageIndex--;
    }
  }

  get currentImage() {
    return this.images[this.selectedImageIndex];
  }

  async openImageMenu(image: any, event: Event) {
    event.stopPropagation();
    const actionSheet = await this.actionSheetCtrl.create({
      header: image.name,
      subHeader: image.description,
      buttons: [
        {
          text: 'Editar',
          handler: async () => {
            const alert = await this.alertCtrl.create({
              header: 'Editar Imagen',
              inputs: [
                { name: 'name', value: image.name, placeholder: 'Nombre' },
                { name: 'description', value: image.description, placeholder: 'Descripción' }
              ],
              buttons: [
                { text: 'Cancelar', role: 'cancel' },
                {
                  text: 'Guardar',
                  handler: (data) => {
                    const formData = new FormData();
                    if (data.name) formData.append('name', data.name);
                    if (data.description) formData.append('description', data.description);
                    this.imageService.update(image.id, formData).subscribe(() => this.loadImages());
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
            const alert = await this.alertCtrl.create({
              header: '¿Eliminar imagen?',
              buttons: [
                { text: 'Cancelar', role: 'cancel' },
                {
                  text: 'Eliminar',
                  handler: () => this.imageService.delete(image.id).subscribe(() => this.loadImages())
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

  getImageUrl(filename: string) {
    return `http://localhost:8080/uploads/${filename}`;
  }

  goBack() {
    if (this.showViewer) {
      this.closeViewer();
    } else {
      this.router.navigate(['/home']);
    }
  }
}
