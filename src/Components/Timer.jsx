import React, { Component, } from 'react';
import '../App.css'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { USER_ATTEMPT } from '../redux/types'
import { recordTimes } from '../redux/actions/userActions'


class Timer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      seconds: 0,
      milliseconds: 0,
      readyCheck: false,
      passFail: false,
      times: []
    }
  }

  //declare global variables for the interval & time out
  timeOut = 0;
  stopTime = 1;

  //it will pick a random number between 1 and this number, change this number to change the limit
  randomNumber = 3;





  //this is fired when first click the button
  readyButton = () => {

    //checks if you've already clicked the button or not
    //if you haven't then it will pick a random number 
    if (this.state.readyCheck == false) {

      //sets the state to reflect that you have started pressed the button
      this.setState({
        seconds: 0,
        milliseconds: 0,
        readyCheck: true,
        passFail: false,
        times: this.state.times
      })


      //picks a random number depending on randomNumber and converts it to milliseconds
      const startTime = Math.floor(Math.random() * Math.floor(this.randomNumber) + 1)
      const startTimeInMilli = startTime * 1000

      //this changes the button colour and then changes the state to allow it to see you haven't clicked the button too early with passFail
      this.timeOut = setTimeout(() => {
        document.getElementById('goButton').classList.add('ready')
        this.setState({
          seconds: 0,
          milliseconds: 0,
          readyCheck: true,
          passFail: true,
          times: this.state.times
        })


        //this is the timer
        //doesn't use full milliseconds due to browsers not being able to support that speed consistently with setInterval
        let i = 0
        this.stopTime = setInterval(() => {
          i++
          this.setState({
            ...this.state,
            milliseconds: i
          })

        }, 10)

      }, startTimeInMilli)


    } else {

      //the state reflects that you've already pressed that you're ready, it fires this
      this.stopButton()
    }
  }


  //this checks if you've pressed the button too early or not and records the time
  stopButton = (e) => {

    //stops the timer and clears the ready check, resets the button too
    clearTimeout(this.timeOut)
    clearInterval(this.stopTime)
    document.getElementById('goButton').classList.remove('ready')

    //this is if you have pressed the button too soon
    if (this.state.passFail == false && this.state.readyCheck == true) {
      const currentState = this.state.times

      //creates an object to add to the state to record the time and if it was a pass or fail
      //and a key for mapping 
      const newTime = {
        seconds: 0,
        milliseconds: 0,
        success: false,
        key: Date.now()
      }
      currentState.push(newTime)

      //this tells you off for clicking too soon
      alert("Dont click the button before the colour changes!")


      //resets the state and adds the new time to the times array
      this.setState({
        seconds: 0,
        milliseconds: 0,
        readyCheck: false,
        passFail: false,
        times: currentState
      })

      //fires off to redux
      this.props.recordTimes(this.state.times)
      clearTimeout(this.timeOut)

      //set off the average time checker func
      this.averageChecker()

    } else {

      //you've clicked after the button has changed colour
      //it's pretty much the same the fail 
      const currentState = this.state.times

      //records the object but with a pass 
      const newTime = {
        seconds: 0,
        milliseconds: this.state.milliseconds,
        success: true,
        key: Date.now()
      }

      //resets the state and adds the object to the times array
      currentState.push(newTime)
      this.setState({
        seconds: 0,
        milliseconds: 0,
        readyCheck: false,
        passFail: false,
        times: currentState
      })

      //sends it to redux
      this.props.recordTimes(this.state.times)

      //fires off the average time checer
      this.averageChecker()
    }
  }


  //this checks to see if you've completed 5 successful attempts
  //and then averages it out (& rounds up)
  averageChecker = () => {

    //creates an array of only successful completions
    const successfulCompletions = this.state.times.filter(time => time.success == true)

    //checks if that array is bigger than or equal to 5
    if (successfulCompletions.length >= 5) {

      //simplifies the array to be only an array of the times
      const timesArray = successfulCompletions.map(i => i.milliseconds)

      //averages out those times
      const averTime = timesArray.reduce((a, b) => a + b, 0) / timesArray.length / 100

      //rounds it up to 3 decimal places
      const roundedUp = averTime.toFixed(3)

      //updates the content and the adds a bold
      document.getElementById('averageViewer').innerHTML = `Your Average is: ${roundedUp}`
      document.getElementById('averageViewer').style.fontWeight = 'bold'
    } else {

      //it doesn't do anything if you haven't done 5
      return
    }
  }

  render() {
    return (
      <Paper elevation={1} className={'wrapper'}>
        <p className={'TimerClock'}>{this.state.milliseconds}</p>
        <Button variant="contained" id={'goButton'} className={'readyButton'} onClick={this.readyButton}>I'm Ready</Button>
        <div className={'tableWrapper'}>
          <p className={'averageTime'} id={'averageViewer'}>
            Please complete 5 tests to see your average time
          </p>
          {this.state.times.map(recordedTimes =>

            <p key={recordedTimes.key} className={'recordedTime'}>
              {recordedTimes.milliseconds / 100}
            </p>
          )}
        </div>
      </Paper>
    );
  }
}

Timer.propTypes = {
  recordTimes: PropTypes.func.isRequired,
  times: PropTypes.object.isRequired
}

const mapActionToProps = {
  recordTimes
}

const mapStateToProps = (state) => ({
  times: state
})

export default connect(mapStateToProps, mapActionToProps)(Timer);