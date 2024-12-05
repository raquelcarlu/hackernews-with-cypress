# Automatizando aplicação que integra com a API Hacker News

![image](https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white)

Automação de testes end-to-end da aplicação em questão (disponibilizada no curso avançado de testes automatizados com Cypress da Escola TAT) com Cypress.

**Objetivo:**

* Demonstrar as capacidades do Cypress na automação de testes web
* Aplicar a funcionalidade `cy.intercept()`
* Testar cenários de erro
* Realizar testes onde a resposta devolvida pela API é "mockada"

**Tecnologias utilizadas:**

* Cypress
* Node.js
* npm

**Estrutura do projeto:**

* `cypress`: Diretório principal dos testes Cypress. Contém os arquivos de teste organizados por funcionalidades.
* `package.json`: Arquivo de configuração do projeto. Define as dependências e scripts para execução dos testes.

**Como executar os testes:**

1. Clone este repositório.
2. Instale as dependências: `npm install`.
3. Execute os testes no modo headless: `npm run test`.
4. Ou execute os testes visualmente: `npm run cy:open`. 

**Características deste projeto:**

1. Simulação de situações de erro (de servidor e de rede);
2. Conferência se um termo está sendo buscado no servidor ou na cache;
3. Buscas via API Hacker News;
4. Testes sendo feitos na API e testes feitos na API "mockada";
5. Aplicação da funcionalidade `cy.intercept()`;
6. Garantir que um elemento está visível antes de interagir com o mesmo;
7. Organização com Page Elements.


