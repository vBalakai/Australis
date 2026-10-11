/* Australis: Riverbend City (Brisbane), home of Gym 1, and Jacara's botanic glasshouse gym */

/* shared town helpers */
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
CHAR.jacara={skin:'#d8a070',hair:'#2a1a14',top:'#7a5ab8',stripe:'#b088e0',bottom:'#3a6a30',shoes:'#6a4020',hat:'#e8c870',bun:true};
CHAR.gardenerIvy={skin:'#f2c79a',hair:'#c86a3a',top:'#58a048',bottom:'#6a4a2a',shoes:'#3a2a20',hat:'#d8b860'};
CHAR.botanist={skin:'#c88a5a',hair:'#2a2a30',top:'#eef0f2',coat:'#eef0f2',bottom:'#3a4a6a',shoes:'#2a2a30',glasses:true};
CHAR.commuter={skin:'#e8b88a',hair:'#3a2a20',top:'#3a5a8a',bottom:'#2a2a30',shoes:'#2a2a30',bag:'#6a4a2a'};
CHAR.student={skin:'#f2c79a',hair:'#1a1a20',top:'#9a6ad8',bottom:'#2a3a6a',shoes:'#ffffff',bag:'#e05080',bun:true};
CHAR.jogger={skin:'#a8704a',hair:'#1a1a20',top:'#f05a5a',bottom:'#2a2a30',shoes:'#f0f0f0',cap:'#ffffff',logo:'#f05a5a'};

