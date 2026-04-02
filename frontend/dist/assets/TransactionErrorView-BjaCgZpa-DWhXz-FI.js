import{d9 as k,d7 as Ve,d6 as e,d5 as ce,e8 as xe,ds as x,cg as Be}from"./index-kXE220vY.js";import{T as Z,g as He,m as G,u as he,V as We}from"./ModalHeader-BnVmXtvG-C88y9n_j.js";import{t as B,s,e as n,n as i,a as Ue}from"./Value-tcJV9e0L-SzkRlpPU.js";import{e as V}from"./ErrorMessage-D8VaAP5m-BHmqK9vk.js";import{r as O}from"./LabelXs-oqZNqbm_-GflE5AgL.js";import{r as je}from"./Subtitle-CV-2yKE4-C7b2Sdxt.js";import{e as me}from"./Title-BnzYV3Is-CD3O7-NZ.js";import{p as c}from"./Address-N-mzBgMy-BVKS0Loi.js";import{j as Je}from"./WalletInfoCard-CEcdukTg-Cd7ABJyn.js";import{n as ue}from"./LoadingSkeleton-U6-3yFwI-3OOnY_XT.js";import{d as qe}from"./shared-FM0rljBt-C2z4nf7q.js";import{o as Qe,F as Ze}from"./Checkbox-BhNoOKjX-BEhC8ULo.js";import{t as Ge}from"./ErrorBanner-CQERa7bL-D9olXyzr.js";import{t as Ye}from"./WarningBanner-D5LqDt95-LaGT_trU.js";import{F as Ke}from"./ExclamationCircleIcon-Dh7SD-pg.js";import{F as pe}from"./ChevronDownIcon-BYAbRWXd.js";import{i as ne}from"./formatters-DDp4fpmm.js";function Xe({title:a,titleId:l,...o},m){return k.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:m,"aria-labelledby":l},o),a?k.createElement("title",{id:l},a):null,k.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"}))}const _e=k.forwardRef(Xe);function ze({title:a,titleId:l,...o},m){return k.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:m,"aria-labelledby":l},o),a?k.createElement("title",{id:l},a):null,k.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"}))}const ge=k.forwardRef(ze);function $e({title:a,titleId:l,...o},m){return k.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:m,"aria-labelledby":l},o),a?k.createElement("title",{id:l},a):null,k.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"}))}const er=k.forwardRef($e),fe=x(n)`
  cursor: pointer;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  color: var(--privy-color-accent);
  svg {
    fill: var(--privy-color-accent);
  }
`;var ie=({iconUrl:a,value:l,symbol:o,usdValue:m,nftName:F,nftCount:u,decimals:t,$isLoading:y})=>{if(y)return e.jsx(te,{$isLoading:y});let v=l&&m&&t?function(T,I,E){let h=parseFloat(T),p=parseFloat(E);if(h===0||p===0||Number.isNaN(h)||Number.isNaN(p))return T;let f=Math.ceil(-Math.log10(.01/(p/h))),d=Math.pow(10,f=Math.max(f=Math.min(f,I),1)),w=+(Math.floor(h*d)/d).toFixed(f).replace(/\.?0+$/,"");return Intl.NumberFormat(void 0,{maximumFractionDigits:I}).format(w)}(l,t,m):l;return e.jsxs("div",{children:[e.jsxs(te,{$isLoading:y,children:[a&&e.jsx(sr,{src:a,alt:"Token icon"}),u&&u>1?u+"x":void 0," ",F,v," ",o]}),m&&e.jsxs(rr,{$isLoading:y,children:["$",m]})]})};let te=x.span`
  color: var(--privy-color-foreground);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.375rem;
  word-break: break-all;
  text-align: right;
  display: flex;
  justify-content: flex-end;

  ${ue}
`;const rr=x.span`
  color: var(--privy-color-foreground-2);
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  word-break: break-all;
  text-align: right;
  display: flex;
  justify-content: flex-end;

  ${ue}
