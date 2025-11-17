
import { useCallback, useMemo } from 'react';

const createAudio = (src: string) => {
  if (typeof Audio !== 'undefined') {
    return new Audio(src);
  }
  return null;
};

export const useSounds = (enabled: boolean) => {
  const sounds = useMemo(() => ({
    click: createAudio('/assets/sound-click.mp3'),
    toggleOn: createAudio('/assets/sound-toggle-on.mp3'),
    toggleOff: createAudio('/assets/sound-toggle-off.mp3'),
    addFavorite: createAudio('/assets/sound-add-favorite.mp3'),
    search: createAudio('/assets/sound-search.mp3'),
  }), []);

  const playSound = useCallback((sound: HTMLAudioElement | null) => {
    if (enabled && sound) {
      sound.currentTime = 0;
      sound.play().catch(err => console.error("Error playing sound:", err));
    }
  }, [enabled]);

  return {
    playClick: () => playSound(sounds.click),
    playToggleOn: () => playSound(sounds.toggleOn),
    playToggleOff: () => playSound(sounds.toggleOff),
    playAddFavorite: () => playSound(sounds.addFavorite),
    playSearch: () => playSound(sounds.search),
  };
};
