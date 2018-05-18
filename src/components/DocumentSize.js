import React, { Component } from 'react';
import { Bubble } from 'react-chartjs-2';

const DocumentSize = (props) => {

  const randomColor = [];
  const dataValue = props.json.filter((ds) => {
    if(ds.response_code === '200' && Number(ds.document_size) < 1000) {
      return ds;
    }
  })
  .map((x, i) => {
    const randomRgba = (
      `rgba(${props.num(255)}, ${props.num(255)}, ${props.num(255)}, 0.6)`
    );
    randomColor.push(randomRgba);

    return {x: i +1, y: x.document_size, r: props.num(5) };
  });

  const data = {
    datasets: [{
      label: 'Antwortcode 200 und Antwortgrösse < 1000',
      duration: 0,
      fill: false,
      lineTension: 0.1,
      backgroundColor: randomColor,
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,0.1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,0.1)',
      pointHoverBorderColor: 'rgba(220,220,220,0.1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: dataValue
   }]
  };

  return (
    <div className="block">
      <h2>Antwortgrösse</h2>
      <Bubble data={data} />
    </div>
  )
}
export default DocumentSize;
