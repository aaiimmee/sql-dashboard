import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Button } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import styles from './index.less';

export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  getNoticeData() {
    const { notices } = this.props;
    if (notices == null || notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const {
      currentUser = {},
      collapsed,
      fetchingNotices,
      isMobile,
      logo,
      role,
      onNoticeVisibleChange,
      onBtnClick,
      onMenuClick,
      onNoticeClear,
    } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {/*<Menu.Item disabled>*/}
          {/*<Icon type="user" />个人中心*/}
        {/*</Menu.Item>*/}
        {/*<Menu.Item disabled>*/}
          {/*<Icon type="setting" />设置*/}
        {/*</Menu.Item>*/}
        {/*<Menu.Item key="triggerError">*/}
          {/*<Icon type="close-circle" />触发报错*/}
        {/*</Menu.Item>*/}
        {/*<Menu.Divider />*/}
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    return (
      <div className={styles.header}>
        <Link to="/" className={styles.logo} key="logo">
          <img src={logo} alt="logo" width="32" />
        </Link>
        <div className={styles.right}>
          {
            localStorage.getItem('role')==='admin'?
              <span className={styles.lockwrap} onClick={onBtnClick}>
                <Icon style={{
                  fontSize: '23px',
                  display: 'inline-block',
                  verticalAlign: 'unset',
                  lineHeight: '64px',
                  paddingRight: '5px',
                  color:'#c5c5c5',
                }} type="lock"/>
                <span className={styles.authop}>权限</span>
              </span>
              :<span> </span>
          }

          {currentUser ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Icon style={{
                  fontSize: '23px',
                  display: 'inline-block',
                  verticalAlign: 'unset',
                  lineHeight: '64px',
                  paddingRight: '5px',
                  color:'#c5c5c5',
                }} type="user"/>
                <span className={styles.userName}>{currentUser}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </div>
    );
  }
}
