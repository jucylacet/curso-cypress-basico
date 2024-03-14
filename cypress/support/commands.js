Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){
    cy.get('#firstName').type("Nome")
    cy.get('#lastName').type("Sobrenome")
    cy.get('#email').type("email@email.com")
    cy.get('#open-text-area').type('Teste')
    cy.contains('button', 'Enviar').click()
})