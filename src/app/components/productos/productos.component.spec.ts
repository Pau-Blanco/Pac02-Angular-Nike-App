import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductosComponent } from './productos.component';
import { ProductService } from '../../services/product.service';
import { ChartService } from '../../services/chart.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import type { Product } from '../../models/product.interface';

describe('ProductosComponent', () => {
  let component: ProductosComponent;
  let fixture: ComponentFixture<ProductosComponent>;
  let mockProductService: any;
  let mockChartService: any;

  const dummyProducts: Product[] = [
    {
      id: 1,
      name: 'Nike Air Max',
      description: 'Zapatillas deportivas',
      price: 120,
      category: 'Calzado',
      serial_number: 'SN123',
      image_url: 'image1.jpg',
      in_stock: 5,
      quantity: 1,
    },
    {
      id: 2,
      name: 'Nike Hoodie',
      description: 'Sudadera cómoda',
      price: 80,
      category: 'Ropa',
      serial_number: 'SN456',
      image_url: 'image2.jpg',
      in_stock: 0,
      quantity: 1,
    }
  ];

  beforeEach(async () => {
    mockProductService = {
      getProducts: jasmine.createSpy('getProducts').and.returnValue(of(dummyProducts))
    };

    mockChartService = {
      addToCart: jasmine.createSpy('addToCart').and.returnValue(of({ success: true }))
    };

    await TestBed.configureTestingModule({
      imports: [ProductosComponent, ReactiveFormsModule, FormsModule],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: ChartService, useValue: mockChartService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(component.products.length).toBe(2);
    expect(component.filteredProducts.length).toBe(2);
  });

  it('should filter products based on search input', fakeAsync(() => {
    component.searchControl.setValue('hoodie');
    tick(300); // debounceTime
    fixture.detectChanges();
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toBe('Nike Hoodie');
  }));

  it('should show "No se encontraron productos" when no matches', fakeAsync(() => {
    component.searchControl.setValue('noexiste');
    tick(300);
    fixture.detectChanges();
    const noResults = fixture.debugElement.query(By.css('p.text-gray-500'));
    expect(noResults.nativeElement.textContent).toContain('No se encontraron productos');
  }));

  it('should call addToCart when button is clicked with valid quantity', () => {
    const product = component.filteredProducts[0]; // tiene stock
    product.quantity = 2;
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    buttons[0].nativeElement.click();

    expect(mockChartService.addToCart).toHaveBeenCalledWith(product.id, product.quantity);
  });

  it('should not call addToCart with invalid quantity', () => {
    const product = component.filteredProducts[0];
    product.quantity = 0; // inválido
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    buttons[0].nativeElement.click();

    expect(mockChartService.addToCart).not.toHaveBeenCalled();
  });

});
