import React, { Component } from 'react';
import { Bubble } from 'react-chartjs-2';

const Requests = (props) => {

  const datetime = props.json.map((dt) => {
    return Number(dt.datetime.day + dt.datetime.hour + dt.datetime.minute);
  }).reduce( (match, num) => {
    match[num] = (match[num] || 0) + 1 ;
  return match;
  },{});

  const randomColor = [];
  const dataValue = Object.entries(datetime).map(([key, value], i) => {
    const num = () => Math.floor(Math.random() * 255);
    const randomRgba = (
      `rgba(${num()}, ${num()}, ${num()}, 0.6)`
    );
    const radius = Math.floor(Math.random() * 4 + 2);
    randomColor.push(randomRgba);
    return { 'x': i, 'y': value, 'r': radius }
  });

  const data = {
      datasets: [{
        label: 'Requests pro Minute',
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
      <h2>Requests pro Minute</h2>
      <Bubble data={data} />
      <button
        disabled={props.response}
        onClick={props.handleShowResponse}
        className="button button--blue">
        Antwortcodes anzeigen
      </button>
    </div>
  )
}
export default Requests;
