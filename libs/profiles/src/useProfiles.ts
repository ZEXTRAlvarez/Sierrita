import { useCallback } from 'react';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import { profilesAtom, activeProfileIdAtom, petStateAtom } from '../../../apps/mobile/src/store/atoms';
import {
  getAllProfiles,
  createProfile,
  deleteProfile,
} from '../../storage/src/profileRepository';
import { upsertPetState } from '../../storage/src/petRepository';
import { upsertParentConfig } from '../../storage/src/parentConfigRepository';
import { createInitialPetState } from '../../pet/src/petEngine';
import type { Profile, PetType } from './types';

export function useProfiles() {
  const [profiles, setProfiles] = useAtom(profilesAtom);
  const [activeProfileId, setActiveProfileId] = useAtom(activeProfileIdAtom);
  const setPetState = useSetAtom(petStateAtom);

  const loadProfiles = useCallback(async () => {
    const loaded = await getAllProfiles();
    setProfiles(loaded);
    return loaded;
  }, [setProfiles]);

  const addProfile = useCallback(
    async (name: string, age: 4 | 5 | 6, avatar: PetType): Promise<Profile> => {
      const id = `profile_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const profile: Profile = { id, name, age, avatar, createdAt: Math.floor(Date.now() / 1000) };

      await createProfile(profile);

      // Crea mascota y config de padres por defecto para el nuevo perfil
      const initialPet = createInitialPetState(id, avatar);
      await upsertPetState(initialPet);
      await upsertParentConfig({
        profileId: id,
        pinHash: '',
        maxSessionMinutes: 30,
        worldsEnabled: ['jungle', 'ocean', 'space'],
        updatedAt: Math.floor(Date.now() / 1000),
      });

      setProfiles((prev) => [...prev, profile]);
      return profile;
    },
    [setProfiles],
  );

  const removeProfile = useCallback(
    async (id: string) => {
      await deleteProfile(id);
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      if (activeProfileId === id) {
        setActiveProfileId(null);
        setPetState(null);
      }
    },
    [activeProfileId, setActiveProfileId, setProfiles, setPetState],
  );

  const selectProfile = useCallback(
    (id: string) => {
      setActiveProfileId(id);
    },
    [setActiveProfileId],
  );

  const activeProfile = profiles.find((p) => p.id === activeProfileId) ?? null;

  return { profiles, activeProfile, activeProfileId, loadProfiles, addProfile, removeProfile, selectProfile };
}
