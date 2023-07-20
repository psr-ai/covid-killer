import React from 'react'
import PropTypes from 'prop-types';
import {confirmOTP, getOTP} from "./apiCovin";
import {encryptSHA256} from "./util";

export default class Login extends React.Component {

    static propTypes = {
        onSuccess: PropTypes.func.isRequired
    }

    state = {
        number: '',
        OTPSent: false,
        OTP: '',
        error: null
    }

    componentDidMount() {
        localStorage.setItem('txnId', '');
        localStorage.setItem('token', '');
    }

    onPhoneChange = (e) => {
        this.setState({
            number: e.target.value
        })
    }

    onOTPChange = (e) => {
        this.setState({
            OTP: e.target.value
        })
    }

    onGetOTP = () => {
        // TODO: validate phone number
        getOTP(this.state.number).then(data => {
            localStorage.setItem('txnId', data['txnId']);
            this.setState({
                OTPSent: true,
                error: null
            })
        }).catch((error) => {
            localStorage.setItem('txnId', null);
            this.setState({
                error: error.response.data,
                OTPSent: false
            })
        })
    }

    onConfirmOTP = () => {
        // TODO: validate OTP
        const txnId = localStorage.getItem('txnId');
        if (txnId) {
            confirmOTP(txnId, encryptSHA256(this.state.OTP)).then(data => {
                localStorage.setItem('token', data['token'])
                this.setState({
                    error: null
                })
                const startDate = new Date();
                window.gtag('event', 'logged-in', {time: startDate.toUTCString(), phone: this.state.number});
                this.props.onSuccess();
            }).catch(error => {
                console.log('error response', error)
                localStorage.setItem('token', '');
                this.setState({
                    error: error.response.data.error,
                    OTPSent: false
                })
            })
        } else {
            console.error('No transaction ID found, retry the process');
        }
    }

    render() {
        return (
            <div>
                <div>
                    Enter your phone number: <input min={1} value={this.state.number} step={1} type={'number'}
                                                    onChange={this.onPhoneChange} title={'Phone number'}/>
                    <button onClick={this.onGetOTP}>Get OTP</button>
                </div>
                {this.state.OTPSent ? <div>
                    Enter the OTP: <input min={1} value={this.state.OTP} step={1} type={'number'}
                                          onChange={this.onOTPChange} title={'OTP'}/>
                    <button onClick={this.onConfirmOTP}>Confirm OTP</button>
                </div> : null}
                {this.state.error ? <div>{`Error: ${this.state.error}`}</div> : null}
            </div>
        )
    }
}