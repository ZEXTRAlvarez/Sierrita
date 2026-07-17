import React from 'react';
import { Animated, View } from 'react-native';
import { useOnboardingFlow } from './hooks/useOnboardingFlow';
import { NameStep } from './components/NameStep';
import { AgeStep } from './components/AgeStep';
import { PetStep } from './components/PetStep';
import { StepDots } from './components/StepDots';
import { AppWalkthrough } from './components/AppWalkthrough';
import { styles } from './OnboardingScreen.styles';

export default function OnboardingScreen() {
  const {
    step,
    name,
    setName,
    age,
    setAge,
    pet,
    setPet,
    saving,
    cardScale,
    goNext,
    handleCreate,
    finishWalkthrough,
  } = useOnboardingFlow();

  if (step === 'walkthrough') {
    return <AppWalkthrough onFinish={finishWalkthrough} />;
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.card, { transform: [{ scale: cardScale }] }]}
      >
        {step === 'name' && (
          <NameStep
            name={name}
            onChangeName={setName}
            onNext={() => goNext('age')}
          />
        )}

        {step === 'age' && (
          <AgeStep
            age={age}
            onSelectAge={setAge}
            onNext={() => goNext('pet')}
          />
        )}

        {step === 'pet' && (
          <PetStep
            pet={pet}
            saving={saving}
            onSelectPet={setPet}
            onCreate={handleCreate}
          />
        )}
      </Animated.View>

      <StepDots step={step} />
    </View>
  );
}
