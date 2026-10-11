/* Australis: shared props for the cities and gyms (Queenslanders, palms, boats, towers, airports, gym buildings, interiors) */

/* ---- extra textures ---- */
T.sand=canvasTex(16,16,f=>{f('#ecd9a4',0,0,16,16);f('#d8c48c',3,4);f('#d8c48c',11,9);f('#d8c48c',6,13);f('#f8ecc4',9,3);f('#f8ecc4',2,10);f('#f8ecc4',13,14);});
T.tarmac=canvasTex(16,16,f=>{f('#5a5e66',0,0,16,16);f('#4c5058',3,5,2,1);f('#6a6e76',10,11,2,1);f('#4c5058',12,2);});
T.redEarth=canvasTex(16,16,f=>{f('#b8643a',0,0,16,16);f('#a0542e',2,4,2,1);f('#a0542e',9,9);f('#a0542e',13,13,2,1);f('#cc7a4a',6,2);f('#cc7a4a',12,6);f('#cc7a4a',4,12);});
T.mud=canvasTex(16,16,f=>{f('#6a5a3c',0,0,16,16);f('#5a4a30',4,4,3,1);f('#7a6a48',10,10,2,1);f('#5a4a30',12,3);});
T.metal=canvasTex(16,16,f=>{f('#6a7280',0,0,16,16);f('#585f6c',0,15,16,1);f('#585f6c',15,0,1,16);f('#8a92a0',0,0,16,1);f('#8a92a0',0,0,1,16);[[3,3],[12,3],[3,12],[12,12]].forEach(p=>f('#4a505c',p[0],p[1]));});
T.conduit=canvasTex(16,16,f=>{f('#3a4050',0,0,16,16);f('#c89a20',7,0,2,16);f('#fff0a0',7,0,1,16);f('#2a3040',0,0,16,1);});
T.lattice=canvasTex(16,16,f=>{f('#3a3028',0,0,16,16);for(let i=0;i<16;i++){f('#e8e0d0',i,i);f('#e8e0d0',15-i,i);f('#e8e0d0',(i+8)%16,i);f('#e8e0d0',(23-i)%16,i);}});
T.hedge=canvasTex(16,16,f=>{f('#3e8a3a',0,0,16,16);[[2,3],[9,1],[13,7],[5,10],[11,13],[1,14]].forEach(p=>{f('#58a848',p[0],p[1],3,2);f('#2e6a2a',p[0]+1,p[1]+2,2,1);});});
T.reefFloor=canvasTex(16,16,f=>{f('#3fb0b8',0,0,16,16);f('#e86a7a',2,3,3,2);f('#f0a040',10,2,2,3);f('#9a5ad0',6,10,3,2);f('#f0e070',12,11,2,2);f('#2a8a98',0,7,16,1);});
T.boardwalk=canvasTex(16,16,f=>{f('#a87a50',0,0,16,16);[3,7,11,15].forEach(y=>f('#7a5434',0,y,16,1));f('#c0946a',0,0,16,1);});
const balustrade=canvasTex(16,8,f=>{f('#f4f0e6',0,0,16,1);f('#f4f0e6',0,6,16,2);[1,5,9,13].forEach(x=>f('#f4f0e6',x,1,2,5));});
T.louvreFront=canvasTex(80,24,f=>{f('#e8e4d8',0,0,80,24);for(let y=2;y<24;y+=3)f('#c0bcae',0,y,80,1);[6,54].forEach(x=>{f('#5a6a7a',x,4,20,12);for(let y=5;y<16;y+=2)f('#8a9aaa',x+1,y,18,1);});f('#3a2a2a',32,6,16,18);f('#4a8a8a',34,8,12,16);f('#f0c040',42,16,2,2);});
T.terminalFront=canvasTex(96,29,f=>{
  f('#dfe4ea',0,0,96,29);f('#2ea89a',0,0,96,4);f('#ffffff',6,1,24,2);
  for(let x=2;x<94;x+=8){f('#4a7aa8',x,6,7,17);f('#7aa8d4',x,6,7,6);}
  f('#3a4048',0,24,96,5);f('#2a3038',36,7,24,22);f('#88c8e8',38,9,20,20);f('#2a3038',47,9,2,20);f('#ffffff',40,11,3,6);
});
const TOWER_GLOW=canvasTex(16,16,f=>{f('#000000',0,0,16,16);[[1,1],[9,1],[5,5],[13,5],[1,9],[9,13],[13,9],[5,13]].forEach(p=>f('#ffffff',p[0],p[1],3,2));});
const towerTexCache={};
function towerTex(base,win){const k=base+win;if(!towerTexCache[k])towerTexCache[k]=canvasTex(16,16,f=>{f(base,0,0,16,16);for(let y=1;y<16;y+=4)for(let x=1;x<16;x+=4)f(win,x,y,3,2);});return towerTexCache[k];}
const MANGROVE=canvasTex(32,40,f=>{
  [[6,26,10,38],[12,28,13,38],[20,28,19,38],[26,26,22,38],[16,27,16,38]].forEach(r=>{const steps=10;for(let i=0;i<=steps;i++){const x=Math.round(r[0]+(r[2]-r[0])*i/steps),y=Math.round(r[1]+(r[3]-r[1])*i/steps);f('#6a5034',x,y,2,1);}});
  const blobs=[[16,13,11],[8,17,7],[24,17,7],[16,8,7]];
  const inside=(x,y)=>blobs.some(b=>(x+.5-b[0])*(x+.5-b[0])+(y+.5-b[1])*(y+.5-b[1])<b[2]*b[2]);
  for(let y=0;y<28;y++)for(let x=0;x<32;x++){if(!inside(x,y))continue;const edge=!inside(x-1,y)||!inside(x+1,y)||!inside(x,y-1)||!inside(x,y+1);const dl=Math.hypot(x-11,y-7)+((x*7+y*13)%5)*.7;f(edge?'#1e3a22':dl<6?'#7aa858':dl<11?'#4e8a44':'#356a34',x,y);}
});
T.spear=canvasTex(12,18,f=>{[1,4,7,10].forEach((x,i)=>{const o=i%2*2;f('#8a7a2a',x+1,o+3,1,15-o);f('#c8b450',x,o+2,1,16-o);f('#e8d888',x,o,1,3);});});

