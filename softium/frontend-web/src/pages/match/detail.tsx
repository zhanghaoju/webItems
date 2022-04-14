import React from 'react';
import { Steps } from 'antd';
const { Step } = Steps;
import './styles/index.less';
import ImportData from './importView';
import MatchData from './matchView';

export default class MatchDetail extends React.PureComponent<any, any> {
  params: any = {};

  constructor(props: any) {
    super(props);
    const {
      match: { params },
    } = props;
    this.params = params;
    this.state = {
      current: 1,
    };
  }

  onChange = (step: number) => {
    this.setState({
      current: step,
    });
  };

  render() {
    const { current } = this.state;
    return (
      <div className="match-detail-container">
        <div className="match-detail-title">新华医院机构数据导入任务</div>
        <Steps
          className="match-detail-steps"
          current={current}
          size="small"
          onChange={this.onChange}
        >
          <Step title={`${this.params.template}数据导入`} />
          <Step title={`${this.params.template}数据匹配`} />
        </Steps>
        {current === 0 ? <ImportData /> : null}
        {current === 1 ? <MatchData /> : null}
      </div>
    );
  }
}
