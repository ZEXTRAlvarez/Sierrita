import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import CasitaGame from './CasitaGame';

/** The intro is 4 taps ("Siguiente" x3 + "¡A jugar!") before the real game mounts. */
function skipIntro(getByTestId: (id: string) => ReactTestInstance) {
  for (let i = 0; i < 4; i++) {
    fireEvent.press(getByTestId('casita-intro-next'));
  }
}

describe('CasitaGame', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows the intro before the first round', () => {
    const { getByTestId, queryByTestId } = render(
      <CasitaGame
        params={{ maxOperand: 39, operations: ['add'], resultMax: 99 }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    expect(getByTestId('casita-intro')).toBeTruthy();
    expect(queryByTestId('casita-house')).toBeNull();
  });

  it('shows round progress, the casita house and the sticks tray once the intro is dismissed', () => {
    const { getByText, getByTestId, getAllByTestId, queryByTestId } = render(
      <CasitaGame
        params={{ maxOperand: 39, operations: ['add'], resultMax: 99 }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    skipIntro(getByTestId);

    expect(queryByTestId('casita-intro')).toBeNull();
    expect(getByText('1 / 5')).toBeTruthy();
    expect(getByTestId('casita-house')).toBeTruthy();
    expect(getAllByTestId('palito')).toHaveLength(20);
  });

  it('reports the round and finishes after the last round', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const onGameFinish = jest.fn();
    const { getAllByTestId, getByTestId } = render(
      <CasitaGame
        params={{ maxOperand: 39, operations: ['add'], resultMax: 99, regroupChance: 0 }}
        onRoundComplete={onRoundComplete}
        onGameFinish={onGameFinish}
        roundCount={1}
        difficulty={1}
      />,
    );

    skipIntro(getByTestId);

    // regroupChance: 0 keeps the tens column unlocked immediately.
    fireEvent.press(getAllByTestId('casita-units-option')[0]);
    await act(async () => {
      fireEvent.press(getAllByTestId('casita-tens-option')[0]);
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);

    act(() => jest.advanceTimersByTime(900));

    expect(onGameFinish).toHaveBeenCalledTimes(1);
  });

  it('keeps the sticks tray independent from answering the casita', () => {
    const { getAllByTestId, queryByTestId, getByTestId } = render(
      <CasitaGame
        params={{ maxOperand: 39, operations: ['add'], resultMax: 99 }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={5}
        difficulty={1}
      />,
    );

    skipIntro(getByTestId);

    const sticks = getAllByTestId('palito');
    sticks.slice(0, 10).forEach((s) => fireEvent.press(s));

    expect(queryByTestId('palitos-decena-badge')).toBeTruthy();

    // Answering the units column shouldn't touch the sticks state.
    fireEvent.press(getAllByTestId('casita-units-option')[0]);
    expect(queryByTestId('palitos-decena-badge')).toBeTruthy();
  });

  it('regression: round 2 shows options matching round 2\'s own problem, not round 1\'s stale ones', async () => {
    // Reported bug: after a round transition, Casita's displayed digits
    // updated but its (useRef-memoized) answer options stayed stuck on the
    // previous round's problem, because the remount key changed a beat
    // before the new problem was actually set. Force addition so the
    // expected units digit is trivially (a + b) % 10 for any round.
    const { getAllByTestId, getByTestId, getByText } = render(
      <CasitaGame
        params={{ maxOperand: 39, operations: ['add'], resultMax: 99, regroupChance: 0 }}
        onRoundComplete={jest.fn(async () => undefined)}
        onGameFinish={jest.fn()}
        roundCount={3}
        difficulty={1}
      />,
    );

    skipIntro(getByTestId);

    // regroupChance: 0 keeps the tens column unlocked immediately, so we can
    // finish round 1 with whatever's offered — right or wrong doesn't matter here.
    fireEvent.press(getAllByTestId('casita-units-option')[0]);
    await act(async () => {
      fireEvent.press(getAllByTestId('casita-tens-option')[0]);
    });
    act(() => jest.advanceTimersByTime(900));

    expect(getByText('2 / 3')).toBeTruthy();

    const aDigit = Number(getByTestId('casita-units-a-digit').props.children);
    const bDigit = Number(getByTestId('casita-units-b-digit').props.children);
    const expectedUnitsDigit = (aDigit + bDigit) % 10;

    const unitsOptionTexts = getAllByTestId('casita-units-option').map((btn) =>
      Number(btn.findByType('Text' as never).props.children),
    );
    expect(unitsOptionTexts).toContain(expectedUnitsDigit);
  });

  it('renders a hundreds column when useHundreds is on and can finish the round', async () => {
    const onRoundComplete = jest.fn(async () => undefined);
    const { getAllByTestId, getByTestId } = render(
      <CasitaGame
        params={{
          maxOperand: 399,
          operations: ['add'],
          resultMax: 999,
          regroupChance: 0,
          useHundreds: true,
        }}
        onRoundComplete={onRoundComplete}
        onGameFinish={jest.fn()}
        roundCount={1}
        difficulty={2}
      />,
    );

    skipIntro(getByTestId);

    expect(getByTestId('casita-column-hundreds')).toBeTruthy();

    fireEvent.press(getAllByTestId('casita-units-option')[0]);
    fireEvent.press(getAllByTestId('casita-tens-option')[0]);
    await act(async () => {
      fireEvent.press(getAllByTestId('casita-hundreds-option')[0]);
    });

    expect(onRoundComplete).toHaveBeenCalledTimes(1);
  });
});
