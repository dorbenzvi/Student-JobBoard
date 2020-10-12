import React from "react";
import ConfirmAlert from '../ConfrimAlert/ConfirmAlert'
import LinesEllipsis from 'react-lines-ellipsis'
import Switchtag from '../Switch/Switch'
import {
    Card,
    CardBody,
    CardFooter,
    CardTitle,
    Row,
    Col,
  } from "reactstrap";
class Job extends React.Component{

  state={
    gotInterview : false,
    
  }

  render(){
    return (
        <Col>
        <Card className="card-stats" >
          <CardBody >
            <Row>
              <Col >
    <CardTitle tag="p"><img style={{height:'60px', width:'60px'}} src={this.props.logo}></img><b>  {this.props.company} - {this.props.jobTitle}</b><p>{this.props.appliedDate?  "You have been applied on: "+this.props.appliedDate: null}</p></CardTitle>
              </Col>
              <Row><Col>
              <LinesEllipsis
                text={this.props.jobDetails}
                maxLine='3'
                ellipsis='...'
                trimRight
                basedOn='letters'
            />
              </Col></Row>
              <Row>
              <Col>
    <p> <ConfirmAlert jobs={this.props.jobs} jobId={this.props.jobId} jobIndex={this.props.jobIndex} dashBoard={this.props.dashBoard} urlToAppy = {this.props.link} status={this.props.status}></ConfirmAlert></p>
            {this.props.status==='applied' ? <Switchtag status='gotInterview' jobState={this} jobs={this.props.jobs} dashBoard={this.props.dashBoard} text="Got Interview?"/> : null}
            {this.props.status==='applied' || this.props.status ==='gotInterview' ? < Switchtag status='denied' jobState={this} jobs={this.props.jobs} dashBoard={this.props.dashBoard} text="Got Denied?"/> : null}
            {this.props.status ==='gotInterview' ? < Switchtag status='offer' jobState={this} jobs={this.props.jobs} dashBoard={this.props.dashBoard} text="Got Offer?"/> : null}
              </Col>
              </Row>
            </Row>
          </CardBody>
          <CardFooter>
            <hr />
            <div className="stats">
              <i className="far fa-calendar" /> {this.props.datePosted} - {this.props.jobLocation}
            </div>
          </CardFooter>
        </Card>
      </Col>
    )
  }
}

export default Job;