import React, {useEffect, useState} from 'react';
import './App.css';
import {useSelector} from "react-redux";
import {useFirestoreConnect} from "react-redux-firebase";
import {HorizontalBarSeries, LineSeries, MarkSeries, VerticalBarSeries, XAxis, XYPlot} from "react-vis";
import BarSeries from "react-vis/es/plot/series/bar-series";

function App() {

  const [datas, setDatas] = useState([])
  // useFirestoreConnect(() => [{collection: "sensors/5190/samples", storeAs: "samples", where:['date', '<', Date.now()], }])
  useFirestoreConnect(() => [{collection: "sensors/0013a20041a72961/samples",
    storeAs: "samples",
    limit: 10,
    orderBy: ["date", "desc"]
    // where: ['date', '>', Date.now()- (1000 * 60*10)]
  }])
  // const firestore = useFirestore()
  const samples = useSelector((state) => state.firestore.ordered.samples)

  useEffect(() => {
    console.log(samples?.map((sample) => ({x: sample?.date, y: sample?.value})))
    setDatas(samples?.map((sample)=>({x: sample?.date,y:sample?.value})))
  }, [samples])
  return (
    <div className="App">
      <XYPlot height={300} width={window.innerWidth}>
        <VerticalBarSeries/>
        <HorizontalBarSeries/>
        {/*<XAxis />*/}
        {/*<YAxis />*/}
        <LineSeries data={datas}/>
      </XYPlot>
      <XYPlot height={300} width={window.innerWidth}>
        <MarkSeries data={datas} />
      </XYPlot>
      <header className="App-header">
        {/*{sensors?.map((sensor)=><div>{sensor.date}</div>)}*/}

      </header>
    </div>
  );
}

export default App;