/* ---- shared materials and animated prop lists ---- */
const GLASS=new THREE.MeshStandardMaterial({color:'#cdeefe',roughness:.1,metalness:.1,transparent:true,opacity:.3,depthWrite:false,side:THREE.DoubleSide});
const palms=[],boats=[],orbs=[];

/* Queenslander (or a Top End stilt house): raised on stumps, veranda across the front, corrugated gable roof */
function qlder(o){
  const W=o.W||5,D=o.D||3,cx=o.cx,cz=o.cz,y=o.y||0,lift=o.lift||.55,H=1.35,rh=o.rh||1.1;
  const g=new THREE.Group();g.position.set(cx,y,cz);add(g);
  const stump=mc(o.stump||'#7a6a5a'),trim=mc(o.trim||'#f4f0e6');
  [-W/2+.25,-W/4,0,W/4,W/2-.25].forEach(x=>[-D/2+.25,D/2-.25].forEach(z=>mesh(new THREE.BoxGeometry(.14,lift,.14),stump,x,lift/2,z,g)));
  if(o.lattice!==false)mesh(new THREE.BoxGeometry(W-.1,lift-.04,.04),M({map:rep(T.lattice,W,lift*2)}),0,(lift-.04)/2,D/2-.2,g);
  mesh(new THREE.BoxGeometry(W,.1,D),M({map:rep(T.wood,W,D)}),0,lift+.05,0,g);
  const bodyD=D-1,bodyZ=-.5,wt=o.wallTex||T.wall;
  const wall=M({map:rep(wt,bodyD,H)}),back=M({map:rep(wt,W-.4,H)}),plain=M({color:'#d8ccb0'});
  mesh(new THREE.BoxGeometry(W-.4,H,bodyD),[wall,wall,plain,plain,M({map:o.front}),back],0,lift+.1+H/2,bodyZ,g);
  for(let i=0;i<5;i++)mesh(new THREE.BoxGeometry(.08,H,.08),trim,-W/2+.12+i*(W-.24)/4,lift+.1+H/2,D/2-.08,g);
  const bm=new THREE.MeshStandardMaterial({map:rep(balustrade,W*2,1),alphaTest:.5,side:THREE.DoubleSide,roughness:1});
  const bal=mesh(new THREE.PlaneGeometry(W-.2,.5),bm,0,lift+.35,D/2-.08,g);bal.castShadow=false;
  for(let i=0;i<3;i++){const h=lift-i*lift/3;mesh(new THREE.BoxGeometry(.8,h,.28),M({map:rep(T.wood,1,1)}),W/2-.6,h/2,D/2+.14+i*.28,g);}
  const s=new THREE.Shape(),hw=D/2+.25;s.moveTo(-hw,0);s.lineTo(hw,0);s.lineTo(0,rh);s.lineTo(-hw,0);
  const geo=new THREE.ExtrudeGeometry(s,{depth:W+.4,bevelEnabled:false});geo.rotateY(Math.PI/2);geo.center();
  mesh(geo,[M({map:rep(wt,1,1)}),M({map:rep(o.roof,1,1)})],0,lift+.1+H+rh/2,0,g);
  const fz=cz+bodyZ+bodyD/2+.01,wy=y+lift+.1+H-.59;
  glowAt(cx-1.38,wy,fz,.76,.44);glowAt(cx+1.38,wy,fz,.76,.44);pointLamp(cx,y+lift+1.2,cz+D/2);
  return g;
}

