import { expect, type Locator, type Page } from '@playwright/test';

export class AgibankCasesPage {
  readonly page: Page;
  readonly baseUrl = 'https://blogdoagi.com.br/';

  readonly searchButton: Locator;
  readonly searchInput: Locator;
  readonly articles: Locator;
  readonly noResultsText: Locator;
  readonly acceptCookiesButton: Locator;
  readonly internalLoanSimulationLink: Locator;
  readonly loanFormHeading: Locator;
  readonly loanNameInput: Locator;
  readonly loanEmailInput: Locator;
  readonly loanWhatsappInput: Locator;
  readonly loanProfileSelect: Locator;
  readonly loanSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header "lupa": no snapshot do site aparece como botão acessível "Search button"
    this.searchButton = page.getByRole('button', { name: /pesquisar|search/i });

    // Campo de busca
    this.searchInput = page.locator('input[type="search"], input[name="s"]').first();

    this.articles = page.locator('main article');

    this.noResultsText = page.locator(
      'text=/lamentamos|nada foi encontrado|nenhum resultado|nada encontrado|não encontramos|nothing found|no results/i'
    );

    this.acceptCookiesButton = page
      .getByRole('button', { name: /aceitar|concordo|accept/i })
      .first();

    this.internalLoanSimulationLink = page
      .locator('main')
      .getByRole('link', { name: /^simulação do empréstimo pessoal$/i })
      .first();
    this.loanFormHeading = page.getByText(/preencha seus dados e receba sua oferta personalizada!/i);
    this.loanNameInput = page.getByLabel(/nome/i).first();
    this.loanEmailInput = page.getByLabel(/e-?mail/i).first();
    this.loanWhatsappInput = page.getByLabel(/celular.*whatsapp/i).first();
    this.loanProfileSelect = page.getByRole('combobox').first();
    this.loanSubmitButton = page
      .getByRole('button', { name: /solicitar análise|solicitar analise/i })
      .first();
  }

  async open(): Promise<void> {
    await this.page.goto(this.baseUrl, { waitUntil: 'domcontentloaded' });
  }

  async acceptCookiesIfPresent(): Promise<void> {
    if (await this.acceptCookiesButton.isVisible().catch(() => false)) {
      await this.acceptCookiesButton.click();
    }
  }

  searchUrl(term: string): string {
    return `${this.baseUrl}?s=${encodeURIComponent(term)}`;
  }

  async assertSearchAvailable(): Promise<void> {
    await expect(this.searchButton.first()).toBeVisible();
  }

  async goToSearchResults(term: string): Promise<void> {
    const url = this.searchUrl(term);
    try {
      await this.page.goto(url, { waitUntil: 'commit' });
      await this.page.waitForLoadState('domcontentloaded');
    } catch (err) {
      await this.page.waitForTimeout(500);
      await this.page.goto(url, { waitUntil: 'commit' });
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  async assertHasResults(): Promise<void> {
    await expect(this.articles.first()).toBeVisible();
  }

  async assertNoResults(): Promise<void> {
    await expect(this.noResultsText.first()).toBeVisible();
  }

  async openArticleByTitle(title: string | RegExp): Promise<void> {
    const link = this.page.locator('main').getByRole('link', { name: title }).first();
    await expect(link).toBeVisible();
    await link.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async assertOnArticle(title: string | RegExp): Promise<void> {
    await expect(this.page).not.toHaveURL(/(\?|&)s=|search/i);
    await expect(this.page.getByRole('heading', { level: 1 })).toContainText(title);
  }

  async assertArticleContainsTexts(texts: string[]): Promise<void> {
    const content = this.page.locator('main');
    await expect(content).toBeVisible();
    for (const t of texts) {
      await expect(content).toContainText(t);
    }
  }

  async openInternalLoanSimulationLink(): Promise<void> {
    await expect(this.internalLoanSimulationLink).toBeVisible();
    const href = await this.internalLoanSimulationLink.getAttribute('href');
    if (href) {
      await this.page.goto(href, { waitUntil: 'domcontentloaded' });
      return;
    }
    await this.internalLoanSimulationLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async assertOnLoanSimulationPage(): Promise<void> {
    await expect(this.page).toHaveURL(/agibank\.com\.br\/emprestimo-pessoal/i);
  }

  async assertLoanLeadFormVisible(): Promise<void> {
    await expect(this.loanFormHeading).toBeVisible();
    await expect(this.loanNameInput).toBeVisible();
    await expect(this.loanEmailInput).toBeVisible();
    await expect(this.loanWhatsappInput).toBeVisible();
    await expect(this.loanProfileSelect).toBeVisible();
    await expect(this.loanSubmitButton).toBeVisible();
  }

  async fillLoanLeadFormWithRandomData(): Promise<void> {
    const random = Math.floor(100000 + Math.random() * 900000);
    const name = `Teste Automacao`;
    const email = `teste.automacao.${random}@mailinator.com`;
    const whatsapp = `1199${Math.floor(1000000 + Math.random() * 9000000)}`;

    await this.loanNameInput.fill(name);
    await this.loanEmailInput.fill(email);
    await this.loanWhatsappInput.fill(whatsapp);

    await this.loanProfileSelect.click();
    await this.page.getByRole('option', { name: /outro|outros/i }).first().click();
  }

  async submitLoanLeadForm(): Promise<void> {
    // Dispara o clique e tenta capturar um popup (caso o link abra em nova aba/janela).
    const popupPromise = this.page.waitForEvent('popup', { timeout: 3000 }).catch(() => undefined);
    await this.loanSubmitButton.click();

    const popup = await popupPromise;

    const whatsappRegex = /(api\.whatsapp\.com|wa\.me|web\.whatsapp\.com)/i;

    if (popup) {
      await popup.waitForLoadState('domcontentloaded');
      await expect(popup).toHaveURL(whatsappRegex);
    } else {
      // Se não houve popup, validar a URL da própria página atual.
      await this.page.waitForLoadState('domcontentloaded');
      await expect(this.page).toHaveURL(whatsappRegex);
    }
  }
}

