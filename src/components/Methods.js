import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';

const Methods = (props) => {

  const dataLabel = [];
  const randomColor = [];
  const responseCodes = props.json.map((rc) => {
    return rc.request.method;
  }).reduce( (match, num) => {
    match[num] = (match[num] || 0) + 1 ;
  return match;
  },{});

  const dataValue = Object.entries(responseCodes).map(([label, value]) => {

    const randomRgba = (
      `rgba(${props.num(255)}, ${props.num(255)}, ${props.num(255)}, 0.6)`
    );
    randomColor.push(randomRgba);
    dataLabel.push(label);
    return value;
  });

  const data = {
    labels: dataLabel,
  	datasets: [{
  		data: dataValue,
  		backgroundColor: randomColor,
  		hoverBackgroundColor: '#e6007e'
  	}]
  }
  return (
    <div className="block container">
      <h2>HTTP Methoden</h2>
      <Doughnut data={data} width={100} height={80} />
      <button
        disabled={props.request}
        onClick={props.handleShowRequest}
        className="button button--blue">
        Requests anzeigen
      </button>
    </div>
  )
}
export default Methods;
