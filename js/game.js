/* Australis: player, follower, dialogue, movement, lighting, camera, controls and the main loop */
PARENT=scene;

/* ================= player, follower ================= */
const PM=human(CHAR.player);scene.add(PM.group);const playerSprite=PM.group;
const playerBlob=blob(0,0,0,.32,scene);
const FM=sugrette();const follower={active:false,model:FM,sprite:FM.group,tx:0,ty:0,from:null,to:null};
FM.group.visible=false;scene.add(FM.group);
const followerBlob=blob(0,0,0,.26,scene);followerBlob.visible=false;
const LOCS={wattle:WT,bloom:BR};
let L=WT;
const P={tx:0,ty:0,face:[0,1],moving:false,t:0,from:null,to:null,parity:0,steps:0};
const STEP=.2;
const worldPos=(tx,ty)=>{const w=L.grid.w(tx,ty);return {x:w[0],z:w[1],y:L.grid.h(tx,ty)};};
function placePlayer(sp){P.tx=sp.tx;P.ty=sp.ty;P.face=sp.face.slice();P.moving=false;const w=worldPos(P.tx,P.ty);P.from=w;P.to=w;}
function placeFollower(snap){
  if(!follower.active)return;
  if(snap===true&&L.grid.blocked(follower.tx,follower.ty)){follower.tx=P.tx-P.face[0];follower.ty=P.ty-P.face[1];}
  const w=worldPos(follower.tx,follower.ty);follower.from=w;follower.to=w;followerBlob.visible=true;
}

/* ================= dialogue ================= */
const dialogEl=document.getElementById('dialog'),dtext=document.getElementById('dtext'),dmore=document.getElementById('dmore'),live=document.getElementById('live');
let dlg=null;
function say(lines,onEnd){dlg={lines:lines.slice(),i:0,chars:still?1e9:0,onEnd};dialogEl.hidden=false;live.textContent=dlg.lines[0];renderDlg();}
function renderDlg(){const line=dlg.lines[dlg.i];const n=Math.min(line.length,Math.floor(dlg.chars));dtext.textContent=line.slice(0,n);dmore.style.visibility=n>=line.length?'visible':'hidden';}
function advance(){
  if(!dlg)return;const line=dlg.lines[dlg.i];
  if(dlg.chars<line.length){dlg.chars=line.length;renderDlg();return;}
  dlg.i++;
  if(dlg.i>=dlg.lines.length){const cb=dlg.onEnd;dlg=null;dialogEl.hidden=true;if(cb)cb();return;}
  dlg.chars=still?1e9:0;live.textContent=dlg.lines[dlg.i];renderDlg();
}
dialogEl.addEventListener('click',advance);

