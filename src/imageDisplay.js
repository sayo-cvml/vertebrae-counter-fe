import { useState, useEffect } from "react";
import Boundingbox from "react-bounding-box";
import client from "./Client";
import { Menu, Layout, Spin, Button, Row, Col, Card, Switch } from "antd";
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { CirclePicker } from "react-color";
import boxOptions from "./options";

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

const ImageDisplay = () => {
  const [image, setImage] = useState(null);
  const [options, setOptions] = useState(boxOptions);
  const [selected, setSelected] = useState(false);
  const [imageObject, setImageObject] = useState();
  const [boxes, setBoxes] = useState([]);
  const [display, setDisplay] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detected, setDetected] = useState(true);

  useEffect(() => {
    if (image) {
      setImage(image);
    }
  }, [image]);

  const handleSelect = (e) => {
    e.preventDefault();
    setImageObject(e.target.files[0]);
    setSelected(true);
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSwitch = (value) => {
    if (value) {
      setDisplay([...boxes]);
      return;
    }
    setDisplay([]);
  };

  const handlePick = (object) => {
    const rgb = object.rgb;
    const colorString = `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
    const colors = {
      normal: colorString,
      selected: colorString,
      unselected: colorString,
    };
    setOptions({ ...options, colors });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setLoading(true);
    const data = new FormData();
    data.append("file", imageObject);
    client
      .post("https://vertebrae-counter-44meqtbvbq-uc.a.run.app/detect/", data)
      .then((response) => {
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
          setImage(image);
          setBoxes(detections);
          setDisplay(detections);
          setDetected(false);
          setLoading(false);
        }
      })
      .catch((error) => {
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
                    {selected && (
                      <Boundingbox
                        image={image}
                        boxes={display}
                        options={options}
                      />
                    )}
                  </Spin>
                </div>
              </Col>
              <Col span={8}>
                <div
                  style={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Card style={{ width: 300 }}>
                    <h2>Vertebrae Count</h2>
                    <p style={{ fontSize: "5rem", textAlign: "center" }}>
                      {boxes.length ? boxes.length : 0}
                    </p>
                  </Card>
                  <Card
                    style={{
                      width: 300,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <h2 style={{ textAlign: "center" }}>Toggle Detections</h2>
                    <div style={{ marginLeft: "40%" }}>
                      <Switch
                        disabled={detected}
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        onChange={handleSwitch}
                        defaultChecked
                      />
                    </div>
                  </Card>
                  <Card>
                    <h2 style={{ textAlign: "center" }}>Color Picker</h2>
                    <div>
                      <CirclePicker onChange={handlePick} />
                    </div>
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
