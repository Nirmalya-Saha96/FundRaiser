import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import Layout from '../../components/Layout';
import { Link } from '../../routes';
import SearchBox from '../../components/SearchBox';

class Npos extends Component {
  state = {
    c: ""
  };

    onSearchChange = (e) => {
     this.setState({c: e.target.value});
   }

  static async getInitialProps() {
    const npo = await factory.methods.getDeployedNPOCampaigns().call();
    const npol = npo.length;

    return { npo, npol };
  }

  renderNpo() {
    const fill = this.props.npo.filter(profile => (
               profile.toLowerCase().includes(this.state.c.toLowerCase())
            ));
    const items = fill.map((address, index) => {
      return {
        header: index,
        description: (
          address
        ),
        extra: (
          <Link route={`/npos/${address}`}>
            <a>View Personal</a>
          </Link>
        ),
        style: { overflowWrap: 'break-word' },
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }


  render() {
    return (
      <Layout>
        <div>
          <h3>Open Scholarships</h3>
          <Link route='/npos/new'>
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
                content: [this.props.npol],
              }}
            />
          </Link>
          <SearchBox searchChange={ this.onSearchChange}/>
          <br />
          {this.renderNpo()}
        </div>
      </Layout>
    );
  }
}

export default Npos;
