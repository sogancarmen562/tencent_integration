import TLSKEY from 'tls-sig-api-v2';
import TencentCloudChat from '@tencentcloud/chat';

const SDK_APP_ID = 20045691;
const REAL_TENCENT_SECRET_KEY = "782a0c0ff132e2f6ad2bb0e546052bd3abd434719edc48847daab16f136724c4";

const api = new TLSKEY.Api(SDK_APP_ID, REAL_TENCENT_SECRET_KEY);

const users = [
  "45060fa6-89eb-4bae-8d6e-e28b280a6f4e",
  "45060fa6-89eb-4bae-8d6e-e28b280a6f4",
  "3e9ab094-926e-4a48-f6c3-56d807fc6cb2",
  "administrator"
];

for (const u of users) {
  const sig = api.genSig(u, 86400 * 180);
  console.log(`User: ${u}`);
  console.log(`Sig: ${sig}`);

  const chat = TencentCloudChat.create({ SDKAppID: SDK_APP_ID });
  try {
    const res = await chat.login({ userID: u, userSig: sig });
    console.log(`>>> SUCCESS LOGIN FOR ${u}! <<<`, res);
  } catch (err) {
    console.error(`FAILED for ${u}:`, err.message, err.code);
  }
}
