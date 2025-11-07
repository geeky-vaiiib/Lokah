import { render } from '@testing-library/react';
import LogoWordmark from '@/components/LogoWordmark';

describe('LogoWordmark', () => {
  it('renders L and KAH around O', () => {
    const { getByText } = render(<LogoWordmark size={24} />);
    expect(getByText('L')).toBeInTheDocument();
    expect(getByText('KAH')).toBeInTheDocument();
  });
});
