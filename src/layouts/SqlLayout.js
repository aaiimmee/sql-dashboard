import React, {Fragment} from 'react';
import { Redirect, Route, Switch} from 'dva/router';
import {Icon} from 'antd';
import { connect } from 'dva';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import {getRoutes} from '../utils/utils';
import logo from '../assets/logo.svg';

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2018 钱包生活
  </Fragment>
);

@connect(({global, login}) => ({
  global,
  login,
}))
export default class SqlLayout extends React.PureComponent {
  onLogout = ({key})=>{
    const { dispatch } =this.props;
    if(key === 'logout'){
      dispatch({
        type: 'login/logout',
      })

    }
  }

  skipAdmin=() => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/skipAdmin',
    })
  }

  render() {
    const {routerData, match} = this.props;
    return (
      <div className={styles.container}>
        <header>
          <GlobalHeader
            logo={logo}
            currentUser={localStorage.getItem('userName')}
            onBtnClick={this.skipAdmin}
            onMenuClick={this.onLogout}
          />
        </header>
        <Switch>
          {getRoutes(match.path, routerData).map(item => (
            <Route
              key={item.key}
              path={item.path}
              component={item.component}
              exact={item.exact}
            />
            ))}
          <Redirect exact from="/" to="/sql" />
        </Switch>
      </div>
    );
  }
}

