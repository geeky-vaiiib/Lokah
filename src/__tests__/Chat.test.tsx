import { render } from '@testing-library/react';
import Chat from '@/pages/Chat';
import { BrowserRouter } from 'react-router-dom';

describe('Chat Page', () => {
  it('renders loader when missing state', () => {
    const { container } = render(
      <BrowserRouter>
        <Chat />
      </BrowserRouter>
    );
    // Loader should be present initially while data fetch simulated
    // Check for the loading spinner with aria-busy attribute
    const loadingContainer = container.querySelector('[aria-busy="true"]');
    expect(loadingContainer).toBeTruthy();
  });
});
