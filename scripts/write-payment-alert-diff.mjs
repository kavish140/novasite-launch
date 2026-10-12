import {existsSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
const step=process.argv[2]??'1';
const files=step==='1'||step==='all'?[
 'AGENTS.md','supabase/functions/_shared/payment-store.ts','supabase/functions/_shared/admin-payments.ts','supabase/functions/_shared/razorpay.ts','supabase/functions/_shared/payment-health.ts','supabase/migrations/20261011100002_payment_dispute_audit.sql',
 'app/lib/payment-health.ts','app/lib/payment-health-store.test.ts','app/lib/payment-disputes.test.ts','app/lib/payment-admin-edge.test.ts','app/pages/admin/AdminDashboard.tsx','app/pages/admin/components/AdminSidebar.tsx','app/pages/admin/components/PaymentAlerts.tsx','app/pages/admin/components/PaymentAlerts.test.tsx','app/pages/admin/hooks/usePaymentHealth.ts','app/pages/admin/hooks/usePaymentHealth.test.tsx','app/pages/admin/tabs/PaymentsTab.tsx','app/pages/admin/tabs/PaymentsTab.test.tsx','scripts/test-payment-disputes-db.mjs',
]:['AGENTS.md','app/pages/admin/tabs/PaymentsTab.tsx','app/pages/admin/tabs/PaymentsTab.test.tsx','app/pages/admin/components/PaymentCronHealth.tsx','app/pages/admin/components/PaymentCronHealth.test.tsx','app/pages/admin/AdminDashboard.tsx'];
if(step==='all')files.push('app/pages/admin/components/PaymentCronHealth.tsx','app/pages/admin/components/PaymentCronHealth.test.tsx','app/lib/payment-health-admin.test.ts','docs/payment-alerts-verification.md','scripts/write-payment-alert-diff.mjs');
const root=resolve('.'),baseline=join(tmpdir(),step==='2'?'sitenova-payment-alerts-step2-baseline':'sitenova-payment-alerts-baseline');
const empty=join(tmpdir(),'sitenova-payment-alerts-empty');writeFileSync(empty,'');
let diff='';
for(const file of files){
 const before=join(baseline,file),after=join(root,file);
 if(!existsSync(after))continue;
 const result=spawnSync('git',['diff','--no-index','--no-ext-diff','--text','--',existsSync(before)?before:empty,after],{encoding:'utf8',maxBuffer:8*1024*1024});
 if(result.status!==0&&result.status!==1)throw new Error('Diff generation failed');
 const chunk=result.stdout;
 if(!chunk)continue;
 // Replace machine-specific headers with reviewable repository paths.
 const body=chunk.slice(chunk.indexOf('@@'));
 diff+=`diff --git a/${file} b/${file}\n--- ${existsSync(before)?`a/${file}`:'/dev/null'}\n+++ b/${file}\n${body}`;
}
writeFileSync(`docs/payment-alerts-step-${step}.diff`,diff);
console.log(`Saved step ${step} source diff (${diff.length} characters).`);
