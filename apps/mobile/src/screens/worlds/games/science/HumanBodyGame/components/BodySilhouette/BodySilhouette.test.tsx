import React from 'react';
import { render } from '@testing-library/react-native';
import { BodySilhouette } from './BodySilhouette';

describe('BodySilhouette', () => {
  it('renders the silhouette and a marker at the given position', () => {
    const { getByTestId } = render(
      <BodySilhouette markerX={80} markerY={40} />,
    );

    expect(getByTestId('body-silhouette')).toBeTruthy();
    expect(getByTestId('body-marker')).toBeTruthy();
  });

  it('positions the marker centered on the given coordinates', () => {
    const { getByTestId } = render(
      <BodySilhouette markerX={100} markerY={50} />,
    );

    const marker = getByTestId('body-marker');
    const flatStyle = Object.assign({}, ...marker.props.style);
    expect(flatStyle.left).toBe(100 - 11);
    expect(flatStyle.top).toBe(50 - 11);
  });
});
