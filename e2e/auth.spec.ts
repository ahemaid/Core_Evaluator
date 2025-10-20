import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Login Flow', () => {
    test('should navigate to login page', async ({ page }) => {
      // Click on login button (assuming there's one in the header)
      await page.click('text=Login');
      
      // Should navigate to login page
      await expect(page).toHaveURL(/.*login/);
    });

    test('should display login form', async ({ page }) => {
      await page.goto('/login');
      
      // Check for login form elements
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      await page.goto('/login');
      
      // Enter invalid email
      await page.fill('input[type="email"]', 'invalid-email');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Should show validation error
      await expect(page.locator('text=Please provide a valid email')).toBeVisible();
    });

    test('should validate required fields', async ({ page }) => {
      await page.goto('/login');
      
      // Submit empty form
      await page.click('button[type="submit"]');
      
      // Should show validation errors
      await expect(page.locator('text=Password is required')).toBeVisible();
    });

    test('should handle invalid credentials', async ({ page }) => {
      await page.goto('/login');
      
      // Enter invalid credentials
      await page.fill('input[type="email"]', 'wrong@example.com');
      await page.fill('input[type="password"]', 'wrongpassword');
      await page.click('button[type="submit"]');
      
      // Should show error message
      await expect(page.locator('text=Invalid credentials')).toBeVisible();
    });

    test('should login successfully with valid credentials', async ({ page }) => {
      await page.goto('/login');
      
      // Mock successful login response
      await page.route('**/api/auth/login', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            token: 'mock-token',
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              role: 'user',
              language: 'ar',
              isApproved: true,
              rewardPoints: 100
            }
          })
        });
      });
      
      // Enter valid credentials
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Should redirect to dashboard or home
      await expect(page).toHaveURL(/.*dashboard|.*home/);
    });
  });

  test.describe('Registration Flow', () => {
    test('should navigate to register page', async ({ page }) => {
      // Click on register button
      await page.click('text=Register');
      
      // Should navigate to register page
      await expect(page).toHaveURL(/.*register/);
    });

    test('should display registration form', async ({ page }) => {
      await page.goto('/register');
      
      // Check for registration form elements
      await expect(page.locator('input[name="name"]')).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('input[name="phone"]')).toBeVisible();
      await expect(page.locator('select[name="role"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should validate registration form', async ({ page }) => {
      await page.goto('/register');
      
      // Submit empty form
      await page.click('button[type="submit"]');
      
      // Should show validation errors
      await expect(page.locator('text=Name must be at least 2 characters')).toBeVisible();
      await expect(page.locator('text=Please provide a valid email')).toBeVisible();
      await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
    });

    test('should validate password length', async ({ page }) => {
      await page.goto('/register');
      
      // Enter short password
      await page.fill('input[type="password"]', '123');
      await page.click('button[type="submit"]');
      
      // Should show validation error
      await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
      await page.goto('/register');
      
      // Enter invalid email
      await page.fill('input[type="email"]', 'invalid-email');
      await page.click('button[type="submit"]');
      
      // Should show validation error
      await expect(page.locator('text=Please provide a valid email')).toBeVisible();
    });

    test('should register successfully', async ({ page }) => {
      await page.goto('/register');
      
      // Mock successful registration response
      await page.route('**/api/auth/register', async route => {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            token: 'mock-token',
            user: {
              id: '1',
              name: 'New User',
              email: 'new@example.com',
              role: 'user',
              language: 'ar',
              isApproved: 'pending',
              rewardPoints: 0
            }
          })
        });
      });
      
      // Fill registration form
      await page.fill('input[name="name"]', 'New User');
      await page.fill('input[type="email"]', 'new@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.fill('input[name="phone"]', '+1234567890');
      await page.selectOption('select[name="role"]', 'user');
      await page.click('button[type="submit"]');
      
      // Should redirect to dashboard or show success message
      await expect(page).toHaveURL(/.*dashboard|.*home/);
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing protected route', async ({ page }) => {
      // Try to access dashboard without authentication
      await page.goto('/dashboard');
      
      // Should redirect to login page
      await expect(page).toHaveURL(/.*login/);
    });

    test('should access protected route after login', async ({ page }) => {
      // Mock login
      await page.route('**/api/auth/login', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            token: 'mock-token',
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              role: 'user',
              language: 'ar',
              isApproved: true,
              rewardPoints: 100
            }
          })
        });
      });

      // Login first
      await page.goto('/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Now access dashboard
      await page.goto('/dashboard');
      
      // Should be able to access dashboard
      await expect(page).toHaveURL(/.*dashboard/);
    });
  });

  test.describe('Logout', () => {
    test('should logout successfully', async ({ page }) => {
      // Mock login
      await page.route('**/api/auth/login', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            token: 'mock-token',
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              role: 'user',
              language: 'ar',
              isApproved: true,
              rewardPoints: 100
            }
          })
        });
      });

      // Login first
      await page.goto('/login');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Click logout button
      await page.click('text=Logout');
      
      // Should redirect to home page
      await expect(page).toHaveURL(/.*home|.*\//);
    });
  });
});
