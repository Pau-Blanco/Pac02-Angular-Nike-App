import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ProductService } from '../../services/product.service';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let mockProductService: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    mockProductService = jasmine.createSpyObj('ProductService', ['addProduct', 'getProductBySerialNumber', 'updateProduct', 'deleteProduct']);

    await TestBed.configureTestingModule({
      imports: [AdminComponent, ReactiveFormsModule],
      providers: [
        { provide: ProductService, useValue: mockProductService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call addProduct when form is valid and submitted', () => {
    // Arrange: Simulamos que addProduct devuelve un observable exitoso
    mockProductService.addProduct.and.returnValue(of({}));

    // Llenamos el formulario
    component.productForm.setValue({
      name: 'Nike Zoom',
      serial_number: 'SN12345',
      price: 150,
      description: 'Zapatilla de alto rendimiento',
      category: 'Zapatos',
      in_stock: 10,
      image_url: 'https://nike.com/zapato.jpg'
    });

    // Act: llamamos al submit
    component.onSubmit();

    // Assert: verificamos que addProduct fue llamado con el objeto correcto
    expect(mockProductService.addProduct).toHaveBeenCalledWith({
      id: null, // porque es un nuevo producto
      name: 'Nike Zoom',
      serial_number: 'SN12345',
      price: 150,
      description: 'Zapatilla de alto rendimiento',
      category: 'Zapatos',
      in_stock: 10,
      image_url: 'https://nike.com/zapato.jpg'
    });
  });

  it('should not call addProduct when form is invalid', () => {
    // Formulario incompleto
    component.productForm.setValue({
      name: '',
      serial_number: '',
      price: null,
      description: '',
      category: '',
      in_stock: null,
      image_url: ''
    });

    component.onSubmit();

    expect(mockProductService.addProduct).not.toHaveBeenCalled();
  });

});
