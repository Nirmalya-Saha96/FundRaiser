import React, { Component, useState } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import Layout from '../../components/Layout';
import { Link } from '../../routes';
import SearchBox from '../../components/SearchBox';

class Projects extends Component {
  state = {
    c: ""
  };

    onSearchChange = (e) => {
     this.setState({c: e.target.value});
   }

  static async getInitialProps() {
    const projects = await factory.methods.getDeployedProjectCampaigns().call();
    const pl = projects.length;

    return { projects, pl };
  }

  renderProjects() {
    const fill = this.props.projects.filter(profile => (
               profile.toLowerCase().includes(this.state.c.toLowerCase())
            ));
    const items = fill.map((address, index) => {
      return {
        header: index,
        description: (
          address
        ),
        extra: (
          <Link route={`/projects/${address}`}>
            <a>View Project</a>
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
          <h3>Open Projects</h3>
          <Link route='/projects/new'>
            <Button
              floated="right"
              basic
              color='yellow'
              content='New Project'
              icon='add'
              label={{
                as: 'a',
                basic: true,
                color: 'yellow',
                pointing: 'left',
                content: [this.props.pl],
              }}
            />
          </Link>
          <SearchBox searchChange={ this.onSearchChange}/>
          <br />
          {this.renderProjects()}
        </div>
      </Layout>
    );
  }
}

export default Projects;
