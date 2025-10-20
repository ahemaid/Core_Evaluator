import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../../pages/HomePage';
import { AuthProvider } from '../../context/AuthContext';

// Mock the translation hook
vi.mock('../../utils/translations', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock the auth context
const mockAuthContext = {
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user',
    language: 'ar',
    isApproved: true,
    rewardPoints: 100,
  },
  login: vi.fn(),
  logout: vi.fn(),
  loading: false,
};

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockAuthContext,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const renderHomePage = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the main title', () => {
    renderHomePage();
    expect(screen.getByText(/home.title/)).toBeInTheDocument();
  });

  it('renders the search form', () => {
    renderHomePage();
    expect(screen.getByLabelText(/home.country/)).toBeInTheDocument();
    expect(screen.getByLabelText(/home.category/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /home.search/ })).toBeInTheDocument();
  });

  it('renders service categories', () => {
    renderHomePage();
    expect(screen.getByText(/home.browseByCategory/)).toBeInTheDocument();
    // Check for category icons (they should be rendered as buttons)
    const categoryButtons = screen.getAllByRole('button');
    expect(categoryButtons.length).toBeGreaterThan(0);
  });

  it('renders features section', () => {
    renderHomePage();
    expect(screen.getByText(/home.whyChoose/)).toBeInTheDocument();
    expect(screen.getByText(/features.verifiedProviders/)).toBeInTheDocument();
    expect(screen.getByText(/features.transparentReviews/)).toBeInTheDocument();
    expect(screen.getByText(/features.expertEvaluations/)).toBeInTheDocument();
  });

  it('renders stats section', () => {
    renderHomePage();
    expect(screen.getByText(/home.stats.verifiedProviders/)).toBeInTheDocument();
    expect(screen.getByText(/home.stats.happyCustomers/)).toBeInTheDocument();
    expect(screen.getByText(/home.stats.averageRating/)).toBeInTheDocument();
  });

  it('renders CTA section', () => {
    renderHomePage();
    expect(screen.getByText(/home.ctaTitle/)).toBeInTheDocument();
    expect(screen.getByText(/home.startSearching/)).toBeInTheDocument();
    expect(screen.getByText(/home.createAccount/)).toBeInTheDocument();
  });

  it('renders blog section', () => {
    renderHomePage();
    expect(screen.getByText(/home.latestBlogs/)).toBeInTheDocument();
    // Check for blog posts
    const blogLinks = screen.getAllByText(/home.readMore/);
    expect(blogLinks.length).toBeGreaterThan(0);
  });

  it('handles search form submission', async () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
      };
    });

    renderHomePage();
    
    const searchButton = screen.getByRole('button', { name: /home.search/ });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/search');
    });
  });

  it('displays animated counters', async () => {
    renderHomePage();
    
    // Wait for counters to animate
    await waitFor(() => {
      const providerCount = screen.getByText(/25000/);
      expect(providerCount).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('handles category selection', () => {
    renderHomePage();
    
    const categorySelect = screen.getByLabelText(/home.category/);
    fireEvent.change(categorySelect, { target: { value: 'healthcare' } });
    
    expect(categorySelect).toHaveValue('healthcare');
  });

  it('handles country selection', () => {
    renderHomePage();
    
    const countrySelect = screen.getByLabelText(/home.country/);
    fireEvent.change(countrySelect, { target: { value: 'Algeria' } });
    
    expect(countrySelect).toHaveValue('Algeria');
  });

  it('renders with RTL direction for Arabic user', () => {
    renderHomePage();
    
    const mainContainer = screen.getByRole('main') || document.body;
    expect(mainContainer).toHaveAttribute('dir', 'rtl');
  });

  it('renders with LTR direction for non-Arabic user', () => {
    // Mock user with English language
    mockAuthContext.user.language = 'en';
    
    renderHomePage();
    
    const mainContainer = screen.getByRole('main') || document.body;
    expect(mainContainer).toHaveAttribute('dir', 'ltr');
  });
});
