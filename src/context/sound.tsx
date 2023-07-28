import hujiashibapai from '@assets/audio/music/hujiashibapai.mp3'
import kisstherain from '@assets/audio/music/kisstherain.mp3'
import chess from '@assets/audio/sound/chess.mp3'
import fail from '@assets/audio/sound/fail.mp3'
import success from '@assets/audio/sound/success.mp3'
import {noop} from 'lodash-es'
import {PropsWithChildren, createContext, useCallback, useContext, useRef, useState} from 'react'

type PlaySoundProps<T> = {
  volume?: number
  type: T
}

type Context = {
  setSound: (props: PlaySoundProps<Keys<typeof sounds>>) => void
  setBackground: (props: PlaySoundProps<Keys<typeof musics>>) => void
  useSoundControl: {playing: boolean; play: AnyFunction; pause: AnyFunction}
}

const sounds = {chess, success, fail}

const musics = {kisstherain, hujiashibapai}

const SoundContext = createContext<Context>({
  setSound: noop,
  setBackground: noop,
  useSoundControl: {playing: false, play: noop, pause: noop},
})

export const useSound = () => useContext(SoundContext)

export function SoundProvider(props: PropsWithChildren) {
  const soundRef = useRef<HTMLAudioElement>(null)
  const backgroundRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const setSound = useCallback<Context['setSound']>(({type, volume}) => {
    const audio = soundRef.current!
    audio.src = sounds[type]
    audio.volume = volume ?? 0.5
    audio.play()
  }, [])
  const setBackground = useCallback<Context['setBackground']>(({type, volume}) => {
    const audio = backgroundRef.current!
    audio.src = musics[type]
    audio.volume = volume ?? 0.3
    setPlaying(false)
  }, [])
  const play = useCallback(() => {
    backgroundRef.current?.play()
    setPlaying(true)
  }, [])
  const pause = useCallback(() => {
    backgroundRef.current?.pause()
    setPlaying(false)
  }, [])

  return (
    <SoundContext.Provider
      value={{setSound, setBackground, useSoundControl: {pause, play, playing}}}
    >
      {props.children}
      <audio ref={soundRef} />
      <audio ref={backgroundRef} loop />
    </SoundContext.Provider>
  )
}
