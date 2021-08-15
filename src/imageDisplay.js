import { useState, useEffect } from "react";
import Boundingbox from "react-bounding-box";
import client from "./Client";
import { Menu, Layout, Spin, Button, Row, Col, Card } from "antd";
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import { DatePicker, Space } from "antd";

// const { RangePicker } = DatePicker;
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const ImageDisplay = () => {
  const [image, setImage] = useState(null);
  const [selected, setSelected] = useState(false);
  const [imageObject, setImageObject] = useState();
  const [detected, setDetected] = useState(true);
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (image) {
      console.log(image);
      setImage(image);
    }
    console.log("None");
  }, [image]);

  const handleSelect = (e) => {
    e.preventDefault();
    setImageObject(e.target.files[0]);
    setSelected(true);
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setLoading(true);
    const data = new FormData();
    data.append("file", imageObject);
    setDetected(false);
    client
      .post("https://vertebrae-counter-44meqtbvbq-uc.a.run.app/detect/", data)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          const predictions = response.data;
          const detections = predictions.map((item) => {
            const box = item[2];
            const x = box[0] - box[2] / 2;
            const y = box[1] - box[3] / 2;
            const w = box[2];
            const h = box[3];
            return [x, y, w, h];
          });
          console.log(detections);
          setImage(image);
          setDetected(true);
          setBoxes(detections);
          setLoading(false);
        }
      })
      .catch((error) => {
        setDetected(true);
        console.log("error ", error);
      });
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Layout style={{ height: "100vh" }}>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["images"]}
            style={{ height: "100%", borderRight: 0 }}
          >
            <SubMenu key={"images"} title="Images">
              <Menu.Item key="1">option1</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{ padding: "0 24px 24px", height: "100vh" }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Row>
              <Col span={16}>
                <div style={{ height: "100vh" }}>
                  <Button onClick={handleSubmit} type="primary" block>
                    Send
                  </Button>
                  <input type="file" onChange={handleSelect} />
                  <Spin spinning={loading} tip="Counting vertebrae...">
                    {selected && <Boundingbox image={image} boxes={boxes} />}
                  </Spin>
                </div>
              </Col>
              <Col span={8}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Card style={{ width: 300 }}>
                    <h2>Vertebrae Count</h2>
                    <p style={{ fontSize: "5rem", textAlign: "center" }}>
                      {boxes.length ? boxes.length : 0}
                    </p>
                  </Card>
                </div>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default ImageDisplay;

//  <Space>
//    <RangePicker direction="vertical" size={12} />
//  </Space>;