`;let sr=x.img`
  height: 14px;
  width: 14px;
  margin-right: 4px;
  object-fit: contain;
`;const nr=a=>{var y,v,T,I,E,h,p,f;let{chain:l,transactionDetails:o,isTokenContractInfoLoading:m,symbol:F}=a,{action:u,functionName:t}=o;return e.jsx(qe,{children:e.jsxs(B,{children:[u!=="transaction"&&e.jsxs(s,{children:[e.jsx(n,{children:"Action"}),e.jsx(i,{children:t})]}),t==="mint"&&"args"in o&&o.args.filter(d=>d).map((d,w)=>{var g,M;return e.jsxs(s,{children:[e.jsx(n,{children:`Param ${w}`}),e.jsx(i,{children:typeof d=="string"&&Be(d)?e.jsx(c,{address:d,url:(M=(g=l==null?void 0:l.blockExplorers)==null?void 0:g.default)==null?void 0:M.url,showCopyIcon:!1}):d==null?void 0:d.toString()})]},w)}),t==="setApprovalForAll"&&o.operator&&e.jsxs(s,{children:[e.jsx(n,{children:"Operator"}),e.jsx(i,{children:e.jsx(c,{address:o.operator,url:(v=(y=l==null?void 0:l.blockExplorers)==null?void 0:y.default)==null?void 0:v.url,showCopyIcon:!1})})]}),t==="setApprovalForAll"&&o.approved!==void 0&&e.jsxs(s,{children:[e.jsx(n,{children:"Set approval to"}),e.jsx(i,{children:o.approved?"true":"false"})]}),t==="transfer"||t==="transferWithMemo"||t==="transferFrom"||t==="safeTransferFrom"||t==="approve"?e.jsxs(e.Fragment,{children:["formattedAmount"in o&&o.formattedAmount&&e.jsxs(s,{children:[e.jsx(n,{children:"Amount"}),e.jsxs(i,{$isLoading:m,children:[o.formattedAmount," ",F]})]}),"tokenId"in o&&o.tokenId&&e.jsxs(s,{children:[e.jsx(n,{children:"Token ID"}),e.jsx(i,{children:o.tokenId.toString()})]})]}):null,t==="safeBatchTransferFrom"&&e.jsxs(e.Fragment,{children:["amounts"in o&&o.amounts&&e.jsxs(s,{children:[e.jsx(n,{children:"Amounts"}),e.jsx(i,{children:o.amounts.join(", ")})]}),"tokenIds"in o&&o.tokenIds&&e.jsxs(s,{children:[e.jsx(n,{children:"Token IDs"}),e.jsx(i,{children:o.tokenIds.join(", ")})]})]}),t==="approve"&&o.spender&&e.jsxs(s,{children:[e.jsx(n,{children:"Spender"}),e.jsx(i,{children:e.jsx(c,{address:o.spender,url:(I=(T=l==null?void 0:l.blockExplorers)==null?void 0:T.default)==null?void 0:I.url,showCopyIcon:!1})})]}),(t==="transferFrom"||t==="safeTransferFrom"||t==="safeBatchTransferFrom")&&o.transferFrom&&e.jsxs(s,{children:[e.jsx(n,{children:"Transferring from"}),e.jsx(i,{children:e.jsx(c,{address:o.transferFrom,url:(h=(E=l==null?void 0:l.blockExplorers)==null?void 0:E.default)==null?void 0:h.url,showCopyIcon:!1})})]}),(t==="transferFrom"||t==="safeTransferFrom"||t==="safeBatchTransferFrom")&&o.transferTo&&e.jsxs(s,{children:[e.jsx(n,{children:"Transferring to"}),e.jsx(i,{children:e.jsx(c,{address:o.transferTo,url:(f=(p=l==null?void 0:l.blockExplorers)==null?void 0:p.default)==null?void 0:f.url,showCopyIcon:!1})})]})]})})},ir=({variant:a,setPreventMaliciousTransaction:l,colorScheme:o="light",preventMaliciousTransaction:m})=>a==="warn"?e.jsx(oe,{children:e.jsxs(Ye,{theme:o,children:[e.jsx("span",{style:{fontWeight:"500"},children:"Warning: Suspicious transaction"}),e.jsx("br",{}),"This has been flagged as a potentially deceptive request. Approving could put your assets or funds at risk."]})}):a==="error"?e.jsx(e.Fragment,{children:e.jsxs(oe,{children:[e.jsx(Ge,{theme:o,children:e.jsxs("div",{children:[e.jsx("strong",{children:"This is a malicious transaction"}),e.jsx("br",{}),"This transaction transfers tokens to a known malicious address. Proceeding may result in the loss of valuable assets."]})}),e.jsxs(tr,{children:[e.jsx(Qe,{color:"var(--privy-color-error)",checked:!m,readOnly:!0,onClick:()=>l(!m)}),e.jsx("span",{children:"I understand and want to proceed anyways."})]})]})}):null;let oe=x.div`
  margin-top: 1.5rem;
