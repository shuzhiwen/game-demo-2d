import {SyntheticEvent, useState} from 'react'
import {MTab, MTabs, TabPanel} from './components/Tab'
import {SectionOnePage} from './one-sprite'
import {Stack} from '@mui/system'

enum STEP {
  One,
  Two,
  Three,
}

export function App() {
  const [value, setValue] = useState<STEP>(STEP.One)
  const handleChange = (_: SyntheticEvent, newValue: STEP) => {
    setValue(newValue)
  }

  return (
    <Stack width="100vw" height="100vh" bgcolor="black">
      <MTabs value={value} onChange={handleChange} centered>
        <MTab value={STEP.One} label="Step One: Make A Sprite" wrapped />
        <MTab value={STEP.Two} label="Step Two" wrapped />
        <MTab value={STEP.Three} label="Step Three" wrapped />
      </MTabs>
      <Stack height="100%" p={2}>
        <TabPanel value={value} index={STEP.One}>
          <SectionOnePage />
        </TabPanel>
      </Stack>
    </Stack>
  )
}
