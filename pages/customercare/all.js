import React, { Component } from 'react';
import { Card, Button, Label } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import Layout from '../../components/Layout';
import { Link, Router } from '../../routes';
import web3 from '../../ethereum/web3';
import SearchBox from '../../components/SearchBox';

class CustomerCare extends Component {
  state = {
    c: "",
    loading: false
  };

    onSearchChange = (e) => {
     this.setState({c: e.target.value});
   }

  static async getInitialProps() {
    const careCount = await factory.methods.getCustomerCareCount().call();
    const accounts = await web3.eth.getAccounts();
    const manager = await factory.methods.manager().call();

    const care = await Promise.all(
      Array(parseInt(careCount))
        .fill()
        .map((element, index) => {
          return factory.methods.cure(index).call();
        })
    );

    return { careCount, care, accounts, manager };
  }

  onUpvote = async (id) => {
    this.setState({ loading: true });
      const accounts = await web3.eth.getAccounts();
      await factory.methods.upvoteCustomerCare(id).send({
        from: accounts[0]
      });
      Router.replaceRoute(`/customercare`);
    this.setState({ loading: false });
  };

  onAlert = async (id) => {
    this.setState({ loading: true });
      const accounts = await web3.eth.getAccounts();
      await factory.methods.setAlert(id).send({
        from: accounts[0]
      });
      Router.replaceRoute(`/customercare`);
    this.setState({ loading: false });
  };

  renderProjects() {
    const fill = this.props.care.filter(profile => (
               profile.campaignAddress.toLowerCase().includes(this.state.c.toLowerCase())
            ));
    const items = fill.map((address, index) => {
      return {
        header: address.campaignName,
        meta: address.campaignAddress,
        description: (
          address.problem
        ),
        extra: (
          <div className='ui two buttons'>
          <Button
            basic
            color='green'
            content='UpVote'
            icon='arrow up'
            loading={this.state.loading}
            onClick={()=> this.onUpvote(index)}
            label={{
              as: 'a',
              basic: true,
              color: 'green',
              pointing: 'left',
              content: [address.voteCount],
            }}
          />
          {address.imp  ?
            (
              <Button disabled solid color='red'>
                ALERT
              </Button>
            ) : null
          }

          </div>
        ),
        style: { overflowWrap: 'break-word' },
      };
    });

    return <Card.Group items={items} />;
  }

  renderAdmin() {
    const fill = this.props.care.filter(profile => (
               profile.campaignAddress.toLowerCase().includes(this.state.c.toLowerCase())
            ));
    const items = fill.map((address, index) => {
      return {
        header: address.campaignName,
        meta: address.campaignAddress,
        description: (
          address.problem
        ),
        extra: (
          <div className='ui two buttons'>
          {address.imp  ?
            (
              <Button
                basic
                color='red'
                content='Set Alert'
                icon='alarm'
                disabled
              />
            ) : (
              <Button
                basic
                color='red'
                content='Set Alert'
                icon='alarm'
                loading={this.state.loading}
                onClick={()=> this.onAlert(index)}
              />
            )
          }
          <Button
            basic
            color='green'
            content='UpVotes'
            label={{
              as: 'a',
              basic: true,
              color: 'green',
              pointing: 'left',
              content: [address.voteCount],
            }}
          />
          </div>
        ),
        style: { overflowWrap: 'break-word' },
      };
    });

    return <Card.Group items={items} />;
  }



  render() {
    return (
      <Layout>
        <div>
          <h3>CUSTOMER CARE</h3>
          <Link route='/customercare/new'>
            <Button
              floated="right"
              basic
              color='yellow'
              content='ADD'
              icon='add'
              label={{
                as: 'a',
                basic: true,
                color: 'yellow',
                pointing: 'left',
                content: [this.props.careCount],
              }}
            />
          </Link>
          <SearchBox searchChange={ this.onSearchChange}/>
          <br />
          {this.props.manager === this.props.accounts[0] ?
            (
              this.renderAdmin()
            ) : (
              this.renderProjects()
            )
          }
        </div>
      </Layout>
    );
  }
}

export default CustomerCare;
