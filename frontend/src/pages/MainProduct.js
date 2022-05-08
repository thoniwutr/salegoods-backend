import Page from 'components/Page';
import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  //   Modal,
  //   ModalBody,
  //   ModalFooter,
  //   ModalHeader,
  Button,
} from 'reactstrap';

const tableTypes = ['' /*, 'bordered', 'striped', 'hover'*/];
const handleClick = () => {
  window.open('./AddProducts');
};
class MainProduct extends React.Component {
  state = {
    modal: false,
    modal_backdrop: false,
    modal_nested_parent: false,
    modal_nested: false,
    backdrop: true,
  };

  render() {
    return (
      <Page title="Salepage" breadcrumbs={[{ name: 'Salepage', active: true }]}>
        <Row>
          <Col md="12" sm="12" xs="12">
            <Card>
              <CardHeader>PRODUCT LISTS</CardHeader>
              <CardBody>
                <Button onClick={handleClick}>Add Products</Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          {tableTypes.map((tableType, index) => (
            <Row key={index}>
              <Col>
                <Card className="mb-3">
                  <CardBody>
                    <Row>
                      <Col>
                        <Card body>
                          <Table {...{ [tableType || 'default']: true }}>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Username</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <th scope="row">1</th>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                              </tr>
                              <tr>
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                              </tr>
                              <tr>
                                <th scope="row">3</th>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td>@twitter</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Card>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          ))}
        </Row>
      </Page>
    );
  }
}
export default MainProduct;
