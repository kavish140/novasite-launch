import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import assert from 'node:assert/strict';
const walk=dir=>readdirSync(dir,{withFileTypes:true}).filter(e=>!e.name.startsWith('.')).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);
const privateNames=['SUPABASE_SERVICE_ROLE_KEY','RAZORPAY_KEY_SECRET','RAZORPAY_WEBHOOK_SECRET','PAYMENT_GATEWAY_SECRET','PAYMENT_RECEIPT_SECRET','PAYMENT_RECEIPT_PREVIOUS_SECRET','CALENDAR_SYNC_SECRET'];
const values=[];
// Read ignored local settings only in memory. Never emit their contents or matches.
for(const file of ['.env','.dev.vars','supabase/functions/.env'])if(existsSync(file))for(const line of readFileSync(file,'utf8').split(/\r?\n/)){
 const match=/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/.exec(line);if(!match||!privateNames.includes(match[1]))continue;
 const value=match[2].replace(/^(['"])(.*)\1$/,'$2');if(value.length>=16)values.push(value);
}
const client=walk('dist/client').filter(file=>/\.(?:js|html|json|map)$/.test(file));
for(const file of client){const body=readFileSync(file,'utf8');assert.ok(!privateNames.some(name=>body.includes(name)),'Private server identifier found in client build');}
const artifacts=[...client,...walk('docs').filter(file=>/\.(?:md|diff|txt)$/.test(file))];
for(const file of artifacts){const body=readFileSync(file,'utf8');assert.ok(!values.some(value=>body.includes(value)),'Private credential found in review/client artifact');}
console.log('PASS: client bundles contain no private payment/server identifiers; local credential values absent from client and review artifacts. Supabase-only secret values were not inspected.');
