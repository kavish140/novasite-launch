import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import {render,screen,fireEvent,waitFor,cleanup} from '@testing-library/react';
import PaymentsTab from './PaymentsTab';
import {adminPaymentRequest} from '@/lib/payment-admin-client';
vi.mock('@/lib/payment-admin-client',()=>({adminPaymentRequest:vi.fn()}));
// New sections have dedicated tests; retain the original queue scenarios unchanged.
vi.mock('../components/PaidOrders',()=>({default:()=>null}));
vi.mock('../components/PaymentInvestigations',()=>({default:()=>null}));
const order={request_id:'request',order_id:'order_1',package:'test',amount:100,status:'pending',reconciliation_state:'needs_reconciliation',created_at:'2026-10-10T10:00:00Z',last_checked_at:null};
beforeEach(()=>{vi.resetAllMocks();vi.mocked(adminPaymentRequest).mockResolvedValue({orders:[order],runs:[],alerts:[],nextOffset:null});});
afterEach(cleanup);
it('shows open disputes with payment, order, paise amount and deadline, then removes resolved disputes',async()=>{
 const health={observedAt:order.created_at,latestRunFailed:false,lastCompletedAt:order.created_at,lastSuccessfulAt:order.created_at,overdue:0,needsReconciliation:0,refunded:0,disputes:[{id:'disp_1',event:'payment.dispute.created',status:'open',amount:100,currency:'INR',paymentId:'pay_1',orderId:'order_1',responseDueAt:'2026-10-12T10:00:00Z',occurredAt:order.created_at}]};
 const view=render(<PaymentsTab health={health}/>);
 expect(screen.getByText('Open disputes')).toBeTruthy();expect(screen.getByText(/Payment: pay_1/)).toBeTruthy();expect(screen.getByText(/Disputed amount: ₹1.00/)).toBeTruthy();expect(screen.getByText(/Response due:.*IST/)).toBeTruthy();
 await screen.findByText('₹1.00');view.rerender(<PaymentsTab health={{...health,disputes:[]}}/>);
 expect(screen.queryByText('Open disputes')).toBeNull();
});
it('shows ₹1 in rupees and re-checks only by order reference, with history',async()=>{
 render(<PaymentsTab/>);expect(await screen.findByText('₹1.00')).toBeTruthy();
 vi.mocked(adminPaymentRequest).mockResolvedValueOnce({state:'paid',needsReview:false}).mockResolvedValueOnce({orders:[],runs:[],alerts:[],nextOffset:null}).mockResolvedValueOnce({history:[{id:'log',old_state:'needs_reconciliation',new_state:'paid',error:null,alert:false,created_at:order.created_at}],nextOffset:null});
 fireEvent.click(screen.getByRole('button',{name:'Re-check with Razorpay'}));
 await waitFor(()=>expect(adminPaymentRequest).toHaveBeenCalledWith('recheck',{requestId:'request'}));
 expect(await screen.findByText(/needs reconciliation → paid/)).toBeTruthy();expect(screen.queryByRole('button',{name:/mark.*paid/i})).toBeNull();
});
it('shows failed runs and over-24-hour flags',async()=>{
 vi.mocked(adminPaymentRequest).mockResolvedValueOnce({orders:[order],runs:[{id:'run',started_at:order.created_at,error:'Provider unavailable'}],alerts:[{id:'alert',request_id:'request',order_id:'order_1',new_state:'needs_reconciliation',created_at:order.created_at,error:null}],nextOffset:null});
 render(<PaymentsTab/>);expect(await screen.findByText('Reconciliation failures — review required')).toBeTruthy();expect(screen.getByText(/Unresolved for over 24 hours/)).toBeTruthy();
});
it('hides historical failure warnings after the current run issue resolves',async()=>{
 vi.mocked(adminPaymentRequest).mockResolvedValueOnce({orders:[],runs:[{id:'run',started_at:order.created_at,error:'Old failure'}],alerts:[],nextOffset:null});
 const health={observedAt:order.created_at,latestRunFailed:true,lastCompletedAt:order.created_at,lastSuccessfulAt:order.created_at,overdue:0,needsReconciliation:0,refunded:0,disputes:[]};
 const view=render(<PaymentsTab health={health}/>);expect(await screen.findByText('Reconciliation failures — review required')).toBeTruthy();
 view.rerender(<PaymentsTab health={{...health,latestRunFailed:false}}/>);
 expect(screen.queryByText('Reconciliation failures — review required')).toBeNull();
});
