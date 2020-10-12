
import React from "react";
// react plugin used to create charts
import { Line, Pie } from "react-chartjs-2";
import axios from 'axios'
import Spinner from '../components/Spinner/Spinner'

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
// core components
import {
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart,
} from "../variables/charts";
import Job from '../components/Jobs/Job'
import fireBase from '../components/postJobs/postJobs'

class Dashboard extends React.Component {

  
  state = {
    loading:false,
    query:'Student',
    location:'israel',
    category:'Jobs',
    Jobs:"",
    status:'open',
    openJobsNumber:0,
    maxResults:150,
    deniedJobs:localStorage.getItem('denied') ? JSON.parse(localStorage.getItem('denied')) : null,
    appliedJobs : localStorage.getItem('applied') ? JSON.parse(localStorage.getItem('applied')) : null,
    gotInterview : localStorage.getItem('gotInterview') ? JSON.parse(localStorage.getItem('gotInterview')) : null,
    offeredJobs : localStorage.getItem('offer') ? JSON.parse(localStorage.getItem('offer')) : null,
    googleId :localStorage.getItem('userSession'),
    userName :localStorage.getItem('userName'),
    title:'Open Positions:',
    needLogin: localStorage.getItem('userSession') ? false : true
}

updatePie = () =>{
  let applied = this.state.appliedJobs ? this.state.appliedJobs.length :0
  let interview =  this.state.gotInterview ? this.state.gotInterview.length :0
  let denied =  this.state.deniedJobs ? this.state.deniedJobs.length :0
  let offer =  this.state.offeredJobs ? this.state.offeredJobs.length :0
  dashboardEmailStatisticsChart.data={
   
          
    labels: [1, 2, 3,4],
    datasets: [
      {
        label: "Emails",
        pointRadius: 0,
        pointHoverRadius: 0,
        backgroundColor: ["#e3e3e3", "#4acccd", "#fcc468", "#ef8157"],
        borderWidth: 2,
        data: [offer, applied, interview, denied],
      },
    ],
 

}
}

componentDidMount = () => {
        fireBase.get('/jobs.json').then (response => {
            if(response.data){
              localStorage.setItem('openJobs',JSON.stringify(response.data))
              const appliedJobs = localStorage.getItem('applied');
               let openJobsNumber;
                if (!appliedJobs) openJobsNumber = response.data.length;
                else{
                  const jobIds = {};
                  for (let job of JSON.parse(localStorage.getItem('applied'))){
                    jobIds[job.id] = job;
                  }
                  openJobsNumber = response.data.filter(openJob => !jobIds[openJob.id]).length;
                }
                

            
               
               this.setState({Jobs: response.data , openJobsNumber})
            
          }
          else{
            this.setState({Jobs:""})
          }
        })
        this.interval = setInterval(() => this.createNewJob, 3600000);
        this.updatePie()
  }

  
  componentWillUnmount = ()=> {
    clearInterval(this.interval);
  }



  appliedJobs =()=>{
    
    this.setState({Jobs:JSON.parse(localStorage.getItem('applied')),status:'applied',title:'Applied Positions:'})
    
 }

 openJobs =()=>{

    this.setState({Jobs:JSON.parse(localStorage.getItem('openJobs')),status:'open', title:'Open Positions:'})
    
 }

 gotInterviewJobs =()=>{

   this.setState({Jobs:JSON.parse(localStorage.getItem('applied')),status:'gotInterview', title:'Got Interview Positions:'})
   
}

gotDenied =()=>{

 this.setState({Jobs:JSON.parse(localStorage.getItem('applied')),status:'gotDenied',title:'Got Denied Positions:'})
}

gotOffer =()=>{

  this.setState({Jobs:JSON.parse(localStorage.getItem('offer')),status:'gotOffer',title:'Got Offer Positions:'})
  
}

createNewJob = () =>{
    const data = {
        query : this.state.query,
        location : this.state.location,
        category : this.state.category,
        maxResults : this.state.maxResults
    }
    console.log('Getting new jobs')
    this.setState({loading:true})
    axios.post('https://api.apify.com/v2/acts/alexey~glassdoor-jobs-scraper/run-sync-get-dataset-items?token='+process.env.REACT_APP_API_KEY,data)
            .then (response => {
              this.setState({loading:false})
              fireBase.put('/jobs.json',response.data)
                
                this.setState({Jobs:response.data})
            })
}

