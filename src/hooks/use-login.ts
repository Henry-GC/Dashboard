import Axios from '@/lib/axios-config'

async function useLogin () {
    const response = await Axios.post('/adm/login')
    const data = response.data
    localStorage.setItem('token', data.token)
    return {}
}