import React, { Component } from 'react';
import { Table, Button, Icon } from 'semantic-ui-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import web3 from '../ethereum/web3';
import factory from '../ethereum/factory';
import { Router } from '../routes';

class VoteRow extends Component {
  state = {
    loading: false
  };

  onVote = async () => {
    this.setState({ loading: true });
    const accounts = await web3.eth.getAccounts();
    await factory.methods.vote(this.props.id).send({
      from: accounts[0]
    });
    Router.replaceRoute(`/vote`);
  this.setState({ loading: false });
  };

  render() {
    const { id, request } = this.props;

    return (
      <Table.Row>
        <Table.Cell>{id}</Table.Cell>
        <Table.Cell>{request.campaignName}</Table.Cell>
        <Table.Cell>
        <CopyToClipboard text={request.managerAddress}>
          <a>{request.managerAddress} <Icon name='copy' /></a>
        </CopyToClipboard>
        </Table.Cell>
        <Table.Cell>
        <CopyToClipboard text={request.campaignAddress}>
          <a>{request.campaignAddress} <Icon name='copy' /></a>
        </CopyToClipboard>
        </Table.Cell>
        <Table.Cell>
          {request.voteCount}
        </Table.Cell>
        <Table.Cell>
            <Button loading={this.state.loading} solid color="green" basic onClick={this.onVote}>
              VOTE
            </Button>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default VoteRow;
