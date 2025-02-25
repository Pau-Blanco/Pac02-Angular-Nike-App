import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Products } from '../../models/products';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-admin',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})

export class AdminComponent {

  productForm: FormGroup;

  producto: Products = {
    reference: '',
    name: '',
    price: 0,
    description: '',
    category: '',
    sale: false,
    image: ''
  };

  constructor(private fb: FormBuilder)
  {
    this.productForm = this.fb.group({
      reference: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: [1, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      category: ['', [Validators.required]],
      sale: [false],
      image: ['', [Validators.required]]
    })
  }

  onSubmit()
  {
    this.producto = {
      reference: this.productForm.value.reference || '',
      name: this.productForm.value.name || '',
      price: this.productForm.value.price || 1,
      description: this.productForm.value.description || '',
      category: this.productForm.value.category || '',
      sale: this.productForm.value.sale || false,
      image: this.productForm.value.image || ''
    };

    console.log('Producto guardado', this.producto);
    this.productForm.reset();
  }
}
