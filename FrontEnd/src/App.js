import './App.css'
import { Button, LinearProgress } from '@mui/material';
import { DownloadRounded, PlayCircleOutlineRounded, DeleteOutlineRounded } from '@mui/icons-material';

const App = () => {
    return (
        <>
            <h1>Noder</h1>

            <div className='buttons'>
                <Button color='error' variant='contained' size='large' startIcon={<DeleteOutlineRounded />}>rm -rf /</Button>
                <Button color='success' variant='contained' size='large' startIcon={<PlayCircleOutlineRounded />}>Start</Button>
                <Button color='secondary' variant='contained' size='large' startIcon={<DownloadRounded />}>Download</Button>
            </div>

            <LinearProgress id='progress' color='secondary'></LinearProgress>

            <div className='W'>W :)</div>
        </>
    )
}

export default App