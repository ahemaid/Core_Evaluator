import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has title', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/ServicePro/);
  });

  test('displays main hero section', async ({ page }) => {
    // Check for main title
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for search form
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('select')).toHaveCount(3); // Country, Category, City
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('displays service categories', async ({ page }) => {
    // Check for categories section
    await expect(page.locator('text=home.browseByCategory')).toBeVisible();
    
    // Check for category buttons
    const categoryButtons = page.locator('button').filter({ hasText: /healthcare|restaurants|education|beauty|automotive|home/i });
    await expect(categoryButtons.first()).toBeVisible();
  });

  test('displays features section', async ({ page }) => {
    // Check for features section
    await expect(page.locator('text=home.whyChoose')).toBeVisible();
    
    // Check for feature items
    await expect(page.locator('text=features.verifiedProviders')).toBeVisible();
    await expect(page.locator('text=features.transparentReviews')).toBeVisible();
    await expect(page.locator('text=features.expertEvaluations')).toBeVisible();
  });

  test('displays stats section', async ({ page }) => {
    // Check for stats section
    await expect(page.locator('text=home.stats.verifiedProviders')).toBeVisible();
    await expect(page.locator('text=home.stats.happyCustomers')).toBeVisible();
    await expect(page.locator('text=home.stats.averageRating')).toBeVisible();
  });

  test('displays CTA section', async ({ page }) => {
    // Check for CTA section
    await expect(page.locator('text=home.ctaTitle')).toBeVisible();
    await expect(page.locator('text=home.startSearching')).toBeVisible();
    await expect(page.locator('text=home.createAccount')).toBeVisible();
  });

  test('displays blog section', async ({ page }) => {
    // Check for blog section
    await expect(page.locator('text=home.latestBlogs')).toBeVisible();
    
    // Check for blog posts
    const blogPosts = page.locator('text=home.readMore');
    await expect(blogPosts.first()).toBeVisible();
  });

  test('search form functionality', async ({ page }) => {
    // Select country
    await page.selectOption('select:first-of-type', 'Algeria');
    
    // Select category
    await page.selectOption('select:nth-of-type(2)', 'healthcare');
    
    // Submit search
    await page.click('button[type="submit"]');
    
    // Should navigate to search page
    await expect(page).toHaveURL(/.*search.*/);
  });

  test('category navigation', async ({ page }) => {
    // Click on a category button
    const categoryButton = page.locator('button').filter({ hasText: /healthcare/i }).first();
    await categoryButton.click();
    
    // Should navigate to search page with category filter
    await expect(page).toHaveURL(/.*search.*category=healthcare/);
  });

  test('CTA button navigation', async ({ page }) => {
    // Click start searching button
    await page.click('text=home.startSearching');
    
    // Should navigate to search page
    await expect(page).toHaveURL(/.*search/);
  });

  test('create account button navigation', async ({ page }) => {
    // Click create account button
    await page.click('text=home.createAccount');
    
    // Should navigate to register page
    await expect(page).toHaveURL(/.*register/);
  });

  test('blog post navigation', async ({ page }) => {
    // Click on a blog post
    const blogLink = page.locator('text=home.readMore').first();
    await blogLink.click();
    
    // Should navigate to blog page
    await expect(page).toHaveURL(/.*blog/);
  });

  test('responsive design - mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that main elements are still visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('text=home.browseByCategory')).toBeVisible();
  });

  test('responsive design - tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Check that main elements are still visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('text=home.browseByCategory')).toBeVisible();
  });

  test('animated counters', async ({ page }) => {
    // Wait for counters to animate
    await page.waitForTimeout(2000);
    
    // Check that stats numbers are visible
    const statsNumbers = page.locator('text=/\\d+/').filter({ hasText: /25000|100000|4\\.9/ });
    await expect(statsNumbers.first()).toBeVisible();
  });

  test('RTL layout for Arabic', async ({ page }) => {
    // Check that the page has RTL direction
    const body = page.locator('body');
    await expect(body).toHaveAttribute('dir', 'rtl');
  });
});
