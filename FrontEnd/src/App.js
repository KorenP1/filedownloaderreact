import './App.css'
import { Button, LinearProgress } from '@mui/material'
import { DeleteOutlineRounded, PlayCircleOutlineRounded, DownloadRounded } from '@mui/icons-material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const fetchDataFromAPI = async (apiURI) => {
    try {
        const response = await fetch(window.location.origin + apiURI);
        if (response.status !== 200) {return 'ERROR'}
        const data = await response.text();
        return data;
    } catch (error) {
        console.log(error);
        return 'ERROR';
    }
}

const fetchStatus = async () => {
    let statusElement = document.getElementById('status')
    switch (await fetchDataFromAPI('/api/status')) {
        case 'ERROR':
            toast.error('Connection Error 🔌')
            break
        case 'EMPTY':
            statusElement.innerHTML = 'No Files 📁'
            statusElement.style.color = 'white'
            break
        case 'CREATING':
            statusElement.innerHTML = 'Creating Files ⌛'
            statusElement.style.color = 'yellow'
            break
        case 'DELETING':
            statusElement.innerHTML = 'Deleting Files 🗑️'
            statusElement.style.color = 'yellow'
            break
        case 'READY':
            statusElement.innerHTML = 'Files Are Ready ☄️'
            statusElement.style.color = 'green'
            break
        default:
            toast.error('Cannot Fetch Status 🔒🔒🔒')
    }
    setTimeout(fetchStatus, 10000)
}

const clearToastsEveryTenMinutes = async () => {
    toast.clearWaitingQueue()
    setTimeout(fetchStatus, 600000)
}

const rmrf = async () => {
    switch (await fetchDataFromAPI('/api/status')) {
        case 'ERROR':
            toast.error('Connection Error 🔌')
            break
        case 'EMPTY':
            toast.info('There Are No Files 🤡')
            break
        case 'CREATING':
            toast.warn('Discarding Creation Task And Deleting Files 🗑️')
            await fetchDataFromAPI('/api/delete')
            break
        case 'DELETING':
            toast.info('Already Deleting Files 🤯')
            break
        case 'READY':
            toast.error('Deleting Files 🗑️')
            await fetchDataFromAPI('/api/delete')
            break
        default:
            toast.error('UNKNOWN PROBLEM OCCURED 👽')
    }
}
const start = async () => {
    switch (await fetchDataFromAPI('/api/status')) {
        case 'ERROR':
            toast.error('Connection Error 🔌')
            break
        case 'EMPTY':
            toast.success('Creation Task Called ⏳')
            await fetchDataFromAPI('/api/start')
            break
        case 'CREATING':
            toast.info('Already Creating Files ⌛')
            break
        case 'DELETING':
            toast.info('Deletion Task Is Running 🗑️')
            break
        case 'READY':
            toast.info('Files Are Ready ✔️')
            break
        default:
            toast.error('UNKNOWN PROBLEM OCCURED 👽')
    }
}
const download = async () => {
    switch (await fetchDataFromAPI('/api/status')) {
        case 'ERROR':
            toast.error('Connection Error 🔌')
            break
        case 'EMPTY':
            toast.info('Can\'t Download, No Files ❄️')
            break
        case 'CREATING':
            toast.info('Files Are Creating 🔥')
            break
        case 'DELETING':
            toast.info('Deletion Task Is Running 🗑️')
            break
        case 'READY':
            toast.success('Downloading Files... 📁')
            let fileNames = (await fetchDataFromAPI('/files')).split(' ')
            for (const fileName of fileNames) {
                const aTag = document.createElement('a')
                aTag.href = window.location.origin + '/files/' + fileName
                aTag.setAttribute('download', fileName)
                document.body.appendChild(aTag)
                aTag.click()
                aTag.remove()
            }
            break
        default:
            toast.error('UNKNOWN PROBLEM OCCURED 👽')
    }
}

clearToastsEveryTenMinutes()
fetchStatus()

export default function App() {

    return (
        <>
            <h1>{process.env.REACT_APP_TITLE} ☄️</h1>

            <ToastContainer theme='dark' newestOnTop='True' limit={20}/>

            <div className='buttons'>
                <Button color='error' variant='contained' size='large' startIcon={<DeleteOutlineRounded />} onClick={rmrf}>rm -rf /</Button>
                <Button color='success' variant='contained' size='large' startIcon={<PlayCircleOutlineRounded />} onClick={start}>Start</Button>
                <Button color='secondary' variant='contained' size='large' startIcon={<DownloadRounded />} onClick={download}>Download</Button>
            </div>

            <div id='status'>Loading...</div>
            <LinearProgress id='progress' color='secondary'></LinearProgress>

            <div className='W'>W :)</div>
        </>
    )
}