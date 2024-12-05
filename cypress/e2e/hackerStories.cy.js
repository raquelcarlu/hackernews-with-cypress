import pageElements from '../support/pageElements'

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
      cy.get(pageElements.table).should('have.length', 101)

      cy.contains('More')
        .should('be.visible')
        .click()

      cy.wait('@getMoreStories')

      cy.get(pageElements.table).should('have.length', 201)
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

      cy.get(pageElements.table).eq(1)
        .should('contain', stories.hits[0].title)
        .and('contain', stories.hits[0].author)
        .and('contain', stories.hits[0].num_comments)
        .and('contain', stories.hits[0].points)

      cy.get(pageElements.table).eq(2)
        .should('contain', stories.hits[1].title)
        .and('contain', stories.hits[1].author)
        .and('contain', stories.hits[1].num_comments)
        .and('contain', stories.hits[1].points)

      cy.get(pageElements.table).eq(3)
        .should('contain', stories.hits[2].title)
        .and('contain', stories.hits[2].author)
        .and('contain', stories.hits[2].num_comments)
        .and('contain', stories.hits[2].points)

      cy.get(pageElements.table).eq(4)
        .should('contain', stories.hits[3].title)
        .and('contain', stories.hits[3].author)
        .and('contain', stories.hits[3].num_comments)
        .and('contain', stories.hits[3].points)
    })

    it('mostra uma história a menos após clicar em "Dismiss" para uma história', () => {
      cy.get(pageElements.firstDismissButton)
        .should('be.visible')
        .click()

      cy.get(pageElements.table).should('have.length', 4)
    })

    context('Ordenação', () => {
      it('ordenar por título', () => { 
        cy.get(pageElements.titleButton)
          .as('titleHeader')
          .should('be.visible')
          .click()
  
        cy.get(pageElements.table).eq(1)
          .should('be.visible')
          .and('contain', stories.hits[1].title)
  
        cy.get('@titleHeader')
          .click()
  
        cy.get(pageElements.table).eq(1)
          .should('be.visible')
          .and('contain', stories.hits[0].title)
      })
  
      it('ordenar por autor', () => {
        cy.get(pageElements.authorButton)
          .as('authorHeader')
          .should('be.visible')
          .click()

        cy.get(pageElements.table).eq(1)
          .should('be.visible')
          .and('contain', stories.hits[0].author)

        cy.get('@authorHeader')
          .click()

        cy.get(pageElements.table).eq(1)
          .should('be.visible')
          .and('contain', stories.hits[2].author)
      })
  
      it('ordenar por número de comentários', () => {
        cy.get(pageElements.commentsButton)
          .should('be.visible')
          .as('commentsHeader')
          .click()

        cy.get(pageElements.table).eq(1)
          .should('be.visible')
          .and('contain', stories.hits[1].num_comments)

        cy.get('@commentsHeader')
          .click()

        cy.get(pageElements.table).eq(1)
          .should('be.visible')
          .and('contain', stories.hits[3].num_comments)
      })
  
      it('ordenar por número de pontos', () => {
        cy.get(pageElements.pointsButton)
          .should('be.visible')
          .as('pointsHeader')
          .click()

        cy.get(pageElements.table).eq(1)
          .should('be.visible')
          .and('contain', stories.hits[0].points)

        cy.get('@pointsHeader')
          .click()

        cy.get(pageElements.table).eq(1)
          .should('be.visible')
          .and('contain', stories.hits[3].points)
      })
    })

    context('Pesquisa', () => {
      beforeEach(() => {
        cy.intercept(
          'GET',
          `**/search?query=${initialTerm}*`,
          { fixture: 'empty' }
        ).as('getEmptyStories')

        cy.intercept(
          'GET',
          `**/search?query=${newTerm}*`,
          { fixture: 'stories' }
        ).as('getNewStoriesMock')
  
        cy.visit('/')
        cy.wait('@getEmptyStories')
        cy.get('input')
          .should('be.visible')
          .clear()
      })
  
      it('mostrar nenhuma história quando nenhuma história for encontrada', () => {
        cy.get(pageElements.table).should('have.length', 1)
      })
  
      it('pesquisar depois de digitar e clicar em ENTER', () => {
        cy.get(pageElements.searchInput)
          .should('be.visible')
          .type(`${newTerm}{enter}`)

        cy.wait('@getNewStoriesMock')

        cy.get(pageElements.table).should('have.length', 5)
      })
  
      it('pesquisar depois de digitar e clicar no botão "Search"', () => {
        cy.get(pageElements.searchInput)
          .should('be.visible')
          .type(newTerm)
        cy.get(pageElements.serachButton)
          .should('be.visible')
          .click()
        
        cy.wait('@getNewStoriesMock')

        cy.get(pageElements.table).should('have.length', 5)
      })
  
      it('pesquisar e submeter a pesquisa diretamente', () => {
        cy.get(pageElements.searchInput)
          .should('be.visible')
          .clear()
          .type(newTerm)
        cy.get('form').submit()

        cy.wait('@getNewStoriesMock')

        cy.get(pageElements.table).should('have.length', 5)
      })

      it('verificar se pesquisa está sendo salva na memória cache', () => {
        const { faker } = require('@faker-js/faker')
        const randomTerm = faker.word.sample()
        let count = 0

        cy.intercept(`**/search?query=${randomTerm}**`, req => {
          count +=1
          req.reply({fixture: 'empty'})
        }).as('random')

        cy.search(randomTerm).then(() => {
          expect(count, `network calls to fetch ${randomTerm}`).to.equal(1)

          cy.wait('@random')

          cy.search(newTerm)
          cy.wait('@getNewStoriesMock')

          cy.search(randomTerm).then(() => {
            expect(count, `network calls to fetch ${randomTerm}`).to.equal(1)
          })
        })
      })
    })
  })

  context('Erros', () => {
    it('server error', () => {
      cy.intercept(
        'GET',
        '**/search*',
        { statusCode: 500 }
      ).as('getServerError')

      cy.visit('/')
      cy.wait('@getServerError')

      cy.get('p:contains("Something went wrong")').should('be.visible')
    })

    it('network error', () => {
      cy.intercept(
        'GET',
        '**/search*',
        { forceNetworkError: true }
      ).as('getNetworkError')

      cy.visit('/')
      cy.wait('@getNetworkError')

      cy.get('p:contains("Something went wrong")').should('be.visible')
    })
  })
})