/* low-poly palm with a gently swaying crown */
const PALM_TRUNK=mc('#8a6a48'),PALM_LEAF=mc('#3f8f3a'),PALM_LEAF2=mc('#5aae4a'),NUT=mc('#6a4a2a');
function palm(x,y,z,s,lean){
  s=s||1;lean=lean||0;
  const g=new THREE.Group();g.position.set(x,y,z);g.scale.setScalar(s);add(g);
  let px=0,py=0;const segs=6,h=2.6;
  for(let i=0;i<segs;i++){const r=.11-.01*i;mesh(new THREE.CylinderGeometry(r*.9,r,h/segs+.02,6),PALM_TRUNK,px,py+h/segs/2,0,g);px+=lean*(i/segs)*.14;py+=h/segs;}
  const top=new THREE.Group();top.position.set(px,py,0);g.add(top);
  for(let i=0;i<8;i++){const fr=new THREE.Group();fr.rotation.y=i/8*Math.PI*2+rnd()*.3;top.add(fr);const leaf=mesh(new THREE.BoxGeometry(.24,.03,1.3),i%2?PALM_LEAF:PALM_LEAF2,0,-.15,.6,fr);leaf.rotation.x=.5;}
  [0,1,2].forEach(i=>{const a=i*2.1;mesh(new THREE.IcosahedronGeometry(.09,0),NUT,px+Math.cos(a)*.12,py-.14,Math.sin(a)*.12,g);});
  g.userData.top=top;g.userData.ph=rnd()*6;palms.push(g);blob(x,y,z,.55*s);
  return g;
}

