import {Stack} from '@mui/system'
import {SyntheticEvent, useState} from 'react'
import {MTab, MTabs, TabPanel} from './components/Tab'
import {SectionOnePage} from './one-sprite'
import {SectionZeroPage} from './zero-learn'

enum STEP {
  Zero,
  One,
}

export function App() {
  const [value, setValue] = useState<STEP>(STEP.Zero)
  const handleChange = (_: SyntheticEvent, newValue: STEP) => {
    setValue(newValue)
  }

  return (
    <Stack width="100vw" height="100vh" bgcolor="black">
      <MTabs value={value} onChange={handleChange} centered>
        <MTab value={STEP.Zero} label="Step Zero: Hello World" wrapped />
        <MTab value={STEP.One} label="Step One: Make A Sprite" wrapped />
      </MTabs>
      <Stack flex={1} p={2} overflow="hidden">
        <TabPanel value={value} index={STEP.Zero}>
          <SectionZeroPage />
        </TabPanel>
        <TabPanel value={value} index={STEP.One}>
          <SectionOnePage />
        </TabPanel>
      </Stack>
    </Stack>
  )
}
