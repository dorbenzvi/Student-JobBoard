import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import React from "react";
import fireBase from '../../components/postJobs/postJobs'
import GoogleLogin from 'react-google-login';

import {
    Button,
    Row,
    Col
  } from "reactstrap";

  

class ConfirmAlert extends React.Component {
  
  

   responseGoogle = (googleResponde,tobe) => {
    
    this.props.dashBoard.setState({googleId:googleResponde.googleId})
    localStorage.setItem('userSession',googleResponde.googleId)
    console.log(googleResponde.ot.Ad)
    if(this.props.dashBoard.state.needLogin)
      document.getElementsByClassName('react-confirm-alert-overlay')[0].style.visibility = "hidden";
    fireBase.get('/users/'+googleResponde.googleId+'.json').then (response => {
      if(response.data){
         
        let applied =[]
        let interview=[]
        let denied = []
        let offer = []
        for ( let key in response.data['applied']){
            applied = [...applied,response.data['applied'][key]]
            if(response.data['applied'][key].gotInterview)
            interview = [...interview,response.data['applied'][key]]
            if(response.data['applied'][key].gotDenied)
            denied = [...denied,response.data['applied'][key]]
            if(response.data['applied'][key].gotOffer)
            offer = [...offer,response.data['applied'][key]]
        }
        if(interview.length >0)
          localStorage.setItem('gotInterview',JSON.stringify(interview))
          if(denied.length >0)
          localStorage.setItem('denied',JSON.stringify(denied))
          if(offer.length >0)
          localStorage.setItem('offer',JSON.stringify(offer))
          localStorage.setItem('applied',JSON.stringify(applied))
          localStorage.setItem('userName',googleResponde.ot.Ad)
          this.setState({needLogin:false})
          this.props.dashBoard.setState({gotInterview:interview,deniedJobs:denied,offeredJobs:offer,appliedJobs:applied,userName:googleResponde.ot.Ad})
          
      

      }
      this.props.dashBoard.setState({needLogin:false})
         
         
  })
}


   
    
returnTodayDate = ()=>
{
  let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();

return dd + '/' + mm + '/' + yyyy;
}

  submit = () => {
    if(this.props.status === 'open'){
      if(localStorage.getItem('userSession')){
        window.open(this.props.urlToAppy,'_blank')
       if(!this.props.dashBoard.state.needLogin)
       if( document.getElementsByClassName('react-confirm-alert-overlay')[0])
         document.getElementsByClassName('react-confirm-alert-overlay')[0].style.visibility = "visible"; 
    confirmAlert({
      title: 'Have you apply for this position?',
      message: 'Press yes to mark as apply and remove from list',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {

            if(this.props.dashBoard.state.appliedJobs){
              let appliedJob = this.props.jobs
              appliedJob.gotInterview=false
              appliedJob.gotOffer=false
              appliedJob.gotDenied=false
              appliedJob.appliedDate =this.returnTodayDate()
              let newArrayOfAppliedJobs = JSON.stringify([...JSON.parse(localStorage.getItem('applied')), appliedJob ])
              localStorage.setItem('applied',newArrayOfAppliedJobs)

              let appliedTemp = JSON.parse(localStorage.getItem('applied'))
              this.props.dashBoard.setState({appliedJobs:appliedTemp})
              fireBase.put('/users/'+this.props.dashBoard.state.googleId+'/applied/'+appliedJob.id+'.json',appliedJob)
              
            }
            else{
              let appliedJob = this.props.jobs

              appliedJob.appliedDate =this.returnTodayDate()
              appliedJob.gotInterview=false
              appliedJob.gotOffer=false
              appliedJob.gotDenied=false
            localStorage.setItem('applied', JSON.stringify([appliedJob]))
            fireBase.put('/users/'+this.props.dashBoard.state.googleId+'/applied/'+appliedJob.id+'.json',appliedJob)
            this.props.dashBoard.setState({appliedJobs:[appliedJob]})
            }
          }
        },
        {
          label: 'No',
          onClick: () => null
        }
      ]
    });
  }
  else{
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='custom-ui'>
            <h1>Are you sure?</h1>
            <p>You want to delete this file?</p>
            
            <div><Row><Col><GoogleLogin
     clientId={process.env.REACT_APP_GOOGLE_AUTH_API_KEY}
       buttonText="Google Login"
       onSuccess={(googleResponde)=>this.responseGoogle(googleResponde,this)}
       onFailure={console.log("Login Error")}
       cookiePolicy={'single_host_origin'}
      
     /></Col></Row></div>
     <button onClick={onClose}>No Thanks</button>
          </div>
        );
      }
    });

    
  }
}
else window.open(this.props.urlToAppy,'_blank')
  };
 
  render() {
    return (
      <div className='container'>
        <Button onClick={this.submit}>{this.props.status ==='applied' || this.props.status ==='gotInterview'||this.props.status ==='gotDenied'||this.props.status ==='gotOffer' ? "View" : "Apply"}</Button>
      </div>
    );
  }
}

export default ConfirmAlert 