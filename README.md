# Agibank
## Teste técnico QA – Web

*Testes realizados em uma máquina WINDOWS*

Este projeto automatiza dois cenários do blog do Agi usando testes que simulam ações de um usuário comum. Em linguagem simples:

- Teste 1: Procura por um artigo sobre como diminuir a parcela do empréstimo consignado e confirma que o artigo correto aparece e contém textos esperados.
- Teste 2: Encontra o artigo sobre simulação de empréstimo pessoal, abre o link de simulação, verifica se o formulário aparece, preenche com dados fictícios e envia.

Os testes seguem passos parecidos com o que um usuário faria no navegador: abrir o site, aceitar cookies (se aparecer), usar a busca, abrir artigos e interagir com o formulário de simulação.

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

## Relatório de execução dos testes

Após a execução local ou no CI, um relatório HTML é gerado na pasta `playwright-report`.

- Localmente:
  - Gere e abra o relatório com:
    ```bash
    npx playwright test
    npx playwright show-report
    ```
  - Se a porta padrão estiver em uso, abra com outra porta: `npx playwright show-report --port 9324`.

- No GitHub Actions (workflow configurado):
  - O workflow salva a pasta `playwright-report` como artefato do run.
  - Baixe o artefato no resumo do run para inspecionar o relatório HTML.

Informações incluídas no relatório:
- Status de cada teste (pass/fail/skipped)
- Vídeos e screenshots quando habilitados
- Erros e stack traces para facilitar debugging

## Demais considerações pertinentes ao teste

- Ambiente: os testes foram desenvolvidos para rodar em Windows localmente e em Linux no CI (Ubuntu). Ajustes de comportamento entre sistemas podem ocorrer.
- Navegadores: o CI executa testes em headless; localmente você pode usar `--headed` para ver o navegador.
- Dependências externas: alguns fluxos interagem com serviços externos (ex.: link para WhatsApp). Esses serviços podem alterar comportamento ou bloquear acessos em ambiente CI.
- Dados de teste: o e-mail usa `mailinator.com` e o número de WhatsApp é fictício. 

