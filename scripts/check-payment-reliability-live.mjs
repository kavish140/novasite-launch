import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const env={};for(const line of (await readFile('supabase/functions/.env','utf8')).split(/\r?\n/)){const m=line.match(/^([A-Z_]+)=(.*)$/);if(m)env[m[1]]=m[2].trim().replace(/^(['"])(.*)\1$/,'$2');}
const url='https://bklmtwblsoitafynpikc.supabase.co/functions/v1/razorpay-payments/';
async function edge(action,token){return fetch(url+action,{method:'POST',headers:{'Content-Type':'application/json','x-payment-gateway-secret':env.PAYMENT_GATEWAY_SECRET,'x-payment-origin':'https://sitenova.dev',...(token?{'x-payment-admin-token':token}:{})},body:'{}'});}
const config=await edge('config');assert.equal(config.status,200);assert.equal((await config.json()).enabled,false);
for(const action of ['order','retry','checkout'])assert.equal((await edge(action)).status,503);
for(const action of ['queue','history','recheck']){assert.equal((await edge('admin-queue/'+action)).status,401);assert.equal((await edge('admin-queue/'+action,'invalid')).status,401);}
for(const action of ['order','retry']){const result=await fetch('https://sitenova.dev/api/payments/'+action,{method:'POST',headers:{origin:'https://sitenova.dev','Content-Type':'application/json'},body:'{}'});assert.equal(result.status,503);}
console.log('PASS: public checkout remains disabled and deployed admin queue rejects missing/forged identities. No order or payment created.');
