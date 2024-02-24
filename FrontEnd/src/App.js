import './App.css'
import { Button } from '@mui/material';
import { DownloadRounded } from '@mui/icons-material';
import { PlayCircleOutlineRounded } from '@mui/icons-material';
import { LinearProgress } from '@mui/material'

const App = () => {
    return (
        <>
            <h1>Noder</h1>

            <div className='buttons'>
                <Button color='success' variant='contained' size='large' startIcon={<PlayCircleOutlineRounded />}>Start</Button>
                <Button color='error' variant='contained' size='large' startIcon={<DownloadRounded />}>Download</Button>
            </div>

            <LinearProgress id='progress' color='secondary'></LinearProgress>

            <div className='W'>W :)</div>
        </>
    )
}

export default App