import React from 'react';
import { render } from '@testing-library/react-native';
import { ClockFace } from './ClockFace';

function getRotation(style: unknown): string | undefined {
  const flat = Array.isArray(style) ? Object.assign({}, ...style) : style;
  const transform = (flat as { transform?: { rotate?: string }[] })?.transform;
  return transform?.[0]?.rotate;
}

describe('ClockFace', () => {
  it('points the hour hand to 0deg and the minute hand to 0deg at 12:00', () => {
    const { getByTestId } = render(<ClockFace hour={12} minute={0} />);

    expect(getRotation(getByTestId('clock-hand-hour').props.style)).toBe(
      '0deg',
    );
    expect(getRotation(getByTestId('clock-hand-minute').props.style)).toBe(
      '0deg',
    );
  });

  it('points the minute hand to 90deg at :15 and drifts the hour hand accordingly', () => {
    const { getByTestId } = render(<ClockFace hour={3} minute={15} />);

    expect(getRotation(getByTestId('clock-hand-minute').props.style)).toBe(
      '90deg',
    );
    // 3:15 → hour hand a quarter of the way from 3 to 4: 90 + 15*0.5 = 97.5deg
    expect(getRotation(getByTestId('clock-hand-hour').props.style)).toBe(
      '97.5deg',
    );
  });
});
