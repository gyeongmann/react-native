import*as e from"../../../core/platform/platform.js";import*as t from"../types/types.js";import*as n from"../helpers/helpers.js";const r=new Map;let a="",i="",s=t.TraceEvents.ProcessID(-1),o=t.TraceEvents.ThreadID(-1),c=t.TraceEvents.ProcessID(-1),d=t.TraceEvents.ThreadID(-1),l=null;const u=new Set,m={min:t.Timing.MicroSeconds(Number.POSITIVE_INFINITY),max:t.Timing.MicroSeconds(Number.NEGATIVE_INFINITY),range:t.Timing.MicroSeconds(Number.POSITIVE_INFINITY)},g=new Map,f=new Map,T=new Map;let p=t.Timing.MicroSeconds(-1);const v=new Set(["B","E","X","I"]);let h=1;function E(n,a){const i=e.MapUtilities.getWithDefault(r,a.frame,(()=>new Map)),s=e.MapUtilities.getWithDefault(i,a.processId,(()=>({frame:a,window:{min:t.Timing.MicroSeconds(0),max:t.Timing.MicroSeconds(0),range:t.Timing.MicroSeconds(0)}})));s.window.min===t.Timing.MicroSeconds(0)&&(s.window.min=n.ts)}function w(){if(3!==h)throw new Error("Meta Handler is not finalized");return{traceBounds:{...m},browserProcessId:s,browserThreadId:o,gpuProcessId:c,gpuThreadId:d===t.TraceEvents.ThreadID(-1)?void 0:d,viewportRect:l||void 0,mainFrameId:a,mainFrameURL:i,navigationsByFrameId:new Map(g),navigationsByNavigationId:new Map(f),threadsInProcess:new Map(T),rendererProcessesByFrame:new Map(r),topLevelRendererIds:new Set(u)}}var M=Object.freeze({__proto__:null,reset:function(){g.clear(),f.clear(),s=t.TraceEvents.ProcessID(-1),o=t.TraceEvents.ThreadID(-1),c=t.TraceEvents.ProcessID(-1),d=t.TraceEvents.ThreadID(-1),l=null,u.clear(),T.clear(),r.clear(),m.min=t.Timing.MicroSeconds(Number.POSITIVE_INFINITY),m.max=t.Timing.MicroSeconds(Number.NEGATIVE_INFINITY),m.range=t.Timing.MicroSeconds(Number.POSITIVE_INFINITY),p=t.Timing.MicroSeconds(-1),h=1},initialize:function(){if(1!==h)throw new Error("Meta Handler was not reset");h=2},handleEvent:function(n){if(2!==h)throw new Error("Meta Handler is not initialized");if(0!==n.ts&&!n.name.endsWith("::UMA")&&v.has(n.ph)){m.min=t.Timing.MicroSeconds(Math.min(n.ts,m.min));const e=n.dur||t.Timing.MicroSeconds(0);m.max=t.Timing.MicroSeconds(Math.max(n.ts+e,m.max))}if(!t.TraceEvents.isProcessName(n)||"Browser"!==n.args.name&&"HeadlessBrowser"!==n.args.name)if(!t.TraceEvents.isProcessName(n)||"Gpu"!==n.args.name&&"GPU Process"!==n.args.name)if(t.TraceEvents.isThreadName(n)&&"CrGpuMain"===n.args.name)d=n.tid;else{if(t.TraceEvents.isThreadName(n)&&"CrBrowserMain"===n.args.name&&(o=n.tid),t.TraceEvents.isTraceEventMainFrameViewport(n)&&null===l){const e=n.args.data.viewport_rect,t=e[0],r=e[1],a=e[2],i=e[5];l=new DOMRect(t,r,a,i)}if(t.TraceEvents.isTraceEventTracingStartedInBrowser(n)){if(p=n.ts,!n.args.data)throw new Error("No frames found in trace data");for(const e of n.args.data.frames??[])E(n,e),e.parent||(a=e.frame,i=e.url,u.add(e.processId))}else if(t.TraceEvents.isTraceEventFrameCommittedInBrowser(n)){const e=n.args.data;if(!e)return;if(E(n,e),e.parent)return;u.add(e.processId)}else if(t.TraceEvents.isTraceEventCommitLoad(n)){const e=n.args.data;if(!e)return;const{frame:t,name:r,url:a}=e;E(n,{processId:n.pid,frame:t,name:r,url:a})}else if(t.TraceEvents.isThreadName(n)){e.MapUtilities.getWithDefault(T,n.pid,(()=>new Map)).set(n.tid,n)}else if(t.TraceEvents.isTraceEventNavigationStartWithURL(n)&&n.args.data){const e=n.args.data.navigationId;if(f.has(e))throw new Error("Found multiple navigation start events with the same navigation ID.");f.set(e,n);const t=n.args.frame,r=g.get(t)||[];return r.push(n),void g.set(t,r)}}else c=n.pid;else s=n.pid},finalize:async function(){if(2!==h)throw new Error("Handler is not initialized");m.min=p,m.range=t.Timing.MicroSeconds(m.max-m.min);for(const[,e]of r){const n=[...e.values()];for(let e=0;e<n.length;e++){const r=n[e],a=n[e+1];a?(r.window.max=t.Timing.MicroSeconds(a.window.min-1),r.window.range=t.Timing.MicroSeconds(r.window.max-r.window.min)):(r.window.max=t.Timing.MicroSeconds(m.max),r.window.range=t.Timing.MicroSeconds(m.max-r.window.min))}}for(const[e,t]of g)if(!r.has(e)){g.delete(e);for(const e of t)e.args.data&&f.delete(e.args.data.navigationId)}h=3},data:w});let S=1;const y=new Map;let I=[];var b=Object.freeze({__proto__:null,reset:function(){y.clear(),I=[],S=1},initialize:function(){if(1!==S)throw new Error("GPU Handler was not reset before being initialized");S=2},handleEvent:function(e){if(2!==S)throw new Error("GPU Handler is not initialized");t.TraceEvents.isTraceEventGPUTask(e)&&n.Trace.addEventToProcessThread(e,y)},finalize:async function(){if(2!==S)throw new Error("GPU Handler is not initialized");const{gpuProcessId:e,gpuThreadId:t}=w(),n=y.get(e);n&&t&&(I=n.get(t)||[]),S=3},data:function(){if(3!==S)throw new Error("GPU Handler is not finalized");return{mainGPUThreadTasks:[...I]}},deps:function(){return["Meta"]}});const C=new Map;let P=[];function R(){return[...P]}var D=Object.freeze({__proto__:null,reset:function(){C.clear(),P.length=0},handleEvent:function(e){"O"===e.ph&&"Screenshot"===e.name&&n.Trace.addEventToProcessThread(e,C)},finalize:async function(){const{browserProcessId:e,browserThreadId:t}=w(),n=C.get(e);n&&(P=n.get(t)||[])},data:R,deps:function(){return["Meta"]}});const k=n.Timing.millisecondsToMicroseconds(t.Timing.MilliSeconds(5e3)),F=n.Timing.millisecondsToMicroseconds(t.Timing.MilliSeconds(1e3)),_=[],L=[],W=[],N=[];let x=0,z=-1;const U=[],O=[];let q=1;function H(e){return{min:e,max:e,range:t.Timing.MicroSeconds(0)}}function A(e,n){e.max=n,e.range=t.Timing.MicroSeconds(e.max-e.min)}function B(e){const t=R(),n=J(t,e);if(n)return`data:img/png;base64,${t[n].args.snapshot}`}function J(t,n){return e.ArrayUtilities.nearestIndexFromBeginning(t,(e=>e.ts>n))}var G=Object.freeze({__proto__:null,MAX_CLUSTER_DURATION:k,MAX_SHIFT_TIME_DELTA:F,initialize:function(){if(1!==q)throw new Error("LayoutShifts Handler was not reset");q=2},reset:function(){q=1,_.length=0,L.length=0,N.length=0,U.length=0,x=0,O.length=0,z=-1},handleEvent:function(e){if(2!==q)throw new Error("Handler is not initialized");!t.TraceEvents.isTraceEventLayoutShift(e)||e.args.data?.had_recent_input?t.TraceEvents.isTraceEventLayoutInvalidation(e)?L.push(e):(t.TraceEvents.isTraceEventStyleRecalcInvalidation(e)&&W.push(e),t.TraceEvents.isTraceEventPrePaint(e)&&N.push(e)):_.push(e)},findNextScreenshotEventIndex:J,finalize:async function(){_.sort(((e,t)=>e.ts-t.ts)),N.sort(((e,t)=>e.ts-t.ts)),L.sort(((e,t)=>e.ts-t.ts)),await async function(){const{navigationsByFrameId:n,mainFrameId:r,traceBounds:a}=w(),i=n.get(r)||[];if(0===_.length)return;let s=_[0].ts,o=_[0].ts,c=null;for(const n of _){const r=n.ts-s>k,a=n.ts-o>F,d=e.ArrayUtilities.nearestIndexFromEnd(i,(e=>e.ts<n.ts)),l=c!==d&&null!==d;if(r||a||l||!U.length){const e=n.ts,c=r?s+k:1/0,u=a?o+F:1/0,m=l?i[d].ts:1/0,g=Math.min(c,u,m);if(U.length>0){A(U[U.length-1].clusterWindow,t.Timing.MicroSeconds(g))}U.push({events:[],clusterWindow:H(e),clusterCumulativeScore:0,scoreWindows:{good:H(e),needsImprovement:null,bad:null}}),s=e}const u=U[U.length-1],m=null!==d?t.Timing.MicroSeconds(n.ts-i[d].ts):void 0;if(u.clusterCumulativeScore+=n.args.data?n.args.data.weighted_score_delta:0,!n.args.data)continue;const g={...n,args:{frame:n.args.frame,data:{...n.args.data,rawEvent:n}},parsedData:{screenshotSource:B(n.ts),timeFromNavigation:m,cumulativeWeightedScoreInWindow:u.clusterCumulativeScore,sessionWindowData:{cumulativeWindowScore:0,id:U.length}}};u.events.push(g),A(u.clusterWindow,n.ts),o=n.ts,c=d}for(const n of U){let r=0,s=-1;if(n===U[U.length-1]){const r=k+n.clusterWindow.min,s=n.clusterWindow.max+F,o=e.ArrayUtilities.nearestIndexFromBeginning(i,(e=>e.ts>n.clusterWindow.max)),c=o?i[o].ts:1/0,d=Math.min(r,s,a.max,c);A(n.clusterWindow,t.Timing.MicroSeconds(d))}for(const e of n.events){r+=e.args.data?e.args.data.weighted_score_delta:0,s=e.parsedData.sessionWindowData.id;const a=e.ts;e.parsedData.sessionWindowData.cumulativeWindowScore=n.clusterCumulativeScore,r<.1?A(n.scoreWindows.good,a):r>=.1&&r<.25?(n.scoreWindows.needsImprovement||(A(n.scoreWindows.good,t.Timing.MicroSeconds(a-1)),n.scoreWindows.needsImprovement=H(a)),A(n.scoreWindows.needsImprovement,a)):r>=.25&&(n.scoreWindows.bad||(n.scoreWindows.needsImprovement?A(n.scoreWindows.needsImprovement,t.Timing.MicroSeconds(a-1)):A(n.scoreWindows.good,t.Timing.MicroSeconds(a-1)),n.scoreWindows.bad=H(e.ts)),A(n.scoreWindows.bad,a)),n.scoreWindows.bad?A(n.scoreWindows.bad,n.clusterWindow.max):n.scoreWindows.needsImprovement?A(n.scoreWindows.needsImprovement,n.clusterWindow.max):A(n.scoreWindows.good,n.clusterWindow.max)}r>x&&(z=s,x=r)}}(),function(){const{traceBounds:e}=w();O.push({ts:e.min,score:0});for(const e of U){let t=0;e.events[0].args.data&&O.push({ts:e.clusterWindow.min,score:e.events[0].args.data.weighted_score_delta});for(let n=0;n<e.events.length;n++){const r=e.events[n];r.args.data&&(t+=r.args.data.weighted_score_delta,O.push({ts:r.ts,score:t}))}O.push({ts:e.clusterWindow.max,score:0})}}(),q=3},data:function(){if(3!==q)throw new Error("Layout Shifts Handler is not finalized");return{clusters:[...U],sessionMaxScore:x,clsWindowID:z,prePaintEvents:[...N],layoutInvalidationEvents:[...L],styleRecalcInvalidationEvents:[],scoreRecords:[...O]}},deps:function(){return["Screenshots","Meta"]},stateForLayoutShiftScore:function(e){let t="good";return e>=.1&&(t="ok"),e>=.25&&(t="bad"),t}});const V=new Map,j=new Map,Y=[];function $(e,t,n){V.has(e)||V.set(e,{});const r=V.get(e);if(!r)throw new Error(`Unable to locate trace events for request ID ${e}`);if(Array.isArray(r[t])){const e=n;r[t].push(...e)}else r[t]=n}function X(e){for(const t of e)if(t>0)return t;return 0}let K=1;var Q=Object.freeze({__proto__:null,reset:function(){j.clear(),V.clear(),Y.length=0,K=1},initialize:function(){K=2},handleEvent:function(e){if(2!==K)throw new Error("Network Request handler is not initialized");t.TraceEvents.isTraceEventResourceWillSendRequest(e)?$(e.args.data.requestId,"willSendRequests",[e]):t.TraceEvents.isTraceEventResourceSendRequest(e)?$(e.args.data.requestId,"sendRequests",[e]):t.TraceEvents.isTraceEventResourceReceiveResponse(e)?$(e.args.data.requestId,"receiveResponse",e):t.TraceEvents.isTraceEventResourceReceivedData(e)?$(e.args.data.requestId,"receivedData",[e]):t.TraceEvents.isTraceEventResourceFinish(e)&&$(e.args.data.requestId,"resourceFinish",e)},finalize:async function(){if(2!==K)throw new Error("Network Request handler is not initialized");const{rendererProcessesByFrame:n}=w();for(const[r,a]of V.entries()){if(!a.sendRequests||!a.receiveResponse)continue;const i=[];for(let e=0;e<a.sendRequests.length-1;e++){const n=a.sendRequests[e],r=a.sendRequests[e+1];let s=n.ts,o=t.Timing.MicroSeconds(r.ts-n.ts);if(a.willSendRequests&&a.willSendRequests[e]&&a.willSendRequests[e+1]){const n=a.willSendRequests[e],r=a.willSendRequests[e+1];s=n.ts,o=t.Timing.MicroSeconds(r.ts-n.ts)}i.push({url:n.args.data.url,priority:n.args.data.priority,ts:s,dur:o})}const s=a.sendRequests[0],o=a.sendRequests[a.sendRequests.length-1],{timing:c}=a.receiveResponse.args.data;if(!c)continue;const d=a.willSendRequests&&a.willSendRequests.length?t.Timing.MicroSeconds(a.willSendRequests[0].ts):t.Timing.MicroSeconds(s.ts),l=a.willSendRequests&&a.willSendRequests.length?t.Timing.MicroSeconds(a.willSendRequests[a.willSendRequests.length-1].ts):t.Timing.MicroSeconds(o.ts),u=a.resourceFinish?a.resourceFinish.ts:l,m=a.resourceFinish?t.Timing.MicroSeconds(1e6*a.resourceFinish.args.data.finishTime):t.Timing.MicroSeconds(u),g=t.Timing.MicroSeconds((m||l)-l),f=t.Timing.MicroSeconds(u-(m||u)),T=t.Timing.MicroSeconds(l-d),p=t.Timing.MicroSeconds(e.NumberUtilities.clamp(1e6*c.requestTime-l,0,Number.MAX_VALUE)),v=t.Timing.MicroSeconds(X([1e3*c.dnsStart,1e3*c.connectStart,1e3*c.sendStart,a.receiveResponse.ts-l])),h=t.Timing.MicroSeconds(1e3*(c.receiveHeadersEnd-c.sendEnd)),E=t.Timing.MicroSeconds(1e6*c.requestTime+1e3*c.receiveHeadersEnd),w=t.Timing.MicroSeconds((m||E)-E),M=t.Timing.MicroSeconds(g+f),S=t.Timing.MicroSeconds(1e3*(c.dnsEnd-c.dnsStart)),y=t.Timing.MicroSeconds(1e3*(c.sslEnd-c.sslStart)),I=t.Timing.MicroSeconds(1e3*(c.proxyEnd-c.proxyStart)),b=t.Timing.MicroSeconds(1e3*(c.sendEnd-c.sendStart)),C=t.Timing.MicroSeconds(1e3*(c.connectEnd-c.connectStart)),{priority:P,frame:R,url:D,renderBlocking:k}=o.args.data,{mimeType:F,fromCache:_,fromServiceWorker:L}=a.receiveResponse.args.data,{encodedDataLength:W,decodedBodyLength:N}=a.resourceFinish?a.resourceFinish.args.data:{encodedDataLength:0,decodedBodyLength:0},{receiveHeadersEnd:x,requestTime:z,sendEnd:U,sendStart:O,sslStart:q}=c,{host:H,protocol:A,pathname:B,search:J}=new URL(D),G="https:"===A,V=n.get(R)?.get(o.pid),$=V?V.frame.url:"",K={args:{data:{decodedBodyLength:N,dnsLookup:S,download:w,encodedDataLength:W,finishTime:m,frame:R,fromCache:_,fromServiceWorker:L,initialConnection:C,host:H,isHttps:G,mimeType:F,networkDuration:g,pathname:B,search:J,priority:P,processingDuration:f,protocol:A,proxyNegotiation:I,redirectionDuration:T,queueing:p,receiveHeadersEnd:t.Timing.MicroSeconds(x),redirects:i,requestId:r,renderBlocking:k||"non_blocking",requestSent:b,requestTime:z,requestingFrameUrl:$,sendEnd:t.Timing.MicroSeconds(1e3*U),sendStart:t.Timing.MicroSeconds(1e3*O),ssl:y,sslStart:t.Timing.MicroSeconds(1e3*q),stalled:v,statusCode:a.receiveResponse.args.data.statusCode,stackTrace:o.args.data.stackTrace,totalTime:M,url:D,waiting:h}},cat:"loading",name:"SyntheticNetworkRequest",ph:"X",dur:t.Timing.MicroSeconds(u-d),tdur:t.Timing.MicroSeconds(u-d),ts:t.Timing.MicroSeconds(d),tts:t.Timing.MicroSeconds(d),pid:o.pid,tid:o.tid};if(K.args.data.fromCache){K.args.data.queueing=t.Timing.MicroSeconds(0),K.args.data.waiting=t.Timing.MicroSeconds(0),K.args.data.dnsLookup=t.Timing.MicroSeconds(0),K.args.data.initialConnection=t.Timing.MicroSeconds(0),K.args.data.ssl=t.Timing.MicroSeconds(0),K.args.data.requestSent=t.Timing.MicroSeconds(0),K.args.data.proxyNegotiation=t.Timing.MicroSeconds(0),K.args.data.networkDuration=t.Timing.MicroSeconds(0);const e=a.receiveResponse?a.receiveResponse.ts:d;K.args.data.stalled=t.Timing.MicroSeconds(e-d),K.args.data.download=t.Timing.MicroSeconds(u-e)}const Q=e.MapUtilities.getWithDefault(j,H,(()=>({renderBlocking:[],nonRenderBlocking:[],all:[]})));"non_blocking"===K.args.data.renderBlocking?Q.nonRenderBlocking.push(K):Q.renderBlocking.push(K),Q.all.push(K),Y.push(K)}K=3},data:function(){if(3!==K)throw new Error("Network Request handler is not finalized");return{byOrigin:new Map(j),byTime:[...Y]}},deps:function(){return["Meta"]}});const Z=new Map;let ee=[];let te=[];const ne=new Set,re=[t.TraceEvents.isTraceEventMarkDOMContent,t.TraceEvents.isTraceEventMarkLoad,t.TraceEvents.isTraceEventFirstPaint,t.TraceEvents.isTraceEventFirstContentfulPaint,t.TraceEvents.isTraceEventLargestContentfulPaintCandidate];function ae(e){return re.some((t=>t(e)))}const ie=[...re,t.TraceEvents.isTraceEventInteractiveTime];function se(e){return ie.some((t=>t(e)))}function oe(r,a){const i=r.args.data?.navigationId;if(!i)throw new Error("Navigation event unexpectedly had no navigation ID.");const s=de(a),{rendererProcessesByFrame:o}=w(),c=o.get(s);if(!c)return;const d=c.get(a.pid);if(!d)return;if(a.ts>=d.window.min&&a.ts<=d.window.max)if(t.TraceEvents.isTraceEventFirstContentfulPaint(a)){const e=t.Timing.MicroSeconds(a.ts-r.ts);ce(s,i,{event:a,score:n.Timing.formatMicrosecondsTime(e,{format:2,maximumFractionDigits:2}),metricName:"FCP",classification:ue(e),navigation:r})}else if(t.TraceEvents.isTraceEventFirstPaint(a)){const e=t.Timing.MicroSeconds(a.ts-r.ts);ce(s,i,{event:a,score:n.Timing.formatMicrosecondsTime(e,{format:2,maximumFractionDigits:2}),metricName:"FP",classification:"unclassified",navigation:r})}else if(t.TraceEvents.isTraceEventMarkDOMContent(a)){const e=t.Timing.MicroSeconds(a.ts-r.ts);ce(s,i,{event:a,score:n.Timing.formatMicrosecondsTime(e,{format:2,maximumFractionDigits:2}),metricName:"DCL",classification:"unclassified",navigation:r})}else if(t.TraceEvents.isTraceEventInteractiveTime(a)){const e=t.Timing.MicroSeconds(a.ts-r.ts);ce(s,i,{event:a,score:n.Timing.formatMicrosecondsTime(e,{format:2,maximumFractionDigits:2}),metricName:"TTI",classification:me(e),navigation:r});const o=n.Timing.millisecondsToMicroseconds(t.Timing.MilliSeconds(a.args.args.total_blocking_time_ms));ce(s,i,{event:a,score:n.Timing.formatMicrosecondsTime(o,{format:1,maximumFractionDigits:2}),metricName:"TBT",classification:Te(o),navigation:r})}else if(t.TraceEvents.isTraceEventMarkLoad(a)){const e=t.Timing.MicroSeconds(a.ts-r.ts);ce(s,i,{event:a,score:n.Timing.formatMicrosecondsTime(e,{format:2,maximumFractionDigits:2}),metricName:"L",classification:"unclassified",navigation:r})}else if(t.TraceEvents.isTraceEventLargestContentfulPaintCandidate(a)){const o=a.args.data?.candidateIndex;if(!o)throw new Error("Largest Contenful Paint unexpectedly had no candidateIndex.");const c=t.Timing.MicroSeconds(a.ts-r.ts),d={event:a,score:n.Timing.formatMicrosecondsTime(c,{format:2,maximumFractionDigits:2}),metricName:"LCP",classification:ge(c),navigation:r},l=e.MapUtilities.getWithDefault(Z,s,(()=>new Map)),u=e.MapUtilities.getWithDefault(l,i,(()=>new Map)).get("LCP");if(void 0===u)return ne.add(d.event),void ce(s,i,d);const m=u.event;if(!t.TraceEvents.isTraceEventLargestContentfulPaintCandidate(m))return;const g=m.args.data?.candidateIndex;if(!g)return;g<o&&(ne.delete(m),ne.add(d.event),ce(s,i,d))}else if(!t.TraceEvents.isTraceEventLayoutShift(a))return e.assertNever(a,`Unexpected event type: ${a}`)}function ce(t,n,r){const a=e.MapUtilities.getWithDefault(Z,t,(()=>new Map)),i=e.MapUtilities.getWithDefault(a,n,(()=>new Map));i.delete(r.metricName),i.set(r.metricName,r)}function de(n){if(t.TraceEvents.isTraceEventFirstContentfulPaint(n)||t.TraceEvents.isTraceEventInteractiveTime(n)||t.TraceEvents.isTraceEventLargestContentfulPaintCandidate(n)||t.TraceEvents.isTraceEventLayoutShift(n)||t.TraceEvents.isTraceEventFirstPaint(n))return n.args.frame;if(t.TraceEvents.isTraceEventMarkDOMContent(n)||t.TraceEvents.isTraceEventMarkLoad(n)){const e=n.args.data?.frame;if(!e)throw new Error("MarkDOMContent unexpectedly had no frame ID.");return e}e.assertNever(n,`Unexpected event type: ${n}`)}function le(r){if(t.TraceEvents.isTraceEventFirstContentfulPaint(r)||t.TraceEvents.isTraceEventLargestContentfulPaintCandidate(r)||t.TraceEvents.isTraceEventFirstPaint(r)){const e=r.args.data?.navigationId;if(!e)throw new Error("Trace event unexpectedly had no navigation ID.");const{navigationsByNavigationId:t}=w(),n=t.get(e);return n||null}if(t.TraceEvents.isTraceEventMarkDOMContent(r)||t.TraceEvents.isTraceEventInteractiveTime(r)||t.TraceEvents.isTraceEventLayoutShift(r)||t.TraceEvents.isTraceEventMarkLoad(r)){const e=de(r),{navigationsByFrameId:t}=w();return n.Trace.getNavigationForTraceEvent(r,e,t)}return e.assertNever(r,`Unexpected event type: ${r}`)}function ue(e){const r=n.Timing.secondsToMicroseconds(t.Timing.Seconds(1.8));let a="bad";return e<=n.Timing.secondsToMicroseconds(t.Timing.Seconds(3))&&(a="ok"),e<=r&&(a="good"),a}function me(e){const r=n.Timing.secondsToMicroseconds(t.Timing.Seconds(3.8));let a="bad";return e<=n.Timing.secondsToMicroseconds(t.Timing.Seconds(7.3))&&(a="ok"),e<=r&&(a="good"),a}function ge(e){const r=n.Timing.secondsToMicroseconds(t.Timing.Seconds(2.5));let a="bad";return e<=n.Timing.secondsToMicroseconds(t.Timing.Seconds(4))&&(a="ok"),e<=r&&(a="good"),a}function fe(e){return"unclassified"}function Te(e){const r=n.Timing.millisecondsToMicroseconds(t.Timing.MilliSeconds(200));let a="bad";return e<=n.Timing.millisecondsToMicroseconds(t.Timing.MilliSeconds(600))&&(a="ok"),e<=r&&(a="good"),a}var pe=Object.freeze({__proto__:null,reset:function(){Z.clear(),te=[],ee=[],ne.clear()},MarkerName:["MarkDOMContent","MarkLoad","firstPaint","firstContentfulPaint","largestContentfulPaint::Candidate"],isTraceEventMarkerEvent:ae,eventIsPageLoadEvent:se,handleEvent:function(e){se(e)&&te.push(e)},getFrameIdForPageLoadEvent:de,getFirstFCPTimestampFromModelData:function(e){const t=e.Meta.mainFrameId,n=e.PageLoadMetrics.metricScoresByFrameId.get(t);if(!n)return null;let r=null;for(const e of n.values()){const t=e.get("FCP")?.event?.ts;t&&(r?t<r&&(r=t):r=t)}return r},scoreClassificationForFirstContentfulPaint:ue,scoreClassificationForTimeToInteractive:me,scoreClassificationForLargestContentfulPaint:ge,scoreClassificationForDOMContentLoaded:fe,scoreClassificationForTotalBlockingTime:Te,finalize:async function(){te.sort(((e,t)=>e.ts-t.ts));for(const e of te){const t=le(e);t&&oe(t,e)}const e=function(){const e=[],t=[...Z.values()].flatMap((e=>[...e.values()]));for(let n=0;n<t.length;n++){const r=t[n].get("LCP");r&&r.event&&e.push(r.event)}return e}(),n=w().mainFrameId,r=[...e,...te.filter((e=>!t.TraceEvents.isTraceEventLargestContentfulPaintCandidate(e)))].filter(ae);ee=r.filter((e=>de(e)===n)).sort(((e,t)=>e.ts-t.ts))},data:function(){return{metricScoresByFrameId:new Map(Z),allMarkerEvents:[...ee]}},deps:function(){return["Meta"]}});const ve=[];let he=null;const Ee=[],we=[],Me=new Map,Se=[];let ye=1;const Ie=new Set(["pointerdown","touchstart","pointerup","touchend","mousedown","mouseup","click"]),be=new Set(["keydown","keypress","keyup"]);function Ce(e){return Ie.has(e.type)?"POINTER":be.has(e.type)?"KEYBOARD":"OTHER"}function Pe(e){const n={POINTER:new Map,KEYBOARD:new Map,OTHER:new Map};function r(e){const r=Ce(e),a=n[r],i=t.Timing.MicroSeconds(e.ts+e.dur),s=a.get(i);s?e.ts<s.ts&&a.set(i,e):a.set(i,e)}for(const t of e)r(t);const a=Object.values(n).flatMap((e=>Array.from(e.values())));return a.sort(((e,t)=>e.ts-t.ts)),a}var Re=Object.freeze({__proto__:null,reset:function(){ve.length=0,Ee.length=0,Se.length=0,Me.clear(),we.length=0,ye=2},handleEvent:function(e){if(2!==ye)throw new Error("Handler is not initialized");if(!t.TraceEvents.isTraceEventEventTiming(e))return;if(t.TraceEvents.isTraceEventEventTimingEnd(e)&&Me.set(e.id,e),ve.push(e),!e.args.data||!t.TraceEvents.isTraceEventEventTimingStart(e))return;const{duration:n,interactionId:r}=e.args.data;n<1||void 0===r||0===r||Se.push(e)},categoryOfInteraction:Ce,removeNestedInteractions:Pe,finalize:async function(){for(const e of Se){const n=Me.get(e.id);if(!n)continue;if(!e.args.data?.type||!e.args.data?.interactionId)continue;const r={cat:e.cat,name:e.name,pid:e.pid,tid:e.tid,ph:e.ph,args:{data:{beginEvent:e,endEvent:n}},ts:e.ts,dur:t.Timing.MicroSeconds(n.ts-e.ts),type:e.args.data.type,interactionId:e.args.data.interactionId};(!he||he.dur<r.dur)&&(he=r),Ee.push(r)}ye=3,we.push(...Pe(Ee))},data:function(){return{allEvents:[...ve],interactionEvents:[...Ee],interactionEventsWithNoNesting:[...we],longestInteractionEvent:he}}});const De=[],ke=[],Fe=[],_e=[],Le=[];let We=1;const Ne=["workerStart","redirectStart","redirectEnd","fetchStart","domainLookupStart","domainLookupEnd","connectStart","connectEnd","secureConnectionStart","requestStart","responseStart","responseEnd"],xe=["navigationStart","unloadEventStart","unloadEventEnd","redirectStart","redirectEnd","fetchStart","commitNavigationEnd","domainLookupStart","domainLookupEnd","connectStart","connectEnd","secureConnectionStart","requestStart","responseStart","responseEnd","domLoading","domInteractive","domContentLoadedEventStart","domContentLoadedEventEnd","domComplete","loadEventStart","loadEventEnd"];var ze=Object.freeze({__proto__:null,reset:function(){De.length=0,ke.length=0,Fe.length=0,_e.length=0,Le.length=0,We=2},handleEvent:function(e){if(2!==We)throw new Error("UserTimings handler is not initialized");[...Ne,...xe].includes(e.name)||(t.TraceEvents.isTraceEventPerformanceMeasure(e)?ke.push(e):(t.TraceEvents.isTraceEventPerformanceMark(e)&&Fe.push(e),t.TraceEvents.isTraceEventConsoleTime(e)&&_e.push(e),t.TraceEvents.isTraceEventTimeStamp(e)&&Le.push(e)))},finalize:async function(){if(2!==We)throw new Error("UserTimings handler is not initialized");const r=new Map;for(const t of[...ke,..._e]){const a=n.Trace.extractId(t);if(void 0===a)continue;const i=`${t.cat}:${a}:${t.name}`,s=e.MapUtilities.getWithDefault(r,i,(()=>({begin:null,end:null}))),o="b"===t.ph,c="e"===t.ph;o?s.begin=t:c&&(s.end=t)}for(const[e,n]of r.entries()){if(!n.begin||!n.end)continue;const r={cat:n.end.cat,ph:n.end.ph,pid:n.end.pid,tid:n.end.tid,id:e,name:n.begin.name,dur:t.Timing.MicroSeconds(n.end.ts-n.begin.ts),ts:n.begin.ts,args:{data:{beginEvent:n.begin,endEvent:n.end}}};De.push(r)}De.sort(((e,t)=>e.ts>t.ts?1:t.ts>e.ts?-1:0)),We=3},data:function(){if(3!==We)throw new Error("UserTimings handler is not finalized");return{performanceMeasures:De.filter(t.TraceEvents.isTraceEventPerformanceMeasure),consoleTimings:De.filter(t.TraceEvents.isTraceEventConsoleTime),performanceMarks:[...Fe],timestampEvents:[...Le]}}});const Ue={UserTimings:ze,PageLoadMetrics:pe,UserInteractions:Re,LayoutShifts:G,Screenshots:D,GPU:b,NetworkRequests:Q};var Oe=Object.freeze({__proto__:null,ENABLED_TRACE_HANDLERS:Ue});const qe=[];var He=Object.freeze({__proto__:null,reset:function(){qe.length=0},handleEvent:function(e){t.TraceEvents.isTraceEventAnimation(e)&&qe.push(e)},data:function(){return{animations:qe}}});const Ae=new Map;var Be=Object.freeze({__proto__:null,reset:function(){Ae.clear()},handleEvent:function(e){t.TraceEvents.isTraceEventLargestImagePaintCandidate(e)&&e.args.data&&Ae.set(e.args.data.DOMNodeId,e)},data:function(){return new Map(Ae)}});const Je=new Map;var Ge=Object.freeze({__proto__:null,reset:function(){Je.clear()},handleEvent:function(e){t.TraceEvents.isTraceEventLargestTextPaintCandidate(e)&&e.args.data&&Je.set(e.args.data.DOMNodeId,e)},data:function(){return new Map(Je)}});const Ve=new Map([["Program",{category:"Other",label:"Other"}],["RunTask",{category:"Other",label:"Run Task"}],["AsyncTask",{category:"Other",label:"Async Task"}],["XHRLoad",{category:"Load",label:"Load"}],["XHRReadyStateChange",{category:"Load",label:"ReadyStateChange"}],["ParseHTML",{category:"Parse",label:"Parse HTML"}],["ParseAuthorStyleSheet",{category:"Parse",label:"Parse StyleSheet"}],["V8.CompileScript",{category:"V8",label:"Compile Script"}],["V8.CompileCode",{category:"V8",label:"Compile Code"}],["V8.CompileModule",{category:"V8",label:"Compile Module"}],["V8.OptimizeCode",{category:"V8",label:"Optimize"}],["v8.wasm.streamFromResponseCallback",{category:"Js",label:"Streaming Wasm Response"}],["v8.wasm.compiledModule",{category:"Js",label:"Compiled Wasm Module"}],["v8.wasm.cachedModule",{category:"Js",label:"Cached Wasm Module"}],["v8.wasm.moduleCacheHit",{category:"Js",label:"Wasm Module Cache Hit"}],["v8.wasm.moduleCacheInvalid",{category:"Js",label:"Wasm Module Cache Invalid"}],["RunMicrotasks",{category:"Js",label:"Run Microtasks"}],["EvaluateScript",{category:"Js",label:"Evaluate Script"}],["FunctionCall",{category:"Js",label:"Function Call"}],["EventDispatch",{category:"Js",label:"Event"}],["RequestMainThreadFrame",{category:"Js",label:"Request Main Thread Frame"}],["RequestAnimationFrame",{category:"Js",label:"Request Animation Frame"}],["CancelAnimationFrame",{category:"Js",label:"Cancel Animation Frame"}],["FireAnimationFrame",{category:"Js",label:"Animation Frame"}],["RequestIdleCallback",{category:"Js",label:"Request Idle Callback"}],["CancelIdleCallback",{category:"Js",label:"Cancel Idle Callback"}],["FireIdleCallback",{category:"Js",label:"Idle Callback"}],["TimerInstall",{category:"Js",label:"Timer Installed"}],["TimerRemove",{category:"Js",label:"Timer Removed"}],["TimerFire",{category:"Js",label:"Timer Fired"}],["WebSocketCreate",{category:"Js",label:"Create WebSocket"}],["WebSocketSendHandshakeRequest",{category:"Js",label:"Send WebSocket Handshake"}],["WebSocketReceiveHandshakeResponse",{category:"Js",label:"Receive WebSocket Handshake"}],["WebSocketDestroy",{category:"Js",label:"Destroy WebSocket"}],["DoEncrypt",{category:"Js",label:"Crypto Encrypt"}],["DoEncryptReply",{category:"Js",label:"Crypto Encrypt Reply"}],["DoDecrypt",{category:"Js",label:"Crypto Decrypt"}],["DoDecryptReply",{category:"Js",label:"Crypto Decrypt Reply"}],["DoDigest",{category:"Js",label:"Crypto Digest"}],["DoDigestReply",{category:"Js",label:"Crypto Digest Reply"}],["DoSign",{category:"Js",label:"Crypto Sign"}],["DoSignReply",{category:"Js",label:"Crypto Sign Reply"}],["DoVerify",{category:"Js",label:"Crypto Verify"}],["DoVerifyReply",{category:"Js",label:"Crypto Verify Reply"}],["GCEvent",{category:"Gc",label:"GC"}],["BlinkGC.AtomicPhase",{category:"Gc",label:"DOM GC"}],["V8.GCIncrementalMarking",{category:"Gc",label:"Incremental GC"}],["MajorGC",{category:"Gc",label:"Major GC"}],["MinorGC",{category:"Gc",label:"Minor GC"}],["ScheduleStyleRecalculation",{category:"Layout",label:"Schedule Recalculate Style"}],["RecalculateStyles",{category:"Layout",label:"Recalculate Style"}],["Layout",{category:"Layout",label:"Layout"}],["UpdateLayoutTree",{category:"Layout",label:"Recalculate Style"}],["InvalidateLayout",{category:"Layout",label:"Invalidate Layout"}],["LayoutInvalidationTracking",{category:"Layout",label:"Layout Invalidation"}],["ComputeIntersections",{category:"Paint",label:"Compute Intersections"}],["HitTest",{category:"Layout",label:"Hit Test"}],["PrePaint",{category:"Layout",label:"Pre-Paint"}],["ScrollLayer",{category:"Paint",label:"Scroll"}],["UpdateLayer",{category:"Paint",label:"Update Layer"}],["PaintSetup",{category:"Paint",label:"Paint Setup"}],["Paint",{category:"Paint",label:"Paint"}],["PaintImage",{category:"Paint",label:"Paint Image"}],["Commit",{category:"Paint",label:"Commit"}],["CompositeLayers",{category:"Paint",label:"Composite Layers"}],["RasterTask",{category:"Paint",label:"Raster"}],["ImageDecodeTask",{category:"Paint",label:"Decode Image Task"}],["ImageUploadTask",{category:"Paint",label:"Upload Image Task"}],["Decode Image",{category:"Paint",label:"Decode Image"}],["Resize Image",{category:"Paint",label:"Resize Image"}],["Draw LazyPixelRef",{category:"Paint",label:"Draw LazyPixelRef"}],["Decode LazyPixelRef",{category:"Paint",label:"Decode LazyPixelRef"}],["GPUTask",{category:"Paint",label:"GPU Task"}]]);var je=Object.freeze({__proto__:null,KNOWN_EVENTS:Ve});const Ye=new Map,$e=new Map,Xe=[];let Ke=0;let Qe=1;const Ze=()=>({url:null,isOnMainFrame:!1,threads:new Map}),et=()=>({name:null,events:[]}),tt=(e,t)=>({event:e,id:t,parentId:null,childrenIds:new Set,depth:0}),nt=(t,n)=>e.MapUtilities.getWithDefault(t,n,Ze),rt=(t,n)=>e.MapUtilities.getWithDefault(t.threads,n,et);function at(e,t,n,r){it(e,t,n),st(e,t,n),ot(e,n,r)}function it(e,t,n){for(const[r,a]of n)for(const[n,i]of a){const a=nt(e,n);if(null===a.url||r===t)try{new URL(i.frame.url),a.url=i.frame.url}catch(e){a.url=null}}}function st(e,t,n){for(const[r,a]of n)for(const[n]of a){const a=nt(e,n);r===t&&(a.isOnMainFrame=!0)}}function ot(e,t,n){for(const[,r]of t)for(const[t]of r){const r=nt(e,t);for(const[e,a]of n.get(t)??[]){rt(r,e).name=a?.args.name??`${e}`}}}function ct(e){for(const[t,n]of e){if(null===n.url){e.delete(t);continue}"about:"===new URL(n.url).protocol&&e.delete(t)}}function dt(e){for(const[,t]of e)for(const[e,n]of t.threads)n.tree?.roots.size||t.threads.delete(e)}function lt(e,t){for(const[,r]of e)for(const[,e]of r.threads)n.Trace.sortTraceEventsInPlace(e.events),e.tree=ut(e.events,t)}function ut(e,n){const r=[];Ke=-1;const a={nodes:new Map,roots:new Set,maxDepth:0};for(let i=0;i<e.length;i++){const s=e[i];if(!n.filter.has(s.name))continue;const o=s.dur||0,c=++Ke,d=tt(s,c);if(0===r.length){a.nodes.set(c,d),a.roots.add(c),s.selfTime=t.Timing.MicroSeconds(o),r.push(d),a.maxDepth=Math.max(a.maxDepth,r.length),$e.set(s,d);continue}const l=r.at(-1);if(void 0===l)throw new Error("Impossible: no parent node found in the stack");const u=l.event,m=s.ts,g=u.ts,f=m+o,T=g+(u.dur||0);if(m<g)throw new Error("Impossible: current event starts before the parent event");if(m>=T){r.pop(),i--,Ke--;continue}if(f>T)throw new Error("Impossible: current event starts during the parent event");a.nodes.set(c,d),d.depth=r.length,d.parentId=l.id,l.childrenIds.add(c),s.selfTime=t.Timing.MicroSeconds(o),void 0!==u.selfTime&&(u.selfTime=t.Timing.MicroSeconds(u.selfTime-(s.dur||0))),r.push(d),a.maxDepth=Math.max(a.maxDepth,r.length),$e.set(s,d)}return a}const mt=new Set(["Layout"]),gt=new Set(["RecalculateStyles","UpdateLayoutTree"]);var ft=Object.freeze({__proto__:null,reset:function(){Ye.clear(),$e.clear(),Xe.length=0,Ke=-1,Qe=1},initialize:function(){if(1!==Qe)throw new Error("Renderer Handler was not reset");Qe=2},handleEvent:function(e){if(2!==Qe)throw new Error("Renderer Handler is not initialized");if(t.TraceEvents.isTraceEventInstant(e)||t.TraceEvents.isTraceEventComplete(e)){const t=nt(Ye,e.pid);rt(t,e.tid).events.push(e),Xe.push(e)}},finalize:async function(){if(2!==Qe)throw new Error("Renderer Handler is not initialized");const{mainFrameId:e,rendererProcessesByFrame:t,threadsInProcess:n}=w();at(Ye,e,t,n),ct(Ye),lt(Ye,{filter:Ve}),dt(Ye),Qe=3},data:function(){if(3!==Qe)throw new Error("Renderer Handler is not finalized");return{processes:new Map(Ye),traceEventToNode:new Map($e),allRendererEvents:[...Xe]}},assignMeta:at,assignOrigin:it,assignIsMainFrame:st,assignThreadName:ot,sanitizeProcesses:ct,sanitizeThreads:dt,buildHierarchy:lt,treify:ut,FORCED_LAYOUT_EVENT_NAMES:mt,FORCED_RECALC_STYLE_EVENTS:gt,deps:function(){return["Meta","Samples"]}});function Tt(e){e.sort(((e,t)=>{const n=e.ts,r=t.ts;return n<r?-1:n>r?1:0}))}const pt=new Set(["Other","V8","Js","Gc"]),vt=new Set([void 0,"JS"]),ht=[/^chrome-extension:\/\//,/^extensions::/],Et=t.Timing.MicroSeconds(200),wt=new Map,Mt=new Map,St=new Map;let yt=1;const It=()=>({threads:new Map}),bt=e=>({callFrame:e,parentId:null,childrenIds:new Set}),Ct=(e,t,n,r)=>({topmostStackFrame:{nodeId:e},tid:n,pid:t,ts:r}),Pt=(t,n)=>e.MapUtilities.getWithDefault(t,n,It),Rt=(t,n,r)=>e.MapUtilities.getWithDefault(t.threads,n,(()=>(e=>({profile:e}))(r)));function Dt(e,t){for(const[,n]of e){const{head:e,chunks:r}=n;if(!e||!r?.length)continue;const a=e.pid,i=e.tid;Rt(Pt(t,a),i,n)}}function kt(e,t){for(const[r,a]of e)for(const[e,i]of a.threads){n.Trace.sortTraceEventsInPlace(i.profile.chunks);const a={filter:pt},s=i.boundaries=Ft(t,r,e,a),o=i.tree=_t(i.profile.chunks),{startTime:c}=i.profile.head.args.data,d={filterCodeTypes:!0,filterUrls:!0},l=Wt((i.samples=Lt(r,e,c,o,i.profile.chunks,d)).map((e=>Ut(o,e))),s);i.calls=l.calls,i.dur=l.dur}}function Ft(e,n,r,a){const i=e.get(n);if(!i)return[];const s=i.get(r);if(!s)return[];const o=new Set;for(const e of s){const n=Ve.get(e.name)?.category??"Other";a.filter.has(n)&&(o.add(e.ts),o.add(t.Timing.MicroSeconds(e.ts+e.dur)))}return[...o].sort(((e,t)=>e<t?-1:1))}function _t(t,n){const r={nodes:new Map};for(const a of t){const t=a.args.data?.cpuProfile;if(!t)continue;const i=t.nodes;if(i)for(const t of i){const a=t.id,i=t.parent,s=t.callFrame;if(!Nt(s,n))continue;const o=e.MapUtilities.getWithDefault(r.nodes,a,(()=>bt(s)));void 0!==i&&(o.parentId=i,r.nodes.get(i)?.childrenIds.add(a))}}return r}function Lt(e,n,r,a,i,s){const o=[];for(const c of i){const{timeDeltas:i,cpuProfile:d}=c.args.data??{};if(i&&d)for(let c=0;c<i.length;c++){const l=i[c],u=d.samples[c];r=t.Timing.MicroSeconds(r+l);const m=xt(u,a,s);null!==m&&o.push(Ct(m,e,n,r))}}return Tt(o),o}function Wt(n,r){const a={calls:new Array,dur:t.Timing.MicroSeconds(0)};let i=0;for(const s of n){if(s.ts>=i){i=r[e.ArrayUtilities.nearestIndexFromBeginning(r,(e=>e>s.ts))??1/0],a.calls.push(s);continue}const n=a.calls.at(-1);if(!n)continue;const o=s.stackFrame.nodeId===n.stackFrame.nodeId,c=s.ts-(n.ts+n.dur)<Et;o&&c?(n.dur=t.Timing.MicroSeconds(s.ts-n.ts),n.children.push(...s.children)):a.calls.push(s)}for(const e of a.calls){const n=Wt(e.children,r);e.children=n.calls,e.selfDur=t.Timing.MicroSeconds(e.dur-n.dur),a.dur=t.Timing.MicroSeconds(a.dur+e.dur)}return a}function Nt(e,t){return!(t?.filterCodeTypes&&!vt.has(e.codeType))&&(!t?.filterUrls||!ht.some((t=>e.url?.match(t))))}function xt(e,t,n){if(null===e)return null;const r=t.nodes.get(e),a=r?.callFrame;return r&&a?Nt(a,n)?e:xt(r.parentId,t,n):null}function zt(e,t){const n=[];let r,a=t;for(;null!==a&&(r=e.nodes.get(a));)n.push(a),a=r.parentId;return n.reverse()}function Ut(e,n){const r=zt(e,n.topmostStackFrame.nodeId).map((e=>((e,n)=>({stackFrame:{nodeId:e},tid:n.tid,pid:n.pid,ts:n.ts,dur:t.Timing.MicroSeconds(0),selfDur:t.Timing.MicroSeconds(0),children:[]}))(e,n)));for(let e=1;e<r.length;e++){const t=r[e-1],n=r[e];t.children.push(n)}return r[0]}function Ot(t,n,r,a=new Map){for(const i of t){if(i.ts<n||i.ts+i.dur>r)continue;const t=e.MapUtilities.getWithDefault(a,i.stackFrame.nodeId,(()=>({stackFrame:{nodeId:i.stackFrame.nodeId},calls:[],durPercent:0,selfDurPercent:0})));t.calls.push(i),t.durPercent+=i.dur/(r-n)*100,t.selfDurPercent+=i.selfDur/(r-n)*100,Ot(i.children,n,r,a)}return a.values()}var qt=Object.freeze({__proto__:null,sortProfileSamples:Tt,reset:function(){wt.clear(),Mt.clear(),St.clear(),yt=1},initialize:function(){if(1!==yt)throw new Error("Samples Handler was not reset");yt=2},handleEvent:function(n){if(2!==yt)throw new Error("Samples Handler is not initialized");if(t.TraceEvents.isTraceEventProfile(n)){e.MapUtilities.getWithDefault(Mt,n.id,(()=>({}))).head=n}else{if(t.TraceEvents.isTraceEventProfileChunk(n)){const t=e.MapUtilities.getWithDefault(Mt,n.id,(()=>({})));return t.chunks=t.chunks??[],void t.chunks.push(n)}if(t.TraceEvents.isTraceEventComplete(n)){const t=e.MapUtilities.getWithDefault(wt,n.pid,(()=>new Map));e.MapUtilities.getWithDefault(t,n.tid,(()=>[])).push(n)}else;}},finalize:async function(){if(2!==yt)throw new Error("Samples Handler is not initialized");Dt(Mt,St),kt(St,wt),yt=3},data:function(){if(3!==yt)throw new Error("Samples Handler is not finalized");return{profiles:new Map(Mt),processes:new Map(St)}},buildProcessesAndThreads:Dt,buildHierarchy:kt,collectBoundaries:Ft,collectStackTraces:_t,collectSamples:Lt,mergeCalls:Wt,isAllowedCallFrame:Nt,findTopmostAllowedCallFrame:xt,buildStackTraceAsCallFrameIdsFromId:zt,buildStackTraceAsCallFramesFromId:function(e,t){return zt(e,t).map((t=>{const n=e.nodes.get(t)?.callFrame;if(!n)throw new Error;return n}))},buildProfileCallFromSample:Ut,getAllFunctionsBetweenTimestamps:Ot,getAllHotFunctionsBetweenTimestamps:function(e,t,n,r){return[...Ot(e,t,n)].filter((e=>e.selfDurPercent>=r)).sort(((e,t)=>e.selfDurPercent>t.selfDurPercent?-1:1))}}),Ht=Object.freeze({__proto__:null,Animation:He,GPU:b,LargestImagePaint:Be,LargestTextPaint:Ge,LayoutShifts:G,Meta:M,NetworkRequests:Q,PageLoadMetrics:pe,Renderer:ft,Samples:qt,Screenshots:D,UserInteractions:Re,UserTimings:ze});export{Oe as Migration,Ht as ModelHandlers,je as Types};