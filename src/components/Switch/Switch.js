import React, { Component } from "react";
import Switch from "react-switch";
import fireBase from '../../components/postJobs/postJobs'
class Switchtag extends Component {
  constructor() {
    super();
   
    this.handleChange = this.handleChange.bind(this);
  }

  state = {
    checked:false,
    disabled:false
  }
  

    gotInterviewV = ()=>{
      let interviewJob = this.props.jobs
      interviewJob.gotInterview = true
      let changeIndex = null
      let appliedJobs = JSON.parse(localStorage.getItem('applied'))
      appliedJobs.map((job,index) =>{
        if(job.id === interviewJob.id){
        appliedJobs[index].gotInterview=true
        changeIndex = index
        fireBase.patch("/users/"+this.props.dashBoard.state.googleId+"/applied/"+interviewJob.id+".json",appliedJobs[index]) //Add got interview to true
        localStorage.setItem('applied',JSON.stringify(appliedJobs))
        }
      })
      if(this.props.dashBoard.state.gotInterview){
        let newArrayOfInterviewJobs = JSON.stringify([...JSON.parse(localStorage.getItem('gotInterview')), interviewJob ])
        localStorage.setItem('gotInterview',newArrayOfInterviewJobs)
  
        let interviewTemp = JSON.parse(localStorage.getItem('gotInterview'))
        this.props.dashBoard.setState({gotInterview:interviewTemp})
        
        
      }
      else{
  
      localStorage.setItem('gotInterview', JSON.stringify([interviewJob]))
      fireBase.patch('/users/'+this.props.dashBoard.state.googleId+"/applied/"+interviewJob.id+'.json',interviewJob)
      this.props.dashBoard.setState({gotInterview:[interviewJob]})
      }
    }

    gotDenied = () =>{
      let deniedJob = this.props.jobs
      let deniedJobs =null
      deniedJob.gotDenied = true
      deniedJobs = JSON.parse(localStorage.getItem('applied'))


      deniedJobs.map((job,index) =>{
        if(job.id === deniedJob.id){
          deniedJobs[index].gotDenied=true
        fireBase.patch("/users/"+this.props.dashBoard.state.googleId+"/applied/"+deniedJob.id+".json",deniedJobs[index]) //Add got interview to true
        localStorage.setItem('applied',JSON.stringify(deniedJobs))
        }
      })
      if(this.props.dashBoard.state.deniedJobs){
        let newArrayOfdeniedJobs = JSON.stringify([...JSON.parse(localStorage.getItem('denied')), deniedJob ])
        localStorage.setItem('denied',newArrayOfdeniedJobs)
  
        let gotDeniedTemp = JSON.parse(localStorage.getItem('denied'))
        this.props.dashBoard.setState({deniedJobs:gotDeniedTemp})
        
        
      }
      else{
  
      localStorage.setItem('denied', JSON.stringify([deniedJob]))
      fireBase.patch('/users/'+this.props.dashBoard.state.googleId+'/applied/'+deniedJob.id+'.json',deniedJob)
      this.props.dashBoard.setState({deniedJobs:[deniedJob]})
      }
    }


    gotOffer = () =>{
      let offeredJob = this.props.jobs
      offeredJob.gotOffer = true 
      let changeIndex = null
      let offeredJobs = JSON.parse(localStorage.getItem('applied'))

        offeredJobs.map((job,index) =>{
        if(job.id === offeredJob.id){
          offeredJobs[index].gotOffer=true
          changeIndex=index
        fireBase.patch("/users/"+this.props.dashBoard.state.googleId+"/applied/"+offeredJob.id+".json",offeredJob) //Add got interview to true
        localStorage.setItem('applied',JSON.stringify(offeredJobs))
        }
      })
      if(this.props.dashBoard.state.offeredJobs){
        let newArrayOfdeniedJobs = JSON.stringify([...JSON.parse(localStorage.getItem('offer')), offeredJob ])
        localStorage.setItem('offer',newArrayOfdeniedJobs)
        let gotOfferTemp = JSON.parse(localStorage.getItem('offer'))
        this.props.dashBoard.setState({offeredJobs:gotOfferTemp})
        
        
      }
      else{
  
      localStorage.setItem('offer', JSON.stringify([offeredJob]))
      fireBase.patch('/users/'+this.props.dashBoard.state.googleId+'/applied/'+offeredJob.id+'.json',offeredJob)
      this.props.dashBoard.setState({offeredJobs:[offeredJob]})
      }
    }

  handleChange(checked) {
    this.setState({ checked });
    if(this.props.status === 'gotInterview')
      this.gotInterviewV()
    if(this.props.status === 'denied')
      this.gotDenied()
    if(this.props.status === 'offer')
      this.gotOffer()
      
    this.disabled=true
    
    
  }
 

  render() {
    
    return (
      <label>
        <span>{this.props.text}</span>
        <Switch onChange={this.handleChange} checked={this.state.checked ? this.state.checked : false} />
      </label>
    );
  }
}

export default Switchtag