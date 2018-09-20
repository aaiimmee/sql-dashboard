import React, { Component } from 'react';
import { Divider, Popconfirm, Table, Form, Select, Modal, Input, Button, Icon } from 'antd';
import { connect } from 'dva';

const { Option } = Select;
const FormItem = Form.Item;

@connect(({ admin, loading }) => ({
  admin,
  loading: loading.effects['admin/query'],
}))
class AdminList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'admin/query',
    });
  }

  onUserDel = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'admin/DelUser',
      payload: {
        userName: record.userName,
      },
    });
  };

  onShowModel = e => {
    e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  onTableControl = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'admin/skipTableList',
      payload: {
        userName: record.userName,
      },
    });
  };

  okHandler = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'admin/addUser',
          payload: fieldsValue,
        });
        this.hideModelHandler();
      }
    });
  };

  hideModelHandler = () => {
    const { form } = this.props;
    this.setState({
      visible: false,
    });
    form.resetFields();
  };

  render() {
    const { admin, loading, form } = this.props;
    const { UserList } = admin;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { visible } = this.state;
    const columns = [
      {
        title: '用户名',
        dataIndex: 'userName',
        key: 'userName',
        align: 'center',
      },
      {
        title: '部门',
        dataIndex: 'department',
        key: 'department',
        align: 'center',
      },
      {
        title: '项目组',
        dataIndex: 'group',
        key: 'group',
        align: 'center',
      },
      {
        title: '角色',
        dataIndex: 'role',
        key: 'role',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        render: (text, record) => (
          <span>
            <Popconfirm
              title="确定删除？"
              okText="Yes"
              cancelText="No"
              onConfirm={() => this.onUserDel(record)}
            >
              <a href="#">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a onClick={() => this.onTableControl(record)}>权限列表</a>
          </span>
        ),
      },
    ];
    return (
      <div>
        <span>
          <Button type="primary" style={{ marginBottom: 10 }} onClick={this.onShowModel}>
            <Icon type="plus-circle-o" />
            添加用户
          </Button>
          <Modal
            title="添加用户"
            visible={visible}
            onOk={this.okHandler}
            onCancel={this.hideModelHandler}
          >
            <Form layout="horizontal" onSubmit={this.okHandler}>
              <FormItem {...formItemLayout} label="用户名">
                {getFieldDecorator('userName', {
                  rules: [{ required: true, message: '用户名必填' }],
                })(<Input placeholder="请输入用户名" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="密码">
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码' }],
                })(<Input placeholder="请输入密码" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="部门">
                {getFieldDecorator('department', {
                  rules: [{ required: true, message: '请选择部门!' }],
                })(
                  <Select
                    placeholder="选择部门"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="技术部" key={1}>
                      技术部
                    </Option>
                    <Option value="商户拓展部" key={2}>
                      商户拓展部
                    </Option>
                    <Option value="运营部" key={3}>
                      运营部
                    </Option>
                    <Option value="综合管理部" key={4}>
                      综合管理部
                    </Option>
                    <Option value="产品部" key={5}>
                      产品部
                    </Option>
                    <Option value="总经办" key={6}>
                      总经办
                    </Option>
                    <Option value="稽核部" key={7}>
                      稽核部
                    </Option>
                    <Option value="市场部" key={8}>
                      市场部
                    </Option>
                    <Option value="设计部" key={9}>
                      设计部
                    </Option>
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="项目组">
                {getFieldDecorator('group', {
                  rules: [{ required: true, message: '请输入项目组' }],
                })(<Input placeholder="请输入项目组" />)}
              </FormItem>
              <FormItem {...formItemLayout} label="角色">
                {getFieldDecorator('role', {
                  rules: [{ required: true, message: '请选择角色!' }],
                })(
                  <Select
                    placeholder="请选择角色"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="admin" key="1">
                      admin
                    </Option>
                    <Option value="user" key="2">
                      user
                    </Option>
                  </Select>
                )}
              </FormItem>
            </Form>
          </Modal>
        </span>
        <Table
          pagination={{ pageSize: 5 }}
          rowKey={item => item.userName}
          columns={columns}
          dataSource={UserList}
          loading={loading}
        />
      </div>
    );
  }
}
export default Form.create()(AdminList);
