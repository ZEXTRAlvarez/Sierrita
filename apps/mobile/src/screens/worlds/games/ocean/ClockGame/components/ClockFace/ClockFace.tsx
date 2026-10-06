import { Text, View } from 'react-native';
import { styles } from './ClockFace.styles';

export interface ClockFaceProps {
  hour: number;
  minute: number;
}

/** An analog clock face with hour/minute hands rotated to match the given time. */
export function ClockFace({ hour, minute }: ClockFaceProps) {
  const minuteAngle = minute * 6;
  const hourAngle = (hour % 12) * 30 + minute * 0.5;

  return (
    <View style={styles.face} testID="clock-face">
      <Text style={[styles.numberLabel, styles.number12]}>12</Text>
      <Text style={[styles.numberLabel, styles.number3]}>3</Text>
      <Text style={[styles.numberLabel, styles.number6]}>6</Text>
      <Text style={[styles.numberLabel, styles.number9]}>9</Text>

      <View
        testID="clock-hand-hour"
        style={[
          styles.handWrap,
          { transform: [{ rotate: `${hourAngle}deg` }] },
        ]}
      >
        <View style={styles.hourHand} />
      </View>
      <View
        testID="clock-hand-minute"
        style={[
          styles.handWrap,
          { transform: [{ rotate: `${minuteAngle}deg` }] },
        ]}
      >
        <View style={styles.minuteHand} />
      </View>
      <View style={styles.centerDot} />
    </View>
  );
}
