import React, {Component} from 'react'
import MonacoEditor from 'react-monaco-editor'
import { connect } from 'dva'
import $ from 'jquery'
import { Tabs, Button, Icon, Select, Table, Modal,Progress,message } from 'antd'
import styles from './Sql.less'

const {Option} = Select;
const {TabPane}= Tabs;


const columns = [{
  title: 'query',
  dataIndex: 'query',
  width: '20%',
  render:(text)=>{
    return <span className={styles.colquery}>{text}</span>
  },
}, {
  title: 'status',
  dataIndex: 'status',
  width: '15%',
  render:(text)=>{
    return <span className={styles.colstatus}>{text}</span>
  },
}, {
  title: 'started',
  dataIndex: 'started',
  width: '15%',
},{
  title: 'duration',
  dataIndex: 'duration',
  width: '15%',
},{
  title: '',
  dataIndex: '',
  width: '45%',
}];

@connect(({sql}) =>({
  sql,
}))
export default class extends Component{
  constructor(props) {
    super(props);
    this.monaco = React.createRef();
    this.sql = React.createRef();
    this.modalMonaco = React.createRef();
    this.state = {
      engine: 'hive',
      visible: false,
      provisible:false,
      query: '',
      id: null,
      activeKey: '1',
    }

  }

  componentDidMount=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'sql/fetchQueryHistory',
      payload: {
        userName:localStorage.getItem('userName'),
      },
    })
    dispatch({
      type: 'sql/fetchSavedSql',
      payload: {
        userName:localStorage.getItem('userName'),
      },
    })
  }


  onHiveChange=(value)=>{
    this.setState({
      engine: value,
    })
  }

  ontabsChange=(key)=>{
    this.setState({
      activeKey: key,
    })
  }

  upClick=()=>{
    const sql = this.sql.current;
    $(sql).animate({
      top: '200px',
    });
  }


  deleteSavedQuery=(id)=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'sql/deleteSavedQuery',
      payload: {
        id,
      },
    })
  }

  handleCancel=() =>{
    this.setState({
      visible: false,
    })
  }

  handleOk=() =>{
    const {dispatch} = this.props;
    const {id,engine}=this.state;
    this.setState({
      visible: false,
    })
    dispatch({
      type: 'sql/updateSqlQuery',
      payload: {
        id,
        query: this.modalMonaco.current.editor.getValue(),
        engine,
      },
    })

  }

  updateSavedQuery=(obj)=>{
    this.setState({
      visible: true,
      query: obj.query,
      id: obj.id,
    })
  }

  runQuery=()=>{
    const query = this.monaco.current.editor.getValue();
    const {dispatch} = this.props;
    const {engine}=this.state;
    this.setState({
      activeKey: '1',
    });
    dispatch({
      type:'sql/clear',
    });
    if(query!==''){
      dispatch({
        type: 'sql/runQuery',
        payload: {
          query,
          userName: localStorage.getItem('userName'),
          engine,
          limit: '0',
        },
      }).then(
        res=>{
          if(res.code===0){
            this.setState({provisible:true});
            this.timer=setInterval(()=>{
              dispatch({
                type:'sql/appProgress',
                payload:{
                  jobName:res.data.jobName,
                },
              }).then(
                res1=>{
                  if(res1.code===-1 || res1.code===1){
                    clearInterval(this.timer);
                    this.setState({
                      provisible:false,
                    })
                  }
                  if(res1.data.state==='FINISHED'){
                    clearInterval(this.timer);
                    setTimeout(()=>{
                      this.setState({
                        provisible:false,
                      })
                    },2000);
                  }
                }
              )
            },2000)
          }
        }
      );
    }else{
      message.error('请输入sql语句');
    }

  }

  runSavedQuery=(item)=>{
    const {query}= item;
    const {dispatch} = this.props;
    const {engine}=this.state;

    dispatch({
      type:'sql/clear',
    });
    if(query!==''){
      dispatch({
        type: 'sql/runQuery',
        payload: {
          query,
          userName: localStorage.getItem('userName'),
          engine,
          limit: '0',
        },
      }).then(
        res=>{
          if(res.code===0){
            // this.setState({activeKey: '1'});
            this.setState({provisible:true});
            this.timer=setInterval(()=>{
              dispatch({
                type:'sql/appProgress',
                payload:{
                  jobName:res.data.jobName,
                },
              }).then(
                res1=>{
                  if(res1.code===-1 || res1.code===1){
                    clearInterval(this.timer);
                    this.setState({
                      provisible:false,
                    })
                  }
                  if(res1.data.state==='FINISHED'){
                    clearInterval(this.timer);
                    setTimeout(()=>{
                      this.setState({
                        provisible:false,
                        activeKey: '1',
                      })
                    },2000);
                  }
                }
              )
            },2000)
          }
        }
      );
    }else{
      message.error('请输入sql语句');
    }
  }

  saveQuery=()=>{
    const query = this.monaco.current.editor.getValue();
    const {dispatch} = this.props;
    const {engine}=this.state;
    dispatch({
      type: 'sql/saveQuery',
      payload: {
        userName: localStorage.getItem('userName'),
        engine,
        query,
      },
    })
  }

  downClick=()=>{
    const sql = this.sql.current;
    $(sql).animate({
      top: '500px',
    });
  }

  swapClick=()=>{
    const sql = this.sql.current;
    $(sql).animate({
      top: '400px',
    });
  }

  HandleCancle=()=>{
    const {dispatch,sql}=this.props;
    const {jobName}=sql;
    dispatch({
      type:'sql/cancelJob',
      payload:{
        jobName:jobName,
      },
    }).then(
      ()=>{
       clearInterval(this.timer);
       this.setState({
         provisible:false,
       });
     }
    );
  }

  render () {
    const {sql} = this.props;
    const { queryList, savedSql,progress,ResultList,jobName,titlearr} = sql;
    const {activeKey,provisible,query,visible}=this.state;
    const column2=[];
    titlearr.map(item=>
      column2.push({
        key:item,
        title:item,
        dataIndex:item,
        align:'center',
      })
    );
    const operations =
      <div className={styles.querybtn}>
        <span className={styles.engine}>engine:</span>
        <Select style={{ paddingRight:'25px' }} defaultValue="hive" onChange={this.onHiveChange}>
          <Option value="hive">hive</Option>
          <Option value="spark">spark</Option>
        </Select>
        <Button style={{ marginRight: '20px'}} onClick={this.saveQuery}>Save query</Button>
        <Button type='primary' onClick={this.runQuery}>Run query</Button>
      </div>;
    return (
      <div>
        <div className={styles.contentwrap}>
          <MonacoEditor
            width="100%"
            height="500"
            language="sql"
            ref={this.monaco}
          />
        </div>
        <div ref={this.sql} className={styles.sqlwrap}>
          <Tabs
            tabBarExtraContent={operations}
            activeKey={activeKey}
            onChange={this.ontabsChange}
          >
            <TabPane tab="Recent Queries" key="1">
              <Table
                bordered
                dataSource={queryList}
                columns={columns}
              />
            </TabPane>
            <TabPane tab="Saved Queries" key="2">
              { savedSql.map(item =>
                <div key={item.id} className={styles.sqldesc}>
                  <span>id: {item.id}</span>
                  <p dangerouslySetInnerHTML={{__html:item.query.replace(/\r?\n/g,'<br />') }} />
                  <div className={styles.btnwrap}>
                    <Button style={{marginRight:'10px'}} onClick={()=> this.updateSavedQuery(item)}>Upadte</Button>
                    <Button style={{marginRight:'10px'}} onClick={()=> this.deleteSavedQuery(item.id)}>Delete</Button>
                    <Button type='primary' onClick={()=>this.runSavedQuery(item)}>Run</Button>
                  </div>
                </div>
              )}
            </TabPane>
            <TabPane tab="Data Preview" key="3">
              <a style={{marginLeft:'50px'}} href={`http://172.28.60.14:8290/query/csv?jobName=${jobName}`} download="">
                <Button type='primary'>下载</Button>
              </a>
              {
                column2.length>0 ?
                  <Table
                    bordered
                    rowKey={item => item.id}
                    dataSource={ResultList}
                    columns={column2}
                    scroll={{ x:'200%'}}
                  />
                  :<div style={{ width:'100%',margin:'100px 300px',fontSize:'40px'}}><span>no data</span></div>
              }

            </TabPane>
          </Tabs>
          <Icon className={styles.downicon} type="down" onClick={this.downClick} />
          <Icon className={styles.swapicon} type="swap" onClick={this.swapClick} />
          <Icon className={styles.upicon} type="up" onClick={this.upClick} />
        </div>
        <Modal
          title="Upadte query"
          visible={visible}
          okText='保存'
          width={650}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <MonacoEditor
            width="100%"
            height="200"
            language="sql"
            value={query}
            ref={this.modalMonaco}
          />
        </Modal>
        <Modal
          title="progress"
          visible={provisible}
          destroyOnClose
          width={650}
          footer={null}
          closable={false}
        >
          <Progress percent={parseInt(progress,10)} status="active" />
          <Button type='primary' style={{marginLeft:'500px',marginTop:'20px'}} onClick={this.HandleCancle}>取消</Button>
        </Modal>
      </div>
    )
  }
}
