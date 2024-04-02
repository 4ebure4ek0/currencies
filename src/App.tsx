import "@fontsource/roboto/400.css";
import {
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import DateInput from "./components/dateInput";
import CheckboxUi from "./components/checkbox";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import Chart from "./components/chart";

interface IData{
  date: string;
  usd?: number;
  eur?: number;
  cny?: number
}

function App() {
  const [getApi, setGetApi] = useState<Number>(0);
  const [currencies, setCurrencies] = useState({
    eur: false,
    usd: false,
    cny: false,
  });
  const [dates, setDates] = useState({
    from: dayjs().subtract(7, "d"),
    to: dayjs(),
  });
  const [filterDays, setFilterDays] = useState<Array<string>>([])
  const [data, setData] = useState<Array<IData>>([]);

  const handleCurrencies = (e: any) => {
    setCurrencies({ ...currencies, [e.target.name]: e.target.checked });
  };

  const handleDates = (newValue: Dayjs | null, name: string) => {
    setDates({ ...dates, [name]: newValue });
  };

  // const sortDates = (a:any, b:any) => {
  //   return a.date - b.date
  // }

  const getDays = useMemo(() => {
    let days = []
    let dateFrom = dates.from;
    for (let i = 0; dateFrom.add(i, "day").isBefore(dates.to); i++) {
      days.push(dateFrom.add(i, "day").format("YYYY-MM-DD"))
    }
    setFilterDays([...days])
  }, [dates])

  useEffect(() => {
    let allDataFromMemory: any = [...data];
    let dateFrom = dates.from;
    for (let i = 0; dateFrom.add(i, "day").isBefore(dates.to); i++) {
      if (
        !allDataFromMemory.find(
          (data: { date: string }) =>
            data.date == dateFrom.add(i, "day").format("YYYY-MM-DD")
        )
      )
        allDataFromMemory.push({
          date: dateFrom.add(i, "day").format("YYYY-MM-DD"),
        });
    }
    allDataFromMemory.forEach((dataItem: { [x: string]: any; date: any }) => {
      let promises: any = [];
      Object.entries(currencies)
        .filter((currency) => currency[1])
        .forEach((currency) => {
          if (!dataItem[currency[0]]) {
            promises.push(
              axios
                .get(
                  `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${dataItem.date}/v1/currencies/${currency[0]}.json`
                )
                .then((res) => {
                  setGetApi((prev) => Number(prev) + 1);
                  return res.data;
                })
            );
          }
        });
      Promise.all(promises).then((res) => {
        res.forEach((item) => {
          dataItem[Object.entries(item)[1][0]] =
            item[Object.entries(item)[1][0]].rub;
        });
      });
    });
    setData([...allDataFromMemory]);
    console.log(data.filter((item: { date: string; }) => item.date in filterDays))
  }, [currencies, dates, getApi]);

  return (
    <>
      <Container
        maxWidth={false}
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid
          container
          height={800}
          width={1400}
          padding={5}
          borderRadius={2}
          border={"3px solid rgba(255, 255, 255, 0.87)}"}
        >
          <Typography variant="h1">График</Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormGroup
                sx={{
                  display: "flex",
                  gap: 3,
                }}
              >
                {Object.entries(currencies).map((cur, n) => (
                  <CheckboxUi
                    key={n}
                    name={cur[0]}
                    value={cur[1]}
                    setCurrencies={handleCurrencies}
                  />
                ))}
                {Object.keys(dates).map(item => {
                  return <DateInput name={item} date={dates[item]} setDate={handleDates}/>
                })}
              </FormGroup>
            </Grid>
            <Grid item xs={8}>
              <Chart data={data} currencies={currencies}/>
            </Grid>
          </Grid>
          <Typography variant="h3" alignSelf={"end"}>
            Число запросов в API: {getApi.toString()}
          </Typography>
        </Grid>
      </Container>
    </>
  );
}
export default App;
