import { useState } from 'react';
import { useAtom } from 'jotai';
import { petStateAtom } from '../../../store/atoms';
import { upsertPetState } from '@sierrita/storage';
import { getOutfit } from '../data/outfits';

export function usePetDetailState() {
  const [petState, setPetState] = useAtom(petStateAtom);
  const [selectedOutfit, setSelectedOutfit] = useState<string>(petState?.outfitId ?? 'none');
  const [showRename, setShowRename] = useState(false);

  function applyOutfit(outfitId: string) {
    if (!petState) return;
    setSelectedOutfit(outfitId);
    const updated = { ...petState, outfitId };
    setPetState(updated);
    upsertPetState(updated).catch(console.error);
  }

  function applyName(name: string) {
    if (!petState) return;
    const trimmed = name.trim();
    const updated = { ...petState, petName: trimmed === '' ? null : trimmed };
    setPetState(updated);
    upsertPetState(updated).catch(console.error);
    setShowRename(false);
  }

  return {
    petState,
    selectedOutfit,
    currentOutfit: getOutfit(selectedOutfit),
    showRename,
    setShowRename,
    applyOutfit,
    applyName,
  };
}
