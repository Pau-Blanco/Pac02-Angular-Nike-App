import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import type { Product } from '../../models/product.interface';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  productForm: FormGroup;
  productId: number | null = null;
  categories: string[] = ['Zapatos', 'Ropa', 'Accesorios', 'Other'];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      serial_number: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      category: ['', Validators.required],
      in_stock: [10, [Validators.required, Validators.min(0)]],
      image_url: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  // Función que se llama cuando el número de serie cambia
  onSerialNumberChange(): void {
    const serial_number = this.productForm.get('serial_number')?.value;
    if (!serial_number) return;

    this.productService.getProductBySerialNumber(serial_number).subscribe(
      (products) => {
        // Verificar que hemos recibido un array y no un objeto vacío
        if (Array.isArray(products) && products.length > 0) {
          // Filtrar el producto por número de serie
          const product = products.find(p => p.serial_number === serial_number);

          if (product) {
            console.log('Producto encontrado:', product); // Verifica el producto encontrado
            this.productId = product.id;
            this.productForm.patchValue({
              name: product.name,
              serial_number: product.serial_number,
              price: product.price,
              description: product.description,
              category: product.category,
              in_stock: product.in_stock,
              image_url: product.image_url,
            });
          } else {
            // Si no encontramos el producto con ese número de serie
            this.productId = null;
            this.productForm.reset({ serial_number });
          }
        } else {
          // Si no se encuentra ningún producto en el array
          this.productId = null;
          this.productForm.reset({ serial_number });
        }
      },
      (error) => {
        console.error('Error al buscar el producto:', error);
      }
    );
  }

  // Función para manejar el envío del formulario
  onSubmit(): void {
    if (this.productForm.invalid) return;

    const product = { ...this.productForm.value, id: this.productId };

    if (this.productId) {
      this.productService.updateProduct(product).subscribe(
        () => {
          alert('Producto actualizado correctamente');
          this.productForm.reset();
          this.productId = null;
        },
        (error) => {
          console.error('Error al actualizar producto:', error);
        }
      );
    } else {
      this.productService.addProduct(product).subscribe(
        () => {
          alert('Producto agregado correctamente');
          this.productForm.reset();
        },
        (error) => {
          console.error('Error al agregar producto:', error);
        }
      );
    }
  }

  // Función para eliminar el producto
  onDelete(): void {
    const serial_number = this.productForm.get('serial_number')?.value;

    if (!serial_number) {
      alert('No se ha seleccionado un producto');
      return;
    }

    this.productService.deleteProduct(serial_number).subscribe(
      () => {
        alert('Producto eliminado correctamente');
        this.productForm.reset();
        this.productId = null;
      },
      (error) => {
        console.error('Error al eliminar producto:', error);
      }
    );
  }


  // Obtener mensaje de error para validación de formulario
  getErrorMessage(controlName: string): string {
    const control = this.productForm.get(controlName);
    if (control?.errors) {
      if (control.errors["required"]) return "Este campo es obligatorio";
      if (control.errors["minlength"]) return `Mínimo ${control.errors["minlength"].requiredLength} caracteres`;
      if (control.errors["maxlength"]) return `Máximo ${control.errors["maxlength"].requiredLength} caracteres`;
      if (control.errors["min"]) return "El valor no puede ser negativo";
    }
    return "";
  }
}
