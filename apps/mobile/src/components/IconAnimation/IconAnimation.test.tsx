import React from 'react';
import { render } from '@testing-library/react-native';
import { IconAnimation } from './IconAnimation';

describe('IconAnimation', () => {
  it('renders at the given size', () => {
    const { UNSAFE_getByType } = render(
      <IconAnimation name="mano" size={48} />,
    );
    const { Image } = require('expo-image');

    const image = UNSAFE_getByType(Image);
    expect(image.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ width: 48, height: 48 }),
      ]),
    );
  });
});