/* ================= movement ================= */
let busy=false,timeName='day';
const held=[];
function dirToWorld(d){
  const ix=d==='left'?-1:d==='right'?1:0,iy=d==='up'?1:d==='down'?-1:0;
  const fx=-Math.sin(view.yaw),fz=-Math.cos(view.yaw),rx=Math.cos(view.yaw),rz=-Math.sin(view.yaw);
  const wx=rx*ix+fx*iy,wz=rz*ix+fz*iy;
  return Math.abs(wx)>Math.abs(wz)?[Math.sign(wx),0]:[0,Math.sign(wz)];
}
function tryStep(d){
  const dir=dirToWorld(d);P.face=dir;
  const ex=L.exit&&L.exit(P.tx,P.ty,dir[0],dir[1]);
  if(ex){held.length=0;clearPad();if(ex.say)say(ex.say);else travel(ex);return;}
  const nx=P.tx+dir[0],ny=P.ty+dir[1],g=L.grid;
  if(g.blocked(nx,ny)||g.edgeBlocked(P.tx,P.ty,nx,ny)||Math.abs(g.h(nx,ny)-g.h(P.tx,P.ty))>.7)return;
  if(follower.active){if(!(follower.tx===nx&&follower.ty===ny)){follower.from=worldPos(follower.tx,follower.ty);follower.tx=P.tx;follower.ty=P.ty;follower.to=worldPos(P.tx,P.ty);}else{follower.from=worldPos(nx,ny);follower.tx=P.tx;follower.ty=P.ty;follower.to=worldPos(P.tx,P.ty);}}
  P.from=worldPos(P.tx,P.ty);P.tx=nx;P.ty=ny;P.to=worldPos(nx,ny);P.moving=true;P.t=0;P.parity^=1;P.steps++;
}
function arrive(){
  P.moving=false;
  if(L.grass.has(P.tx+','+P.ty)&&rnd()<.14){
    const list=timeName==='night'?L.wild.night:L.wild.day,name=list[Math.floor(rnd()*list.length)];
    held.length=0;clearPad();
    const fl=document.getElementById('flash');fl.classList.remove('go');void fl.offsetWidth;fl.classList.add('go');
    say(['A wild '+name+' appeared!',name+' rustled back into the '+L.wild.field+'.']);
  }
}
function interact(){
  if(busy)return;
  if(dlg){advance();return;}
  if(P.moving)return;
  const fx=P.tx+P.face[0],fy=P.ty+P.face[1],key=fx+','+fy;
  if(follower.active&&follower.tx===fx&&follower.ty===fy){say(['Sugrette: "Sug-sug!"','Its fur crackles with happy static.']);return;}
  let t=L.talk.get(key);if(!t)return;
  if(typeof t==='function')t=t();
  if(t&&t.sprite){const n=t;if(n.model)n.model.targetRot=Math.atan2(P.tx-n.tx,P.ty-n.ty);const lines=typeof n.lines==='function'?n.lines():n.lines;if(lines)say(lines,n.onEnd);return;}
  if(Array.isArray(t))say(t);
}
const fadeEl=document.getElementById('fade');
function travel(ex){
  busy=true;document.getElementById('cardName').textContent=ex.card[0];document.getElementById('cardSub').textContent=ex.card[1];
  fadeEl.classList.add('on');
  setTimeout(()=>{switchLoc(ex.to,ex.spawn);setTimeout(()=>{fadeEl.classList.remove('on');busy=false;},still?200:900);},still?50:450);
}
const plate=document.getElementById('plate');
function switchLoc(id,spawn){
  L.group.visible=false;L=LOCS[id];L.group.visible=true;
  placePlayer(spawn||L.spawn);
  if(follower.active){follower.tx=P.tx-P.face[0];follower.ty=P.ty-P.face[1];if(L.grid.blocked(follower.tx,follower.ty)){follower.tx=P.tx;follower.ty=P.ty;}placeFollower();}
  view.yaw=L.yaw;orientBillboards(L.yaw);target.set(P.to.x,P.to.y,P.to.z);
  document.getElementById('plateName').textContent=L.name;document.getElementById('plateSub').textContent=L.sub;
  plate.classList.remove('drop');void plate.offsetWidth;plate.classList.add('drop');
}

