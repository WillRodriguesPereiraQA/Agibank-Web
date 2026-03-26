import { test, expect } from './fixtures';
import { AgibankCasesPage } from '../page/agibank-cases-page';

test.describe('Blog do Agi - Pesquisa de artigos', () => {
  test('Validar a exibição com sucesso do artigo sobre diminuição da parcela do empréstimo consignado', async ({
    page
  }) => {
    const blog = new AgibankCasesPage(page);
    await blog.open();
    await blog.acceptCookiesIfPresent();
    await blog.assertSearchAvailable();

    const term = 'diminuir a parcela do empréstimo consignado';
    await blog.goToSearchResults(term);

    await expect(page).toHaveURL(new RegExp(`[?&]s=${encodeURIComponent(term)}`, 'i'));
    await blog.assertHasResults();
    await expect(page.locator('main')).toContainText(/empréstimo consignado/i);

    await blog.openArticleByTitle(/como reduzir parcela de empréstimo consignado\??/i);
    await blog.assertOnArticle(/como reduzir parcela de empréstimo consignado/i);
    await blog.assertArticleContainsTexts([
      'É possível reduzir o valor do consignado?',
      'Como reduzir parcela de empréstimo consignado',
      'Cuidado com propostas enganosas'
    ]);
  });
  
  test('Validar que a simulação de empréstimo pessoal funciona com sucesso', async ({ page }) => {
    const blog = new AgibankCasesPage(page);
    await blog.open();
    await blog.acceptCookiesIfPresent();

    // A lupa de pesquisa (canto superior direito) deve existir (pré-condição)
    await blog.assertSearchAvailable();

    const term = 'simulação do empréstimo pessoal';
    await blog.goToSearchResults(term);

    await expect(page).toHaveURL(new RegExp(`[?&]s=${encodeURIComponent(term)}`, 'i'));

    await blog.assertHasResults();

    await expect(page.locator('main')).toContainText(/empréstimo pessoal/i);

    await blog.openArticleByTitle(
      /simulação do empréstimo pessoal: o que olhar além do valor da parcela/i
    );
    await blog.assertOnArticle(
      /simulação do empréstimo pessoal: o que olhar além do valor da parcela/i
    );

    await blog.openInternalLoanSimulationLink();
    await blog.assertOnLoanSimulationPage();
    await blog.assertLoanLeadFormVisible();
    await blog.fillLoanLeadFormWithRandomData();
    await blog.submitLoanLeadForm();
  });
});

