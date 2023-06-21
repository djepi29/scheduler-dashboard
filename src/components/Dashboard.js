import React, { Component } from "react";

import axios from "axios";

import classnames from "classnames";

import Loading from "./Loading";

import Panel from "./Panel";

import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
 } from "helpers/selectors";

//mock data
const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: 6
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: "1pm"
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: "Wednesday"
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: "2.3"
  }
];



class Dashboard extends Component {

  state = {
    loading: true,
    focused: null,
    days: [],
    appointments: {},
    interviewers: {},

  }

  selectPanel(id) {
    this.setState(previousState => ({
     focused: previousState.focused !== null ? null : id
    }));
   }

   componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(([days, appointments, interviewers]) => {
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
    });
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }



  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
    });

    // console.log(this.state)r
    
    if (this.state.loading) {
      return <Loading/>
    }

    const panels = (this.state.focused ? data.filter(panel => this.state.focused === panel.id) : data).map(panel => (
      <Panel
      key={panel.id}
      id={panel.id}
      label={panel.label}
      value={panel.value}
      onSelect={event => this.selectPanel(panel.id)}
      />
    ))

    return <main className={dashboardClasses}
    >{panels}</main>;
  }
}

export default Dashboard;
