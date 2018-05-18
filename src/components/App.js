import React, { Component } from 'react';
import axios from 'axios';
import Methods from './Methods';
import Requests from './Requests';
import ResponseCodes from './ResponseCodes';
import DocumentSize from './DocumentSize';


class App extends Component {
  constructor (props) {
    super(props);
    this.handleShowRequest = this.handleShowRequest.bind(this);
    this.handleShowResponse = this.handleShowResponse.bind(this);
    this.handleShowDocument = this.handleShowDocument.bind(this);
    this.state = {
      json: [],
      request: false,
      response: false,
      document: false,
      num: (range) => Math.floor(Math.random() * range)
    }
  }
  async getData() {
    const regex = (
      /^.*(?=\.)\.\w{1,} \[(.*?)\] \"(.*?)\" \d{1,3} \d{1,5}|^.*(?=\.)\.\w{1,} \[(.*?)\] \"(.*?)\" \d{1,3} \-/gm
    );
    const res = await axios('./epa-http.txt');
    const epa = await res.data.match(regex);

    const jsonFormated = await epa.map((data) => {
      const objToJson = {
        "host": undefined,
        "datetime":{"day": undefined, "hour": undefined, "minute": undefined, "second": undefined},
        "request":{
          "method": undefined, "url": undefined,
          "protocol": undefined, "protocol_version": undefined
        },
        "response_code": undefined, "document_size": undefined
      };

      const formatedString = data.replace(/"/,"'").replace(/"/,"'").replace("' ","' +");

      const host = formatedString.match(/^.*(?=\.)\.\w{2,}\.\w{1,}/gm);
      if(!!host) {
        objToJson.host = host[0];
      }

      let datetime = formatedString.match(/\[(.*?)\]/gm);
      if(!!datetime) {
        datetime.map((dt) => {
          const arrayDt = dt.slice(1, dt.length - 1).split(':');
          // console.log('arrayDt: ', arrayDt);
          objToJson.datetime.day = arrayDt[0];
          objToJson.datetime.hour = arrayDt[1];
          objToJson.datetime.minute = arrayDt[2];
          objToJson.datetime.second = arrayDt[3];
        });
      }

      const request = formatedString.match(/\'(.*?)\'/gm);
      if(!!request) {
        let method = formatedString.match(/ \'\w{3,}/gm);
        if(!!method) {
          objToJson.request.method = method.map((x) => x.trim().replace("'", ""))[0];
        }
        let url = formatedString.match(/ \/(.*?)\ /gm);
        if(!!url) {
          objToJson.request.url = url.map((x) => x.trim())[0];
        }
        let protocol = formatedString.match(/\ \w{2,}\//gm);
        if(!!protocol) {
          objToJson.request.protocol = protocol.map((x) => x.replace("/", "").trim())[0];
        }
        let protocolVersion = formatedString.match(/\ \w{2,}\/(.*?)\'/gm);
        if(!!protocolVersion) {
          objToJson.request.protocol_version = protocolVersion.map((x) => {
            return x.replace(/\ \w{2,}\//gm, "").replace("'", "");
          })[0];
        }
      }

      let responseCode = formatedString.match(/ \+\d{3}/gm);
      if(!!responseCode) {
        objToJson.response_code = responseCode.map((x) => x.replace(" +", ""))[0];
      }

      let documentSize = formatedString.match(/ \d{1,5}| -/gm);
      if(!!documentSize) {
        objToJson.document_size = documentSize.map((x) => x.trim())[0];
      }

      return objToJson;
    });

    return await jsonFormated.filter((x) => {
        if(x.host !== undefined && x.request.method !== undefined && x.request.url !== undefined && x.response_code !== undefined && x.document_size !== undefined) {
          return x;
        }
    });
  }
  componentDidMount() {
    if (!!this.state.json) {
      (async () => {
          try {
              this.setState({json: await this.getData()});
          } catch (e) {
              console.log('Error! Cant get the json-data.', e);
          }
      })();
    }
  }
  handleShowRequest() {
    this.setState(() => ({ request: true }));
  }
  handleShowResponse() {
    this.setState(() => ({ response: true }));
  }
  handleShowDocument() {
    this.setState(() => ({ document: true }));
  }
  render () {
    return (
      <div>
        <h1>Auswertung von Serverzugriffen von EPA</h1>

        <Methods
          json={this.state.json}
          num={this.state.num}
          request={this.state.request}
          handleShowRequest={this.handleShowRequest}
        />
        {this.state.request &&
          <Requests
            json={this.state.json}
            num={this.state.num}
            response={this.state.response}
            handleShowResponse={this.handleShowResponse}
          />
        }
        {this.state.response &&
          <ResponseCodes
            json={this.state.json}
            num={this.state.num}
            document={this.state.document}
            handleShowDocument={this.handleShowDocument}
          />
        }
        {this.state.document &&
          <DocumentSize
            json={this.state.json}
            num={this.state.num}
          />
        }

      </div>
    )
  }
}
export default App
