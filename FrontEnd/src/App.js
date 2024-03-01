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

const fetchStatus = async (count = 0, recursion = false) => {
    if (count >= 60) {toast.error('Please Refresh Page 🔄'); setTimeout(() => {fetchStatus(++count)}, 10000); Array.from(document.getElementsByClassName('buttons')[0].children).forEach(button => {button.style.pointerEvents = 'none'}); return}
    switch (await fetchDataFromAPI('/api/status')) {
        case 'ERROR':
             toast.error('Connection Error 🔌')
            break
        case 'EMPTY':
            document.getElementById('progress').style.display = 'none'
            document.getElementById('status').innerHTML = 'No Files 📁'
            document.getElementById('status').style.color = 'white'
            break
        case 'CREATING':
            document.getElementById('progress').style.display = 'block'
            document.getElementById('status').innerHTML = 'Creating Files ⌛'
            document.getElementById('status').style.color = 'yellow'
            break
        case 'DELETING':
            document.getElementById('progress').style.display = 'block'
            document.getElementById('status').innerHTML = 'Deleting Files 🗑️'
            document.getElementById('status').style.color = 'yellow'
            break
        case 'READY':
            document.getElementById('progress').style.display = 'none'
            document.getElementById('status').innerHTML = 'Files Are Ready ☄️'
            document.getElementById('status').style.color = 'green'
            break
        default:
            toast.error('Cannot Fetch Status 🔒🔒🔒')
    }
    if (recursion) {setTimeout(() => {fetchStatus(++count, true)}, 10000)}
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
            fetchStatus()
            break
        case 'CREATING':
            toast.warn('Discarding Creation Task And Deleting Files 🗑️')
            await fetchDataFromAPI('/api/delete')
            fetchStatus()
            break
        case 'DELETING':
            toast.info('Already Deleting Files 🤯')
            fetchStatus()
            break
        case 'READY':
            toast.error('Deleting Files 🗑️')
            await fetchDataFromAPI('/api/delete')
            fetchStatus()
            break
        default:
            toast.error('Unknown Problem Occured 👽')
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
            fetchStatus()
            break
        case 'CREATING':
            toast.info('Already Creating Files ⌛')
            fetchStatus()
            break
        case 'DELETING':
            toast.info('Deletion Task Is Running 🗑️')
            fetchStatus()
            break
        case 'READY':
            toast.info('Files Are Ready ✔️')
            fetchStatus()
            break
        default:
            toast.error('Unknown Problem Occured 👽')
    }
}
const download = async () => {
    switch (await fetchDataFromAPI('/api/status')) {
        case 'ERROR':
            toast.error('Connection Error 🔌')
            break
        case 'EMPTY':
            toast.info('Can\'t Download, No Files ❄️')
            fetchStatus()
            break
        case 'CREATING':
            toast.info('Files Are Creating 🔥')
            fetchStatus()
            break
        case 'DELETING':
            toast.info('Deletion Task Is Running 🗑️')
            fetchStatus()
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
            fetchStatus()
            break
        default:
            toast.error('Unknown Problem Occured 👽')
    }
}

clearToastsEveryTenMinutes()
fetchStatus(1, true)

export default function App() {

    return (
        <>
            <h1>{process.env.REACT_APP_TITLE} ☄️</h1>

            <ToastContainer theme='dark' newestOnTop='True' limit={50}/>

            <div className='buttons'>
                <Button color='error' variant='contained' size='large' startIcon={<DeleteOutlineRounded />} onClick={rmrf}>rm -rf /</Button>
                <Button color='success' variant='contained' size='large' startIcon={<PlayCircleOutlineRounded />} onClick={start}>Start</Button>
                <Button color='secondary' variant='contained' size='large' startIcon={<DownloadRounded />} onClick={download}>Download</Button>
            </div>

            <div id='status'>Loading... ⚓</div>
            <LinearProgress id='progress' color='secondary'></LinearProgress>

            <div className='W'>W :)</div>
        </>
    )
}