/* flat triangular bow: half-width w, length len (positive points +Z, negative points -Z), depth h downward from y */
function bowPrism(w,len,h,col,x,y,z,parent){
  const s=new THREE.Shape();s.moveTo(-w,0);s.lineTo(w,0);s.lineTo(0,len);s.lineTo(-w,0);
  const geo=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:false});geo.rotateX(Math.PI/2);
  return mesh(geo,mc(col),x,y,z,parent);
}
/* small boat that bobs on the water */
function boat(x,y,z,o){
  o=o||{};const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=o.rot||0;add(g);const len=o.len||2.4;
  const hull=mc(o.hull||'#f4f4f0'),stripe=mc(o.stripe||'#2e6aa8');
  mesh(new THREE.BoxGeometry(len,.42,.9),hull,0,.1,0,g);
  const bow=mesh(new THREE.ConeGeometry(.64,.7,4),hull,len/2+.33,.1,0,g);bow.rotation.z=-Math.PI/2;bow.rotation.x=Math.PI/4;bow.scale.set(1,1,.7);
  mesh(new THREE.BoxGeometry(len+.02,.08,.92),stripe,0,.25,0,g);
  if(o.cabin!==false){mesh(new THREE.BoxGeometry(len*.36,.42,.72),hull,-len*.15,.52,0,g);mesh(new THREE.BoxGeometry(len*.37,.16,.74),mc('#3a5a7a'),-len*.15,.6,0,g);}
  if(o.mast)mesh(new THREE.CylinderGeometry(.03,.03,2.4,5),mc('#d8d8d8'),.1,1.4,0,g);
  g.userData.ph=rnd()*6;g.userData.y=y;boats.push(g);
  return g;
}

/* city tower; its windows light up at night */
function tower(x,z,w,h,d,base,win){
  const m=M({map:rep(towerTex(base,win),w,h/1.2),roughness:.55,metalness:.25,emissive:'#ffd27a',emissiveMap:rep(TOWER_GLOW,w,h/1.2),emissiveIntensity:0});lampMats.push(m);
  const t=mesh(new THREE.BoxGeometry(w,h,d),m,x,h/2,z);t.castShadow=false;
  mesh(new THREE.BoxGeometry(w*.7,.3,d*.7),mc('#8a929c'),x,h+.15,z).castShadow=false;
  if(h>9)mesh(new THREE.CylinderGeometry(.04,.06,1.6,5),mc('#c8ccd0'),x,h+1.1,z).castShadow=false;
}

/* Australis Air terminal with a control tower */
function terminal(r,y){
  y=y||0;const {cx,cz,W,D}=r,H=1.9;
  const side=M({color:'#cfd6de'});
  mesh(new THREE.BoxGeometry(W,H,D),[side,side,side,side,M({map:T.terminalFront}),side],cx,y+H/2,cz);
  const roof=mesh(new THREE.BoxGeometry(W+.6,.16,D+.6),mc('#f0f2f4'),cx,y+H+.1,cz);roof.rotation.x=-.06;
  const tx=cx+W/2-.7,tz=cz-D/2+.7;
  mesh(new THREE.CylinderGeometry(.3,.38,2.6,8),M({color:'#e8ecf0',flatShading:true}),tx,y+H+1.3,tz);
  mesh(new THREE.CylinderGeometry(.62,.5,.55,8),M({color:'#5ab0d0',roughness:.2,metalness:.3,flatShading:true}),tx,y+H+2.88,tz);
  mesh(new THREE.CylinderGeometry(.7,.7,.1,8),mc('#2a3038'),tx,y+H+3.2,tz);
  mesh(new THREE.BoxGeometry(1.6,.36,.1),mc('#2ea89a'),cx-W/4,y+H+.4,cz+D/2+.2);
  glowAt(cx,y+.6,cz+D/2+.02,1.2,1.15);
}
/* parked plane in Australis Air colours, facing +X by default */
function plane(x,y,z,rot){
  const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=rot||0;add(g);
  const white=mc('#f4f6f8'),teal=mc('#2ea89a'),grey=mc('#9aa2ac'),dark=mc('#2a3038');
  const fus=mesh(new THREE.CylinderGeometry(.42,.42,5,10),white,0,1.1,0,g);fus.rotation.z=Math.PI/2;
  const nose=mesh(new THREE.SphereGeometry(.42,10,6,0,Math.PI*2,0,Math.PI/2),white,2.5,1.1,0,g);nose.rotation.z=-Math.PI/2;
  const tail=mesh(new THREE.ConeGeometry(.42,1.2,10),white,-3.1,1.1,0,g);tail.rotation.z=Math.PI/2;
  mesh(new THREE.BoxGeometry(5.02,.1,.86),teal,0,.82,0,g);
  mesh(new THREE.BoxGeometry(1.2,.08,5.8),white,.2,.92,0,g);
  mesh(new THREE.BoxGeometry(.8,1.2,.08),teal,-3.3,1.85,0,g);
  mesh(new THREE.BoxGeometry(.5,.06,1.8),white,-3.3,1.2,0,g);
  [-1.5,1.5].forEach(z2=>{const e=mesh(new THREE.CylinderGeometry(.18,.2,.7,8),grey,.45,.72,z2,g);e.rotation.z=Math.PI/2;});
  mesh(new THREE.BoxGeometry(.3,.14,.6),dark,2.62,1.3,0,g);
  [[1.6,0],[-.3,.5],[-.3,-.5]].forEach(p=>mesh(new THREE.BoxGeometry(.12,.7,.12),dark,p[0],.35,p[1],g));
  return g;
}

