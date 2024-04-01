import { Checkbox, FormControlLabel, Typography } from "@mui/material"

interface IProps{
    name: string;
    value: boolean;
    setCurrencies: (e:any) => void
}

enum curs {
    usd = "Доллар",
    eur = "Евро",
    cny = "Юань",
}
const CheckboxUi = (props:IProps) => {
    let cur:curs = curs[props.name]
    return(
        <FormControlLabel
        control={<Checkbox size="large" name={props.name} checked={props.value} color="default" onChange={(e:any) => props.setCurrencies(e)}/>}
        label={<Typography variant="h4">{cur}</Typography>}
      />
    )
}

export default CheckboxUi