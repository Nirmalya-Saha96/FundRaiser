import React, { Component } from 'react';
import { Card, Button, Table } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import Layout from '../../components/Layout';
import AdminRow from '../../components/AdminRow';
import { Link } from '../../routes';
import web3 from '../../ethereum/web3';

class AdminFactory extends Component {
  state = {
    loading: false
  };

  static async getInitialProps() {
    const projects = await factory.methods.getDeployedProjectCampaigns().call();
    const ngos = await factory.methods.getDeployedNGOCampaigns().call();
    const npos = await factory.methods.getDeployedNPOCampaigns().call();
    const care = await factory.methods.getCustomerCareCount().call();
    const balance = await factory.methods.getBalance().call();
    const reportCount = await factory.methods.getReportCount().call();
    const checkCount = await factory.methods.getAdminCheckCount().call();

    const adminCheck = await Promise.all(
      Array(parseInt(checkCount))
        .fill()
        .map((element, index) => {
          return factory.methods.adminCheck(index).call();
        })
    );

    const pl = projects.length;
    const ngol = ngos.length;
    const npol = npos.length;

    return { pl, ngol, npol, care, balance, reportCount, checkCount, adminCheck };
  }

  renderCards(){
    const items = [
     {
       header: 'Registered FundRaiser',
       description:
         [this.props.pl, ' Projects,  ', this.props.ngol, ' NGOs,  ', this.props.npol, ' Non-Profit Organisations,  '],
       meta: 'Approved'
     },
     {
       header: 'Registered Isssues, of Campaigns',
       description:
         [this.props.care, ' Registered CustomerCare  ', ' Out of ',this.props.reportCount],
       meta: 'Issues',
     },
     {
       header: 'Other Informations',
       description:
         [this.props.checkCount, ' Pending Approvals ', this.props.balance, ' wei Current Balance '],
       meta: 'Info',
     },
   ];
   return <Card.Group style={{padding: '40px'}} items={items} />;
  }

  renderRows() {
    return this.props.adminCheck.map((check, index) => {
      return (
        <AdminRow
          key={index}
          id={index}
          check={check}
        />
      );
    });
  }

  onStartVoting = async () => {
    this.setState({ loading: true });
      const accounts = await web3.eth.getAccounts();
      await factory.methods.startVoting().send({
        from: accounts[0]
      });
    this.setState({ loading: false });
  };

  onDeclareResults = async () => {
    this.setState({ loading: true });
      const accounts = await web3.eth.getAccounts();
      await factory.methods.declareResult().send({
        from: accounts[0]
      });
    this.setState({ loading: false });
  };

  render() {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <div>
          <h1 style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}>ADMIN CONTROL PANEL</h1>
          <Button.Group style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}>
             <Button loading={this.state.loading} onClick={this.onStartVoting} positive>START VOTING</Button>
             <Button.Or />
             <Button loading={this.state.loading} onClick={this.onDeclareResults} color='yellow'>DECLARE RESULTS</Button>
          </Button.Group>
          {this.renderCards()}

          <Table>
            <Header>
              <Row>
                <HeaderCell>ID</HeaderCell>
                <HeaderCell>Name</HeaderCell>
                <HeaderCell>Description</HeaderCell>
                <HeaderCell>Documentary Proof</HeaderCell>
                <HeaderCell>Minimum Contribution</HeaderCell>
                <HeaderCell>Manager</HeaderCell>
                <HeaderCell>Approve</HeaderCell>
              </Row>
            </Header>
            <Body>{this.renderRows()}</Body>
          </Table>
        </div>
      </Layout>
    );
  }
}

export default AdminFactory;
