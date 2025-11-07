import { render } from '@testing-library/react';
import { GlassButton } from '@/components/GlassButton';
import '@testing-library/jest-dom';

describe('GlassButton', () => {
  it('renders label text', () => {
    const { getByText } = render(<GlassButton label="Start" />);
    const el = getByText('Start');
    expect(el).toBeInTheDocument();
  });
});
