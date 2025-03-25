import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import type { Product } from '../../models/product.interface';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  productForm: FormGroup;
  isEditing = false;
  categories = ["Zapatos", "Ropa", "Accesorios", "Other"];
  productId: number | null = null; // Para almacenar el ID del producto al editar

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.createForm();
  }

  ngOnInit(): void { }

  createForm(): FormGroup {
    return this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      serialNumber: ["", [Validators.required, Validators.maxLength(9)]], // Corrección en la validación
      price: ["", [Validators.required, Validators.min(0)]],
      description: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      category: ["", Validators.required],
      inStock: [true],
      imageUrl: ["", Validators.required],
    });
  }

  onSerialNumberChange(): void {
    const serialNumber = this.productForm.get("serialNumber")?.value;
    if (serialNumber) {
      this.productService.getProductBySerialNumber(serialNumber).subscribe(
        (product) => {
          if (product) {
            this.isEditing = true;
            this.productId = product.id; // Guardamos el ID del producto para actualizarlo después
            this.productForm.patchValue(product);
          } else {
            this.isEditing = false;
            this.productId = null;
          }
        },
        (error) => console.error("Error al buscar producto:", error)
      );
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product: Product = {
        ...this.productForm.value,
        id: this.isEditing && this.productId !== null ? this.productId : undefined,
      };

      if (this.isEditing && this.productId !== null) {
        this.productService.updateProduct(product).subscribe(() => { // Pasamos solo el objeto `product`
          console.log("Producto actualizado");
          this.resetForm();
        });
      } else {
        this.productService.addProduct(product).subscribe(() => {
          console.log("Producto agregado");
          this.resetForm();
        });
      }
    } else {
      Object.keys(this.productForm.controls).forEach((key) => {
        const control = this.productForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }


  resetForm(): void {
    this.productForm.reset();
    this.isEditing = false;
    this.productId = null;
  }

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
