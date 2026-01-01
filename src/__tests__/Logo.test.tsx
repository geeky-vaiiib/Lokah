import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Logo from '@/components/Logo';
import { BrowserRouter } from 'react-router-dom';

describe('Logo', () => {
    it('renders LOKAH text in default variant', () => {
        render(<Logo />);
        expect(screen.getByText('Lokah')).toBeInTheDocument();
    });

    it('renders with link wrapper when asLink is true', () => {
        render(
            <BrowserRouter>
                <Logo asLink />
            </BrowserRouter>
        );
        // Find the link by role
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/');
    });

    it('renders standard size by default', () => {
        render(<Logo size={50} />);
        const text = screen.getByText('Lokah');
        // We check if style contains font-size. 
        // Note: The implementation applies fontSize to the span.
        expect(text).toHaveStyle({ fontSize: '50px' });
    });
});
