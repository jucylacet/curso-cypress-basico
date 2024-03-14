// <reference types="Cypress" />

//O bloco describe define a suíte de testes, 
//e o bloco it, define um caso de teste.

describe('Central de Atendimento ao Cliente TAT', function() {
    // Antes de cada teste executa essa função
    beforeEach(function() { 
        cy.visit('./src/index.html')
    })
    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal','Central de Atendimento ao Cliente TAT')
    })
    it('preenche os campos obrigatorios e envia o formulário', function(){
        const longText = " Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
        cy.get('#firstName').type("Nome")
        cy.get('#lastName').type("Sobrenome")
        cy.get('#email').type("email@email.com")
        //No objeto de options que podemos passar ao comando 
        //.type(), é possível sobrescrever o delay padrão por outro valor (em milissegundos).
        cy.get('#open-text-area').type(longText, {delay: 0})
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')
    })
    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
        cy.get('#firstName').type("Nome")
        cy.get('#lastName').type("Sobrenome")
        cy.get('#email').type("email@email,com")
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })
    it('campo telefone continua vazio quando preenchido com valor não numérico', function(){
        cy.get('#phone')
        .type('abcdefghij')
        .should('have.value', '')
    })
    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
        cy.get('#firstName').type("Nome")
        cy.get('#lastName').type("Sobrenome")
        cy.get('#email').type("email@email.com")
        cy.get('#phone-checkbox').click()
        cy.get('#open-text-area').type('Teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })
    it('preenche e limpa os campos nome, sobrenome, email e telefone', function(){
        cy.get('#firstName')
            .type("Nome")
            .should('have.value', "Nome")
            .clear()
            .should('have.value', '')
        cy.get('#lastName')
            .type("Sobrenome")
            .should('have.value', "Sobrenome")
            .clear()
            .should('have.value', '')
        cy.get('#email')
            .type("email@email.com")
            .should('have.value', "email@email.com")
            .clear()
            .should('have.value', '')
        cy.get('#phone')
            .type("1234567890")
            .should('have.value', "1234567890")
            .clear()
            .should('have.value', '')
    })
    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })
    it('envia o form com sucesso usando um comando customizado', function(){
        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')
    })
  })
  