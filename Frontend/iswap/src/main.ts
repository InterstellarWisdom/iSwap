import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Modal, Spin, Button, Input, Space, Collapse, Slider } from "ant-design-vue"
import 'ant-design-vue/dist/antd.css';
import './assets/styles/common.less';

createApp(App).use(store).use(router).use(Modal).use(Spin).use(Button).use(Input).use(Space).use(Collapse).use(Slider).mount("#app");
