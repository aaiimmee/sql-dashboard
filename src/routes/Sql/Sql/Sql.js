import React, {Component} from 'react';
import Sider from './Sider'
import Content from './Content'

export default class extends Component{
  render () {
    return (
      <div>
        <Sider />
        <Content />
      </div>
    )
  }
}
