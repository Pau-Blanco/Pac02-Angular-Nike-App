describe('template spec', () => {
  // Visita directamente la URL completa para evitar errores de ruta
  beforeEach(() => {
    cy.visit('http://localhost:4200/admin');
  });

  it('Debería crear un producto exitosamente', () => {
    cy.intercept('POST', '/api/products').as('addProduct'); // Asegúrate de usar la URL correcta

    cy.get('input[formControlName="name"]').type('Zapatillas Deportivas');
    cy.get('input[formControlName="serial_number"]').type('01');
    cy.get('input[formControlName="price"]').type('79.99');
    cy.get('textarea[formControlName="description"]').type('Zapatillas de deporte cómodas y ligeras.');
    cy.get('select[formControlName="category"]').select('Zapatos');
    cy.get('input[formControlName="image_url"]').type('https://example.com/zapato.jpg');
    cy.get('input[formControlName="in_stock"]').clear().type('15');

    cy.get('button[type="submit"]').click();

    cy.wait('@addProduct').its('response.statusCode').should('eq', 200);

    cy.on('window:alert', (str) => {
      expect(str).to.equal('Producto agregado correctamente');
    });
  });
});