/* ================= lighting ================= */
const hemi=new THREE.HemisphereLight('#d4ecff','#7a9a50',.7);scene.add(hemi);
const sun=new THREE.DirectionalLight('#fff1d6',1.25);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{left:-26,right:26,top:26,bottom:-26,near:1,far:90});sun.shadow.bias=-.0006;sun.shadow.normalBias=.02;
scene.add(sun);scene.add(sun.target);
const PN=90,pPos=new Float32Array(PN*3),pSeed=[];
for(let i=0;i<PN;i++){pPos[i*3]=-14+rnd()*28;pPos[i*3+1]=.6+rnd()*3;pPos[i*3+2]=-10+rnd()*20;pSeed.push(rnd()*10);}
const pGeo=new THREE.BufferGeometry();pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));
const ptMat=new THREE.PointsMaterial({color:'#fff3a0',size:.09,transparent:true,opacity:.85,depthWrite:false});
const motes=new THREE.Points(pGeo,ptMat);scene.add(motes);
const PRESETS={
  day:{top:'#8fd0ff',bot:'#eaf6ff',fog:'#d6ecf7',hs:'#cfe6ff',hg:'#6a8a48',hi:.5,sun:'#fff0d8',si:1.0,sp:[-11,20,13],tint:'#eeeeee',glow:false,pc:'#fff3a0',po:.75,exp:.88},
  gold:{top:'#f0a06a',bot:'#ffe0ac',fog:'#f4cf9e',hs:'#ffd6a0',hg:'#6a5a40',hi:.45,sun:'#ffad6a',si:1.3,sp:[-21,7.5,7],tint:'#f0d4b8',glow:false,pc:'#ffe08a',po:.9,exp:.88},
  night:{top:'#0b1430',bot:'#2a3c6e',fog:'#1e2c52',hs:'#5a6ab0',hg:'#1a1c28',hi:.5,sun:'#a8bcff',si:.55,sp:[9,16,6],tint:'#7d8cc4',glow:true,pc:'#d8ff7a',po:1,exp:1.1}
};
function setTime(name){
  timeName=name;const p=PRESETS[name];
  stage.style.setProperty('--sky-top',p.top);stage.style.setProperty('--sky-bot',p.bot);
  scene.fog.color.set(p.fog);hemi.color.set(p.hs);hemi.groundColor.set(p.hg);hemi.intensity=p.hi;
  sun.color.set(p.sun);sun.intensity=p.si;sun.userData.off=p.sp;
  spriteMats.forEach(m=>m.color.set(p.tint));
  glows.forEach(g=>g.visible=p.glow);lamps.forEach(l=>l.intensity=p.glow?1.4:0);lampMats.forEach(m=>m.emissiveIntensity=p.glow?1.6:0);
  ptMat.color.set(p.pc);ptMat.opacity=p.po;ptMat.size=p.glow?.13:.09;blobMat.opacity=p.glow?.16:.24;
  renderer.toneMappingExposure=p.exp;
  document.querySelectorAll('.seg button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.t===name)));
}

/* ================= camera & input ================= */
const target=new THREE.Vector3();
/* fixed Pokémon-style camera: straight on, about 55 degrees down, always following the player */
const view={yaw:0,pitch:.96,dist:24};
function defaultDist(){const a=stage.clientWidth/Math.max(1,stage.clientHeight);return a>=1.3?22:a>=.9?25:30;}
function resetView(){view.yaw=L.yaw;view.pitch=.96;view.dist=defaultDist();orientBillboards(L.yaw);}
function updateCamera(){
  const cp=Math.cos(view.pitch);
  camera.position.set(target.x+Math.sin(view.yaw)*cp*view.dist,target.y+Math.sin(view.pitch)*view.dist,target.z+Math.cos(view.yaw)*cp*view.dist);
  camera.lookAt(target);scene.fog.near=view.dist-4;scene.fog.far=view.dist+52;
  const o=sun.userData.off||[-11,20,13];sun.position.set(target.x+o[0],o[1],target.z+o[2]);sun.target.position.set(target.x,0,target.z);
}
const KEYMAP={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right'};
window.addEventListener('keydown',e=>{
  const onButton=e.target&&e.target.tagName==='BUTTON';
  const d=KEYMAP[e.code];
  if(d){e.preventDefault();if(held.indexOf(d)<0)held.push(d);return;}
  if((e.code==='Space'||e.code==='Enter')&&onButton)return;
  if(e.code==='Space'||e.code==='Enter'||e.code==='KeyZ'){e.preventDefault();if(!e.repeat)interact();}
});
window.addEventListener('keyup',e=>{const d=KEYMAP[e.code];if(d){const i=held.indexOf(d);if(i>=0)held.splice(i,1);}});
window.addEventListener('blur',()=>{held.length=0;clearPad();});
const padBtns=[...document.querySelectorAll('.dpad button')];
function clearPad(){padBtns.forEach(b=>b.classList.remove('held'));}
padBtns.forEach(b=>{
  const d=b.dataset.d;
  b.addEventListener('pointerdown',e=>{e.preventDefault();try{b.setPointerCapture(e.pointerId);}catch(_){}if(held.indexOf(d)<0)held.push(d);b.classList.add('held');});
  const up=()=>{const i=held.indexOf(d);if(i>=0)held.splice(i,1);b.classList.remove('held');};
  b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('lostpointercapture',up);
  b.addEventListener('keydown',e=>{if(e.code==='Space'||e.code==='Enter'){e.preventDefault();if(!P.moving&&!dlg&&!busy)tryStep(d);}});
});
const btnA=document.getElementById('btnA');
btnA.addEventListener('pointerdown',e=>{e.preventDefault();interact();});
btnA.addEventListener('keydown',e=>{if(e.code==='Space'||e.code==='Enter'){e.preventDefault();interact();}});
document.querySelectorAll('.seg button').forEach(b=>b.addEventListener('click',()=>setTime(b.dataset.t)));
const tiltBtn=document.getElementById('tilt');
tiltBtn.addEventListener('click',()=>{const on=tiltBtn.getAttribute('aria-pressed')!=='true';tiltBtn.setAttribute('aria-pressed',String(on));stage.classList.toggle('flat',!on);});

function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/Math.max(1,h);camera.updateProjectionMatrix();}
let band=null;
new ResizeObserver(()=>{resize();const d=defaultDist();if(d!==band){band=d;view.dist=d;}}).observe(stage);

/* ================= start ================= */
WT.group.visible=true;placePlayer(WT.spawn);target.set(P.to.x,P.to.y,P.to.z);
resize();resetView();setTime('day');
const clock=new THREE.Clock();let last=0;
function frame(){
  const now=clock.getElapsedTime(),dt=Math.min(.05,now-last);last=now;const t=still?0:now;
  if(!dlg&&!busy&&!P.moving&&held.length)tryStep(held[held.length-1]);
  let px,py,pz;
  if(P.moving){P.t+=dt/STEP;if(P.t>=1){P.t=1;}const k=P.t;px=P.from.x+(P.to.x-P.from.x)*k;pz=P.from.z+(P.to.z-P.from.z)*k;py=P.from.y+(P.to.y-P.from.y)*k;if(P.t>=1)arrive();}
  else{px=P.to.x;py=P.to.y;pz=P.to.z;}
  turnTo(PM.group,Math.atan2(P.face[0],P.face[1]),.35);
  animHuman(PM,t,P.moving,(P.steps+(P.moving?P.t:0))*Math.PI);
  playerSprite.position.set(px,py,pz);playerBlob.position.set(px,py+.02,pz);
  if(follower.active&&follower.from){
    const k=P.moving?P.t:1;const fx=follower.from.x+(follower.to.x-follower.from.x)*k,fz=follower.from.z+(follower.to.z-follower.from.z)*k,fy=follower.from.y+(follower.to.y-follower.from.y)*k;
    const ddx=follower.to.x-follower.from.x,ddz=follower.to.z-follower.from.z;if(Math.abs(ddx)+Math.abs(ddz)>.01)turnTo(FM.group,Math.atan2(ddx,ddz),.3);
    FM.group.position.set(fx,fy+Math.abs(Math.sin(t*6))*(P.moving?.12:.03),fz);followerBlob.position.set(fx,fy+.02,fz);
    if(!P.moving)follower.from=follower.to;
  }
  target.lerp(new THREE.Vector3(px,py,pz),still?1:.12);
  if(L.update)L.update(t);
  L.actors.forEach(m=>{if(!m.group.visible)return;turnTo(m.group,m.targetRot,.15);if(m.hop)m.group.position.y=m.base+Math.abs(Math.sin(t*2.6+m.ph))*.16;else if(m.legL)animHuman(m,t,false,0);});
  if(dlg&&dlg.chars<dlg.lines[dlg.i].length){dlg.chars+=dt*48;renderDlg();}
  for(let i=0;i<PN;i++){const s=pSeed[i];pPos[i*3]=target.x+((s*13.7+t*.05)%1-.5)*28+Math.sin(t*.4+s)*.3;pPos[i*3+1]=target.y+.6+((s*.37+t*.08)%1)*3;pPos[i*3+2]=target.z+((s*7.3)%1-.5)*20+Math.cos(t*.3+s)*.3;}
  pGeo.attributes.position.needsUpdate=true;
  updateCamera();renderer.render(scene,camera);requestAnimationFrame(frame);
}
frame();