`,tr=x.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;const or=({transactionIndex:a,maxIndex:l})=>typeof a!="number"||l===0?"":` (${a+1} / ${l+1})`,Rr=({img:a,submitError:l,prepareError:o,onClose:m,action:F,title:u,subtitle:t,to:y,tokenAddress:v,network:T,missingFunds:I,fee:E,from:h,cta:p,disabled:f,chain:d,isSubmitting:w,isPreparing:g,isTokenPriceLoading:M,isTokenContractInfoLoading:N,isSponsored:C,symbol:H,balance:R,onClick:D,transactionDetails:A,transactionIndex:P,maxIndex:W,onBack:r,chainName:b,validation:U,hasScanDetails:Y,setIsScanDetailsOpen:Te,preventMaliciousTransaction:Ie,setPreventMaliciousTransaction:Ae,tokensSent:K,tokensReceived:J,isScanning:Se,isCancellable:Fe,functionName:Ee})=>{var X,_,z,$,ee,re;let{showTransactionDetails:q,setShowTransactionDetails:Me,hasMoreDetails:Oe,isErc20Ish:De}=(j=>{let[L,Ce]=k.useState(!1),Q=!0,se=!1;return(!j||j.isErc20Ish||j.action==="transaction")&&(Q=!1),Q&&(se=Object.entries(j||{}).some(([Re,Pe])=>Pe&&!["action","isErc20Ish","isNFTIsh"].includes(Re))),{showTransactionDetails:L,setShowTransactionDetails:Ce,hasMoreDetails:Q&&se,isErc20Ish:j==null?void 0:j.isErc20Ish}})(A),Ne=ce(),Le=De&&N||g||M||Se;return e.jsxs(e.Fragment,{children:[e.jsx(Z,{onClose:m,backFn:r}),a&&e.jsx(ve,{children:a}),e.jsxs(me,{style:{marginTop:a?"1.5rem":0},children:[u,e.jsx(or,{maxIndex:W,transactionIndex:P})]}),e.jsx(je,{children:t}),e.jsxs(B,{style:{marginTop:"2rem"},children:[(!!K[0]||Le)&&e.jsxs(s,{children:[J.length>0?e.jsx(n,{children:"Send"}):e.jsx(n,{children:F==="approve"?"Approval amount":"Amount"}),e.jsx("div",{className:"flex flex-col",children:K.map((j,L)=>e.jsx(ie,{iconUrl:j.iconUrl,value:Ee==="setApprovalForAll"?"All":j.value,usdValue:j.usdValue,symbol:j.symbol,nftName:j.nftName,nftCount:j.nftCount,decimals:j.decimals},L))})]}),J.length>0&&e.jsxs(s,{children:[e.jsx(n,{children:"Receive"}),e.jsx("div",{className:"flex flex-col",children:J.map((j,L)=>e.jsx(ie,{iconUrl:j.iconUrl,value:j.value,usdValue:j.usdValue,symbol:j.symbol,nftName:j.nftName,nftCount:j.nftCount,decimals:j.decimals},L))})]}),A&&"spender"in A&&(A!=null&&A.spender)?e.jsxs(s,{children:[e.jsx(n,{children:"Spender"}),e.jsx(i,{children:e.jsx(c,{address:A.spender,url:(_=(X=d==null?void 0:d.blockExplorers)==null?void 0:X.default)==null?void 0:_.url})})]}):null,y&&e.jsxs(s,{children:[e.jsx(n,{children:"To"}),e.jsx(i,{children:e.jsx(c,{address:y,url:($=(z=d==null?void 0:d.blockExplorers)==null?void 0:z.default)==null?void 0:$.url,showCopyIcon:!0})})]}),v&&e.jsxs(s,{children:[e.jsx(n,{children:"Token address"}),e.jsx(i,{children:e.jsx(c,{address:v,url:(re=(ee=d==null?void 0:d.blockExplorers)==null?void 0:ee.default)==null?void 0:re.url})})]}),e.jsxs(s,{children:[e.jsx(n,{children:"Network"}),e.jsx(i,{children:T})]}),e.jsxs(s,{children:[e.jsx(n,{children:"Estimated fee"}),e.jsx(i,{$isLoading:g||M||C===void 0,children:C?e.jsxs(we,{children:[e.jsxs(be,{children:["Sponsored by ",Ne.name]}),e.jsx(ge,{height:16,width:16})]}):E})]}),Oe&&!Y&&e.jsxs(e.Fragment,{children:[e.jsx(s,{className:"cursor-pointer",onClick:()=>Me(!q),children:e.jsxs(Ue,{className:"flex items-center gap-x-1",children:["Details"," ",e.jsx(pe,{style:{width:"0.75rem",marginLeft:"0.25rem",transform:q?"rotate(180deg)":void 0}})]})}),q&&A&&e.jsx(nr,{action:F,chain:d,transactionDetails:A,isTokenContractInfoLoading:N,symbol:H})]}),Y&&e.jsx(s,{children:e.jsxs(fe,{onClick:()=>Te(!0),children:[e.jsx("span",{className:"text-color-primary",children:"Details"}),e.jsx(_e,{height:"14px",width:"14px",strokeWidth:"2"})]})})]}),e.jsx(xe,{}),l?e.jsx(V,{style:{marginTop:"2rem"},children:l.message}):o&&P===0?e.jsx(V,{style:{marginTop:"2rem"},children:o.shortMessage??ye}):null,e.jsx(ir,{variant:U,preventMaliciousTransaction:Ie,setPreventMaliciousTransaction:Ae}),e.jsx(ke,{$useSmallMargins:!(!o&&!l&&U!=="warn"&&U!=="error"),address:h,balance:R,errMsg:g||o||l||!I?void 0:`Add funds on ${(d==null?void 0:d.name)??b} to complete transaction.`}),e.jsx(G,{style:{marginTop:"1rem"},loading:w,disabled:f||g,onClick:D,children:p}),Fe&&e.jsx(We,{style:{marginTop:"1rem"},onClick:m,isSubmitting:!1,children:"Not now"}),e.jsx(he,{})]})},Pr=({img:a,title:l,subtitle:o,cta:m,instructions:F,network:u,blockExplorerUrl:t,isMissingFunds:y,submitError:v,parseError:T,total:I,swap:E,transactingWalletAddress:h,fee:p,balance:f,disabled:d,isSubmitting:w,isPreparing:g,isTokenPriceLoading:M,onClick:N,onClose:C,onBack:H,isSponsored:R})=>{let D=g||M,[A,P]=k.useState(!1),W=ce();return e.jsxs(e.Fragment,{children:[e.jsx(Z,{onClose:C,backFn:H}),a&&e.jsx(ve,{children:a}),e.jsx(me,{style:{marginTop:a?"1.5rem":0},children:l}),e.jsx(je,{children:o}),e.jsxs(B,{style:{marginTop:"2rem",marginBottom:".5rem"},children:[(I||D)&&e.jsxs(s,{children:[e.jsx(n,{children:"Amount"}),e.jsx(i,{$isLoading:D,children:I})]}),E&&e.jsxs(s,{children:[e.jsx(n,{children:"Swap"}),e.jsx(i,{children:E})]}),u&&e.jsxs(s,{children:[e.jsx(n,{children:"Network"}),e.jsx(i,{children:u})]}),(p||D||R!==void 0)&&e.jsxs(s,{children:[e.jsx(n,{children:"Estimated fee"}),e.jsx(i,{$isLoading:D,children:R&&!D?e.jsxs(we,{children:[e.jsxs(be,{children:["Sponsored by ",W.name]}),e.jsx(ge,{height:16,width:16})]}):p})]})]}),e.jsx(s,{children:e.jsxs(fe,{onClick:()=>P(r=>!r),children:[e.jsx("span",{children:"Advanced"}),e.jsx(pe,{height:"16px",width:"16px",strokeWidth:"2",style:{transition:"all 300ms",transform:A?"rotate(180deg)":void 0}})]})}),A&&e.jsx(e.Fragment,{children:F.map((r,b)=>r.type==="sol-transfer"?e.jsxs(S,{children:[e.jsx(s,{children:e.jsxs(O,{children:["Transfer ",r.withSeed?"with seed":""]})}),e.jsxs(s,{children:[e.jsx(n,{children:"Amount"}),e.jsxs(i,{children:[ne({amount:r.value,decimals:r.token.decimals})," ",r.token.symbol]})]}),!!r.toAccount&&e.jsxs(s,{children:[e.jsx(n,{children:"Destination"}),e.jsx(i,{children:e.jsx(c,{address:r.toAccount,url:t})})]})]},b):r.type==="spl-transfer"?e.jsxs(S,{children:[e.jsx(s,{children:e.jsxs(O,{children:["Transfer ",r.token.symbol]})}),e.jsxs(s,{children:[e.jsx(n,{children:"Amount"}),e.jsx(i,{children:r.value.toString()})]}),!!r.fromAta&&e.jsxs(s,{children:[e.jsx(n,{children:"Source"}),e.jsx(i,{children:e.jsx(c,{address:r.fromAta,url:t})})]}),!!r.toAta&&e.jsxs(s,{children:[e.jsx(n,{children:"Destination"}),e.jsx(i,{children:e.jsx(c,{address:r.toAta,url:t})})]}),!!r.token.address&&e.jsxs(s,{children:[e.jsx(n,{children:"Token"}),e.jsx(i,{children:e.jsx(c,{address:r.token.address,url:t})})]})]},b):r.type==="ata-creation"?e.jsxs(S,{children:[e.jsx(s,{children:e.jsx(O,{children:"Create token account"})}),e.jsxs(s,{children:[e.jsx(n,{children:"Program ID"}),e.jsx(i,{children:e.jsx(c,{address:r.program,url:t})})]}),!!r.owner&&e.jsxs(s,{children:[e.jsx(n,{children:"Owner"}),e.jsx(i,{children:e.jsx(c,{address:r.owner,url:t})})]})]},b):r.type==="create-account"?e.jsxs(S,{children:[e.jsx(s,{children:e.jsxs(O,{children:["Create account ",r.withSeed?"with seed":""]})}),!!r.account&&e.jsxs(s,{children:[e.jsx(n,{children:"Account"}),e.jsx(i,{children:e.jsx(c,{address:r.account,url:t})})]}),e.jsxs(s,{children:[e.jsx(n,{children:"Amount"}),e.jsxs(i,{children:[ne({amount:r.value,decimals:9})," SOL"]})]})]},b):r.type==="spl-init-account"?e.jsxs(S,{children:[e.jsx(s,{children:e.jsx(O,{children:"Initialize token account"})}),!!r.account&&e.jsxs(s,{children:[e.jsx(n,{children:"Account"}),e.jsx(i,{children:e.jsx(c,{address:r.account,url:t})})]}),!!r.mint&&e.jsxs(s,{children:[e.jsx(n,{children:"Mint"}),e.jsx(i,{children:e.jsx(c,{address:r.mint,url:t})})]}),!!r.owner&&e.jsxs(s,{children:[e.jsx(n,{children:"Owner"}),e.jsx(i,{children:e.jsx(c,{address:r.owner,url:t})})]})]},b):r.type==="spl-close-account"?e.jsxs(S,{children:[e.jsx(s,{children:e.jsx(O,{children:"Close token account"})}),!!r.source&&e.jsxs(s,{children:[e.jsx(n,{children:"Source"}),e.jsx(i,{children:e.jsx(c,{address:r.source,url:t})})]}),!!r.destination&&e.jsxs(s,{children:[e.jsx(n,{children:"Destination"}),e.jsx(i,{children:e.jsx(c,{address:r.destination,url:t})})]}),!!r.owner&&e.jsxs(s,{children:[e.jsx(n,{children:"Owner"}),e.jsx(i,{children:e.jsx(c,{address:r.owner,url:t})})]})]},b):r.type==="spl-sync-native"?e.jsxs(S,{children:[e.jsx(s,{children:e.jsx(O,{children:"Sync native"})}),e.jsxs(s,{children:[e.jsx(n,{children:"Program ID"}),e.jsx(i,{children:e.jsx(c,{address:r.program,url:t})})]})]},b):r.type==="raydium-swap-base-input"?e.jsxs(S,{children:[e.jsx(s,{children:e.jsxs(O,{children:["Raydium swap"," ",r.tokenIn&&r.tokenOut?`${r.tokenIn.symbol} → ${r.tokenOut.symbol}`:""]})}),e.jsxs(s,{children:[e.jsx(n,{children:"Amount in"}),e.jsx(i,{children:r.amountIn.toString()})]}),e.jsxs(s,{children:[e.jsx(n,{children:"Minimum amount out"}),e.jsx(i,{children:r.minimumAmountOut.toString()})]}),r.mintIn&&e.jsxs(s,{children:[e.jsx(n,{children:"Token in"}),e.jsx(i,{children:e.jsx(c,{address:r.mintIn,url:t})})]}),r.mintOut&&e.jsxs(s,{children:[e.jsx(n,{children:"Token out"}),e.jsx(i,{children:e.jsx(c,{address:r.mintOut,url:t})})]})]},b):r.type==="raydium-swap-base-output"?e.jsxs(S,{children:[e.jsx(s,{children:e.jsxs(O,{children:["Raydium swap"," ",r.tokenIn&&r.tokenOut?`${r.tokenIn.symbol} → ${r.tokenOut.symbol}`:""]})}),e.jsxs(s,{children:[e.jsx(n,{children:"Max amount in"}),e.jsx(i,{children:r.maxAmountIn.toString()})]}),e.jsxs(s,{children:[e.jsx(n,{children:"Amount out"}),e.jsx(i,{children:r.amountOut.toString()})]}),r.mintIn&&e.jsxs(s,{children:[e.jsx(n,{children:"Token in"}),e.jsx(i,{children:e.jsx(c,{address:r.mintIn,url:t})})]}),r.mintOut&&e.jsxs(s,{children:[e.jsx(n,{children:"Token out"}),e.jsx(i,{children:e.jsx(c,{address:r.mintOut,url:t})})]})]},b):r.type==="jupiter-swap-shared-accounts-route"?e.jsxs(S,{children:[e.jsx(s,{children:e.jsxs(O,{children:["Jupiter swap"," ",r.tokenIn&&r.tokenOut?`${r.tokenIn.symbol} → ${r.tokenOut.symbol}`:""]})}),e.jsxs(s,{children:[e.jsx(n,{children:"In amount"}),e.jsx(i,{children:r.inAmount.toString()})]}),e.jsxs(s,{children:[e.jsx(n,{children:"Quoted out amount"}),e.jsx(i,{children:r.quotedOutAmount.toString()})]}),r.mintIn&&e.jsxs(s,{children:[e.jsx(n,{children:"Token in"}),e.jsx(i,{children:e.jsx(c,{address:r.mintIn,url:t})})]}),r.mintOut&&e.jsxs(s,{children:[e.jsx(n,{children:"Token out"}),e.jsx(i,{children:e.jsx(c,{address:r.mintOut,url:t})})]})]},b):r.type==="jupiter-swap-exact-out-route"?e.jsxs(S,{children:[e.jsx(s,{children:e.jsxs(O,{children:["Jupiter swap"," ",r.tokenIn&&r.tokenOut?`${r.tokenIn.symbol} → ${r.tokenOut.symbol}`:""]})}),e.jsxs(s,{children:[e.jsx(n,{children:"Quoted in amount"}),e.jsx(i,{children:r.quotedInAmount.toString()})]}),e.jsxs(s,{children:[e.jsx(n,{children:"Amount out"}),e.jsx(i,{children:r.outAmount.toString()})]}),r.mintIn&&e.jsxs(s,{children:[e.jsx(n,{children:"Token in"}),e.jsx(i,{children:e.jsx(c,{address:r.mintIn,url:t})})]}),r.mintOut&&e.jsxs(s,{children:[e.jsx(n,{children:"Token out"}),e.jsx(i,{children:e.jsx(c,{address:r.mintOut,url:t})})]})]},b):e.jsxs(S,{children:[e.jsxs(s,{children:[e.jsx(n,{children:"Program ID"}),e.jsx(i,{children:e.jsx(c,{address:r.program,url:t})})]}),e.jsxs(s,{children:[e.jsx(n,{children:"Data"}),e.jsx(i,{children:r.discriminator})]})]},b))}),e.jsx(xe,{}),v?e.jsx(V,{style:{marginTop:"2rem"},children:v.message}):T?e.jsx(V,{style:{marginTop:"2rem"},children:ye}):null,e.jsx(ke,{$useSmallMargins:!(!T&&!v),title:"",address:h,balance:f,errMsg:g||T||v||!y?void 0:"Add funds on Solana to complete transaction."}),e.jsx(G,{style:{marginTop:"1rem"},loading:w,disabled:d||g,onClick:N,children:m}),e.jsx(he,{})]})};let ke=x(Je)`
  ${a=>a.$useSmallMargins?"margin-top: 0.5rem;":"margin-top: 2rem;"}
