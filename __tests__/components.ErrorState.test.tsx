import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { ErrorState } from '../src/components/ErrorState';

describe('ErrorState', () => {
  it('renders message and triggers retry', () => {
    const onRetry = jest.fn();
    const { getByText } = render(<ErrorState message="Network error" onRetry={onRetry} />);

    expect(getByText('Network error')).toBeTruthy();

    fireEvent.press(getByText('Try again'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
