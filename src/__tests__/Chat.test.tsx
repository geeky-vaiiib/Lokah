import { render } from '@testing-library/react';
import Chat from '@/pages/Chat';
import { BrowserRouter } from 'react-router-dom';

describe('Chat Page', () => {
  it('renders loader when missing state', () => {
    const { getByRole } = render(
      <BrowserRouter>
        <Chat />
      </BrowserRouter>
    );
    // Loader should be present initially while data fetch simulated
    expect(getByRole('status')).toBeTruthy();
  });
});