/* Riverbend Gym: a botanic glasshouse with a barrel roof and a cupola */
function glasshouse(r,y){
  y=y||0;const {cx,cz,W,D}=r,H=1.3,FR=mc('#f4f6f2');
  mesh(new THREE.BoxGeometry(W,.35,D),mc('#c8bca0'),cx,y+.175,cz);
  const box=mesh(new THREE.BoxGeometry(W-.1,H,D-.1),GLASS,cx,y+.35+H/2,cz);box.castShadow=false;
  for(let i=0;i<=W;i++){[cz-D/2+.03,cz+D/2-.03].forEach(z=>mesh(new THREE.BoxGeometry(.06,H,.06),FR,cx-W/2+i,y+.35+H/2,z));}
  [cx-W/2+.03,cx+W/2-.03].forEach(x=>{for(let j=1;j<D;j++)mesh(new THREE.BoxGeometry(.06,H,.06),FR,x,y+.35+H/2,cz-D/2+j);});
  const roof=mesh(new THREE.CylinderGeometry(D/2,D/2,W,14,1,true,0,Math.PI),GLASS,cx,y+.35+H,cz);roof.rotation.z=Math.PI/2;roof.castShadow=false;
  for(let i=0;i<=W;i++){const rib=mesh(new THREE.TorusGeometry(D/2,.035,4,14,Math.PI),FR,cx-W/2+i,y+.35+H,cz);rib.rotation.y=Math.PI/2;}
  mesh(new THREE.BoxGeometry(W,.07,.07),FR,cx,y+.35+H+D/2,cz);
  const cup=mesh(new THREE.SphereGeometry(.85,12,6,0,Math.PI*2,0,Math.PI/2),GLASS,cx,y+.35+H+D/2-.25,cz);cup.castShadow=false;
  mesh(new THREE.TorusGeometry(.85,.04,4,16),FR,cx,y+.35+H+D/2-.25,cz).rotation.x=Math.PI/2;
  mesh(new THREE.ConeGeometry(.08,.5,6),mc('#e8b21e'),cx,y+.35+H+D/2+.85,cz);
  mesh(new THREE.BoxGeometry(1.2,1.25,.12),mc('#2f5a3a'),cx,y+.35+.62,cz+D/2+.02);
  mesh(new THREE.BoxGeometry(1.4,.12,.16),FR,cx,y+.35+1.3,cz+D/2+.03);
  for(let i=0;i<7;i++)spr(i%3?TREE.gum:TREE.jac,cx-W/2+.8+rnd()*(W-1.6),y+.35,cz-D/2+.6+rnd()*(D-1.4),1.1,1.4);
  glowAt(cx,y+.95,cz+D/2+.1,1,1);
}

