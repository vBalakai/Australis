/* Australis: helpers that build terrain, buildings, props and sprites */
/* ================= builders ================= */
const M=o=>new THREE.MeshStandardMaterial(Object.assign({roughness:1,metalness:0},o));
function sideMat(tex,len,h,top){const t=rep(tex,len,h);if(top)t.offset.y=1-h;return M({map:t});}
function groundBox(x0,x1,z0,z1,y0,y1,top,side){
  const w=x1-x0,d=z1-z0,h=y1-y0,st=side||T.cliff,topAlign=st===T.cliff;
  const mats=[sideMat(st,d,h,topAlign),sideMat(st,d,h,topAlign),M({map:rep(top,w,d)}),M({color:'#4a3220'}),sideMat(st,w,h,topAlign),sideMat(st,w,h,topAlign)];
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mats);m.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);m.receiveShadow=true;add(m);return m;
}
function slab(x0,x1,z0,z1,y,h,top,side){
  const w=x1-x0,d=z1-z0,sm=M({color:side||'#c9ae7c'});
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),[sm,sm,M({map:rep(top,w,d)}),sm,sm,sm]);
  m.position.set((x0+x1)/2,y+h/2,(z0+z1)/2);m.receiveShadow=true;m.castShadow=h>.1;add(m);return m;
}
function mesh(geo,mat,x,y,z,parent){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;(parent||PARENT).add(m);return m;}
/* sprites are upright planes turned to face the locked camera, so they never lean back into walls */
const matCache=new Map(),depthCache=new Map(),spriteMats=[],billboards=[];
const planeGeo=new THREE.PlaneGeometry(1,1);planeGeo.translate(0,.5,0);
const BB_Y=1.38;
function smat(tex){if(!matCache.has(tex)){const m=new THREE.MeshBasicMaterial({map:tex,alphaTest:.5,side:THREE.DoubleSide,fog:true});matCache.set(tex,m);spriteMats.push(m);}return matCache.get(tex);}
function depthFor(tex){if(!depthCache.has(tex))depthCache.set(tex,new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:tex,alphaTest:.5,side:THREE.DoubleSide}));return depthCache.get(tex);}
function orientBillboards(yaw){billboards.forEach(b=>{b.rotation.y=yaw;});}
const blobGeo=new THREE.CircleGeometry(1,16),blobMat=new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.24,depthWrite:false});
function blob(x,y,z,r,parent){const b=new THREE.Mesh(blobGeo,blobMat);b.rotation.x=-Math.PI/2;b.scale.set(r,r*.8,1);b.position.set(x,y+.02,z);(parent||PARENT).add(b);return b;}
function spr(tex,x,y,z,sx,sy,shadow,cast){const s=new THREE.Mesh(planeGeo,smat(tex));s.position.set(x,y,z);s.scale.set(sx,sy*BB_Y,1);add(s);billboards.push(s);if(cast){s.castShadow=true;s.customDepthMaterial=depthFor(tex);}if(shadow)s.userData.blob=blob(x,y,z,shadow);return s;}
const railMat=M({color:'#6a4020'}),metal=M({color:'#9aa2ac',flatShading:true}),lightMetal=M({color:'#e4e8ec',flatShading:true});
const rockMat=M({color:'#a49a8a',flatShading:true});
const glowMat=new THREE.MeshBasicMaterial({color:'#ffd27a',transparent:true,opacity:.92});
const glows=[],lamps=[],lampMats=[];
function glowAt(x,y,z,w,h){const g=new THREE.Mesh(new THREE.PlaneGeometry(w,h),glowMat);g.position.set(x,y,z);g.visible=false;add(g);glows.push(g);}
function pointLamp(x,y,z){const l=new THREE.PointLight('#ffc878',0,6,1.6);l.position.set(x,y,z);add(l);lamps.push(l);}
function house(o){
  const W=o.W||5,D=o.D||3,H=o.H||1.5,oh=.32,rh=o.rh||1.25,cx=o.cx,cz=o.cz,y=o.y;
  const wt=o.wall||T.wall;
  const sideM=M({map:rep(wt,D,H)}),backM=M({map:rep(wt,W,H)}),plain=M({color:'#e6d8b6'});
  mesh(new THREE.BoxGeometry(W,H,D),[sideM,sideM,plain,plain,M({map:o.front}),backM],cx,y+H/2,cz);
  const s=new THREE.Shape();s.moveTo(-D/2-oh,0);s.lineTo(D/2+oh,0);s.lineTo(0,rh);s.lineTo(-D/2-oh,0);
  const geo=new THREE.ExtrudeGeometry(s,{depth:W+.5,bevelEnabled:false});geo.rotateY(Math.PI/2);geo.center();
  mesh(geo,[M({map:rep(wt,1,1)}),M({map:rep(o.roof,1,1)})],cx,y+H+rh/2,cz);
  if(o.chimney!==false)mesh(new THREE.BoxGeometry(.5,1,.5),M({color:'#8a7a70'}),cx+W*.28,y+H+.75,cz-.55);
  mesh(new THREE.BoxGeometry(1.4,.12,.5),M({color:'#c8b890'}),cx,y+.06,cz+D/2+.25);
  return {front:cz+D/2,top:y+H};
}
function signAt(x,y,z){mesh(new THREE.BoxGeometry(.1,.6,.1),railMat,x,y+.3,z);const sm=M({color:'#5a3a1a'});mesh(new THREE.BoxGeometry(.9,.55,.08),[sm,sm,sm,sm,M({map:T.sign}),sm],x,y+.75,z);}
function streetLamp(x,y,z,col){
  mesh(new THREE.CylinderGeometry(.05,.08,1.9,6),M({color:col||'#3a3a44'}),x,y+.95,z);
  const lm=M({color:'#fff4d0',emissive:'#ffd27a',emissiveIntensity:0});lampMats.push(lm);
  mesh(new THREE.BoxGeometry(.3,.32,.3),lm,x,y+2.05,z);mesh(new THREE.ConeGeometry(.26,.18,4),M({color:col||'#3a3a44',flatShading:true}),x,y+2.3,z).rotation.y=Math.PI/4;
  pointLamp(x,y+2,z+.3);
}
function fenceRect(x0,x1,z0,z1,gap){ /* gap: {side:'w'|'e', z0, z1} */
  const post=new THREE.BoxGeometry(.12,.55,.12),postM=M({color:'#9a6830'}),railM=M({color:'#c08848'});
  const rail=(ax,az,bx,bz)=>{const len=Math.hypot(bx-ax,bz-az);[.24,.42].forEach(h=>{const r=mesh(new THREE.BoxGeometry(len,.05,.05),railM,(ax+bx)/2,h,(az+bz)/2);r.rotation.y=-Math.atan2(bz-az,bx-ax);});};
  for(let x=x0;x<=x1;x++){mesh(post,postM,x,.275,z0);mesh(post,postM,x,.275,z1);}
  for(let z=z0+1;z<z1;z++){mesh(post,postM,x1,.275,z);mesh(post,postM,x0,.275,z);}
  rail(x0,z0,x1,z0);rail(x0,z1,x1,z1);rail(x1,z0,x1,z1);
  if(gap){rail(x0,z0,x0,gap.z0);rail(x0,gap.z1,x0,z1);}else rail(x0,z0,x0,z1);
}
function hills(list){const cols=['#6f9a52','#86a85a','#5d8a4a','#9aa860','#7a9c56'];list.forEach((h,i)=>{const m=mesh(new THREE.IcosahedronGeometry(1,0),M({color:cols[i%5],flatShading:true}),h[0],h[1],h[2]);m.scale.set(h[3],h[4],h[5]);m.rotation.y=rnd()*3;m.castShadow=false;});}
function rocksAt(list){list.forEach(r=>{const m=mesh(new THREE.DodecahedronGeometry(r[3]||(.32+rnd()*.2),0),rockMat,r[0],r[1]+.12,r[2]);m.rotation.set(rnd()*3,rnd()*3,0);});}
