/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module '*'
declare class SMS_Plugin {
  stopJanus(): void;
  sendData(data: string): string;
  sendPrivateMsg(username: string, msg: string): void;
  doCall(display: string): void;
  doHangup(): void;
  answerCall(jsep): void;
  queryRoomList(): void;
  createRoom(): void;
}