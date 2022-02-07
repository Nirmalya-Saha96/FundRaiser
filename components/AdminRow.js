import React, { Component } from 'react';
import { Table, Button, Message, Icon } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import FundRaiser from '../ethereum/fundRaiser';
import factory from '../ethereum/factory';
import { Router } from '../routes';

class AdminRow extends Component {
  state = {
    loading: false
  };

  onApproveProject = async () => {
    this.setState({ loading: true });
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createProjectCampaign(this.props.id).send({
        from: accounts[0]
      });
      Router.replaceRoute(`/adminfactory`);
    this.setState({ loading: false });
  };

  onApproveNGO = async () => {
    this.setState({ loading: true });
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createNGOCampaign(this.props.id).send({
        from: accounts[0]
      });
      Router.replaceRoute(`/adminfactory`);
    this.setState({ loading: false });
  };

  render() {
    const { Row, Cell } = Table;
    const { id, check } = this.props;

    return (
      <Row positive={check.isChecked}>
        <Cell>{id}</Cell>
        <Cell>{check.adminName}</Cell>
        <Cell>{check.adminDescription}</Cell>
        <Cell>
          <Button color='yellow'><a target='blank' href={check.adminIpfs}><Icon name='check circle outline' /></a></Button>
        </Cell>
        <Cell>{web3.utils.fromWei(check.adminMinimum, 'ether')} ethers</Cell>
        <Cell>{check.adminManager}</Cell>
        <Cell>
          {check.isChecked ? null : (
            check.isProject ? (
              <Button loading={this.state.loading} color="green" onClick={this.onApproveProject}>
                Approve
              </Button>
            ) : (
              <Button loading={this.state.loading} color="yellow" onClick={this.onApproveNGO}>
                Approve
              </Button>
          )
          )}
        </Cell>
      </Row>
    );
  }
}

export default AdminRow;
