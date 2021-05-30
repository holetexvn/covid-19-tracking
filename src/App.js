import React, { useEffect, useMemo } from 'react';
import { sortBy } from 'lodash';
import CountrySelector from './components/CountrySelector';
import { getCountries, getReportByCountry } from './components/apis';
import Summary from './components/Summary';
import Highlight from './components/Highlight';
import { Container, Typography } from '@material-ui/core';
import '@fontsource/roboto';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

const App = () => {
  const [countries, setCountries] = React.useState([]);
  const [selectedCountryId, setSelectedCountryId] = React.useState('');
  const [report, setReport] = React.useState([]);

  useEffect(() => {
    getCountries().then((res) => {
      const { data } = res;
      const countries = sortBy(data, 'Country');
      setCountries(countries);
      setSelectedCountryId('vn');
    });
  }, []);

  const handleOnChange = React.useCallback((e) => {
    setSelectedCountryId(e.target.value);
  }, []);

  useEffect(() => {
    if (selectedCountryId) {
      const selectedCountry = countries.find(
        (country) => country.ISO2 === selectedCountryId.toUpperCase()
      );
      getReportByCountry(selectedCountry.Slug).then((res) => {
        console.log('getReportByCountry', { res });
        // remove last item = current date
        res.data.pop();
        setReport(res.data);
      });
    }
  }, [selectedCountryId, countries]);

  const summary = useMemo(() => {
    if (report && report.length) {
      const latestData = report[report.length - 1];
      return [
        {
          title: 'Số ca nhiễm',
          count: latestData.Confirmed,
          type: 'confirmed',
        },
        {
          title: 'Khỏi',
          count: latestData.Recovered,
          type: 'recovered',
        },
        {
          title: 'Tử vong',
          count: latestData.Deaths,
          type: 'death',
        },
      ];
    }
    return [];
  }, [report]);

  return (
    <Container style={{ marginTop: 20 }}>
      <Typography variant='h2' component='h2'>
        Số liệu COVID-19
      </Typography>
      <Typography>{moment().format('LLL')}</Typography>
      <CountrySelector
        handleOnChange={handleOnChange}
        countries={countries}
        value={selectedCountryId}
      />
      <Highlight summary={summary} />
      <Summary countryId={selectedCountryId} report={report} />
    </Container>
  );
};

export default App;