/* ================= Riverbend City ================= */
const RB=newLoc('riverbend',{name:'Riverbend City',sub:'Brisbane River · Gym 1 · Grass',yaw:0,grid:Grid(36,22,-18,-11)});
(function(L){
  PARENT=L.group;const g=L.grid;
  groundBox(-44,8,-32,26,-.6,0,T.grass);groundBox(11,46,-32,26,-.6,0,T.grass);groundBox(8,11,-32,26,-.6,-.45,T.bed);
  const wRiver=waterPlane(8,11,-32,26,-.16,T.water,{opacity:.9,color:'#cfe2d8'});
  /* streets, plaza, bridge */
  slab(-44,8,-2,0,0,.03,T.pave);slab(11,46,-2,0,0,.03,T.pave);
  slab(-15,-8,-4,-2,0,.025,T.path);slab(11,17,-4,-2,0,.025,T.pave);
  slab(7.6,11.4,-2.2,.2,0,.16,T.tarmac,'#5a6a7a');
  const steel=mc('#6a7a8c');
  [-2.2,.2].forEach(z=>{
    mesh(new THREE.BoxGeometry(3.9,.1,.1),steel,9.5,1.8,z);mesh(new THREE.BoxGeometry(3.9,.1,.1),steel,9.5,.3,z);
    for(let i=0;i<=4;i++)mesh(new THREE.BoxGeometry(.1,1.55,.1),steel,7.6+i*.95,1.05,z);
    for(let i=0;i<4;i++){const d=mesh(new THREE.BoxGeometry(1.75,.07,.07),steel,8.075+i*.95,1.05,z);d.rotation.z=(i%2?1:-1)*Math.atan2(1.5,.95);}
    [7.6,11.4].forEach(x=>mesh(new THREE.BoxGeometry(.24,2.6,.24),steel,x,1.3,z));
  });
  mesh(new THREE.BoxGeometry(3.9,.08,2.5),steel,9.5,1.85,-1).castShadow=true;
  mesh(new THREE.BoxGeometry(.6,.9,1.6),mc('#8a8478'),9.5,-.45,-1);
  /* CityCat ferry and a pontoon */
  slab(10.25,10.95,5,6.6,-.12,.18,T.boardwalk,'#5a3a20');
  const ferry=boat(9.1,-.08,3,{len:2.6,hull:'#f4f6f8',stripe:'#2e6aa8',rot:-Math.PI/2});ferry.scale.setScalar(.8);
  /* buildings */
  glasshouse(rectOf(L,3,3,9,6),0);
  healingCentre(rectOf(L,12,3,16,6));
  generalStore(rectOf(L,19,4,23,6));
  const tr=rectOf(L,29,3,34,6);terminal(tr,0);
  slab(18,32,-14,-4.5,0,.03,T.tarmac,'#3a3e46');
  plane(25,0,-9,Math.PI);
  const q=(a,c,b,d,wall,line,roof,door,doorHi)=>{const r=rectOf(L,a,c,b,d);qlder({cx:r.cx,cz:r.cz,W:r.W,D:r.D,wallTex:boards(wall,line),front:houseFront(wall,line,door,doorHi),roof});};
  q(2,12,6,14,'#f2ead8','#d8ccb0',T.roofRed,'#3a6a4a','#5a8a6a');
  q(9,12,13,14,'#cfe0ea','#aac0cc',T.roofGreen,'#8a3a2a','#aa5a4a');
  q(2,16,6,18,'#f4e2a8','#d8c488',T.roofRed,'#3a4a8a','#5a6aaa');
  /* skyline across the river, behind the trees */
  [[-4,-19,3,9,3,'#7aa0c0','#c8e0f4'],[0,-21,3.5,13,3.5,'#5a7a9a','#a8c8e4'],[4,-18.5,2.5,7,2.5,'#8a9aaa','#d8e4ee'],[13,-20,3,11,3,'#4a6a8a','#9ac0e0'],[17,-22,4,15,4,'#6a8aa8','#b8d4ec'],[21,-19,3,8,3,'#9aaab8','#e0e8f0'],[25,-21,3,10,3,'#5a7088','#a0bcd8'],[-9,-20,3,7,3,'#8aa0b4','#d0e0ec']].forEach(t=>tower(t[0],t[1],t[2],t[3],t[4],t[5],t[6]));
  /* trees, park, lamps, signs */
  const kinds=[TREE.gum,TREE.jac,TREE.gum,TREE.jac,TREE.gum];
  borderTrees(L,[0,1,20,21],[0,35],kinds,(tx,ty)=>(tx>=25&&tx<=29&&(ty<=1||ty>=20))||((tx===0)&&(ty===9||ty===10)));
  [[16,13],[19,12],[23,13],[17,17],[22,17],[20,19]].forEach(p=>tileTree(L,TREE.jac,p[0],p[1],1.05));
  for(let i=0;i<70;i++){const tx=15+rnd()*10,ty=12+rnd()*8;const [x,z]=g.w(tx,ty);spr(FLOWERS[4],x-.5,0,z-.5,.42,.42);}
  [[30,13],[33,16],[31,18]].forEach(p=>tileTree(L,TREE.gum,p[0],p[1],1));
  const bench=(tx,ty)=>{const [x,z]=g.w(tx,ty);const bm=mc('#b07040');mesh(new THREE.BoxGeometry(1,.08,.36),bm,x,.34,z);mesh(new THREE.BoxGeometry(1,.3,.06),bm,x,.55,z-.18);[-.42,.42].forEach(o=>mesh(new THREE.BoxGeometry(.08,.32,.3),railMat,x+o,.16,z));g.block(tx,ty);L.talk.set(tx+','+ty,['A park bench under the jacarandas. Purple petals drift down around you.']);};
  bench(19,15);bench(32,11);
  [[8,11],[15,11],[24,11],[34,11]].forEach(p=>tileLamp(L,p[0],p[1],'#2f3a4a'));
  tileSign(L,1,8,['RIVERBEND CITY','Where the river bends and the jacarandas bloom.']);
  tileSign(L,10,7,['RIVERBEND GYM','Leader: Jacara. "Rooted in patience, blooming with strength."']);
  tileSign(L,25,11,['THE BIG BEND','CityCat ferries run up and down the river all day.']);
  tileSign(L,29,8,['AUSTRALIS AIR','Flights to Coralport need the Jacaranda Badge.']);
  /* grid */
  g.block(26,0,28,21);g.open(26,9,28,10);for(let x=26;x<=28;x++){g.setH(x,9,.16);g.setH(x,10,.16);}
  g.block(3,3,9,6);g.block(12,3,16,6);g.block(19,4,23,6);g.block(29,3,34,6);
  g.block(2,12,6,14);g.block(9,12,13,14);g.block(2,16,6,18);
  g.block(0,0,35,1);g.block(0,20,35,21);g.block(0,0,0,21);g.open(0,9,0,10);g.block(35,0,35,21);
  markRect(L.paved,0,9,35,10);markRect(L.paved,3,7,9,8);markRect(L.paved,29,7,34,8);markRect(L.paved,15,12,25,19);
  door(L,6,6,{to:'rbgym',spawn:{tx:7,ty:15,face:[0,-1]}});
  door(L,14,6,{say:['Riverbend Healing Centre.','You rest for a moment. Your team feels refreshed!']});
  door(L,21,6,{say:['Riverbend General Store.','Potions, capture gear and mango smoothies. A sign says "Back in five minutes".']});
  door(L,31,6,{flight:true});door(L,32,6,{flight:true});
  L.talk.set('4,14',['A Queenslander on tall stumps. A cool breeze blows under the house.']);
  L.talk.set('11,14',['Nobody\'s home. A Warblet is singing on the veranda railing.']);
  L.talk.set('4,18',['A note on the door: "Gone to the markets at the river. Back by lunch!"']);
  L.airport={tx:31,ty:7,face:[0,1]};
  npc(L,()=>human(CHAR.commuter),11,8,['Jacara\'s glasshouse is the oldest building in Riverbend.','Some say the jacaranda inside it was the very first one in Australis.']);
  npc(L,()=>human(CHAR.student),18,14,['When the jacarandas bloom, uni exams are close.','Every Riverbend student knows that feeling!']);
  npc(L,()=>human(CHAR.jogger),31,15,['Morning! I run along the river every day.','Australis Air flies from that terminal, but only for trainers with a gym badge.']);
  L.spawn={tx:1,ty:9,face:[1,0]};
  L.exit=(tx,ty,dx)=>(tx<=0&&dx===-1)?{to:'bloom',spawn:{tx:30,ty:ty===9?7:8,face:[-1,0]},card:['Route 2','Valley farmland']}:null;
  scatterTufts(L,120,T.tuft,.2);
  /* falling jacaranda petals */
  const PETALS=60,pp=new Float32Array(PETALS*3),ps=[];
  for(let i=0;i<PETALS;i++){ps.push(rnd()*10);pp[i*3]=-3.5+rnd()*10;pp[i*3+2]=1+rnd()*8;}
  const pgeo=new THREE.BufferGeometry();pgeo.setAttribute('position',new THREE.BufferAttribute(pp,3));
  add(new THREE.Points(pgeo,new THREE.PointsMaterial({color:'#b08ae0',size:.12,depthWrite:false,transparent:true,opacity:.95})));
  L.update=t=>{
    wRiver.offset.y=-t*.12;
    for(let i=0;i<PETALS;i++){const s=ps[i];pp[i*3+1]=3.2-((s*.31+t*.18)%1)*3.2;pp[i*3]=-3.5+((s*.73)%1)*10+Math.sin(t*1.3+s)*.3;}
    pgeo.attributes.position.needsUpdate=true;
    ferry.position.z=2.5+((t*.7)%22);ferry.position.y=-.08+Math.sin(t*1.4)*.03;
    palms.forEach(p=>{if(p.parent===L.group)p.userData.top.rotation.z=Math.sin(t*.8+p.userData.ph)*.05;});
  };
})(RB);

