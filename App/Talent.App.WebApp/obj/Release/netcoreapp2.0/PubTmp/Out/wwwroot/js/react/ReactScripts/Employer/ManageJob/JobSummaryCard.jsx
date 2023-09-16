import React from 'react';
import Cookies from 'js-cookie';
import { Popup, Modal, Header, Icon, Card, Button, Grid, Label } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        }
        /*this.selectJob = this.selectJob.bind(this)*/
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleOpen() {
        this.setState({ open: true });
    }

    handleClose() {
        this.setState({ open: false });
    }

    render() {
        const { job, handleCloseJob } = this.props;
        const currentDate = new Date();
        const expiryDate = new Date(job.expiryDate);
        const isExpired = currentDate > expiryDate;

        return (
            <div className="ui column">
                <div className="ui three stackable cards">
                    <Card raised style={{ minWidth: '300px', width: '100%', height: '400px' }}>
                        <Card.Content>
                            <Card.Header>{job.title}</Card.Header>
                            <Label color='black' ribbon='right'><Icon name='user' /> 0 </Label>
                            <Card.Meta>{job.location.city}, {job.location.country} - {moment(job.createdOn).format('MMMM Do, YYYY')}</Card.Meta>
                            <Card.Meta></Card.Meta>
                            <Card.Description>{job.summary}</Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <Grid width={12}>
                                <Grid.Column width={4}>
                                    <Button.Group size='mini' floated='left'>
                                        {isExpired && (
                                            <Button color="red">
                                                Expired
                                            </Button>
                                        )}
                                    </Button.Group>
                                </Grid.Column>
                                <Grid.Column width={12}>
                                    <Button.Group floated='right' size='mini'>
                                        <Modal
                                            basic
                                            onClose={this.handleClose}
                                            open={this.state.open}
                                            size='small'
                                            trigger={job.status === 1 ? (
                                                <Button
                                                    basic
                                                    color='blue'
                                                    icon='archive'
                                                    content='Closed'
                                                    disabled
                                                />
                                            ) : (
                                                <Button
                                                    basic
                                                    color='blue'
                                                    icon='close'
                                                    content='Close'
                                                    onClick={this.handleOpen}
                                                />
                                            )}>
                                            <Header icon>
                                                <Icon name='briefcase' />
                                                <div className="row" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <h2>Job details:</h2>
                                                    <span>{job.title}</span>
                                                    <span> {job.location.city}, {job.location.country} - {moment(job.createdOn).format('MMMM Do, YYYY')}</span>
                                                    <br />
                                                    <h2>
                                                        " Do you wish to proceed with closing this job? "
                                                    </h2>
                                                </div>
                                            </Header>
                                            <Modal.Actions>
                                                <Button color='red' inverted onClick={this.handleClose}>
                                                    <Icon name='remove' /> No
                                                </Button>
                                                <Button color='green' inverted onClick={() => { handleCloseJob(job.id); this.handleClose(); }}>
                                                    <Icon name='checkmark' /> Yes
                                                </Button>
                                            </Modal.Actions>
                                        </Modal>
                                        <Button
                                            basic
                                            color='blue'
                                            icon='edit'
                                            content='Edit'
                                        />
                                        <Button
                                            basic
                                            color='blue'
                                            icon='copy'
                                            content='Copy'
                                            style={{ textAlign: 'right' }}
                                        />
                                    </Button.Group>
                                </Grid.Column>
                            </Grid>
                        </Card.Content>
                    </Card>
                </div>
            </div>
        );
    }
}