`,S=x(B)`
  margin-top: 0.5rem;
  border: 1px solid var(--privy-color-foreground-4);
  border-radius: var(--privy-border-radius-sm);
  padding: 0.5rem;
`,ye="There was an error preparing your transaction. Your transaction request will likely fail.",ve=x.div`
  display: flex;
  width: 100%;
  justify-content: center;
  max-height: 40px;

  > img {
    object-fit: contain;
    border-radius: var(--privy-border-radius-sm);
  }
`,we=x.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
`,be=x.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--privy-color-foreground);
`,lr=()=>e.jsxs(xr,{children:[e.jsx(jr,{}),e.jsx(hr,{})]});const Vr=({transactionError:a,chainId:l,onClose:o,onRetry:m,chainType:F,transactionHash:u})=>{let{chains:t}=Ve(),[y,v]=k.useState(!1),{errorCode:T,errorMessage:I}=((h,p)=>{if(p==="ethereum")return{errorCode:h.details??h.message,errorMessage:h.shortMessage};let f=h.txSignature,d=(h==null?void 0:h.transactionMessage)||"Something went wrong.";if(Array.isArray(h.logs)){let w=h.logs.find(g=>/insufficient (lamports|funds)/gi.test(g));w&&(d=w)}return{transactionHash:f,errorMessage:d}})(a,F),E=(({chains:h,chainId:p,chainType:f,transactionHash:d})=>{var w,g;return f==="ethereum"?((g=(w=h.find(M=>M.id===p))==null?void 0:w.blockExplorers)==null?void 0:g.default.url)??"https://etherscan.io":function(M,N){return`https://explorer.solana.com/tx/${M}?chain=${N}`}(d||"",p)})({chains:t,chainId:l,chainType:F,transactionHash:u});return e.jsxs(e.Fragment,{children:[e.jsx(Z,{onClose:o}),e.jsxs(ar,{children:[e.jsx(lr,{}),e.jsx(dr,{children:T}),e.jsx(cr,{children:"Please try again."}),e.jsxs(ae,{children:[e.jsx(le,{children:"Error message"}),e.jsx(de,{$clickable:!1,children:I})]}),u&&e.jsxs(ae,{children:[e.jsx(le,{children:"Transaction hash"}),e.jsxs(ur,{children:["Copy this hash to view details about the transaction on a"," ",e.jsx("u",{children:e.jsx("a",{href:E,children:"block explorer"})}),"."]}),e.jsxs(de,{$clickable:!0,onClick:async()=>{await navigator.clipboard.writeText(u),v(!0)},children:[u,e.jsx(fr,{clicked:y})]})]}),e.jsx(mr,{onClick:()=>m({resetNonce:!!u}),children:"Retry transaction"})]}),e.jsx(He,{})]})};let ar=x.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`,dr=x.span`
  color: var(--privy-color-foreground);
  text-align: center;
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.25rem; /* 111.111% */
  text-align: center;
  margin: 10px;
