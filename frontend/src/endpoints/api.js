import axios from "axios";


const BASE_URL = 'http://127.0.0.1:8000/api/'
const LOGIN_URL = `${BASE_URL}token/`
const LOGOUT_URL = `${BASE_URL}logout/`
const REFRESH_URL = `${BASE_URL}token/refresh/`
const WORKOUTS_URL = `${BASE_URL}workouts/`
const EXERCISES_URL = `${BASE_URL}exercises/`
const AUTH_URL = `${BASE_URL}authenticated/`
const REGISTER_URL = `${BASE_URL}register/`


/**
 * The `login` function sends a POST request to a specified URL with the provided username and
 * password, and returns a boolean indicating the success of the login attempt.
 * @param username - The `username` parameter is the username entered by the user for logging in.
 * @param password - The `password` parameter in the `login` function is the user's password that they
 * input when trying to log in. It is used to authenticate the user's identity along with their
 * username during the login process.
 * @returns The `login` function is returning the value of `response.data.success`, which is likely a
 * boolean indicating whether the login was successful or not.
 */
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


/**
 * The `refreshToken` function sends a POST request to a specified URL to refresh a token and returns a
 * boolean indicating success or failure.
 * @returns The `refreshToken` function is returning either the `response.data.refreshed` value if the
 * axios post request is successful, or `false` if there is an error caught in the try-catch block.
 */
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


/**
 * The function `getWorkouts` asynchronously fetches workout data from a specified URL using axios,
 * with error handling that includes a refresh callback.
 * @returns The `getWorkouts` function is returning the data from the response of the axios GET request
 * to the `WORKOUTS_URL`. If the request is successful, it returns the data. If there is an error, it
 * calls the `callRefresh` function with the error and a callback function that retries the axios GET
 * request to the `WORKOUTS_URL`.
 */
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


/**
 * The function `getWorkoutDetail` asynchronously fetches workout details using the workout ID and
 * handles errors by refreshing the access token if needed.
 * @param workout_id - The `workout_id` parameter is the unique identifier of the workout for which you
 * want to retrieve details. It is used in the URL to specify which workout's details you are fetching
 * from the server.
 * @returns The `getWorkoutDetail` function is returning the data from the response of the API call
 * made to `workouts//`.
 */
export const getWorkoutDetail = async (workout_id) => {
    try {
        const response = await axios.get(`${BASE_URL}workouts/${workout_id}/`, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        callRefresh(error, () => axios.get(`${BASE_URL}workouts/${workout_id}/`, {
            withCredentials: true
        }))
    }
}


/**
 * The function `deleteWorkout` sends a DELETE request to a specific workout endpoint and handles
 * errors by refreshing the access token.
 * @param workout_id - The `workout_id` parameter in the `deleteWorkout` function represents the unique
 * identifier of the workout that you want to delete. This identifier is used to specify which workout
 * should be deleted from the server when making the DELETE request to the API endpoint
 * `workouts/${workout
 * @returns The `deleteWorkout` function is returning the data from the response of the DELETE request
 * made to `workouts//`.
 */
export const deleteWorkout = async (workout_id) => {
    try {
        const response = await axios.delete(`${BASE_URL}workouts/${workout_id}/`, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        callRefresh(error, () => axios.delete(`${BASE_URL}workouts/${workout_id}/`, {
            withCredentials: true
        }))
    }
}


/**
 * This function retrieves exercises data from a specified URL using axios, handling errors by
 * refreshing the data.
 * @returns The `getExercises` function is returning the data from the response of the axios GET
 * request to the `EXERCISES_URL`. If the request is successful, it returns the response data. If there
 * is an error, it calls the `callRefresh` function with the error and retries the axios GET request to
 * the `EXERCISES_URL` with credentials.
 */
export const getExercises = async () => {
    try {
        const response = await axios.get(EXERCISES_URL, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        callRefresh(error, () => axios.get(EXERCISES_URL, {
            withCredentials: true
        }))
    }
}


/**
 * The code snippet contains functions for handling user authentication, registration, and refreshing
 * tokens in a JavaScript application.
 * @param error - The `error` parameter in the `callRefresh` function is used to capture any error that
 * occurs during the execution of the function passed as an argument. It is then checked to see if the
 * error response status is 401 (Unauthorized). If it is, the function attempts to refresh the
 * authentication token
 * @param func - The `func` parameter in the `callRefresh` function is a function that makes an API
 * call. It is used to retry the API call after refreshing the access token if the initial call
 * resulted in a 401 unauthorized error.
 * @returns The `callRefresh` function returns the data from the retry response if the token is
 * successfully refreshed and the retry response is successful. Otherwise, it returns `false`.
 */
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


/**
 * The `logout` function sends a POST request to a logout URL with credentials and returns a boolean
 * indicating success or failure.
 * @returns The `logout` function is returning a boolean value. If the logout request is successful, it
 * will return `true`, indicating that the user has been logged out successfully. If there is an error
 * during the logout process, it will return `false`.
 */
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


/**
 * The function `authenticated` sends a POST request to an authentication URL and returns a boolean
 * indicating whether the user is authenticated.
 * @returns The `authenticated` function is returning a boolean value. If the authentication request is
 * successful and the response contains a `authenticated` property, it will return the value of
 * `response.data.authenticated`. If there is an error during the request, it will log the error and
 * return `false`.
 */
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


/**
 * The `register` function sends a POST request to a specified URL with user registration data and
 * returns the response data.
 * @param username - The `username` parameter is the username that the user wants to register with. It
 * is a string value that will be used to identify the user when logging in.
 * @param email - The `email` parameter in the `register` function is the email address that the user
 * wants to use for registration. It is a required field for creating a new user account.
 * @param password - The `password` parameter in the `register` function is the password that the user
 * wants to use for their account. It is a sensitive piece of information that should be securely
 * stored and encrypted to protect the user's data. It is important to handle passwords securely to
 * prevent unauthorized access to user accounts.
 * @returns The `register` function is returning the data from the response of the POST request made to
 * the REGISTER_URL.
 */
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

