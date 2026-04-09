import{d9 as a,dA as T,d7 as _,d4 as $,d6 as e,em as E,en as U,dU as F,ds as p,e2 as W}from"./index-qSpe-cq9.js";import{F as N}from"./ShieldCheckIcon-D7o7JnyS.js";import{m as O}from"./ModalHeader-BnVmXtvG-YuJGHfdx.js";import{l as V}from"./Layouts-BlFm53ED-B99eMUf3.js";import{g as H,h as M,u as z,b as B,k as D}from"./shared-DhWmkz5T-BvEdd1HB.js";import{w as s}from"./Screen-Cycy3IzT-BBtwWod7.js";import"./index-Dq_xe9dz-DmwSqYyP.js";const re={component:()=>{let[o,y]=a.useState(!0),{authenticated:m,user:g}=T(),{walletProxy:i,closePrivyModal:v,createAnalyticsEvent:x,client:j}=_(),{navigate:k,data:A,onUserCloseViaDialogOrKeybindRef:C}=$(),[l,P]=a.useState(void 0),[f,d]=a.useState(""),[c,w]=a.useState(!1),{entropyId:u,entropyIdVerifier:S,onCompleteNavigateTo:b,onSuccess:h,onFailure:R}=A.recoverWallet,n=(r="User exited before their wallet could be recovered")=>{v({shouldCallAuthOnSuccess:!1}),R(typeof r=="string"?new F(r):r)};return C.current=n,a.useEffect(()=>{if(!m)return n("User must be authenticated and have a Privy wallet before it can be recovered")},[m]),e.jsxs(s,{children:[e.jsx(s.Header,{icon:N,title:"Enter your password",subtitle:"Please provision your account on this new device. To continue, enter your recovery password.",showClose:!0,onClose:n}),e.jsx(s.Body,{children:e.jsx(K,{children:e.jsxs("div",{children:[e.jsxs(H,{children:[e.jsx(M,{type:o?"password":"text",onChange:r=>(t=>{t&&P(t)})(r.target.value),disabled:c,style:{paddingRight:"2.3rem"}}),e.jsx(z,{style:{right:"0.75rem"},children:o?e.jsx(B,{onClick:()=>y(!1)}):e.jsx(D,{onClick:()=>y(!0)})})]}),!!f&&e.jsx(L,{children:f})]})})}),e.jsxs(s.Footer,{children:[e.jsx(s.HelpText,{children:e.jsxs(V,{children:[e.jsx("h4",{children:"Why is this necessary?"}),e.jsx("p",{children:"You previously set a password for this wallet. This helps ensure only you can access it"})]})}),e.jsx(s.Actions,{children:e.jsx(Y,{loading:c||!i,disabled:!l,onClick:async()=>{w(!0);let r=await j.getAccessToken(),t=E(g,u);if(!r||!t||l===null)return n("User must be authenticated and have a Privy wallet before it can be recovered");try{x({eventName:"embedded_wallet_recovery_started",payload:{walletAddress:t.address}}),await(i==null?void 0:i.recover({accessToken:r,entropyId:u,entropyIdVerifier:S,recoveryPassword:l})),d(""),b?k(b):v({shouldCallAuthOnSuccess:!1}),h==null||h(t),x({eventName:"embedded_wallet_recovery_completed",payload:{walletAddress:t.address}})}catch(I){U(I)?d("Invalid recovery password, please try again."):d("An error has occurred, please try again.")}finally{w(!1)}},$hideAnimations:!u&&c,children:"Recover your account"})}),e.jsx(s.Watermark,{})]})]})}};let K=p.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`,L=p.div`
  line-height: 20px;
  height: 20px;
  font-size: 13px;
  color: var(--privy-color-error);
  text-align: left;
  margin-top: 0.5rem;
`,Y=p(O)`
  ${({$hideAnimations:o})=>o&&W`
      && {
        // Remove animations because the recoverWallet task on the iframe partially
        // blocks the renderer, so the animation stutters and doesn't look good
        transition: none;
      }
    `}
`;export{re as PasswordRecoveryScreen,re as default};