`,cr=x.span`
  margin-top: 4px;
  margin-bottom: 10px;
  color: var(--privy-color-foreground-3);
  text-align: center;

  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.008px;
`,xr=x.div`
  position: relative;
  width: 60px;
  height: 60px;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`,hr=x(Ke)`
  position: absolute;
  width: 35px;
  height: 35px;
  color: var(--privy-color-error);
`,jr=x.div`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--privy-color-error);
  opacity: 0.1;
`,mr=x(G)`
  && {
    margin-top: 24px;
  }
  transition:
    color 350ms ease,
    background-color 350ms ease;
`,le=x.span`
  width: 100%;
  text-align: left;
  font-size: 0.825rem;
  color: var(--privy-color-foreground);
  padding: 4px;
`,ae=x.div`
  width: 100%;
  margin: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`,ur=x.text`
  position: relative;
  width: 100%;
  padding: 5px;
  font-size: 0.8rem;
  color: var(--privy-color-foreground-3);
  text-align: left;
  word-wrap: break-word;
`,de=x.span`
  position: relative;
  width: 100%;
  background-color: var(--privy-color-background-2);
  padding: 8px 12px;
  border-radius: 10px;
  margin-top: 5px;
  font-size: 14px;
  color: var(--privy-color-foreground-3);
  text-align: left;
  word-wrap: break-word;
  ${a=>a.$clickable&&`cursor: pointer;
  transition: background-color 0.3s;
  padding-right: 45px;

  &:hover {
    background-color: var(--privy-color-foreground-4);
  }`}
`,pr=x(er)`
  position: absolute;
  top: 13px;
  right: 13px;
  width: 24px;
  height: 24px;
`,gr=x(Ze)`
  position: absolute;
  top: 13px;
  right: 13px;
  width: 24px;
  height: 24px;
`,fr=({clicked:a})=>e.jsx(a?gr:pr,{});export{Pr as G,Rr as Q,Vr as n};
