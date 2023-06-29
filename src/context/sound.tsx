import hujiashibapai from '@audio/music/hujiashibapai.mp3'
import kisstherain from '@audio/music/kisstherain.mp3'
import chess from '@audio/sound/chess.mp3'
import fail from '@audio/sound/fail.mp3'
import success from '@audio/sound/success.mp3'
import {Box} from '@mui/material'
import {noop} from 'lodash-es'
import {PropsWithChildren, createContext, useCallback, useContext, useRef} from 'react'

type PlaySoundProps<T> = {
  volume?: number
  type: T
}

type Context = {
  playSound: (props: PlaySoundProps<Keys<typeof sounds>>) => void
  playBackground: (props: PlaySoundProps<Keys<typeof musics>>) => void
}

const sounds = {chess, success, fail}

const musics = {kisstherain, hujiashibapai}

const SoundContext = createContext<Context>({
  playSound: noop,
  playBackground: noop,
})

export const useSound = () => useContext(SoundContext)

export function SoundProvider(props: PropsWithChildren) {
  const soundRef = useRef<HTMLAudioElement>(null)
  const playSound = useCallback<Context['playSound']>(({type, volume}) => {
    if (soundRef.current) {
      const audio = new Audio(sounds[type])
      audio.autoplay = true
      audio.volume = volume ?? 0.5
      audio.onended = () => soundRef.current?.removeChild(audio)
      soundRef.current?.append(audio)
    }
  }, [])
  const playBackground = useCallback<Context['playBackground']>(({type, volume}) => {
    const audio = soundRef.current?.querySelector('audio') || new Audio()
    audio.src = musics[type]
    audio.loop = true
    audio.autoplay = true
    audio.volume = volume ?? 0.3
    soundRef.current?.appendChild(audio)
  }, [])

  return (
    <SoundContext.Provider value={{playSound, playBackground}}>
      {props.children}
      <Box ref={soundRef} />
    </SoundContext.Provider>
  )
}
