describe('Fluxo de Agendamento', () => {
  beforeEach(() => {
    // Login antes de cada teste
    cy.task('firebase:auth:signIn', {
      email: Cypress.env('TEST_USER_EMAIL') || 'test@example.com',
      password: Cypress.env('TEST_USER_PASSWORD') || 'password123'
    }).then((userCredential) => {
      if (userCredential) {
        // Definir o localStorage com o token e informações do usuário
        window.localStorage.setItem('authUser', JSON.stringify(userCredential.user));
        window.localStorage.setItem('authToken', userCredential.token);
      }
    });

    // Interceptar chamadas de API relevantes
    cy.intercept('GET', '**/doctors', { fixture: 'doctors.json' }).as('getDoctors');
    cy.intercept('GET', '**/patients', { fixture: 'patients.json' }).as('getPatients');
    cy.intercept('POST', '**/appointments', { statusCode: 201, body: { id: 'new-appointment-id' } }).as('createAppointment');
  });

  it('Deve criar um novo agendamento com sucesso', () => {
    // Visitar a página de novo agendamento
    cy.visit('/dashboard/agendar');

    // Esperar pelos dados carregarem
    cy.wait('@getDoctors');
    cy.wait('@getPatients');

    // Selecionar um médico
    cy.get('[data-testid=doctor-select]').click();
    cy.get('.MuiAutocomplete-popper').contains('Dr. João Silva').click();

    // Selecionar um paciente
    cy.get('[data-testid=patient-select]').click();
    cy.get('.MuiAutocomplete-popper').contains('Maria Oliveira').click();

    // Selecionar uma data no calendário
    cy.get('[data-testid=calendar-day]').eq(15).click();

    // Selecionar um tipo de consulta
    cy.get('[data-testid=appointment-type-select]').click();
    cy.get('.MuiMenu-list').contains('Consulta').click();

    // Adicionar observações
    cy.get('[data-testid=notes-field]').type('Consulta para check-up anual');

    // Adicionar sintomas
    cy.get('[data-testid=symptom-field]').type('Dor de cabeça');
    cy.get('[data-testid=add-symptom-button]').click();
    cy.get('[data-testid=symptom-field]').type('Febre');
    cy.get('[data-testid=add-symptom-button]').click();

    // Verificar se os sintomas foram adicionados
    cy.get('[data-testid=symptom-chip]').should('have.length', 2);

    // Enviar o formulário
    cy.get('[data-testid=submit-button]').click();

    // Verificar se a requisição foi feita corretamente
    cy.wait('@createAppointment').its('request.body').should('include', {
      medicoId: Cypress.sinon.match.string,
      pacienteId: Cypress.sinon.match.string,
      tipo: 'consultation',
      observacoes: 'Consulta para check-up anual',
    });

    // Verificar se o usuário é redirecionado para a agenda
    cy.url().should('include', '/dashboard/agenda');

    // Verificar se a mensagem de sucesso é exibida
    cy.get('.MuiAlert-standardSuccess').should('be.visible');
  });

  it('Deve exibir erros de validação para campos obrigatórios', () => {
    // Visitar a página de novo agendamento
    cy.visit('/dashboard/agendar');

    // Tentar enviar o formulário sem preencher os campos
    cy.get('[data-testid=submit-button]').click();

    // Verificar se as mensagens de erro são exibidas
    cy.get('.MuiFormHelperText-root').should('be.visible');
    cy.get('.MuiAlert-standardError').should('be.visible')
      .and('contain.text', 'Por favor, preencha todos os campos obrigatórios');
  });

  it('Deve permitir cancelar o agendamento', () => {
    // Visitar a página de novo agendamento
    cy.visit('/dashboard/agendar');

    // Clicar no botão de cancelar
    cy.get('[data-testid=cancel-button]').click();

    // Verificar se o usuário é redirecionado para a agenda
    cy.url().should('include', '/dashboard/agenda');
  });
}); 