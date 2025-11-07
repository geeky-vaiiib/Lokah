import { render } from '@testing-library/react';
import MoodBackground from '@/components/MoodBackground';

describe('MoodBackground', () => {
  it('renders without crashing', () => {
    const { container } = render(<MoodBackground />);
    expect(container.firstChild).toBeTruthy();
  });
});
