Cypress.Commands.add('search', term => {
    cy.get('input')
        .should('be.visible')
        .clear()
        .type(`${term}{enter}`)
})