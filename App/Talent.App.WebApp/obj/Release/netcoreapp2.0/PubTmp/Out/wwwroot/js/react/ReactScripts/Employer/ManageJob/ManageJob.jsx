import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Button,Progress, Dropdown, Input, Select, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader) --showClosed: false,
        this.state = {
            loadJobs: [],
            filteredJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: true,
                showDraft: false,
                showExpired: true,
                showUnexpired: true,
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.handleCloseJob = this.handleCloseJob.bind(this);

    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        //this.loadData(() =>
        //    this.setState({ loaderData })
        //)

        //console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.init();
        this.loadData();
    };

    handlePageChange(e, { activePage }) {
        this.setState({ activePage }, () => this.loadData());
    }

    test() {
        console.log(this.state.filter);
    }

    handleSortChange(e, { value }) {

        this.setState(
            {
                sortBy: {
                    date: value,
                },
                activePage: 1,
            },
            () => this.loadData()
        );
        //console.log(this.state.sortBy);
    }

    handleFilterChange(selectedOptions) {
        const filterOptions = ['showActive', 'showClosed', 'showDraft', 'showExpired', 'showUnexpired'];

        if (selectedOptions.includes('showAll')) {
            this.setState(
                {
                    filter: {
                        showActive: true,
                        showClosed: true,
                        showDraft: true,
                        showExpired: true,
                        showUnexpired: true,
                    },
                    activePage: 1, 
                },
                () => this.loadData()
            );
        } else {
            const newFilter = {};
            filterOptions.forEach((option) => {
                newFilter[option] = selectedOptions.includes(option);
            });

            this.setState(
                {
                    filter: newFilter,
                    activePage: 1, 
                },
                () => this.loadData()
            );
            //console.log(this.state.filter);
        }
    }

    handleCloseJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        var link = 'https://talentservicestalent.azurewebsites.net/listing/listing/closeJob';

        //var data = JSON.stringify(id);
        console.log(id);

        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            type: "post",
            data: JSON.stringify(id),
            success: (res) => {
                if (res.Success) {
                    TalentUtil.notification.show(res.message, 'success', null, null);
                    //this.setState((prevState) => {
                    //    const updatedLoadJobs = prevState.loadJobs.filter((job) => job.id !== id);
                    //    return {
                    //        loadJobs: updatedLoadJobs
                    //    };
                    //}); 
                } else {
                    TalentUtil.notification.show(res.message, 'error', null, null);
                }
            },
            error: (error) => {
                console.error('Error closing job:', error);
            }
        });
    }

    loadData() {
        var link = 'https://talentservicestalent.azurewebsites.net/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
        const data = {
            showActive: this.state.filter.showActive,
            showClosed: this.state.filter.showClosed,
            showDraft: this.state.filter.showDraft,
            showExpired: this.state.filter.showExpired,
            showUnexpired: this.state.filter.showUnexpired,
            sortbyDate: this.state.sortBy.date,
            activePage: this.state.activePage,
        };
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            dataType: 'json',
            type: 'GET',
            data: data,
            //body: JSON.stringify(),
            success: (res) => {
                if (res.success) {
                    this.setState({
                        loadJobs: res.myJobs,
                        totalPages: Math.ceil(res.totalCount / 6)
                        //}, () => {
                        //    console.log(this.state.loadJobs);
                    });
                    //console.log(res);
                } else {
                    TalentUtil.notification.show(res.Message, 'error', null, null);
                }
            },
            error: (error) => {
                console.error('Error loading job data:', error);
            }
        });
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    render() {
        const { loadJobs, filter, sortBy, filteredJobs } = this.state;

        const filterOptions = [
            { key: 'showAll', text: 'Select All', value: 'showAll' },
            { key: 'showActive', text: 'Show Active Jobs', value: 'showActive' },
            { key: 'showClosed', text: 'Show Closed Jobs', value: 'showClosed' },
            { key: 'showDraft', text: 'Show Draft Jobs', value: 'showDraft' },
            { key: 'showExpired', text: 'Show Expired Jobs', value: 'showExpired' },
            { key: 'showUnexpired', text: 'Show Unexpired Jobs', value: 'showUnexpired' },
        ];

        const sortOptions = [
            { key: 'newest', value: 'desc', text: 'Newest First' },
            { key: 'oldest', value: 'asc', text: 'Oldest First' },
        ];

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container" >
                    <h1>List of Jobs</h1>
                    <div className="ui stackable">
                        <div className="row">
                            <Icon name="filter" />
                            Filter:
                            <Dropdown
                                text='Choose filter'
                                name="filterOptions"
                                options={filterOptions}
                                multiple
                                value={Object.keys(filter).filter((key) => filter[key])}
                                onChange={(e, { value }) => this.handleFilterChange(value)}
                            />
                            <Icon name="calendar" style={{ marginLeft: '20px' }} />
                            Sort By Date:{' '}
                            <Dropdown
                                inline
                                options={sortOptions}
                                value={sortBy.date}
                                onChange={(e, { value }) => this.handleSortChange(e, { value })}
                            />
                        </div>
                    </div>
                    <br />
                    <hr />
                    <div className="ui stackable three column grid">
                        {loadJobs.length > 0 ? (
                            loadJobs.map((job) => (
                                <JobSummaryCard key={job.id} job={job} handleCloseJob={this.handleCloseJob} />
                            ))
                        ) : (
                            <div className="column">
                                <br />
                                    <p className="text center">No jobs match the selected filters.</p>
                                    
                            </div>
                        )}
                    </div>
                    <br />
                    <br />
                    {loadJobs.length > 0 && ( 
                        <div className="pagination-container">
                            <Pagination
                                activePage={this.state.activePage}
                                onPageChange={this.handlePageChange}
                                totalPages={this.state.totalPages}
                                ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
                                prevItem={{ content: <Icon name="angle double left" />, icon: true }}
                                nextItem={{ content: <Icon name="angle double right" />, icon: true }}
                            />
                            </div>
                    )}
                    <br/>
                </div>
            </BodyWrapper>
        );

    }
}