/* ================= Riverbend Gym: the Botanic Glasshouse ================= */
const PANE=canvasTex(16,16,f=>{f('#bfe0d8',0,0,16,16);f('#d8f0ec',2,2,5,5);f('#f4f8f6',0,0,16,1);f('#f4f8f6',0,0,1,16);f('#f4f8f6',8,0,1,16);f('#f4f8f6',0,8,16,1);});
const RBG=newLoc('rbgym',{name:'Riverbend Gym',sub:'Botanic Glasshouse · Grass',yaw:0,indoor:true,grid:Grid(15,16,-7.5,-8)});
(function(L){
  PARENT=L.group;const g=L.grid;
  room(-7.5,7.5,-8,8,T.grass,PANE,2.8);
  slab(-1,1,-6,8,0,.02,T.path);slab(-6,6,4,5,0,.02,T.path);slab(-6,-4,-4,5,0,.02,T.path);slab(-6,6,-4,-3,0,.02,T.path);slab(-1,1,-4,0,0,.02,T.path);slab(4,6,-4,5,0,.02,T.path);
  const hedge=(a,b,ty)=>{const r=rectOf(L,a,ty,b,ty);slab(r.x0,r.x1,r.z0+.1,r.z1-.1,0,.7,T.hedge,'#2e6a2a');for(let i=0;i<(b-a+1)*2;i++)spr(FLOWERS[Math.floor(rnd()*5)],r.x0+.2+rnd()*(r.W-.4),.7,r.cz+(rnd()-.5)*.5,.42,.42);g.block(a,ty,b,ty);};
  hedge(1,10,12);hedge(4,13,8);hedge(1,5,4);hedge(9,13,4);
  const pond=rectOf(L,10,2,12,3);slab(pond.x0,pond.x1,pond.z0,pond.z1,0,.12,T.stone,'#8a8272');const wp=waterPlane(pond.x0+.15,pond.x1-.15,pond.z0+.15,pond.z1-.15,.13,T.water);g.block(10,2,12,3);
  talkRect(L,10,2,12,3,['A lily pond. A tiny Wattlet is napping on a lily pad.']);
  [[2,2],[4,2]].forEach(p=>{const [x,z]=g.w(p[0],p[1]);spr(TREE.gum,x,0,z,1.6,2,.5,true);g.block(p[0],p[1]);});
  const [jx,jz]=g.w(7,1);spr(TREE.jac,jx,0,jz-.2,4,5,1.2,true);
  for(let i=0;i<40;i++)spr(FLOWERS[4],jx-2+rnd()*4,0,jz-.3+rnd()*1.6,.42,.42);
  g.block(0,0,14,1);g.block(0,0,0,15);g.block(14,0,14,15);
  talkRect(L,1,12,10,12,['Neatly clipped hedges, dotted with flowers.']);talkRect(L,4,8,13,8,['Neatly clipped hedges, dotted with flowers.']);talkRect(L,1,4,5,4,['Bottlebrush hedges, buzzing with bees.']);talkRect(L,9,4,13,4,['Bottlebrush hedges, buzzing with bees.']);
  npc(L,()=>human(CHAR.gardenerIvy),12,10,['Gardener Ivy: "Jacara taught me to grow bottlebrush from seed!"','"Her Bristlet heals itself in the sunshine. Watch out for that."'],{rot:-Math.PI/2});
  npc(L,()=>human(CHAR.botanist),2,6,['Botanist Ken: "This glasshouse is over a hundred years old."','"Every plant in here came from a different corner of Australis."'],{rot:Math.PI/2});
  gymLeader(L,()=>human(CHAR.jacara),7,2,{badge:'jacaranda',
    intro:['Welcome to the Botanic Glasshouse! I\'m Jacara, Leader of the Riverbend Gym.','My Grass Pokémon grow slowly, with patience and plenty of sunshine.','Let\'s see if your partner has put down roots. Here I come!'],
    battle:['Gym Leader Jacara sent out Cottonee!','Cottonee scattered Stun Spore... but your partner shook it off!','Cottonee fainted! Jacara sent out Bristlet!','Bristlet used Mega Drain, but your partner held on!','Bristlet fainted!','Jacara: "What a lovely, steady battle. You\'ve earned this."','You received the Jacaranda Badge!','Australis Air will now fly you to Coralport.'],
    after:['The jacarandas always bloom a little brighter after a good battle.','Fly to Coralport next. Marlee will test you out on the water!']});
  L.spawn={tx:7,ty:15,face:[0,-1]};
  L.exit=(tx,ty,dx,dy)=>(ty>=15&&dy===1)?{to:'riverbend',spawn:{tx:6,ty:7,face:[0,1]}}:null;
  L.update=t=>{wp.offset.set(t*.03,t*.05);};
})(RBG);
