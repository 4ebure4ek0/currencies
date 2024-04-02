import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Chart = (props: any) => {
  return (
    <>
      <LineChart
        width={600}
        height={400}
        data={props.data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="10" strokeWidth={3} />
        <Tooltip />
        <Legend />
        <XAxis dataKey="date" />
        <YAxis />
        {props.currencies.eur && (
          <Line
            type="monotone"
            dataKey="eur"
            stroke="#8884d8"
            strokeWidth={3}
          />
        )}
        {props.currencies.usd && (
          <Line
            type="monotone"
            dataKey="usd"
            stroke="#82ca9d"
            strokeWidth={3}
          />
        )}
        {props.currencies.cny && (
          <Line
            type="monotone"
            dataKey="cny"
            stroke="#a7d3fe"
            strokeWidth={3}
          />
        )}
      </LineChart>
    </>
  );
};

export default Chart;
