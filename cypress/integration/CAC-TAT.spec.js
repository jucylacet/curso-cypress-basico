// <reference types="Cypress" />

//O bloco describe define a suíte de testes,
//e o bloco it, define um caso de teste.

describe("Central de Atendimento ao Cliente TAT", function () {
  const THREE_SECONDS_IN_MS=3000;
  // Antes de cada teste executa essa função
  beforeEach(function () {
    cy.visit("./src/index.html");
  });
  it("verifica o título da aplicação", function () {
    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
  });
  it("preenche os campos obrigatorios e envia o formulário", function () {
    const longText =
      " Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

    cy.clock();

    cy.get("#firstName").type("Nome");
    cy.get("#lastName").type("Sobrenome");
    cy.get("#email").type("email@email.com");
    //No objeto de options que podemos passar ao comando
    //.type(), é possível sobrescrever o delay padrão por outro valor (em milissegundos).
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.contains("button", "Enviar").click();

    cy.get(".success").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".success").should("not.be.visible");


  });
  it("exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", function () {
    cy.clock();
    cy.get("#firstName").type("Nome");
    cy.get("#lastName").type("Sobrenome");
    cy.get("#email").type("email@email,com");
    cy.get("#open-text-area").type("Teste");
    cy.contains("button", "Enviar").click();

    cy.get(".error").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");

  });
  Cypress._.times(3, function() {
    it("campo telefone continua vazio quando preenchido com valor não numérico", function () {
      cy.get("#phone")
      .type("abcdefghij")
      .should("have.value", "");
    });
  })

  it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", function () {
    cy.clock();

    cy.get("#firstName").type("Nome");
    cy.get("#lastName").type("Sobrenome");
    cy.get("#email").type("email@email.com");
    cy.get("#phone-checkbox").check();
    cy.get("#open-text-area").type("Teste");
    cy.contains("button", "Enviar").click();

    cy.get(".error").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");

  });
  it("preenche e limpa os campos nome, sobrenome, email e telefone", function () {
    cy.get("#firstName")
      .type("Nome")
      .should("have.value", "Nome")
      .clear()
      .should("have.value", "");
    cy.get("#lastName")
      .type("Sobrenome")
      .should("have.value", "Sobrenome")
      .clear()
      .should("have.value", "");
    cy.get("#email")
      .type("email@email.com")
      .should("have.value", "email@email.com")
      .clear()
      .should("have.value", "");
    cy.get("#phone")
      .type("1234567890")
      .should("have.value", "1234567890")
      .clear()
      .should("have.value", "");
  });
  it("exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", function () {
    cy.clock();
    cy.contains("button", "Enviar").click();

    cy.get(".error").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");
  });
  it("envia o form com sucesso usando um comando customizado", function () {
    cy.clock();
    cy.fillMandatoryFieldsAndSubmit();

    cy.get(".success").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");
  });

  // Testes em input tipo SELECT
  it("Seleciona um produto (Youtube) por seu texto", function () {
    cy.get("#product")
      // Não passou no teste com valor do texto Youtube
      .select("youtube")
      .should("have.value", "youtube");
  });
  it("Seleciona um produto (Mentoria) pelo seu valor", function () {
    cy.get("#product").select("mentoria").should("have.value", "mentoria");
  });
  it("Seleciona um produto (Blog) pelo seu índice", function () {
    cy.get("#product").select(1).should("have.value", "blog");
  });

  //Testes em input tipo RADIO
  it("Marca o tipo de atendimento 'Feedback' ", function () {
    cy.get(":nth-child(4) > input").check().should("have.value", "feedback");
  });
  it("Marca cada tipo de atendimento", function () {
    cy.get('input[type="radio"]')
      .should("have.length", 3)
      .each(function ($radio) {
        cy.wrap($radio).check();
        cy.wrap($radio).should("be.checked");
      });
  });
  //Testes em input tipo CHECKBOX
  it("Marca ambos checkboxes, depois desmarca o ultimo", function () {
    cy.get('input[type="checkbox"]')
      .check()
      .should("be.checked")
      .last()
      .uncheck()
      .should("not.be.checked");
  });
  //Fazendo upload de arquivos
  it("Seleciona um arquivo da pasta fixtures", function () {
    cy.get("#file-upload")
      //verifica se não tem file
      .should("not.have.value")
      //upload de arquivo
      .selectFile("cypress/fixtures/example.json")
      .should(function (input) {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });
  it("Seleciona um arquivo simulando drag-and-drop", function () {
    cy.get("#file-upload")
      .should("not.have.value")
      .selectFile("cypress/fixtures/example.json", { action: "drag-drop" })
      .should(function (input) {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });
  it("Seleciona um arquivo utilizando uma fixture para a qual foi dada um alias", function () {
    cy.fixture("example.json").as("sampleFile");
    cy.get("#file-upload")
      .selectFile("@sampleFile")
      .should(function (input) {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });
  // Lidando com links que abrem em outra aba
  it("Verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", function () {
    cy.get("#privacy a").should("have.attr", "target", "_blank");
  });
  it("Acessa a página da política de privacidade removendo o target e então clicando no link", function () {
    cy.get("#privacy a")
    .invoke('removeAttr', 'target')
    .click();
    //Verificação na mesma aba
    cy.contains("Talking About Testing").should("be.visible");
  });
  it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', function() {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })
  it("preenche a area de texto usando o comando invoke", function () {
    //repeat para repetir a string
    const longText = Cypress._.repeat('0123456789', 20)
    cy.get('#open-text-area')
    //invocar o valor de um input de texto e setamos
    .invoke('val', longText)
    .should('have.value', longText)
  })
  it("faz uma requisição HTTP", function(){
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
    .should(function(response){
      const {status, statusText, headers, body} = response
      expect(status).to.equal(200)
      expect(statusText).to.equal('OK')
      expect(body).to.include('CAC TAT')
    })
  })
  it.only("Encontrar o gato e demonstrar que ele está visível.", function () {
      cy.get('#cat')
        .invoke('show')
        .should('be.visible')
  });
});
