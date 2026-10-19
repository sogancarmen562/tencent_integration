import TencentCloudChat from '@tencentcloud/chat';

const SDK_APP_ID = 20045691;
const USER_ID = "45060fa6-89eb-4bae-8d6e-e28b280a6f4e";
const USER_SIG = "eJw1jc0KgkAURl9FZlvadXDGMWhXVP5gqItwp3m10QxRiSh698x0ew7n*94kckPtgS1ZK4RqQJbKSGSG917m8i8MBhzyhKvCwlQ10gRVkXFUkYqUCkh4buBcdlmVNI3Mho4CGIxb*mTw2cgWB64zxgYHE*9lPVJTmCBAN*m8JIvf*WEVB4-GuSxsb*c7dtWV-BZGMjBrPfbPxdY7Xfelm8bHV7chny9Ldzo8";

console.log("Testing Tencent Cloud Chat SDK login for user:", USER_ID);

const chat = TencentCloudChat.create({ SDKAppID: SDK_APP_ID });

chat.on(TencentCloudChat.EVENT.SDK_READY, () => {
  console.log("SUCCESS! Tencent SDK_READY event fired!");
  process.exit(0);
});

chat.on(TencentCloudChat.EVENT.SDK_NOT_READY, (err) => {
  console.error("FAILED! SDK_NOT_READY:", err);
  process.exit(1);
});

chat.login({
  userID: USER_ID,
  userSig: USER_SIG
}).then((res) => {
  console.log("chat.login response:", res);
}).catch((err) => {
  console.error("chat.login error:", err);
  process.exit(1);
});
