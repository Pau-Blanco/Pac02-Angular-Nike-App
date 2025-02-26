import { Component, type OnInit } from '@angular/core';
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

export class AdminComponent {
  productForm: FormGroup
  isEditing = false
  categories = ["Electronics", "Clothing", "Books", "Food", "Other"]

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
  ) {
    this.productForm = this.createForm()
  }

  ngOnInit(): void { }

  createForm(): FormGroup {
    return this.fb.group({
      name: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      serialNumber: ["", [Validators.required, Validators.pattern("^[A-Z0-9]{6,10}$")]],
      price: ["", [Validators.required, Validators.min(0)]],
      description: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      category: ["", Validators.required],
      inStock: [true],
      imageUrl: ["", Validators.required],
    })
  }

  onSerialNumberChange(): void {
    const serialNumber = this.productForm.get("serialNumber")?.value
    if (serialNumber) {
      const existingProduct = this.productService.getProductBySerialNumber(serialNumber)
      if (existingProduct) {
        this.isEditing = true
        this.productForm.patchValue(existingProduct)
      } else {
        this.isEditing = false
      }
    }
  }

  async onImageUpload(event: any): Promise<void> {
    const file = event.target.files[0]
    if (file) {
      // Here you would typically upload to your image server
      // For demo purposes, we'll use a placeholder
      const imageUrl = "/placeholder.svg"
      this.productForm.patchValue({ imageUrl })
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value

      if (this.isEditing) {
        this.productService.updateProduct(product)
      } else {
        this.productService.addProduct(product)
      }

      this.productForm.reset()
      this.isEditing = false
    } else {
      Object.keys(this.productForm.controls).forEach((key) => {
        const control = this.productForm.get(key)
        if (control?.invalid) {
          control.markAsTouched()
        }
      })
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.productForm.get(controlName)
    if (control?.errors) {
      if (control.errors["required"]) return "Este campo es obligatorio"
      if (control.errors["minlength"]) return `Mínimo ${control.errors["minlength"].requiredLength} caracteres`
      if (control.errors["maxlength"]) return `Máximo ${control.errors["maxlength"].requiredLength} caracteres`
      if (control.errors["min"]) return "El valor no puede ser negativo"
      if (control.errors["pattern"]) return "Formato de número de serie inválido"
    }
    return ""
  }
}
