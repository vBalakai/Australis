/* Australis: Wattle Town, the start town on the Darling Downs */
/* ================= Wattle Town ================= */
const WT=newLoc('wattle',{name:'Wattle Town',sub:'Darling Downs · Start town',yaw:0,grid:Grid(32,24,-16,-12),wild:{day:['Warblet','Burrowlet','Warblet','Burrowlet'],night:['Possnack','Burrowlet','Possnack'],field:'wheat'}});
(function(L){
  PARENT=L.group;const g=L.grid;
  groundBox(-30,12,-26,-1.5,-.6,.5,T.grass);groundBox(14,30,-26,-1.5,-.6,.5,T.grass);groundBox(12,14,-26,-1.5,-.6,.15,T.bed);
  groundBox(-30,12,-1.5,22,-.6,0,T.grass);groundBox(14,30,-1.5,22,-.6,0,T.grass);groundBox(12,14,-1.5,22,-.6,-.32,T.bed);
  const wm=t=>M({map:t,roughness:.35,transparent:true,opacity:.92});
  const wN=rep(T.water,2,24.5),wS=rep(T.water,2,23.5),wF=rep(T.fall,2,.55);
  const a=add(new THREE.Mesh(new THREE.PlaneGeometry(2,24.5),wm(wN)));a.rotation.x=-Math.PI/2;a.position.set(13,.4,-13.75);a.receiveShadow=true;
  const b=add(new THREE.Mesh(new THREE.PlaneGeometry(2,23.5),wm(wS)));b.rotation.x=-Math.PI/2;b.position.set(13,-.1,10.25);b.receiveShadow=true;
  add(new THREE.Mesh(new THREE.PlaneGeometry(2,.52),M({map:wF,roughness:.3,emissive:'#1a3a6a',emissiveIntensity:.25}))).position.set(13,.15,-1.49);
  [12.4,13,13.6].forEach((x,i)=>spr(T.foam,x,-.12,-1.3+i*.05,.5,.38));
  slab(-14,12,-1,1,0,.03,T.path);slab(14,30,-1,1,0,.03,T.path);slab(-2,0,1,8,0,.03,T.path);
  slab(-9,-8,-4.6,-1.5,.5,.03,T.path);slab(4,5,-4.6,-1.5,.5,.03,T.path);slab(-9,-2,7,8,0,.03,T.path);slab(-9,-8,6,7,0,.03,T.path);
  [-9,4].forEach(x0=>{[[-1.5,-1.2,.375],[-1.2,-.9,.25],[-.9,-.6,.125]].forEach(s=>slab(x0,x0+1,s[0],s[1],0,s[2],T.path,'#a89a7c'));});
  slab(11.7,14.3,-1,1,0,.14,T.wood,'#86582e');
  [-1,1].forEach(z=>{mesh(new THREE.BoxGeometry(2.6,.07,.08),railMat,13,.42,z);[11.75,13,14.25].forEach(x=>mesh(new THREE.BoxGeometry(.1,.42,.1),railMat,x,.28,z));});
  house({cx:-8.5,cz:-6,y:.5,roof:T.roofRed,front:T.frontRed});
  house({cx:4.5,cz:-6,y:.5,roof:T.roofBlue,front:T.frontBlue});
  const labSide=M({map:rep(T.labwall,3.5,2)}),labBack=M({map:rep(T.labwall,9,2)}),labTop=M({color:'#dfe3e8'});
  mesh(new THREE.BoxGeometry(9,2,3.5),[labSide,labSide,labTop,labTop,M({map:T.labFront}),labBack],-8.5,1,4.25);
  mesh(new THREE.BoxGeometry(9.4,.22,3.9),M({map:rep(T.concrete,9.4,3.9)}),-8.5,2.11,4.25);
  const solarM=M({map:rep(T.solar,1.8,1.1),roughness:.5,metalness:.2});
  [[-11.6,3.4],[-9.5,3.4],[-11.6,5],[-9.5,5]].forEach(p=>{const m=mesh(new THREE.BoxGeometry(1.8,.06,1.1),solarM,p[0],2.45,p[1]);m.rotation.x=-.32;mesh(new THREE.BoxGeometry(.08,.3,.08),railMat,p[0],2.3,p[1]+.35);});
  mesh(new THREE.CylinderGeometry(.05,.05,.6,6),M({color:'#8890a0'}),-5.6,2.5,3.6);
  mesh(new THREE.SphereGeometry(.55,8,4,0,Math.PI*2,0,Math.PI/2.6),M({color:'#eef2f6',flatShading:true,side:THREE.DoubleSide}),-5.6,2.85,3.6).rotation.x=-2.3;
  const wmG=new THREE.Group();wmG.position.set(9.6,.5,-6.3);add(wmG);
  const up=new THREE.Vector3(0,1,0);
  [[-.55,-.55],[.55,-.55],[-.55,.55],[.55,.55]].forEach(c=>{const p0=new THREE.Vector3(c[0],0,c[1]),p1=new THREE.Vector3(c[0]*.18,3.2,c[1]*.18);const dir=p1.clone().sub(p0),len=dir.length();const leg=mesh(new THREE.CylinderGeometry(.045,.045,len,5),metal,0,0,0,wmG);leg.position.copy(p0.clone().add(p1).multiplyScalar(.5));leg.quaternion.setFromUnitVectors(up,dir.normalize());});
  [1,2.1].forEach(h=>{const s=1.1-(h/3.2)*.9;mesh(new THREE.BoxGeometry(s,.04,.04),metal,0,h,-s/2,wmG);mesh(new THREE.BoxGeometry(s,.04,.04),metal,0,h,s/2,wmG);mesh(new THREE.BoxGeometry(.04,.04,s),metal,-s/2,h,0,wmG);mesh(new THREE.BoxGeometry(.04,.04,s),metal,s/2,h,0,wmG);});
  mesh(new THREE.BoxGeometry(.32,.32,.6),metal,0,3.3,0,wmG);mesh(new THREE.BoxGeometry(.03,.45,1.1),lightMetal,0,3.35,-.8,wmG);
  const fan=new THREE.Group();fan.position.set(0,3.35,.4);wmG.add(fan);
  for(let i=0;i<12;i++){const bl=mesh(new THREE.BoxGeometry(.16,.62,.02),lightMetal,0,0,0,fan);const an=i/12*Math.PI*2;bl.position.set(Math.sin(an)*.5,Math.cos(an)*.5,0);bl.rotation.z=-an;}
  mesh(new THREE.TorusGeometry(.82,.025,4,24),metal,0,0,0,fan);
  mesh(new THREE.CylinderGeometry(.72,.72,1.35,14),M({map:rep(T.tank,4.5,1.35),roughness:.6,metalness:.3}),8,1.175,-5);
  mesh(new THREE.CylinderGeometry(.05,.8,.32,14),M({color:'#c8ced4',flatShading:true}),8,2.01,-5);
  slab(1,11,3,8,0,.06,T.dirt,'#6a4628');
  const wheat=[];
  for(let i=0;i<20;i++)for(let j=0;j<10;j++){const x=1.25+i*.5+(rnd()-.5)*.12,z=3.2+j*.5+(rnd()-.5)*.1;const s=spr(T.wheat,x,.06,z,.6,.82);s.userData.x=x;s.userData.z=z;wheat.push(s);}
  spr(T.scare,6.5,.06,5.5,1,1.5,.35);
  fenceRect(0,11,2,8,{z0:4,z1:5});
  const hay=(x,z)=>{const m=mesh(new THREE.CylinderGeometry(.34,.34,.52,10),[M({color:'#e0b858',flatShading:true}),M({color:'#c89a3c'}),M({color:'#c89a3c'})],x,.34,z);m.rotation.z=Math.PI/2;};
  hay(-3.5,2.6);hay(-2.9,3.5);
  const ute=new THREE.Group();ute.position.set(-3.1,0,5.5);ute.rotation.y=Math.PI/2;add(ute);
  const red=M({color:'#c84838',flatShading:true});
  mesh(new THREE.BoxGeometry(2,.36,.9),red,0,.42,0,ute);mesh(new THREE.BoxGeometry(.8,.42,.86),red,.4,.8,0,ute);mesh(new THREE.BoxGeometry(.06,.3,.74),M({color:'#a8d8f8',roughness:.2}),.81,.82,0,ute);
  [[-.65,.47],[.65,.47],[-.65,-.47],[.65,-.47]].forEach(w=>{mesh(new THREE.CylinderGeometry(.2,.2,.14,10),M({color:'#2a2a2a'}),w[0],.2,w[1],ute).rotation.x=Math.PI/2;});
  signAt(1.5,.5,-2.5);signAt(10.5,.5,-2.5);
  const mailbox=(x,z,c)=>{mesh(new THREE.BoxGeometry(.08,.6,.08),railMat,x,.8,z);mesh(new THREE.BoxGeometry(.32,.24,.44),M({color:c}),x,1.2,z);mesh(new THREE.BoxGeometry(.04,.2,.06),M({color:'#e84848'}),x+.18,1.32,z-.1);};
  mailbox(-9.5,-3.5,'#4878c8');mailbox(5.5,-3.5,'#d05038');
  const benchM=M({color:'#b07040'});mesh(new THREE.BoxGeometry(1.1,.08,.36),benchM,-1.5,.84,-3.4);mesh(new THREE.BoxGeometry(1.1,.3,.06),benchM,-1.5,1.05,-3.58);[-1.95,-1.05].forEach(x=>mesh(new THREE.BoxGeometry(.08,.32,.3),railMat,x,.66,-3.4));
  streetLamp(-2.5,.5,-2.5);
  rocksAt([[11.5,.5,-3.5],[11.5,0,3.5],[14.8,0,6],[11.6,.5,-9],[-14,.5,-4.5],[7.5,0,9.5]]);
  [-8.5,4.5].forEach(cx=>{glowAt(cx-1.5,1.34,-4.48,.76,.44);glowAt(cx+1.5,1.34,-4.48,.76,.44);pointLamp(cx,1.4,-3.8);});
  glowAt(-11.25,1.06,6.01,2.26,.62);glowAt(-5.75,1.06,6.01,2.26,.62);glowAt(-8.5,.55,6.01,1.26,1.4);pointLamp(-8.5,1.2,6.8);
  const kinds=[TREE.gum,TREE.gum,TREE.olive,TREE.gum,TREE.olive,TREE.wattle],pick=()=>kinds[Math.floor(rnd()*kinds.length)];
  const inCreek=x=>x>11.2&&x<14.8,gy=(x,z)=>(z<-1.5&&!inCreek(x))?.5:0;
  const treeAt=(x,z,tex,s)=>spr(tex,x,gy(x,z),z,2*s,2.5*s,.6*s,true);
  for(let x=-15.6;x<=15.6;x+=1.15){[-11.5,-10.5,10.6,11.6].forEach(z=>{const X=x+(rnd()-.5)*.45,Z=z+(rnd()-.5)*.3;if(inCreek(X))return;treeAt(X,Z,pick(),.92+rnd()*.25);});}
  for(let z=-9.6;z<=9.6;z+=1.15){[-15.3,-14.3].forEach(x=>treeAt(x+(rnd()-.5)*.3,z+(rnd()-.5)*.4,pick(),.92+rnd()*.25));if(Math.abs(z)>1.5)[14.8,15.7].forEach(x=>treeAt(x+(rnd()-.5)*.3,z+(rnd()-.5)*.4,pick(),.92+rnd()*.25));}
  for(let i=0;i<90;i++){const X=(rnd()*2-1)*28,Z=-24+rnd()*39;if(Math.abs(X)<16.6&&Z>-12.6&&Z<12.6)continue;if(inCreek(X))continue;treeAt(X,Z,pick(),.95+rnd()*.35);}
  const hl=[];for(let i=0;i<12;i++)hl.push([-30+i*5.4+rnd()*2,.2,-23-rnd()*4,4+rnd()*3,2.2+rnd()*3,3+rnd()*2]);
  [-1,1].forEach(sd=>{for(let i=0;i<6;i++)hl.push([sd*(25+rnd()*4),.1,-14+i*5.5,3+rnd()*2,1.6+rnd()*2,3+rnd()*2]);});hills(hl);
  spr(TREE.wattle,-1.5,.5,-5.5,4,5,1.1,true);
  treeAt(-12.5,-2.5,TREE.wattle,1);treeAt(-4.5,-2.5,TREE.wattle,1);treeAt(-4.5,-7.5,TREE.gum,1);treeAt(-13.5,5.5,TREE.gum,.95);
  [[-7.6,-4],[-7.1,-3.85],[-6.6,-4],[2.4,-4],[2.9,-3.85],[3.4,-4]].forEach((p,i)=>spr(FLOWERS[i%4],p[0],.5,p[1],.42,.42));

  /* walkability: x=tx, y=ty; world X=tx-16+.5, Z=ty-12+.5 */
  for(let y=0;y<24;y++)for(let x=0;x<32;x++)g.setH(x,y,y<=9?.5:0);
  g.setH(7,10,.25);g.setH(20,10,.25);g.setH(28,11,.14);g.setH(29,11,.14);g.setH(28,12,.14);g.setH(29,12,.14);
  g.block(0,0,31,1);g.block(0,22,31,23);g.block(0,0,1,23);g.block(30,0,31,23);g.open(30,11,31,12);
  g.block(28,0,29,23);g.open(28,11,29,12);
  g.block(2,10,29,10);g.open(7,10);g.open(20,10);
  g.block(5,4,9,7);g.block(18,4,22,7);g.block(3,14,11,17);
  g.block(25,5,25,6);g.block(23,6,24,7);g.block(14,6);g.block(14,8);g.block(17,9);g.block(26,9);g.block(6,8);g.block(21,8);g.block(13,9);
  g.block(3,9);g.block(11,9);g.block(11,4);g.block(2,17);g.block(12,14,13,15);g.block(12,16,13,18);g.block(27,8);g.block(27,15);g.block(22,17);
  for(let y=14;y<=19;y++){if(y!==16)g.edge(15,y,16,y);g.edge(26,y,27,y);}
  for(let x=16;x<=26;x++){g.edge(x,13,x,14);g.edge(x,19,x,20);}
  markRect(L.grass,16,14,26,19);
  markRect(L.paved,2,11,31,12);markRect(L.paved,14,13,15,19);markRect(L.paved,7,8,7,10);markRect(L.paved,20,8,20,10);markRect(L.paved,7,19,13,19);
  L.talk.set('7,7',['Your house.','Mum calls from the kitchen: "Don\'t forget your hat! The Downs sun is no joke."']);
  L.talk.set('20,7',['The door is locked.','A note says: "Gone to the lab first. Try to keep up!"']);
  L.talk.set('6,8',['A letter from the Professor:','"Come by the lab when you\'re ready to start your journey."']);
  L.talk.set('21,8',['Your rival\'s letterbox. It\'s stuffed with Pokémon magazines.']);
  L.talk.set('17,9',['WATTLE TOWN','Where every journey takes root.']);
  L.talk.set('26,9',['EAST: Route 1 to Bloomridge.','Mind the cattle grid!']);
  talkRect(L,25,5,25,6,['The windmill creaks as it pumps cool bore water into the tank.']);
  talkRect(L,23,6,24,7,['A corrugated water tank. It rings like a bell when you knock on it.']);
  L.talk.set('14,6',['The golden wattle the town is named after.','Fluffy yellow blossoms drift down around you.']);
  L.talk.set('14,8',['You sit on the bench for a moment. Bees hum in the wattle above.']);
  L.talk.set('13,9',['A street lamp. Moths love it at night.']);
  L.talk.set('7,17',['Professor\'s Lab.','The sliding doors are shut. The Professor is waiting outside.']);
  talkRect(L,3,17,6,17,['Through the window: shelves of field notes and specimen jars.']);talkRect(L,8,17,11,17,['Through the window: shelves of field notes and specimen jars.']);
  talkRect(L,12,14,13,15,['Round hay bales. They smell like summer.']);
  talkRect(L,12,16,13,18,['The Professor\'s ute. The tray is full of field-research gear.']);
  L.talk.set('22,17',['A scarecrow in a farmer\'s shirt. The Warblet don\'t seem scared of it at all.']);
  L.talk.set('3,9',['A young wattle, buzzing with bees.']);L.talk.set('11,9',['A young wattle, buzzing with bees.']);
  for(let y=2;y<=21;y++)if(y<11||y>12){const c=['The creek runs clear and cold. It\'s too deep to wade across.'];L.talk.set('28,'+y,c);L.talk.set('29,'+y,c);}
  npc(L,()=>human(CHAR.rival),22,9,['Took you long enough!','I\'m picking the strongest starter. Just watch me.']);
  npc(L,()=>human(CHAR.prof),9,18,['Ah, there you are!','Australis is full of Pokémon you won\'t find anywhere else.','Choose your partner: Gumjo, Kindrill or Puggly. Then head east through the wheat country to Bloomridge.']);
  npc(L,gumjo,6,18,['Gumjo: "Gum-gum!"','It\'s clinging to its eucalyptus leaf and won\'t let go.'],{hop:true});
  npc(L,warblet,18,13,['Warblet: "Warble-warble!"','It hops along the fence, singing at you.'],{hop:true});
  L.spawn={tx:7,ty:8,face:[0,1]};
  L.exit=(tx,ty,dx,dy)=>(tx>=31&&dx===1)?{to:'bloom',spawn:{tx:1,ty:ty===11?7:8,face:[1,0]},card:['Route 1','Downs farm roads']}:null;
  scatterTufts(L,170,T.tuft,.18);
  L.update=t=>{wN.offset.y=-t*.18;wS.offset.y=-t*.22;wF.offset.y=t*1.1;fan.rotation.z=-t*2.4;for(let i=0;i<wheat.length;i++){const s=wheat[i];s.position.x=s.userData.x+Math.round(Math.sin(t*1.5+s.userData.z*1.3+s.userData.x*.4)*1.2)/16;}};
})(WT);
