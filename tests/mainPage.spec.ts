import { test, expect, Locator } from '@playwright/test';

interface Element {
  locator: (page: Page) => Locator;
  name: string;
  text?: string;
  attribute?: {
    type: string;
    value: string;
  };
}

const elements: Elements[] = [
  {
    locator: (page: Page): Locator =>
      page.getByRole('link', { name: 'Playwright logo Playwright' }),
    name: 'Playwright logo link',
    text: 'Playwright',
    attributes: {
      type: 'href',
      value: '/',
    },
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'Docs' }),
    name: 'Docs link',
    text: 'Docs',
    attributes: {
      type: 'href',
      value: '/docs/intro',
    },
  },
  {
    // exact: true обязателен: на странице две ссылки «MCP», без этого тест падает
    locator: (page: Page): Locator => page.getByRole('link', { name: 'MCP', exact: true }),
    name: 'MCP link',
    text: 'MCP',
    attributes: {
      type: 'href',
      value: '/mcp/introduction',
    },
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'API' }),
    name: 'API link',
    text: 'API',
    attributes: {
      type: 'href',
      value: '/docs/api/class-playwright',
    },
  },
  {
    locator: (page: Page): Locator => page.getByRole('button', { name: 'Node.js' }),
    name: 'Node.js link',
    text: 'Node.js',
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'GitHub repository' }),
    name: 'GitHub repository link',
    attributes: {
      type: 'href',
      value: 'https://github.com/microsoft/playwright',
    },
  },
  {
    locator: (page: Page): Locator => page.getByRole('link', { name: 'Discord server' }),
    name: 'Discord server link',
    attributes: {
      type: 'href',
      value: 'https://aka.ms/playwright/discord',
    },
  },
  {
    locator: (page: Page): Locator =>
      page.getByRole('button', { name: 'Switch between dark and light' }),
    name: 'Switch between dark and light link',
  },
  {
    locator: (page: Page): Locator => page.getByRole('button', { name: 'Search (Control+k)' }),
    name: 'Search (Control+k) link',
  },
];

test.describe('Тесты главной страницы', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://playwright.dev/');
  });

  // Проверка видимости всех элементов из массива
  test('Проверка отображения элементов навигации хедера', async ({ page }) => {
    for (const { locator, name } of elements) {
      await test.step(`Проверить элемент: ${name}`, async () => {
        await expect.soft(locator(page)).toBeVisible({ timeout: 10000 });
      });
    }
  });
  test('Проверка текстов элементов навигации', async ({ page }) => {
    for (const { locator, name, text } of elements) {
      if (text) {
        await test.step(`Проверка текста: ${name}`, async () => {
          await expect(locator(page)).toContainText(text);
        });
      }
    }
  });

  test('Тест по проверке атрибутов href', async ({ page }) => {
    for (const { locator, name, attributes } of elements) {
      if (attributes) {
        await test.step(`Проверка атрибутов href элемента: ${name}`, async () => {
          await expect(locator(page)).toHaveAttribute(attributes.type, attributes.value);
        });
      }
    }
  });

  // Проверка заголовка
  test('Тест заголовка страницы', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Playwright enables reliable' })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Playwright enables reliable' })).toContainText(
      'Playwright enables reliable web automation for testing, scripting, and AI agents.',
    );
  });

  ['light', 'dark'].forEach((value) => {
    // переключение день+ночь со скринами
    test(`Скриншот в теме ${value}`, async ({ page }) => {
      await page.evaluate(
        (theme) => document.documentElement.setAttribute('data-theme', theme),
        value,
      );
      await page.screenshot({ path: `modal-active-${value}.png`, fullPage: true });
    });
  });
});
