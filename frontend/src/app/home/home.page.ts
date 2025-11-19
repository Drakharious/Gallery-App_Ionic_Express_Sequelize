import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { GalleryService } from '../services/gallery.service';
import { CategoryService } from '../services/category.service';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, AfterViewInit {
  @ViewChild('segmentWrapper') segmentWrapper!: ElementRef;
  
  galleries: any[] = [];
  categories: any[] = [];
  selectedCategoryId: number | null = null;
  loading = false;
  user: any = null;
  showLeftArrow = false;
  showRightArrow = false;

  constructor(
    private router: Router,
    private galleryService: GalleryService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.loadCategories();
    this.loadGalleries();
  }

  ngAfterViewInit() {
    setTimeout(() => this.checkScrollArrows(), 100);
  }

  ionViewWillEnter() {
    this.user = this.authService.getCurrentUser();
    this.loadCategories();
    this.loadGalleries();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (res) => {
        this.categories = res;
        setTimeout(() => this.checkScrollArrows(), 100);
      },
      error: () => {},
    });
  }

  scrollCategories(direction: 'left' | 'right') {
    const wrapper = this.segmentWrapper?.nativeElement;
    if (!wrapper) return;
    
    const scrollAmount = 200;
    const newScrollLeft = direction === 'left' 
      ? wrapper.scrollLeft - scrollAmount 
      : wrapper.scrollLeft + scrollAmount;
    
    wrapper.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
  }

  onSegmentScroll() {
    this.checkScrollArrows();
  }

  checkScrollArrows() {
    const wrapper = this.segmentWrapper?.nativeElement;
    if (!wrapper) return;
    
    this.showLeftArrow = wrapper.scrollLeft > 10;
    this.showRightArrow = wrapper.scrollLeft < (wrapper.scrollWidth - wrapper.clientWidth - 10);
  }

  filterByCategory(categoryId: any) {
    this.selectedCategoryId = categoryId === 'null' ? null : categoryId;
    this.loadGalleries();
  }

  loadGalleries() {
    this.loading = true;
    const params: any = { page: 1, limit: 100 };
    if (this.selectedCategoryId) {
      params.categoryId = this.selectedCategoryId;
    }
    this.galleryService
      .getAll(params.page, params.limit, params.categoryId)
      .subscribe({
        next: (res) => {
          this.galleries = res.data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  async createGallery() {
    const alert = await this.alertCtrl.create({
      header: 'Nueva Galería',
      inputs: [
        { name: 'name', placeholder: 'Nombre de la galería' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Siguiente',
          handler: (data) => {
            if (data.name) {
              if (this.categories.length > 0) {
                this.selectCategoryForGallery(data.name);
              } else {
                this.galleryService
                  .create(data.name, null)
                  .subscribe(() => this.loadGalleries());
              }
              return true;
            }
            return false;
          },
        },
      ],
    });
    await alert.present();
  }

  async selectCategoryForGallery(galleryName: string) {
    const inputs: any[] = [
      {
        name: 'categoryId',
        type: 'radio',
        label: 'Sin categoría',
        value: null,
        checked: true,
      },
    ];

    this.categories.forEach((cat) => {
      inputs.push({
        name: 'categoryId',
        type: 'radio',
        label: cat.name,
        value: cat.id,
      });
    });

    const alert = await this.alertCtrl.create({
      header: 'Seleccionar categoría',
      message: `Para "${galleryName}"`,
      inputs,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Crear',
          handler: (categoryId) => {
            this.galleryService
              .create(galleryName, categoryId)
              .subscribe(() => {
                if (categoryId) {
                  this.selectedCategoryId = categoryId;
                }
                this.loadGalleries();
              });
          },
        },
      ],
    });
    await alert.present();
  }

  goToCategories() {
    this.router.navigate(['/categories']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  getCoverImage(gallery: any): string {
    // Prioridad 1: Imagen de portada personalizada
    if (gallery.coverImage) {
      return gallery.coverImage;
    }
    
    // Si no hay imágenes en la galería, no hay portada
    if (!gallery.images || gallery.images.length === 0) {
      return '';
    }

    // Prioridad 2: Imagen seleccionada de la galería
    if (gallery.coverImageId) {
      const coverImg = gallery.images.find(
        (img: any) => img.id === gallery.coverImageId
      );
      if (coverImg) {
        return coverImg.imageFile;
      }
    }

    // Prioridad 3: Primera imagen de la galería
    return gallery.images[0].imageFile;
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
          handler: () => this.editGallery(gallery),
        },
        {
          text: 'Mover',
          handler: () => this.moveGallery(gallery),
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            const imageCount = gallery.images?.length || 0;
            const message =
              imageCount > 0
                ? `Esta galería contiene ${imageCount} imagen${
                    imageCount > 1 ? 'es' : ''
                  }. Se eliminarán permanentemente.`
                : '¿Eliminar esta galería?';

            const alert = await this.alertCtrl.create({
              header: '¿Eliminar galería?',
              message: message,
              buttons: [
                { text: 'Cancelar', role: 'cancel' },
                {
                  text: 'Eliminar',
                  role: 'destructive',
                  handler: () =>
                    this.galleryService
                      .delete(gallery.id)
                      .subscribe(() => this.loadGalleries()),
                },
              ],
            });
            await alert.present();
          },
        },
        { text: 'Cancelar', role: 'cancel' },
      ],
    });
    await actionSheet.present();
  }

  async editGallery(gallery: any) {
    const alert = await this.alertCtrl.create({
      header: 'Editar Galería',
      inputs: [
        {
          name: 'name',
          value: gallery.name,
          placeholder: 'Nombre de la galería',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Cambiar portada',
          handler: (data) => {
            if (data.name && data.name !== gallery.name) {
              this.galleryService
                .update(gallery.id, { name: data.name })
                .subscribe(() => this.loadGalleries());
            }
            this.changeCoverImage(gallery);
            return false;
          },
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.name) {
              this.galleryService
                .update(gallery.id, { name: data.name })
                .subscribe(() => this.loadGalleries());
            }
          },
        },
      ],
    });
    await alert.present();
  }

  changeCoverImage(gallery: any) {
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
        const formData = new FormData();
        formData.append('coverImage', file);
        this.galleryService
          .update(gallery.id, formData)
          .subscribe(() => this.loadGalleries());
      }
    };
    input.click();
  }

  async moveGallery(gallery: any) {
    const inputs: any[] = [
      {
        name: 'categoryId',
        type: 'radio',
        label: 'Sin categoría',
        value: null,
        checked: !gallery.categoryId,
      },
    ];

    this.categories.forEach((cat) => {
      inputs.push({
        name: 'categoryId',
        type: 'radio',
        label: cat.name,
        value: cat.id,
        checked: gallery.categoryId === cat.id,
      });
    });

    const alert = await this.alertCtrl.create({
      header: 'Mover a',
      message: `Selecciona la categoría para "${gallery.name}"`,
      inputs,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Mover',
          handler: (data) => {
            this.galleryService
              .update(gallery.id, { categoryId: data })
              .subscribe(() => this.loadGalleries());
          },
        },
      ],
    });
    await alert.present();
  }
}
