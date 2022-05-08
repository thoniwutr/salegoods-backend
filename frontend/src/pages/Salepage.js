import Page from 'components/Page';
import React from 'react';
import {
  Button,
  //ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';

class Salepage extends React.Component {
  state = {
    modal: false,
    modal_backdrop: false,
    modal_nested_parent: false,
    modal_nested: false,
    backdrop: true,
  };

  toggle = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };

  render() {
    return (
      <Page title="Salepage" breadcrumbs={[{ name: 'Salepage', active: true }]}>
        <Row>
          <Col md="12" sm="12" xs="12">
            <Card>
              <CardHeader>Start Tracking</CardHeader>
              <CardBody>
                <Button onClick={this.toggle()}>เร่ิมTrackingข้อมูล</Button>
                <Modal
                  isOpen={this.state.modal}
                  toggle={this.toggle()}
                  className={this.props.className}>
                  <ModalHeader toggle={this.toggle()}>Modal title</ModalHeader>
                  <ModalBody>
                    Page ของคุณนั้นเร่ิม live แล้วหรือยัง. โปรดกด live ที่Page ของคุณก่อนเริ่มโปรแกรม
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.toggle()}>
                      Start
                    </Button>{' '}
                    <Button color="secondary" onClick={this.toggle()}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Modal>
              </CardBody>
            </Card>
          </Col>
          
        </Row>
      </Page>
    );
  }
}

export default Salepage;
