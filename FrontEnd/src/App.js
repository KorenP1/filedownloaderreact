import './App.css'
import { Button, LinearProgress } from '@mui/material'
import { DownloadRounded, PlayCircleOutlineRounded, DeleteOutlineRounded } from '@mui/icons-material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

async function fetchDataFromAPI(apiURI) {
    try {
        const response = await fetch(window.location.origin + apiURI);
        const data = await response.text();
        return data;
    } catch (error) {
        console.log(error);
        return 'ERROR';
    }
}

const App = () => {


    const rmrf = async () => {
        switch (await fetchDataFromAPI('/api/status')) {
            case 'ERROR':
                toast.error('Connection Error 🔌')
                break
            case 'EMPTY':
                toast.success('There are no files 🤡')
                break
            case 'CREATING':
                toast.success('Discarding creating task and deleting files 🗑️')
                break
            case 'DELETING':
                toast.error('Already deleting files 🤯')
                break
            case 'READY':
                toast.error('Deleting files 🗑️')
                break
        }
    }
    const start = async () => {
        toast.success('Start')
    }
    const download = async () => {
        toast.error('🦄 Wow so easy!');
    }

    return (
        <>
            <h1>Noder</h1>

            <ToastContainer theme='dark'/>

            <div className='buttons'>
                <Button color='error' variant='contained' size='large' startIcon={<DeleteOutlineRounded />} onClick={rmrf}>rm -rf /</Button>
                <Button color='success' variant='contained' size='large' startIcon={<PlayCircleOutlineRounded />} onClick={start}>Start</Button>
                <Button color='secondary' variant='contained' size='large' startIcon={<DownloadRounded />} onClick={download}>Download</Button>
            </div>

            <LinearProgress id='progress' color='secondary'></LinearProgress>

            <div className='W'>W :)</div>
        </>
    )
}

export default App