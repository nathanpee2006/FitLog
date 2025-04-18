import axios from "axios";


const BASE_URL = 'http://127.0.0.1:8000/api/'
const LOGIN_URL = `${BASE_URL}token/`
const LOGOUT_URL = `${BASE_URL}logout/`
const REFRESH_URL = `${BASE_URL}token/refresh/`
const WORKOUTS_URL = `${BASE_URL}workouts/`
const AUTH_URL = `${BASE_URL}authenticated/`
const REGISTER_URL = `${BASE_URL}register/`


export const login = async (username, password) => {
    const response = await axios.post(LOGIN_URL, {
        username: username,
        password: password,
    },
        {
            withCredentials: true
        }
    )
    return response.data.success
}


export const refreshToken = async () => {
    try {
        const response = await axios.post(REFRESH_URL,
            {},
            { withCredentials: true }
        )
        return response.data.refreshed
    } catch (error) {
        console.log(error)
        return false
    }
}


export const getWorkouts = async () => {
    try {
        const response = await axios.get(WORKOUTS_URL, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        callRefresh(error, () => axios.get(WORKOUTS_URL, {
            withCredentials: true
        }))
    }
}


const callRefresh = async (error, func) => {
    if (error.response && error.response.status === 401) {
        const tokenRefreshed = await refreshToken()
        if (tokenRefreshed) {
            const retryResponse = await func()
            return retryResponse.data
        }
    }
    return false
}


export const logout = async () => {
    try {
        const response = await axios.post(LOGOUT_URL,
            {},
            { withCredentials: true }
        )
        return response.data.success
    } catch (error) {
        console.log(error)
        return false
    }
}


export const authenticated = async () => {
    try {
        const response = await axios.post(AUTH_URL,
            {},
            { withCredentials: true }
        )
        return response.data.authenticated
    } catch (error) {
        console.log(error)
        return false
    }
}


export const register = async (username, email, password) => {
    const response = await axios.post(REGISTER_URL,
        {
            username: username,
            email: email,
            password: password
        },
        { withCredentials: true }
    )
    return response.data
}