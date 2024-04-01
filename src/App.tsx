import "@fontsource/roboto/400.css";
import {
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import DateInput from "./components/dateInput";
import CheckboxUi from "./components/checkbox";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import { LineChart, Line } from 'recharts';
function App() {
  const [getApi, setGetApi] = useState<Number>(0);
  const [currencies, setCurrencies] = useState({
    eur: false, 
    usd: false, 
    cny: false
  })
  const [dates, setDates] = useState({
    from: dayjs().subtract(7, 'd'),
    to: dayjs()
  })
  const [data, setData] = useState<any>({})
  const [selectedData, setSelectedData] = useState<any>({})

  const handleCurrencies = (e: any) => {
    console.log()
    setCurrencies({...currencies, [e.target.name]: e.target.checked})
  }

  const handleDates = (newValue: Dayjs | null, name: string) => {
    setDates({...dates, [name]: newValue})
  }

  useEffect(() => {
    let allData: any = data
    Object.entries(currencies)
      .filter(currency => currency[1])
      .forEach((currency) => {
        let curDate = dates.from
        let promises = []
        for(let i = 0; curDate.add(i, 'day').isBefore(dates.to); i++){
          if(!(data[currency[0]] && data[currency[0]][curDate.add(i, 'day').format('YYYY-MM-DD')])){
            promises.push(
              axios.get(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${curDate.add(i, 'day').format('YYYY-MM-DD')}/v1/currencies/${currency[0]}.json`)
                .then(res => {
                  setGetApi(prev => Number(prev) + 1)
                  return res.data
                })
            )
          }
        }
        Promise.all(promises)
        .then(res => {
          let addToData: any = {}
          res.forEach((item) => addToData[item.date] = item[currency[0]].rub)
          allData[currency[0]] = {...data[currency[0]], ...addToData}
        })
    })
    setData(allData)
  }, [currencies, dates])

  useEffect(() => {
    Object.entries(data)
      .filter(currency => currencies[currency[0]])
      .forEach(currencyData => {
        // Object.keys(currencyData[1]).filter(currencyDate => dayjs(currencyDate).isBetween(dayjs(dates.from), dayjs(dates.to)))
        console.log(currencyData)
      })
  }, [currencies, dates])
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
                {
                  Object.entries(currencies).map((cur, n) => (<CheckboxUi key={n} name={cur[0]} value={cur[1]} setCurrencies={handleCurrencies}/>))
                }
                <FormControlLabel
                  sx={{
                    justifyContent: "space-between",
                  }}
                  labelPlacement={"start"}
                  control={<DateInput date={dates.from} setDate={handleDates} name={"from"}/>}
                  label={<Typography variant="h4">Дата с</Typography>}
                />
                <FormControlLabel
                  sx={{
                    justifyContent: "space-between",
                  }}
                  labelPlacement={"start"}
                  control={<DateInput date={dates.to} setDate={handleDates} name={"to"}/>}
                  label={<Typography variant="h4">Дата до</Typography>}
                />
              </FormGroup>
            </Grid>
            <Grid item xs={8}>
              {JSON.stringify(selectedData)}
              {/* <LineChart width={400} height={400} data={data}>
                <Line type="monotone" dataKey="eur" stroke="#8884d8" />
              </LineChart> */}
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
function isBetween(option: unknown, c: typeof Dayjs, d: typeof dayjs): void {
  throw new Error("Function not implemented.");
}

