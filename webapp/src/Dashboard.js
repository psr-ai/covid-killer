import React from 'react'
import PropTypes from 'prop-types'
import {calendarByDistrict, getDistricts, getStates} from "./apiCovin";
import DataTable from "./DataTable";

class Dashboard extends React.Component {

    static propTypes = {
        onError: PropTypes.func.isRequired
    }

    state = {
        states: [],
        selectedState: '',
        districts: [],
        selectedDistrict: '',
        interval: 1,
        startDate: (new Date()).toISOString().split('T')[0],
        centers: [],
        executing: false
    }

    componentDidMount() {
        getStates().then(data => {
            const defaultStateId = data["states"][0]["state_id"];
            this.setState({
                states: data["states"],
                selectedState: defaultStateId
            })
            this.getDistrictsAndSetDefault(defaultStateId)
        })
    }



    getDistrictsAndSetDefault = (stateId) => {
        getDistricts(stateId).then(data => {
            this.setState({
                districts: data["districts"],
                selectedDistrict: data["districts"][0]["district_id"]
            })
        })
    }

    onIntervalChange = (event) => {
        this.setState({
            interval: event.target.value
        })
    }

    startInterval = () => {
        this.executor = setInterval(this.executorMethod, this.state.interval * 1000);
        this.setState({
            executing: true
        })
    }

    stopInterval = () => {
        clearInterval(this.executor);
        this.setState({
            executing: false
        })
    }

    executorMethod = () => {
        const date = new Date(this.state.startDate)
        const formattedDate = ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + date.getFullYear();
        calendarByDistrict(this.state.selectedDistrict, formattedDate).then(data => {
            const availabilityAt = Date.now();
            const processedData = []
            data['centers'].forEach(row => {
                row.sessions.forEach(session => {
                    processedData.push({
                        id: row.center_id.toString() + session.session_id.toString() + availabilityAt.toString(),
                        availability_at: availabilityAt,
                        ...session,
                        ...row
                    })
                })
            })
            this.setState({
                centers: this.state.centers.concat(processedData)
            })
        }).catch(error => {
            localStorage.setItem('token', '')
            this.props.onError();
        })
    }


    onExecute = () => {
        this.startInterval()
    }

    onStop = () => {
        this.stopInterval()
    }

    onDateChange = (event) => {
        this.setState({
            startDate: event.target.value
        })
    }

    render() {
        return (
            <div className="Dashboard">
                <div>
                    <div>
                        <label htmlFor="state">Select a state:</label>

                        <select name="states" id="states" value={this.state.selectedState} onChange={(event) => {
                            const stateId = event.target.value;
                            this.setState({
                                selectedState: stateId
                            })
                            this.getDistrictsAndSetDefault(stateId)
                        }}>
                            {
                                this.state.states.map(state => <option value={state["state_id"]}
                                                                       key={state["state_id"]}>{state["state_name"]}</option>)
                            }
                        </select>
                    </div>
                    <div>
                        <label htmlFor="district">Select a district:</label>

                        <select name="cars" id="cars" value={this.state.selectedDistrict} onChange={(event) => {
                            this.setState({
                                selectedDistrict: event.target.value
                            })
                        }}>
                            {
                                this.state.districts.map(district => <option value={district["district_id"]}
                                                                             key={district["district_id"]}>{district["district_name"]}</option>)
                            }
                        </select>
                    </div>
                    <div>
                        <label htmlFor="date">Start date of week:</label>
                        <input type="date" id="date" name="date" value={this.state.startDate} onChange={this.onDateChange}/>
                    </div>
                    <div>
                        <span>Check slot every&nbsp;</span>
                        <input min={1} value={this.state.interval} step={1} type={'number'} onChange={this.onIntervalChange}
                               title={'Interval'}/>
                        <span>&nbsp;second{this.state.interval > 1 ? 's' : ''}.</span>
                    </div>
                    <button disabled={this.state.executing} onClick={this.onExecute}>{this.state.executing ? `Executing every ${this.state.interval} seconds...` : 'Execute'}</button>
                    {this.state.executing ? <button onClick={this.onStop}>Stop</button> : null}
                </div>
                <div>
                    <DataTable rows={this.state.centers} />
                </div>
            </div>
        );
    }
}

export default Dashboard;
