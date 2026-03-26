# Agibank
## Teste técnico QA – Web

Este projeto automatiza dois cenários do blog do Agi usando testes que simulam ações de um usuário comum. Em linguagem simples:

- Teste 1: Procura por um artigo sobre como diminuir a parcela do empréstimo consignado e confirma que o artigo correto aparece e contém textos esperados.
- Teste 2: Encontra o artigo sobre simulação de empréstimo pessoal, abre o link de simulação, verifica se o formulário aparece, preenche com dados fictícios e envia.

Os testes seguem passos parecidos com o que um usuário faria no navegador: abrir o site, aceitar cookies (se aparecer), usar a busca, abrir artigos e interagir com o formulário de simulação.

A validação final da simulação de empréstimo pessoal é o direcionamento para a API do Whatsapp Web.

Métodos principais usados (nomes técnicos, apenas para referência):

- open
- acceptCookiesIfPresent
- assertSearchAvailable
- goToSearchResults
- assertHasResults
- openArticleByTitle
- assertOnArticle
- assertArticleContainsTexts
- openInternalLoanSimulationLink
- assertOnLoanSimulationPage
- assertLoanLeadFormVisible
- fillLoanLeadFormWithRandomData
- submitLoanLeadForm

Obs: Anexei as evidências em prints e um vídeo no projeto.

### Requisitos
- Node.js

### Instalação
```bash
npm install
npx playwright install
```

### Rodando os testes
```bash
npx playwright test tests/agibank-cases.spec.ts --headed
```

### Relatório HTML
```bash
npx playwright show-report
```