  render() {
   
    return (
      <>
        <div className="content" >
          <Row style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            <Col lg="2" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row >
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-globe text-warning" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div onClick={this.openJobs} className="numbers">
                        <p className="card-category">Open Positions</p>
    <CardTitle tag="p">{this.state.openJobsNumber}</CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div onClick={this.createNewJob} className="stats">
                    {this.state.loading ? <Spinner/> : null} Update Now
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="2" md="6" sm="6" xs="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-send text-success" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers"  onClick={this.appliedJobs}>
                        <p className="card-category">Applied Jobs</p>
    <CardTitle tag="p">{this.state.appliedJobs ? this.state.appliedJobs.length :0}</CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="far fa-calendar" /> Last day
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="2" md="6" sm="6" xs="6">
              <Card onClick={this.gotInterviewJobs} className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-chat-33 text-danger" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">Got Interview</p>
                        <CardTitle tag="p"> {this.state.gotInterview ?this.state.gotInterview.length :0}</CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="far fa-clock" /> In the last hour
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="2" md="6" sm="6" xs="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-simple-remove text-primary" />
                      </div>
                    </Col>
                    <Col onClick={this.gotDenied} md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">Got Denied</p>
    <CardTitle tag="p">{this.state.deniedJobs ?this.state.deniedJobs.length :0}</CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="fas fa-sync-alt" /> Update now
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="2" md="6" sm="6" xs="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-money-coins text-info" />
                      </div>
                    </Col>
                    <Col onClick={this.gotOffer} md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">Got An Offer</p>
                        <CardTitle tag="p">{this.state.offeredJobs ?this.state.offeredJobs.length :0}</CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="fas fa-sync-alt" /> Update now
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
          <Row >
            <Col md="12">
            <Card >
                <CardHeader>
    <CardTitle tag="h5">{this.state.title}</CardTitle>
                  
                </CardHeader>
                
              {
              
              this.state.Jobs ? this.state.Jobs.map((job, index) => {
               var flag=true
               
              if(localStorage.getItem('applied') && this.state.status==='open'){
              
              JSON.parse(localStorage.getItem('applied')).map((job2,i2) =>{
                if (job2.id===job.id) flag=false;
              });
            }
            
             return (flag&&job.gotInterview&&!job.gotDenied&&!job.gotOffer &&this.state.status ==='gotInterview') || (flag&&!job.gotInterview&&!job.gotDenied&&!job.gotOffer&&this.state.status ==='applied') || (flag&&!job.gotDenied&&this.state.status ==='open') || (this.state.status === 'gotDenied'&& job.gotDenied&& !job.gotOffer) || (this.state.status === 'gotOffer'&& !job.gotDenied&& job.gotOffer)? <Job jobs={job}
              company={job.companyDetails.name} 
              logo = {job.companyDetails.logo}
              link={job.url}
              datePosted={job.datePosted}
              jobDetails={job.jobDetails}
              jobTitle = {job.jobTitle}
              jobLocation = {job.jobLocation.address.addressLocality}
              jobId = {job.id}
              jobIndex = {index}
              dashBoard={this}
              status={this.state.status}
              appliedDate = {job.appliedDate}
           
              
              // latitude = {job.jobLocation.geo.latitude}
              // longitude = {job.jobLocation.geo.longitude}
    
              key={job.id}
              />:null
            }):null}

          
                
              </Card>
            </Col>
          </Row>
          <Row style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            <Col md="4">
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">Statistics</CardTitle>
                  <p className="card-category">your Apply Performance</p>
                </CardHeader>
                <CardBody>
                  <Pie
                    data={dashboardEmailStatisticsChart.data}
                    options={dashboardEmailStatisticsChart.options}
                  />
                </CardBody>
                <CardFooter>
                  <div className="legend">
                    <i className="fa fa-circle text-primary" /> Applied{" "}
                    <i className="fa fa-circle text-warning" /> Interview{" "}
                    <i className="fa fa-circle text-danger" /> Denied{" "}
                    <i className="fa fa-circle text-gray" /> Offer
                  </div>
                  <hr />
                 
                </CardFooter>
              </Card>
            </Col>
          
          </Row>
        </div>
      </>
    );
  }

}

export default Dashboard;
