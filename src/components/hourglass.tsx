import {HourglassTop} from '@mui/icons-material'
import {IconButton} from '@mui/material'
import anime from 'animejs'
import {useRef} from 'react'
import {useEffectOnce} from 'react-use'

export function Hourglass() {
  const ref = useRef<HTMLButtonElement>(null)

  useEffectOnce(() => {
    const instance = anime({
      delay: 2000,
      easing: 'easeInOutSine',
      targets: ref.current,
      rotate: 360,
      loop: true,
    })
    return () => anime.remove(instance)
  })

  return (
    <IconButton ref={ref}>
      <HourglassTop fontSize="large" sx={{color: 'white'}} />
    </IconButton>
  )
}
