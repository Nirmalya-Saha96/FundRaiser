import React from 'react';
import { Menu, Segment } from 'semantic-ui-react'
import { Link } from '../routes';

export default () => {

    return (
      <Menu stackable style={{ marginTop: '10px' }}>
        <Menu.Item>
        <Link route="/">
          <a className="item">FundRaiser</a>
        </Link>
        </Menu.Item>

        <Menu.Item>
        <Link route="/">
          <a className="item">FundRaiser</a>
        </Link>
        </Menu.Item>

        <Menu.Item>
        <Link route="/">
          <a className="item">FundRaiser</a>
        </Link>
        </Menu.Item>
      </Menu>
    );
};
