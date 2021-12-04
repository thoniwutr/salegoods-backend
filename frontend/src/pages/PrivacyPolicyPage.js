import Page from 'components/Page';
import Typography from 'components/Typography';
import React from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';

var perf =require('./privacy-policy');

class PrivacyPolicyPage extends React.Component {
   render(){
      return (
         <iframe src={perf }></iframe>   /* like this */
      );
   }
}
export default PrivacyPolicyPage;