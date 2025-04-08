import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.interface';
import { HttpRequest } from '@angular/common/http';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const dummyToken = 'fake-jwt-token';
  const apiUrl = 'http://localhost:3000/api/products';

  beforeEach(() => {
    // Mock de localStorage
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'authToken') {
        return dummyToken;
      }
      return null;
    });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all products', () => {
    const dummyProducts: Product[] = [
      { id: 1, name: 'P1', serial_number: 'SN1', price: 100, description: 'Desc1', category: 'Cat1', in_stock: 5, image_url: 'img1' },
      { id: 2, name: 'P2', serial_number: 'SN2', price: 200, description: 'Desc2', category: 'Cat2', in_stock: 10, image_url: 'img2' },
    ];

    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(dummyProducts);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProducts);
  });

  it('should get a product by serial number', () => {
    const dummyProduct: Product = {
      id: 1,
      name: 'P1',
      serial_number: 'SN123',
      price: 150,
      description: 'Test',
      category: 'Cat',
      in_stock: 3,
      image_url: 'img'
    };

    service.getProductBySerialNumber('SN123').subscribe(product => {
      expect(product).toEqual(dummyProduct);
    });

    const req = httpMock.expectOne(`${apiUrl}?serial_number=SN123`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyProduct);
  });

  it('should add a product with token', () => {
    const newProduct = { name: 'New Product', price: 50 };

    service.addProduct(newProduct).subscribe(res => {
      expect(res).toEqual({ success: true });
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${dummyToken}`);
    expect(req.request.body).toEqual(newProduct);

    req.flush({ success: true });
  });

  it('should update a product with token', () => {
    const updatedProduct: Product = {
      id: 1,
      name: 'Updated',
      serial_number: 'SN100',
      price: 999,
      description: 'Updated Desc',
      category: 'Updated Cat',
      in_stock: 1,
      image_url: 'img'
    };

    service.updateProduct(updatedProduct).subscribe(res => {
      expect(res).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(`${apiUrl}/SN100`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${dummyToken}`);
    expect(req.request.body).toEqual(updatedProduct);

    req.flush(updatedProduct);
  });

  it('should delete a product with token', () => {
    const serialNumber = 'SN200';

    service.deleteProduct(serialNumber).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/${serialNumber}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${dummyToken}`);

    req.flush(null);
  });

});
