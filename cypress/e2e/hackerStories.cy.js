describe('Hacker Stories', () => {
  const initialTerm = 'redux'
  const newTerm = 'cypress'
  const stories = require('../fixtures/stories.json')

  context('API real', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'GET',
        pathname: '**/search',
        query: {
          query: 'redux',
          page: '0'
        }
      }).as('getStoriesReal')

      cy.visit('/')
      cy.wait('@getStoriesReal')
    })

    it('mostrar 100 histórias e depois mais 100 depois de clicar em "More"', () => {
      cy.intercept({
        method: 'GET',
        pathname: '**/search',
        query: {
          query: initialTerm,
          page: '1'
        }
      }).as('getMoreStories')
      cy.get('.table > *').should('have.length', 101)

      cy.contains('More')
        .should('be.visible')
        .click()

      cy.wait('@getMoreStories')

      cy.get('.table > *').should('have.length', 201)
    })
  })

  context('API mock', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `**/search?query=${initialTerm}*`,
        { fixture: 'stories' }
      ).as('getStoriesMock')

      cy.visit('/')
      cy.wait('@getStoriesMock')
    })
    it('mostra a história certa para cada história renderizada', () => {

      cy.get('.table > *').eq(1)
        .should('contain', stories.hits[0].title)
        .and('contain', stories.hits[0].author)
        .and('contain', stories.hits[0].num_comments)
        .and('contain', stories.hits[0].points)

      cy.get('.table > *').eq(2)
        .should('contain', stories.hits[1].title)
        .and('contain', stories.hits[1].author)
        .and('contain', stories.hits[1].num_comments)
        .and('contain', stories.hits[1].points)

      cy.get('.table > *').eq(3)
        .should('contain', stories.hits[2].title)
        .and('contain', stories.hits[2].author)
        .and('contain', stories.hits[2].num_comments)
        .and('contain', stories.hits[2].points)

      cy.get('.table > *').eq(4)
        .should('contain', stories.hits[3].title)
        .and('contain', stories.hits[3].author)
        .and('contain', stories.hits[3].num_comments)
        .and('contain', stories.hits[3].points)
    })

    it('mostra uma história a menos após clicar em "Dismiss" para uma história', () => {
      cy.get(':nth-child(2) > :nth-child(5) > .button-inline')
        .should('be.visible')
        .click()

      cy.get('.table > *').should('have.length', 4)
    })
  })

  context('Ordenação', () => {
    it.skip('ordenar por título', () => { })

    it.skip('ordenar por autor', () => { })

    it.skip('ordenar por número de comentários', () => { })

    it.skip('ordenar por número de pontos', () => { })
  })

  context('Pesquisa', () => {
    it.skip('mostrar nenhuma história quando nenhuma história for encontrada', () => { })

    it.skip('pesquisar depois de digitar e clicar em ENTER', () => { })

    it.skip('pesquisar depois de digitar e clicar no botão "Search"', () => { })

    it.skip('pesquisar e submeter a pesquisa diretamente', () => { })
  })


  context('Erros', () => {
    it.skip('server error', () => { })

    it.skip('network error', () => { })
  })
})
