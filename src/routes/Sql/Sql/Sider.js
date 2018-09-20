import React, {Component} from 'react';
import { connect } from 'dva';
import { Menu, List , Button, Divider, Input, Select } from 'antd';
import styles from './Sql.less'

const InputGroup = Input.Group;
const Option = Select.Option;



@connect(({sql}) =>({
  sql,
}))
export default class Sider extends Component{
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sql/fetchTables',
      payload: {
        userName: localStorage.getItem('userName'),
      },
    })

  }

  onTableChange=(value)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'sql/fetchColumns',
      payload: {
        database: value.slice(0,3),
        table: value,
      },
    })
  }

  render () {
    const  { sql} = this.props;
    const { tables,columns } = sql;
    return (
      <div>
        <div className={styles.sider}>
          <p className={styles.tabletitle}>Tables：</p>
          <div className={styles.inputselect}>
            <List
              className={styles.ulselect}
              size='small'
              style={{fontWeight:'bold'}}
              bordered
              dataSource={tables}
              renderItem={item => (<List.Item onClick={()=>{this.onTableChange(item)}}>{item}</List.Item>)}
            />
          </div>
          <p className={styles.tabletitle}>Columns：</p>
          <div className={styles.coluselect}>
            <List
              className={styles.colum}
              size='small'
              style={{fontWeight:'bold'}}
              bordered
              dataSource={columns}
              renderItem={item => (<List.Item className={styles.listitem}>
                {item.column}
                <span className={styles.renderitem}>{item.comment}<Divider type="vertical" />{item.type}</span>
              </List.Item>)}
            />
          </div>
        </div>
      </div>
    )
  }
}
