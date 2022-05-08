import Page from 'components/Page';
import React from 'react';
// import { render } from 'react-dom';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
} from 'reactstrap';


const AddProducts = () => {
  return (
    <Page title="Products" breadcrumbs={[{ name: 'AddProducts', active: true }]}>
      <Row>
        <Col xl={6} lg={12} md={12}>
          <Card>
            <CardHeader>Products</CardHeader>
            <CardBody>
              <Form>
                <FormGroup>
                  <Label for="exampleEmail">รหัสสินค้า</Label>
                  <Input
                    plaintext
                    value="Some plain text/ static value"
                    readOnly
                  />
                </FormGroup>
                <FormGroup>
				  <Label for="exampleText">ชื่อสินค้า</Label>
				  <Input className="mb-2" placeholder="กรอกชื่อสินค้า" bsSize="lg" />
                </FormGroup>
                <FormGroup>
                  <Label for="size">ขนาด</Label>
                  <Input type="select" name="size">
				  	<option>ไม่มี</option>
                    <option>SSS</option>
                    <option>SS</option>
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
					<option>XL</option>
					<option>XXL</option>
					<option>XXXL</option>
                  </Input>
                </FormGroup>
				<FormGroup>
                  <Label for="size">สีของสินค้า</Label>
                  <Input type="select" name="size">
				  	<option>ไม่มี</option>
                    <option>เหลือง</option>
                    <option>เขียว</option>
                    <option>ส้ม</option>
                    <option>แดง</option>
                    <option>ขาว</option>
					<option>ดำ</option>
					<option>ชมพู</option>
					<option>โอรส</option>
					<option>น้ำตาล</option>
					<option>เทา</option>
					<option>ฟ้า</option>
					<option>กรม</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="productNumber">จำนวนสินค้า</Label>
                  <Input
                    type="number"
                    name="number"
                    id="productNumber"
                    placeholder="เลือกจำนวนสินค้า"
					min="1"
					Max="250"
					
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="exampleText">รหัสสั่งซื้อสินค้าสำหรับLive</Label>
                  <Input type="textarea" name="text" />
                </FormGroup>

                <FormGroup>
                  <Label for="exampleFile">File</Label>
                  <Input type="file" name="file" />
                  <FormText color="muted">
                    This is some placeholder block-level help text for the above
                    input. It's a bit lighter and easily wraps to a new line.
                  </FormText>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input type="checkbox" /> สินค้าพร้อมขาย
                  </Label>
                </FormGroup>
				<FormGroup check row>
                  <Col sm={{ size: 10, offset: 2 }}>
                    <Button>Submit</Button>
                  </Col>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Page>
  );
};

export default AddProducts;