/* Stormhaven Gym: a storm observatory with a lightning rod */
function observatory(r,y){
  y=y||0;const {cx,cz,W,D}=r,R=Math.min(W,D)/2-.15;
  mesh(new THREE.CylinderGeometry(R,R+.1,1.8,18),M({color:'#e4e8ec',flatShading:true}),cx,y+.9,cz);
  mesh(new THREE.CylinderGeometry(R+.03,R+.03,.22,18),mc('#f0c030'),cx,y+1.6,cz);
  mesh(new THREE.SphereGeometry(R,18,8,0,Math.PI*2,0,Math.PI/2),M({color:'#a8b2be',metalness:.6,roughness:.35,flatShading:true}),cx,y+1.8,cz);
  const slit=mesh(new THREE.BoxGeometry(.5,.08,R*1.2),mc('#2a3038'),cx,y+1.8+R*.62,cz+R*.42);slit.rotation.x=-.8;
  mesh(new THREE.CylinderGeometry(.04,.05,3.2,6),mc('#c8ccd0'),cx,y+1.8+R+1.4,cz);
  const orbM=M({color:'#fff4a0',emissive:'#ffd02a',emissiveIntensity:1.4});
  orbs.push(mesh(new THREE.IcosahedronGeometry(.22,1),orbM,cx,y+1.8+R+3.05,cz));
  const dish=mesh(new THREE.SphereGeometry(.5,10,5,0,Math.PI*2,0,Math.PI/2.6),M({color:'#eef2f6',flatShading:true,side:THREE.DoubleSide}),cx+R*.8,y+2.3,cz-R*.4);dish.rotation.z=1.1;
  mesh(new THREE.BoxGeometry(1.1,1.3,.3),mc('#2a3038'),cx,y+.65,cz+R-.08);
  mesh(new THREE.BoxGeometry(1.3,.12,.34),mc('#f0c030'),cx,y+1.36,cz+R-.06);
  glowAt(cx,y+.65,cz+R+.09,.9,1.1);
}

/* tesla pylon with a flickering orb */
function pylon(x,y,z,h){
  h=h||3.4;
  mesh(new THREE.CylinderGeometry(.07,.22,h,6),M({color:'#7a828e',flatShading:true}),x,y+h/2,z);
  for(let i=1;i<=3;i++)mesh(new THREE.TorusGeometry(.26-.04*i,.04,4,10),mc('#c89a40'),x,y+h*(.4+i*.15),z).rotation.x=Math.PI/2;
  const orbM=M({color:'#d8f0ff',emissive:'#7ac8ff',emissiveIntensity:1.2});
  orbs.push(mesh(new THREE.IcosahedronGeometry(.24,1),orbM,x,y+h+.15,z));
  blob(x,y,z,.35);
}

/* gym interior shell: floor, a tall back wall and low side walls, open to the camera like a Pokémon room */
function room(x0,x1,z0,z1,floorTex,wallTex,wallH){
  wallH=wallH||2.4;
  slab(x0-.3,x1+.3,z0,z1,-.2,.2,floorTex,'#24242c');
  const wm=M({map:rep(wallTex,x1-x0+.6,wallH)});
  mesh(new THREE.BoxGeometry(x1-x0+.6,wallH,.3),wm,(x0+x1)/2,wallH/2,z0-.15);
  const sm=M({map:rep(wallTex,z1-z0,.8)});
  mesh(new THREE.BoxGeometry(.3,.8,z1-z0),sm,x0-.15,.4,(z0+z1)/2);
  mesh(new THREE.BoxGeometry(.3,.8,z1-z0),sm,x1+.15,.4,(z0+z1)/2);
  slab(x0-60,x1+60,z0-40,z1+40,-.6,.02,T.concrete,'#101014').material[2].color.set('#0c0c12');
}