//<BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
//    <div className="ui container" >
//        <h1>List of Jobs</h1>
//        <Button color="green" onClick={() => this.test()}>
//            View Details
//        </Button>
//        <div className="ui stackable">
//            <div className="row">
//                <Icon name="filter" />
//                Filter:
//                <Dropdown
//                    text='Choose filter'
//                    name="filterOptions"
//                    options={filterOptions}
//                    multiple
//                    value={Object.keys(filter).filter((key) => filter[key])}
//                    onChange={(e, { value }) => this.handleFilterChange(value)}
//                />
//                <Icon name="calendar" style={{ marginLeft: '20px' }} />
//                Sort By Date:{' '}
//                <Dropdown
//                    inline
//                    options={sortOptions}
//                    value={sortBy.date}
//                    onChange={(e, { value }) => this.handleSortChange(e, { value })}
//                />
//            </div>
//        </div>
//        <br />
//        <br />
//        <div className="ui stackable three column grid">
//            {loadJobs.length > 0 ? (
//                loadJobs.map((job) => (
//                    <JobSummaryCard key={job.id} job={job} handleDeleteJob={this.handleCloseJob} />
//                ))
//            ) : (
//                <p>No jobs match the selected filters.</p>
//            )}
//        </div>
//        <br />
//        <br />
//        {loadJobs.length > 0 && ( // Only render pagination if there are jobs
//            <div className="pagination-container">
//                <Pagination
//                    activePage={this.state.activePage}
//                    onPageChange={this.handlePageChange}
//                    totalPages={this.state.totalPages}
//                    ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
//                    prevItem={{ content: <Icon name="angle double left" />, icon: true }}
//                    nextItem={{ content: <Icon name="angle double right" />, icon: true }}
//                />
//            </div>
//        )}
//    </div>
//</BodyWrapper>

//<Dropdown text='Choose filter' multiple >
//    <Dropdown.Menu>
//        <Input icon='search' iconPosition='left' className='search' />
//        <Dropdown.Divider />
//        <Dropdown.Header icon='tags' content='Tag Label' />
//        <Dropdown.Menu scrolling>
//            {filterOptions.map((option) => (
//                <Dropdown.Item
//                    multiple
//                    key={option.value} {...option}
//                    onClose={(e, { value }) => this.handleFilterChange(value)} />
//            ))}
//        </Dropdown.Menu>
//    </Dropdown.Menu>
//</Dropdown>