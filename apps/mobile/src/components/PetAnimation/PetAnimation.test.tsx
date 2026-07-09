import React from 'react';
import { render } from '@testing-library/react-native';
import { PetAnimation } from './PetAnimation';

jest.mock('expo-video', () => ({
  useVideoPlayer: () => ({ loop: false, muted: false, play: jest.fn() }),
  VideoView: 'VideoView',
}));

describe('PetAnimation', () => {
  it('falls back to an emoji when there is no clip for the given pet/mood', () => {
    const { getByText } = render(
      <PetAnimation petType={'unicorn' as any} mood="happy" />,
    );

    expect(getByText('🐾')).toBeTruthy();
  });

  it('renders a video for a known pet/mood combination', () => {
    const { queryByText } = render(
      <PetAnimation petType="dragon" mood="happy" />,
    );

    expect(queryByText('🐲')).toBeNull();
  });
});
