import{dA as L,d7 as N,d4 as k,d9 as o,f0 as I,dG as E,ex as w,ey as C,d6 as a,dw as O,ds as p,ci as z,cf as P,f1 as q}from"./index-qSpe-cq9.js";import{h as F}from"./CopyToClipboard-DSTf_eKU-aQjpLwyE.js";import{a as V}from"./Layouts-BlFm53ED-B99eMUf3.js";import{a as H,i as J}from"./JsonTree-aPaJmPx7-DW2VP_QP.js";import{n as G}from"./ScreenLayout-D1p_ntex-DSCS_z3W.js";import{c as K}from"./createLucideIcon-dQJDYowT.js";import"./ModalHeader-BnVmXtvG-YuJGHfdx.js";import"./Screen-Cycy3IzT-BBtwWod7.js";import"./index-Dq_xe9dz-DmwSqYyP.js";/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]],W=K("square-pen",Q),B=p.img`
  && {
    height: ${e=>e.size==="sm"?"65px":"140px"};
    width: ${e=>e.size==="sm"?"65px":"140px"};
    border-radius: 16px;
    margin-bottom: 12px;
  }
`;let X=e=>{if(!z(e))return e;try{let s=P(e);return s.includes("�")?e:s}catch{return e}},Y=e=>{try{let s=q.decode(e),n=new TextDecoder().decode(s);return n.includes("�")?e:n}catch{return e}},Z=e=>{let{types:s,primaryType:n,...l}=e.typedData;return a.jsxs(a.Fragment,{children:[a.jsx(te,{data:l}),a.jsx(F,{text:(r=e.typedData,JSON.stringify(r,null,2)),itemName:"full payload to clipboard"})," "]});var r};const M=({method:e,messageData:s,copy:n,iconUrl:l,isLoading:r,success:g,walletProxyIsLoading:m,errorMessage:x,isCancellable:d,onSign:c,onCancel:y,onClose:u})=>a.jsx(G,{title:n.title,subtitle:n.description,showClose:!0,onClose:u,icon:W,iconVariant:"subtle",helpText:x?a.jsx(ee,{children:x}):void 0,primaryCta:{label:n.buttonText,onClick:c,disabled:r||g||m,loading:r},secondaryCta:d?{label:"Not now",onClick:y,disabled:r||g||m}:void 0,watermark:!0,children:a.jsxs(V,{children:[l?a.jsx(B,{style:{alignSelf:"center"},size:"sm",src:l,alt:"app image"}):null,a.jsxs($,{children:[e==="personal_sign"&&a.jsx(b,{children:X(s)}),e==="eth_signTypedData_v4"&&a.jsx(Z,{typedData:s}),e==="solana_signMessage"&&a.jsx(b,{children:Y(s)})]})]})}),ue={component:()=>{let{authenticated:e}=L(),{initializeWalletProxy:s,closePrivyModal:n}=N(),{navigate:l,data:r,onUserCloseViaDialogOrKeybindRef:g}=k(),[m,x]=o.useState(!0),[d,c]=o.useState(""),[y,u]=o.useState(),[f,T]=o.useState(null),[R,S]=o.useState(!1);o.useEffect(()=>{e||l("LandingScreen")},[e]),o.useEffect(()=>{s(I).then(i=>{x(!1),i||(c("An error has occurred, please try again."),u(new E(new w(d,C.E32603_DEFAULT_INTERNAL_ERROR.eipCode))))})},[]);let{method:_,data:j,confirmAndSign:v,onSuccess:D,onFailure:U,uiOptions:t}=r.signMessage,A={title:(t==null?void 0:t.title)||"Sign message",description:(t==null?void 0:t.description)||"Signing this message will not cost you any fees.",buttonText:(t==null?void 0:t.buttonText)||"Sign and continue"},h=i=>{i?D(i):U(y||new E(new w("The user rejected the request.",C.E4001_USER_REJECTED_REQUEST.eipCode))),n({shouldCallAuthOnSuccess:!1}),setTimeout(()=>{T(null),c(""),u(void 0)},200)};return g.current=()=>{h(f)},a.jsx(M,{method:_,messageData:j,copy:A,iconUrl:t!=null&&t.iconUrl&&typeof t.iconUrl=="string"?t.iconUrl:void 0,isLoading:R,success:f!==null,walletProxyIsLoading:m,errorMessage:d,isCancellable:t==null?void 0:t.isCancellable,onSign:async()=>{S(!0),c("");try{let i=await v();T(i),S(!1),setTimeout(()=>{h(i)},O)}catch(i){console.error(i),c("An error has occurred, please try again."),u(new E(new w(d,C.E32603_DEFAULT_INTERNAL_ERROR.eipCode))),S(!1)}},onCancel:()=>h(null),onClose:()=>h(f)})}};let $=p.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`,ee=p.p`
  && {
    margin: 0;
    width: 100%;
    text-align: center;
    color: var(--privy-color-error-dark);
    font-size: 14px;
    line-height: 22px;
  }
`,te=p(H)`
  margin-top: 0;
`,b=p(J)`
  margin-top: 0;
`;export{ue as SignRequestScreen,M as SignRequestView,ue as default};
