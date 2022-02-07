import React, { Component } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import fundRaiser from '../../ethereum/fundRaiser';
import web3 from '../../ethereum/web3';
import { Link, Router } from '../../routes';
import Layout from '../../components/Layout';

class NewRequestNgo extends Component {
  state = {
    value: '',
    description: '',
    recipient: '',
    loading: false,
    errorMessage: ''
  };

  static async getInitialProps(props) {
    const { address } = props.query;

    return { address };
  }

  onSubmitRequest = async event => {
    event.preventDefault();

    const ngo = fundRaiser(this.props.address);
    const { description, value, recipient } = this.state;

    this.setState({ loading: true, errorMessage: '' });

    try {
      const accounts = await web3.eth.getAccounts();
      await ngo.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({ from: accounts[0] });

      Router.pushRoute(`/ngos/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <Link route={`/ngos/${this.props.address}/requests`}>
          <a>Back</a>
        </Link>
        <h1>Create A Transaction Request</h1>
        <Form onSubmit={this.onSubmitRequest} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })}
                label="description"
                labelPosition="right"/>
          </Form.Field>

          <Form.Field>
            <label>Value in Ethers</label>
            <Input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
              label="ether"
              labelPosition="right"
            />
          </Form.Field>

          <Form.Field>
            <label>Recipient Address</label>
            <Input
              value={this.state.recipient}
              onChange={event =>
                this.setState({ recipient: event.target.value })}
                label="address"
                labelPosition="right"
            />
          </Form.Field>

          <Message error header="Something Went Wrong" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>
            CREATE
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default NewRequestNgo;
