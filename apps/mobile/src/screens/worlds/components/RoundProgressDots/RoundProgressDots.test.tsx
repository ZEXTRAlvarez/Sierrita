import React from 'react';
import { render } from '@testing-library/react-native';
import { RoundProgressDots } from './RoundProgressDots';

describe('RoundProgressDots', () => {
  it('renders one dot per round', () => {
    const { getAllByTestId } = render(<RoundProgressDots roundCount={5} rounds={[]} color="#4CAF50" />);

    expect(getAllByTestId('round-dot')).toHaveLength(5);
  });

  it('colors played dots by correctness and leaves the rest neutral', () => {
    const rounds = [
      { correct: true, responseTimeMs: 1000, hintsUsed: 0 },
      { correct: false, responseTimeMs: 1000, hintsUsed: 0 },
    ];
    const { getAllByTestId } = render(<RoundProgressDots roundCount={3} rounds={rounds} color="#4CAF50" />);

    const dots = getAllByTestId('round-dot');
    expect(dots[0].props.style).toEqual(expect.arrayContaining([expect.objectContaining({ backgroundColor: '#4CAF50' })]));
    expect(dots[1].props.style).toEqual(expect.arrayContaining([expect.objectContaining({ backgroundColor: '#F44336' })]));
    expect(dots[2].props.style).toEqual(expect.arrayContaining([expect.objectContaining({ backgroundColor: '#DDD' })]));
  });
});
