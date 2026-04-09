import{dD as x,d6 as e,eX as h,d9 as f,ds as n}from"./index-qSpe-cq9.js";import{n as k}from"./ScreenLayout-D1p_ntex-DSCS_z3W.js";import{c as C}from"./createLucideIcon-dQJDYowT.js";/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],S=C("chevron-down",A),z=async({operation:r,until:a,delay:o,interval:i,attempts:d,signal:c})=>{let u,l=0;for(;l<d;){if(c!=null&&c.aborted)return{status:"aborted",result:u,attempts:l};l++;try{if(u=await r(),a(u))return{status:"success",result:u,attempts:l};l<d&&await x(i)}catch{l<d&&await x(i)}}return{status:"max_attempts",result:u,attempts:l}},D=r=>{try{return r.location.origin}catch{return}},X=async(r,a)=>{let o=await z({operation:async()=>({done:D(r)===window.location.origin,closed:r.closed}),until:({done:i,closed:d})=>i||d,delay:0,interval:500,attempts:360,signal:a});return o.status==="aborted"?(r.close(),{status:"aborted"}):o.status==="max_attempts"?{status:"timeout"}:o.result.done?(r.close(),{status:"redirected"}):{status:"closed"}},Y=({currency:r="usd",value:a,onChange:o,inputMode:i="decimal",autoFocus:d})=>{var v;let[c,u]=f.useState("0"),l=f.useRef(null),m=a??c,g=((v=h[r])==null?void 0:v.symbol)??"$",b=f.useCallback(s=>{let t=s.target.value,p=(t=t.replace(/[^\d.]/g,"")).split(".");p.length>2&&(t=p[0]+"."+p.slice(1).join("")),p.length===2&&p[1].length>2&&(t=`${p[0]}.${p[1].slice(0,2)}`),t.length>1&&t[0]==="0"&&t[1]!=="."&&(t=t.slice(1)),(t===""||t===".")&&(t="0"),o?o(t):u(t)},[o]),j=f.useCallback(s=>{!(["Delete","Backspace","Tab","Escape","Enter",".","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(s.key)||(s.ctrlKey||s.metaKey)&&["a","c","v","x"].includes(s.key.toLowerCase()))&&(s.key>="0"&&s.key<="9"||s.preventDefault())},[]),y=f.useMemo(()=>(m.includes("."),m),[m]);return e.jsxs(L,{onClick:()=>{var s;return(s=l.current)==null?void 0:s.focus()},children:[e.jsx(w,{children:g}),y,e.jsx("input",{ref:l,type:"text",inputMode:i,value:y,onChange:b,onKeyDown:j,autoFocus:d,placeholder:"0",style:{width:1,height:"1rem",opacity:0,alignSelf:"center",fontSize:"1rem"}}),e.jsx(w,{style:{opacity:0},children:g})]})},Z=({selectedAsset:r,onEditSourceAsset:a})=>{let{icon:o}=h[r];return e.jsxs(E,{onClick:a,children:[e.jsx(_,{children:o}),e.jsx(B,{children:r.toLocaleUpperCase()}),e.jsx(K,{children:e.jsx(S,{})})]})};let L=n.span`
  background-color: var(--privy-color-background);
  width: 100%;
  text-align: center;
  border: none;
  font-kerning: none;
  font-feature-settings: 'calt' off;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  cursor: pointer;

  &:focus {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
  }

  && {
    color: var(--privy-color-foreground);
    font-size: 3.75rem;
    font-style: normal;
    font-weight: 600;
    line-height: 5.375rem;
  }
`,w=n.span`
  color: var(--privy-color-foreground);
  font-kerning: none;
  font-feature-settings: 'calt' off;
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.5rem;
  margin-top: 0.75rem;
`,E=n.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: auto;
  gap: 0.5rem;
  border: 1px solid var(--privy-color-border-default);
  border-radius: var(--privy-border-radius-full);

  && {
    margin: auto;
    padding: 0.5rem 1rem;
  }
`,_=n.div`
  svg {
    width: 1rem;
    height: 1rem;
    border-radius: var(--privy-border-radius-full);
    overflow: hidden;
  }
`,B=n.span`
  color: var(--privy-color-foreground);
  font-kerning: none;
  font-feature-settings: 'calt' off;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.375rem;
`,K=n.div`
  color: var(--privy-color-foreground);

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;const G=({opts:r,isLoading:a,onSelectSource:o})=>e.jsx(k,{showClose:!1,showBack:!0,onBack:()=>o(r.source.selectedAsset),title:"Select currency",children:e.jsx(M,{children:r.source.assets.map(i=>{let{icon:d,name:c}=h[i];return e.jsx(R,{onClick:()=>o(i),disabled:a,children:e.jsxs(U,{children:[e.jsx(F,{children:d}),e.jsxs($,{children:[e.jsx(q,{children:c}),e.jsx(H,{children:i.toLocaleUpperCase()})]})]})},i)})})});let M=n.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
`,R=n.button`
  border-color: var(--privy-color-border-default);
  border-width: 1px;
  border-radius: var(--privy-border-radius-mdlg);
  border-style: solid;
  display: flex;

  && {
    padding: 0.75rem 1rem;
  }
`,U=n.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
`,F=n.div`
  svg {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--privy-border-radius-full);
    overflow: hidden;
  }
`,$=n.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
`,q=n.span`
  color: var(--privy-color-foreground);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
`,H=n.span`
  color: var(--privy-color-foreground-3);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
`;export{Y as f,Z as h,G as k,X as p,z as u};
