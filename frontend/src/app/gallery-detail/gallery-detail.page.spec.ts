import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GalleryDetailPage } from './gallery-detail.page';

describe('GalleryDetailPage', () => {
  let component: GalleryDetailPage;
  let fixture: ComponentFixture<GalleryDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
