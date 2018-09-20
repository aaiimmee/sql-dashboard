import React, { Component } from 'react';
import { Popconfirm, Table, Form, Select, Modal, Button, Icon, Card, Divider } from 'antd';
import { connect } from 'dva';
import { getPageQuery } from 'utils/utils';

const { Option } = Select;
const FormItem = Form.Item;

@connect(({ admin, loading }) => ({
  admin,
  loading: loading.effects['admin/query'],
}))
class TableControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: '添加权限',
      currentBase: '',
      currentTable: '',
      currentAuthorize: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const name = getPageQuery() && getPageQuery().userName;
    if (name) {
      dispatch({
        type: 'admin/tableControl',
        payload: {
          userName: name,
        },
      });
    }
  }

  onAddauthorize = () => {
    const { dispatch } = this.props;
    this.setState({
      visible: true,
    });
    dispatch({
      type: 'admin/fetchDatabase',
    });
  };

  onHandlechange = () => {
    const { dispatch, form } = this.props;
    setTimeout(() => {
      form.validateFields(['database'], (err, fieldsValue) => {
        dispatch({
          type: 'admin/allTable',
          payload: fieldsValue,
        });
      });
    }, 0);
  };

  onAuthorizeDel = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'admin/DelData',
      payload: record,
    });
  };

  onSubmit = () => {
    const { dispatch, admin } = this.props;
    const { TableList } = admin;
    const arr = TableList.map(item => Object.values(item));
    const keys = {};
    // eslint-disable-next-line
    arr.map(item => {
      keys[item[0]] = [...item[1]];
    });
    const name = getPageQuery() && getPageQuery().userName;
    dispatch({
      type: 'admin/addTableControl',
      payload: {
        userName: name,
        control: keys,
      },
    });
  };

  okHandler = () => {
    const { dispatch, form } = this.props;
    const { title } = this.state;
    if (title === '添加权限') {
      form.validateFields(['table', 'authorize'], (err, fieldsValue) => {
        dispatch({
          type: 'admin/AddData',
          payload: fieldsValue,
        });
      });
    } else {
      form.validateFields(['table', 'authorize'], (err, fieldsValue) => {
        console.log(fieldsValue);
        dispatch({
          type: 'admin/replaceAuthorize',
          payload: fieldsValue,
        });
        this.setState({
          currentBase: '',
          currentTable: '',
          currentAuthorize: [],
        });
      });
    }
    this.hideModelHandler();
  };

  editTable = record => {
    this.setState({
      visible: true,
      title: '编辑权限',
      currentBase: record.table.split('.')[0],
      currentTable: record.table,
      currentAuthorize: record.authorize,
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
    const { getFieldDecorator } = form;
    const { TableList, DataBase, table } = admin;
    const arr = TableList.map(item => item.table);
    /* 过滤掉已经添加过权限的表 */
    const common = table.filter(item => arr.indexOf(item) === -1);
    const { visible, currentTable, currentBase, currentAuthorize, title } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const columns = [
      {
        title: 'Table',
        dataIndex: 'table',
        key: 'table',
        align: 'center',
      },
      {
        title: '权限',
        dataIndex: 'authorize',
        key: 'authorize',
        align: 'center',
        render: (text, record) =>
          record.authorize.map(item => (
            <span style={{ marginLeft: 5 }} key={item}>
              {item}
            </span>
          )),
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
              onConfirm={() => this.onAuthorizeDel(record)}
            >
              <a href="#">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a onClick={() => this.editTable(record)}>编辑</a>
          </span>
        ),
      },
    ];
    return (
      <div>
        <span>
          <Button type="primary" style={{ margin: 10 }} onClick={this.onAddauthorize}>
            <Icon type="plus-circle-o" />
            添加权限
          </Button>
          <Modal
            title={title}
            visible={visible}
            onOk={this.okHandler}
            onCancel={this.hideModelHandler}
            destroyOnClose
          >
            <Form layout="horizontal" onSubmit={this.okHandler}>
              <FormItem {...formItemLayout} label="数据库">
                {getFieldDecorator('database', {
                  initialValue: currentBase,
                  rules: [{ required: true, message: '请选择数据库' }],
                })(
                  <Select
                    placeholder="选择数据库"
                    showSearch
                    onChange={this.onHandlechange}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {DataBase.map(item => (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="表">
                {getFieldDecorator('table', {
                  initialValue: currentTable,
                  rules: [{ required: true, message: '请选择表' }],
                })(
                  <Select
                    placeholder="选择数据表"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {common.map(item => (
                      <Option value={item} key={item}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="权限">
                {getFieldDecorator('authorize', {
                  initialValue: currentAuthorize,
                  rules: [{ required: true, message: '请选择权限!' }],
                })(
                  <Select
                    mode="multiple"
                    placeholder="选择权限"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value="insert" key={1}>
                      insert
                    </Option>
                    <Option value="update" key={2}>
                      update
                    </Option>
                    <Option value="delete" key={3}>
                      delete
                    </Option>
                    <Option value="select" key={4}>
                      select
                    </Option>
                    <Option value="merge" key={5}>
                      merge
                    </Option>
                    <Option value="truncate" key={6}>
                      truncate
                    </Option>
                    <Option value="alter" key={7}>
                      alter
                    </Option>
                    <Option value="drop" key={8}>
                      drop
                    </Option>
                    <Option value="dropindex" key={9}>
                      dropindex
                    </Option>
                    <Option value="createindex" key={10}>
                      createindex
                    </Option>
                  </Select>
                )}
              </FormItem>
            </Form>
          </Modal>
        </span>
        <Card bordered={false}>
          <Table
            pagination={{ pageSize: 5 }}
            rowKey={item => item.table}
            columns={columns}
            dataSource={TableList}
            loading={loading}
          />
          <span>
            <Button type="primary" style={{ margin: 10 }} onClick={this.onSubmit}>
              提交
            </Button>
          </span>
        </Card>
      </div>
    );
  }
}
export default Form.create()(TableControl);
