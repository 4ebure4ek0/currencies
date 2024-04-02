import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from "dayjs";

interface IProps{
  name: string;
  date: Dayjs;
  setDate: (newValue: Dayjs | null, name: string) => void;
}

enum dates {
  to = "Дата до",
  from = "Дата с",
}

const DateInput = (props: IProps) => {
  let label:dates = dates[props.name]
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker label={label} name={props.name} value={props.date} onChange={(newValue) => props.setDate(newValue, props.name)}/>
    </LocalizationProvider>
  );
};

export default DateInput;
