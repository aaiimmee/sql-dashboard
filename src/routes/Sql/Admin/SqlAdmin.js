import React, { Component } from 'react';
import { BackTop, Card } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import AdminList from './AdminList';

export default class extends Component {
  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <BackTop />
          <AdminList />
        </Card>
      </PageHeaderLayout>
    );
  }
}
