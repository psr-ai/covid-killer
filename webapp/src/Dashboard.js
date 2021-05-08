import React from 'react'
import PropTypes from 'prop-types'
import {calendarByDistrict, getDistricts, getStates} from "./apiCovin";
import SlotsTable from "./SlotsTable";

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
        startDate: (new Date()).toISOString().split('T')[0]
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

    onExecute = () => {
        const date = new Date(this.state.startDate)
        const formattedDate = ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + date.getFullYear();
        calendarByDistrict(this.state.selectedDistrict, formattedDate).then(data => {
            console.log('data', data)
        }).catch(error => {
            console.log('error', error.response)
            this.props.onError();
        })
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
                    <button onClick={this.onExecute}>Execute</button>
                </div>
                <div>
                    <SlotsTable />
                </div>
            </div>
        );
    }
}

export default Dashboard;