/* ---- shared town helpers ---- */
function boards(base,line){return canvasTex(16,16,f=>{f(base,0,0,16,16);[3,7,11,15].forEach(y=>f(line,0,y,16,1));});}
function healingCentre(r,y){house({cx:r.cx,cz:r.cz,y:y||0,W:r.W,D:r.D,H:2.2,rh:1.2,roof:T.roofTeal,front:T.centreFront,wall:T.labwall,chimney:false});glowAt(r.cx,(y||0)+.47,r.z1+.01,1.25,.94);}
function generalStore(r,y,awningCol){
  y=y||0;house({cx:r.cx,cz:r.cz,y,W:r.W,D:r.D,H:1.7,rh:1,roof:T.roofGreen,front:T.storeFront,chimney:false});
  const aw=mesh(new THREE.BoxGeometry(r.W,.05,.8),[mc(awningCol||'#e05040'),mc(awningCol||'#e05040'),M({map:rep(T.awning,r.W,1)}),mc('#a83028'),M({map:rep(T.awning,r.W,.1)}),mc('#e05040')],r.cx,y+1.25,r.z1+.32);aw.rotation.x=.38;
  [[-1.9,'#e09038'],[-1.4,'#58a840'],[1.4,'#e05040'],[1.9,'#f0d048']].forEach(c=>{mesh(new THREE.BoxGeometry(.42,.3,.36),mc('#b07c48'),r.cx+c[0],y+.15,r.z1+.3);mesh(new THREE.BoxGeometry(.36,.06,.3),mc(c[1]),r.cx+c[0],y+.33,r.z1+.3);});
  glowAt(r.cx-1.56,y+.63,r.z1+.01,1,.5);glowAt(r.cx+1.56,y+.63,r.z1+.01,1,.5);
}
function borderTrees(L,rows,cols,kinds,skip,yOf){
  const g=L.grid;const pick=()=>kinds[Math.floor(rnd()*kinds.length)];
  rows.forEach(ty=>{for(let tx=0;tx<g.W;tx+=1.15){if(skip&&skip(Math.round(tx),ty))continue;const [x,z]=g.w(tx,ty);spr(pick(),x+(rnd()-.5)*.4,yOf?yOf(x,z):0,z+(rnd()-.5)*.3,2*(.92+rnd()*.25),2.5*(.92+rnd()*.25),.55,true);}});
  cols.forEach(tx=>{for(let ty=0;ty<g.H;ty+=1.1){if(skip&&skip(tx,Math.round(ty)))continue;const [x,z]=g.w(tx,ty);spr(pick(),x+(rnd()-.5)*.3,yOf?yOf(x,z):0,z+(rnd()-.5)*.3,2*(.95+rnd()*.2),2.5*(.95+rnd()*.2),.55,true);}});
}
function tileTree(L,tex,tx,ty,s){const [x,z]=L.grid.w(tx,ty);spr(tex,x,L.grid.h(tx,ty),z,2*(s||1),2.5*(s||1),.6*(s||1),true);L.grid.block(tx,ty);}
function tileSign(L,tx,ty,lines){const [x,z]=L.grid.w(tx,ty);signAt(x,L.grid.h(tx,ty),z);L.grid.block(tx,ty);L.talk.set(tx+','+ty,lines);}
function tileLamp(L,tx,ty,col){const [x,z]=L.grid.w(tx,ty);streetLamp(x,L.grid.h(tx,ty),z,col);L.grid.block(tx,ty);L.talk.set(tx+','+ty,['A street lamp. Moths love it at night.']);}
function waterPlane(x0,x1,z0,z1,y,tex,opts){
  opts=opts||{};const t=rep(tex,x1-x0,z1-z0);
  const m=add(new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,z1-z0),M({map:t,roughness:.3,transparent:true,opacity:opts.opacity||.9,color:opts.color||'#ffffff'})));
  m.rotation.x=-Math.PI/2;m.position.set((x0+x1)/2,y,(z0+z1)/2);m.receiveShadow=true;return t;
}
