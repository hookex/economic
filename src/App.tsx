import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from "react-bootstrap/Col";
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card'
import {CompoundByYears, compoundGroupByYears} from "./util/compound";
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';

echarts.registerTheme('my_theme', {
  backgroundColor: '#f4cccc'
});

const baseOption = {
  title: {
    text: ''
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: ['本金', '利息', '总资金']
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: []
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: []
};


interface FormValue {
  money: string;
  rate: string;
  years: string;
  moneyLoopYears: string;
  result: CompoundByYears
}

export default class App extends React.Component {
  public state: FormValue = {
    money: '10000',
    rate: '6',
    years: '40',
    moneyLoopYears: '1',
    result: {
      total: [],
      base: [],
      interest: [],
    },
  };

  constructor(props: any) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleSubmit(event: any) {
    this.compute();
    event.preventDefault();
  }

  componentDidMount(): void {
    this.compute();
  }

  compute() {
    const {money, years, rate, moneyLoopYears} = this.state;

    let result = compoundGroupByYears(
      parseInt(money),
      parseInt(rate) / 100,
      parseInt(years),
      parseInt(moneyLoopYears)
    );


    this.setState({
      result: result
    });
  }

  handleInputChange(event: any) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  // @ts-ignore
  getChartOption() {
    let option: any = JSON.parse(JSON.stringify(baseOption));

    // @ts-ignore
    option.xAxis[0].data = this.state.result.base.map((base, i) => {
      return `第${i + 1}年`;
    });

    // @ts-ignore
    option.series.push({name: '本金', type: 'line', stack: '本金', areaStyle: {}, data: this.state.result.base});
    // @ts-ignore
    option.series.push({name: '利息', type: 'line', stack: '利息', areaStyle: {}, data: this.state.result.interest});
    // @ts-ignore
    option.series.push({name: '总资金', type: 'line', stack: '总资金', areaStyle: {}, data: this.state.result.total});

    return option;
  }

  render() {
    let table;
    let chart;

    if (this.state.result.base.length) {
      chart =
        <Card>
          <Card.Body>
            <ReactEcharts
              echarts={echarts}
              option={this.getChartOption()}
              notMerge={true}
              lazyUpdate={true}
              theme={"theme_name"}
              // onChartReady={this.onChartReadyCallback}
              // onEvents={EventsDict}
              // opts={}
            />
          </Card.Body>
        </Card>;

      table =
        <Table striped bordered hover>
          <thead>
          <tr>
            <th>年份</th>
            <th>全部本金</th>
            <th>全部收益</th>
            <th>全部资金</th>
          </tr>
          </thead>
          <tbody>
          {
            this.state.result.base.map((base, i) =>
              <tr key={i}>
                <td>第{i + 1}年</td>
                <td>{base}</td>
                <td>{this.state.result.interest[i].toFixed(2)}</td>
                <td>{this.state.result.total[i].toFixed(2)}</td>
              </tr>
            )
          }
          </tbody>
        </Table>
    }

    return (
      <Container className="p-3">
        <Jumbotron>
          <h1 className="header">复利计算器</h1>
        </Jumbotron>

        <Form onSubmit={this.handleSubmit}>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>本金</Form.Label>
              <Form.Control type="number" onChange={this.handleInputChange} placeholder="输入本金"
                            name="money"
                            defaultValue={this.state.money}/>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>循环缴纳年数(如逐年缴纳的储蓄险)</Form.Label>
              <Form.Control type="number" onChange={this.handleInputChange} placeholder="输入年数"
                            name="moneyLoopYears"
                            defaultValue={this.state.moneyLoopYears}/>
            </Form.Group>
          </Form.Row>

          <Form.Group controlId="formGridAddress1">
            <Form.Label>年化利率(%)</Form.Label>
            <Form.Control type="number" onChange={this.handleInputChange} placeholder="输入年化利率"
                          name="rate"
                          defaultValue={this.state.rate}/>
          </Form.Group>

          <Form.Group controlId="formGridAddress2">
            <Form.Label>共多少年</Form.Label>
            <Form.Control type="number" onChange={this.handleInputChange} defaultValue={this.state.years}
                          name="years"
                          placeholder="请输入年份"/>
          </Form.Group>

          <Button variant="primary" type="submit">
            计算
          </Button>
        </Form>

        <hr/>
        {chart}
        <hr/>
        {table}

      </Container>
    );
  }
}
