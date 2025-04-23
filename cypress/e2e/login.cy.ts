describe('LoginComponent E2E Tests', () => {

  // Visita directamente la URL completa para evitar errores de ruta
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  });

  it('debería mostrar el título de Login', () => {
    cy.contains('h2', 'Login').should('be.visible');
  });

  it('debería validar campos vacíos', () => {
    cy.get('input[formControlName="email"]').focus().blur();
    cy.get('input[formControlName="password"]').focus().blur();

    cy.contains('Email inválido').should('exist');
    cy.contains('Mínimo 8 caracteres').should('exist');
  });

  it('debería mostrar error por email inválido', () => {
    cy.get('input[formControlName="email"]').type('correo-no-valido').blur();
    cy.get('input[formControlName="password"]').type('password123');

    cy.contains('Email inválido').should('exist');
  });

  it('debería mostrar error por contraseña demasiado corta', () => {
    cy.get('input[formControlName="email"]').type('test@email.com');
    cy.get('input[formControlName="password"]').type('123').blur();

    cy.contains('Mínimo 8 caracteres').should('exist');
  });

  it('debería deshabilitar el botón si el formulario es inválido', () => {
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('debería hacer login exitosamente', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' }
    }).as('loginRequest');

    cy.get('input[formControlName="email"]').type('usuario@test.com');
    cy.get('input[formControlName="password"]').type('passwordValido123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.url().should('include', '/home');
  });

  it('debería mostrar mensaje de error en login fallido', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 401,
      body: { message: 'Credenciales inválidas' }
    }).as('loginRequestFail');

    cy.get('input[formControlName="email"]').type('usuario@test.com');
    cy.get('input[formControlName="password"]').type('passwordErronea');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequestFail');
    cy.contains('Credenciales inválidas').should('be.visible');
  });

});
