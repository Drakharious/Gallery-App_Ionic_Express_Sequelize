import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: false
})
export class CategoriesPage implements OnInit {

  categories: any[] = [];
  loading = false;

  constructor(
    private router: Router,
    private categoryService: CategoryService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  ionViewWillEnter() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (res) => {
        this.categories = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  async createCategory() {
    const alert = await this.alertCtrl.create({
      header: 'Nueva Categoría',
      inputs: [
        { name: 'name', placeholder: 'Nombre' },
        { name: 'description', placeholder: 'Descripción (opcional)' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Crear',
          handler: (data) => {
            if (data.name) {
              this.categoryService.create(data.name, data.description).subscribe(() => this.loadCategories());
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async editCategory(category: any, event: Event) {
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Editar Categoría',
      inputs: [
        { name: 'name', value: category.name, placeholder: 'Nombre' },
        { name: 'description', value: category.description, placeholder: 'Descripción' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (data.name) {
              this.categoryService.update(category.id, data.name, data.description).subscribe(() => this.loadCategories());
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteCategory(category: any, event: Event) {
    event.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar categoría?',
      message: 'Las galerías asociadas quedarán sin categoría',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.categoryService.delete(category.id).subscribe(() => this.loadCategories())
        }
      ]
    });
    await alert.present();
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
