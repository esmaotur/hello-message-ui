import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("uygulama açıldığında", () => {
  cy.visit("http://localhost:3000");
});

When("mesaj listesi yüklenirse", () => {
  cy.contains("Hello Message System", { timeout: 10000 }).should("be.visible");
});


Then("kullanıcı mesajları görebilmelidir", () => {
  cy.get("li").should("have.length.greaterThan", 0);
});
