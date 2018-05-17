import React, { Component } from 'react';
import { Pie } from 'react-chartjs-2';

const ResponseCodes = (props) => {

  const dataKey = [];
  const randomColor = [];
  const responseCodes = props.json.map((rc) => {
    return rc.response_code;
  }).reduce( (match, num) => {
    match[num] = (match[num] || 0) + 1 ;
  return match;
  },{});

  const dataValue = Object.entries(responseCodes).map(([key, value]) => {
    const num = Math.floor(Math.random() * 255);
    const randomRgba = (
      `rgba(${num}, ${num}, ${num}, 0.6)`
    );
    randomColor.push(randomRgba);
    dataKey.push(key);
    return value;
  });

  const data = {
    labels: dataKey,
  	datasets: [{
  		data: dataValue,
  		backgroundColor: randomColor,
  		hoverBackgroundColor: '#e6007e'
  	}]
  }
  return (
    <div className="block container">
      <h2>Antwortcodes</h2>
        <Pie data={data} width={100} height={80}/>
        <button
          disabled={props.document}
          onClick={props.handleShowDocument}
          className="button button--blue">
          Antwortgrösse anzeigen
        </button>
    </div>
  )
}
export default ResponseCodes;
