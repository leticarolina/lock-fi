import{dA as I,d4 as M,d9 as f,f6 as W,d6 as t,f7 as B,dy as F,ds as x}from"./index-qSpe-cq9.js";import{p as P,u as V,k as z,f as D,h as R}from"./SelectSourceAsset-C10HQdge-BnSpBXx6.js";import{p as Y}from"./CopyableText-BCytXyJL-0AFmy_6_.js";import{n as k}from"./ScreenLayout-D1p_ntex-DSCS_z3W.js";import{i as q}from"./InfoBanner-DkQEPd77-DlsLFOa6.js";import{c as S}from"./createLucideIcon-dQJDYowT.js";import{C as N}from"./check-CVVO2Syq.js";import{C as E}from"./circle-x-Bwem3PfN.js";import"./copy-LyoJc1TR.js";import"./ModalHeader-BnVmXtvG-YuJGHfdx.js";import"./Screen-Cycy3IzT-BBtwWod7.js";import"./index-Dq_xe9dz-DmwSqYyP.js";/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=[["path",{d:"M5 22h14",key:"ehvnwv"}],["path",{d:"M5 2h14",key:"pdyrp9"}],["path",{d:"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22",key:"1d314k"}],["path",{d:"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2",key:"1vvvr6"}]],K=S("hourglass",H);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=[["path",{d:"m16 11 2 2 4-4",key:"9rsbq5"}],["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],X=S("user-check",O),G=({data:e,onClose:a})=>t.jsx(k,{showClose:!0,onClose:a,title:"Initiate bank transfer",subtitle:"Use the details below to complete a bank transfer from your bank.",primaryCta:{label:"Done",onClick:a},watermark:!1,footerText:"Exchange rates and fees are set when you authorize and determine the amount you receive. You'll see the applicable rates and fees for your transaction separately",children:t.jsx(J,{children:(B[e.deposit_instructions.asset]||[]).map(([u,m],y)=>{let d=e.deposit_instructions[u];if(!d||Array.isArray(d))return null;let o=u==="asset"?d.toUpperCase():d,h=o.length>100?`${o.slice(0,9)}...${o.slice(-9)}`:o;return t.jsxs(Q,{children:[t.jsx(Z,{children:m}),t.jsx(Y,{value:o,includeChildren:F,children:t.jsx(ee,{children:h})})]},y)})})});let J=x.ol`
  border-color: var(--privy-color-border-default);
  border-width: 1px;
  border-radius: var(--privy-border-radius-mdlg);
  border-style: solid;
  display: flex;
  flex-direction: column;

  && {
    padding: 0 1rem;
  }
`,Q=x.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;

  &:not(:first-of-type) {
    border-top: 1px solid var(--privy-color-border-default);
  }

  & > {
    :nth-child(1) {
      flex-basis: 30%;
    }

    :nth-child(2) {
      flex-basis: 60%;
    }
  }
`,Z=x.span`
  color: var(--privy-color-foreground);
  font-kerning: none;
  font-variant-numeric: lining-nums proportional-nums;
  font-feature-settings: 'calt' off;

  /* text-xs/font-regular */
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.125rem; /* 150% */

  text-align: left;
  flex-shrink: 0;
`,ee=x.span`
  color: var(--privy-color-foreground);
  font-kerning: none;
  font-feature-settings: 'calt' off;

  /* text-sm/font-medium */
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.375rem; /* 157.143% */

  text-align: right;
  word-break: break-all;
`;const te=({onClose:e})=>t.jsx(k,{showClose:!0,onClose:e,icon:E,iconVariant:"error",title:"Something went wrong",subtitle:"We couldn't complete account setup. This isn't caused by anything you did.",primaryCta:{label:"Close",onClick:e},watermark:!0}),se=({onClose:e,reason:a})=>{let u=a?a.charAt(0).toLowerCase()+a.slice(1):void 0;return t.jsx(k,{showClose:!0,onClose:e,icon:E,iconVariant:"error",title:"Identity verification failed",subtitle:u?`We can't complete identity verification because ${u}. Please try again or contact support for assistance.`:"We couldn't verify your identity. Please try again or contact support for assistance.",primaryCta:{label:"Close",onClick:e},watermark:!0})},re=({onClose:e,email:a})=>t.jsx(k,{showClose:!0,onClose:e,icon:K,title:"Identity verification in progress",subtitle:"We're waiting for Persona to approve your identity verification. This usually takes a few minutes, but may take up to 24 hours.",primaryCta:{label:"Done",onClick:e},watermark:!0,children:t.jsxs(q,{theme:"light",children:["You'll receive an email at ",a," once approved with instructions for completing your deposit."]})}),oe=({onClose:e,onAcceptTerms:a,isLoading:u})=>t.jsx(k,{showClose:!0,onClose:e,icon:X,title:"Verify your identity to continue",subtitle:"Finish verification with Persona — it takes just a few minutes and requires a government ID.",helpText:t.jsxs(t.Fragment,{children:[`This app uses Bridge to securely connect accounts and move funds. By clicking "Accept," you agree to Bridge's`," ",t.jsx("a",{href:"https://www.bridge.xyz/legal",target:"_blank",rel:"noopener noreferrer",children:"Terms of Service"})," ","and"," ",t.jsx("a",{href:"https://www.bridge.xyz/legal/row-privacy-policy/bridge-building-limited",target:"_blank",rel:"noopener noreferrer",children:"Privacy Policy"}),"."]}),primaryCta:{label:"Accept and continue",onClick:a,loading:u},watermark:!0}),ae=({onClose:e})=>t.jsx(k,{showClose:!0,onClose:e,icon:N,iconVariant:"success",title:"Identity verified successfully",subtitle:"We've successfully verified your identity. Now initiate a bank transfer to view instructions.",primaryCta:{label:"Initiate bank transfer",onClick:()=>{},loading:!0},watermark:!0}),ie=({opts:e,onClose:a,onEditSourceAsset:u,onSelectAmount:m,isLoading:y})=>t.jsxs(k,{showClose:!0,onClose:a,headerTitle:`Buy ${e.destination.asset.toLocaleUpperCase()}`,primaryCta:{label:"Continue",onClick:m,loading:y},watermark:!0,children:[t.jsx(D,{currency:e.source.selectedAsset,inputMode:"decimal",autoFocus:!0}),t.jsx(R,{selectedAsset:e.source.selectedAsset,onEditSourceAsset:u})]}),ne=({onClose:e,onAcceptTerms:a,onSelectAmount:u,onSelectSource:m,onEditSourceAsset:y,opts:d,state:o,email:h,isLoading:n})=>o.status==="select-amount"?t.jsx(ie,{onClose:e,onSelectAmount:u,onEditSourceAsset:y,opts:d,isLoading:n}):o.status==="select-source-asset"?t.jsx(z,{onSelectSource:m,opts:d,isLoading:n}):o.status==="kyc-prompt"?t.jsx(oe,{onClose:e,onAcceptTerms:a,opts:d,isLoading:n}):o.status==="kyc-incomplete"?t.jsx(re,{onClose:e,email:h}):o.status==="kyc-success"?t.jsx(ae,{onClose:e}):o.status==="kyc-error"?t.jsx(se,{onClose:e,reason:o.reason}):o.status==="account-details"?t.jsx(G,{onClose:e,data:o.data}):o.status==="create-customer-error"||o.status==="get-customer-error"?t.jsx(te,{onClose:e}):null,ve={component:()=>{let{user:e}=I(),a=M().data;if(!(a!=null&&a.FundWithBankDepositScreen))throw Error("Missing data");let{onSuccess:u,onFailure:m,opts:y,createOrUpdateCustomer:d,getCustomer:o,getOrCreateVirtualAccount:h}=a.FundWithBankDepositScreen,[n,j]=f.useState(y),[b,r]=f.useState({status:"select-amount"}),[w,l]=f.useState(null),[U,i]=f.useState(!1),g=f.useRef(null),_=f.useCallback(async()=>{var C,p;let s;i(!0),l(null);try{s=await o({kycRedirectUrl:window.location.origin})}catch(c){if(!c||typeof c!="object"||!("status"in c)||c.status!==404)return r({status:"get-customer-error"}),l(c),void i(!1)}if(!s)try{s=await d({hasAcceptedTerms:!1,kycRedirectUrl:window.location.origin})}catch(c){return r({status:"create-customer-error"}),l(c),void i(!1)}if(!s)return r({status:"create-customer-error"}),l(Error("Unable to create customer")),void i(!1);if(s.status==="not_started"&&s.kyc_url)return r({status:"kyc-prompt",kycUrl:s.kyc_url}),void i(!1);if(s.status==="not_started")return r({status:"get-customer-error"}),l(Error("Unexpected user state")),void i(!1);if(s.status==="rejected")return r({status:"kyc-error",reason:(p=(C=s.rejection_reasons)==null?void 0:C[0])==null?void 0:p.reason}),l(Error("User KYC rejected.")),void i(!1);if(s.status==="incomplete")return r({status:"kyc-incomplete"}),void i(!1);if(s.status!=="active")return r({status:"get-customer-error"}),l(Error("Unexpected user state")),void i(!1);s.status;try{let c=await h({destination:n.destination,provider:n.provider,source:{asset:n.source.selectedAsset}});r({status:"account-details",data:c})}catch(c){return r({status:"create-customer-error"}),l(c),void i(!1)}},[n]),T=f.useCallback(async()=>{var c,A;if(l(null),i(!0),b.status!=="kyc-prompt")return l(Error("Unexpected state")),void i(!1);let s=W({location:b.kycUrl});if(await d({hasAcceptedTerms:!0}),!s)return l(Error("Unable to begin kyc flow.")),i(!1),void r({status:"create-customer-error"});g.current=new AbortController;let C=await P(s,g.current.signal);if(C.status==="aborted")return;if(C.status==="closed")return void i(!1);C.status;let p=await V({operation:()=>o({}),until:v=>v.status==="active"||v.status==="rejected",delay:0,interval:2e3,attempts:60,signal:g.current.signal});if(p.status!=="aborted"){if(p.status==="max_attempts")return r({status:"kyc-incomplete"}),void i(!1);if(p.status,p.result.status==="rejected")return r({status:"kyc-error",reason:(A=(c=p.result.rejection_reasons)==null?void 0:c[0])==null?void 0:A.reason}),l(Error("User KYC rejected.")),void i(!1);if(p.result.status!=="active")return r({status:"kyc-incomplete"}),void i(!1);s.closed||s.close(),p.result.status;try{r({status:"kyc-success"});let v=await h({destination:n.destination,provider:n.provider,source:{asset:n.source.selectedAsset}});r({status:"account-details",data:v})}catch(v){r({status:"create-customer-error"}),l(v)}finally{i(!1)}}},[r,l,i,d,h,b,n,g]),L=f.useCallback(s=>{r({status:"select-amount"}),j({...n,source:{...n.source,selectedAsset:s}})},[r,j]),$=f.useCallback(()=>{r({status:"select-source-asset"})},[r]);return t.jsx(ne,{onClose:f.useCallback(async()=>{var s;(s=g.current)==null||s.abort(),w?m(w):await u()},[w,g]),opts:n,state:b,isLoading:U,email:e.email.address,onAcceptTerms:T,onSelectAmount:_,onSelectSource:L,onEditSourceAsset:$})}};export{ve as FundWithBankDepositScreen,ve as default};
