import axios from "axios";

const API_BASE = 'https://cdn-api.co-vin.in/api'

export const getOTP = (phoneNumber) => new Promise((resolve, reject) => {
    const data = JSON.stringify({"mobile": phoneNumber});

    const config = {
        method: 'post',
        url: `${API_BASE}/v2/auth/public/generateOTP`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            resolve(response.data)
        })
        .catch(function (error) {
            reject(error)
        });
})

export const confirmOTP = (txnId, encodedOTP) => new Promise((resolve, reject) => {
    const data = JSON.stringify({"otp":encodedOTP,"txnId":txnId});

    const config = {
        method: 'post',
        url: `${API_BASE}/v2/auth/public/confirmOTP`,
        headers: {
            'Content-Type': 'application/json'
        },
        data : data
    };

    axios(config)
        .then(function (response) {
            resolve(response.data)
        })
        .catch(function (error) {
            reject(error)
        });
})

export const getStates = () => new Promise((resolve, reject) => {
    const config = {
        method: 'get',
        url: `${API_BASE}/v2/admin/location/states`
    };
    axios(config)
        .then(function (response) {
            resolve(response.data)
        })
        .catch(function (error) {
            reject(error)
        });
})

export const getDistricts = (stateId) => new Promise((resolve, reject) => {
    const config = {
        method: 'get',
        url: `${API_BASE}/v2/admin/location/districts/${stateId}`
    };
    axios(config)
        .then(function (response) {
            resolve(response.data)
        })
        .catch(function (error) {
            reject(error)
        });
})

export const calendarByDistrict = (districtId, date) => new Promise((resolve, reject) => {
    const config = {
        method: 'get',
        url: `${API_BASE}/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${date}`,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    };
    axios(config)
        .then(function (response) {
            resolve(response.data)
        })
        .catch(function (error) {
            reject(error)
        });
})