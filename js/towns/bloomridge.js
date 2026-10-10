/* Australis: Bloomridge, the garden town on the range, and the valley below */
/* ================= Bloomridge ================= */
const BR=newLoc('bloom',{name:'Bloomridge',sub:'The Range · Garden town',yaw:0,grid:Grid(32,20,-16,-10),wild:{day:['Wattlet','Burrowlet','Warblet','Sugrette'],night:['Possnack','Wattlet','Burrowlet'],field:'corn'}});
(function(L){
  PARENT=L.group;const g=L.grid,TOP=2.5;
  groundBox(-34,-15,-24,22,-.6,TOP,T.dry,T.rock);
  groundBox(-15,4,-24,22,-.6,TOP,T.grass,T.rock);
  groundBox(4,40,-24,22,-.6,0,T.lush,T.cliff);
  groundBox(3.8,4.04,-24,22,TOP-.2,TOP+.02,T.grass,T.cliff);
  rocksAt([[4.3,1.6,-8.5,.5],[4.25,.9,-6,.6],[4.35,1.9,-4.4,.4],[4.2,.5,.5,.55],[4.4,1.7,2.4,.45],[4.3,.8,4.2,.6],[4.2,2,6.6,.4],[4.35,.6,8.4,.5],[4.6,0,-7.5,.45],[4.7,0,2.5,.5],[4.5,0,5.5,.4]]);
  slab(-34,-16,-3,-1,TOP,.03,T.road);slab(-16,4,-3,-1,TOP,.03,T.pave);slab(-5,-3,-7,7,TOP,.03,T.pave);slab(-15,4,5,7,TOP,.03,T.pave);
  slab(-10,-5,0,5,TOP,.025,T.path);slab(8,40,-3,-1,0,.03,T.path);
  for(let i=0;i<10;i++){const h=TOP-(i+1)*.25;slab(4+i*.4,4.4+i*.4,-3,-1,0,h,T.stone,'#9a9282');}
  [-3.08,-.92].forEach(z=>{for(let i=0;i<=4;i++){const x=4+i,h=TOP-i*.625;mesh(new THREE.BoxGeometry(.1,.5,.1),railMat,x,h+.25,z);}const r=mesh(new THREE.BoxGeometry(Math.hypot(4,2.5),.06,.06),railMat,6,TOP/2+.5,z);r.rotation.z=-Math.atan2(2.5,4);});
  /* buildings */
  house({cx:-10.5,cz:-5,y:TOP,W:5,D:4,H:2.2,rh:1.2,roof:T.roofTeal,front:T.centreFront,wall:T.labwall,chimney:false});
  house({cx:.5,cz:-4.5,y:TOP,W:5,D:3,H:1.7,rh:1,roof:T.roofGreen,front:T.storeFront,chimney:false});
  const aw=mesh(new THREE.BoxGeometry(5,.05,.8),[M({color:'#e05040'}),M({color:'#e05040'}),M({map:rep(T.awning,5,1)}),M({color:'#a83028'}),M({map:rep(T.awning,5,.1)}),M({color:'#e05040'})],.5,TOP+1.25,-2.68);aw.rotation.x=.38;
  [[-1.4,'#e09038'],[-.9,'#58a840'],[1.9,'#e05040'],[2.4,'#f0d048']].forEach(c=>{mesh(new THREE.BoxGeometry(.42,.3,.36),M({color:'#b07c48'}),c[0],TOP+.15,-2.7);mesh(new THREE.BoxGeometry(.36,.06,.3),M({color:c[1],flatShading:true}),c[0],TOP+.33,-2.7);});
  house({cx:-12.5,cz:2.5,y:TOP,roof:T.roofOrange,front:T.frontOrange});
  house({cx:-.5,cz:2.5,y:TOP,roof:T.roofPurple,front:T.frontPurple});
  glowAt(-12.125,TOP+.75,-2.99,1,.5);glowAt(-8.875,TOP+.75,-2.99,1,.5);glowAt(-10.5,TOP+.47,-2.99,1.25,.94);pointLamp(-10.5,TOP+1.6,-2.4);
  glowAt(-1.06,TOP+.63,-2.99,1,.5);glowAt(2.06,TOP+.63,-2.99,1,.5);
  [-12.5,-.5].forEach(cx=>{glowAt(cx-1.5,TOP+.84,4.02,.76,.44);glowAt(cx+1.5,TOP+.84,4.02,.76,.44);pointLamp(cx,TOP+1.3,4.7);});
  /* park */
  [[-10,-8,0,2,T.bloomA],[-7,-5,0,2,T.bloomB],[-10,-8,3,5,T.bloomB],[-7,-5,3,5,T.bloomA]].forEach(b=>{slab(b[0],b[1],b[2],b[3],TOP,.16,b[4],'#7a5434');for(let i=0;i<9;i++)spr(FLOWERS[Math.floor(rnd()*5)],b[0]+.25+rnd()*1.5,TOP+.16,b[2]+.25+rnd()*1.5,.42,.42);});
  const stoneM=M({color:'#c4bcaa',flatShading:true});
  mesh(new THREE.CylinderGeometry(.5,.55,.32,10),stoneM,-7.5,TOP+.16,2.5);
  const fw=rep(T.water,1,1);const disc=add(new THREE.Mesh(new THREE.CircleGeometry(.42,10),M({map:fw,roughness:.3})));disc.rotation.x=-Math.PI/2;disc.position.set(-7.5,TOP+.3,2.5);
  mesh(new THREE.CylinderGeometry(.08,.1,.7,6),stoneM,-7.5,TOP+.6,2.5);mesh(new THREE.CylinderGeometry(.22,.1,.12,8),stoneM,-7.5,TOP+.95,2.5);
  const drops=[];for(let i=0;i<8;i++){const s=spr(T.drop,-7.5,TOP+1,2.5,.16,.16);s.userData.ph=i/8;drops.push(s);}
  /* lookout */
  slab(2,4,0,4,TOP,.08,T.wood,'#86582e');
  for(let z=0;z<=4;z+=.5)mesh(new THREE.BoxGeometry(.09,.5,.09),railMat,3.92,TOP+.33,z);
  mesh(new THREE.BoxGeometry(.06,.06,4),railMat,3.92,TOP+.55,2);
  [0,4].forEach(z=>{mesh(new THREE.BoxGeometry(2,.06,.06),railMat,3,TOP+.55,z);[2,3].forEach(x=>mesh(new THREE.BoxGeometry(.09,.5,.09),railMat,x,TOP+.33,z));});
  const sc=new THREE.Group();sc.position.set(3.5,TOP+.08,3.5);add(sc);
  [[-.18,-.12],[.18,-.12],[0,.2]].forEach(l=>{const leg=mesh(new THREE.CylinderGeometry(.025,.025,.62,4),M({color:'#4a4a52'}),l[0]*.6,.3,l[1]*.6,sc);leg.rotation.set(l[1]*.9,0,-l[0]*.9);});
  const tube=mesh(new THREE.CylinderGeometry(.07,.1,.62,8),M({color:'#5a6a8a',metalness:.3,roughness:.5}),0,.66,0,sc);tube.rotation.z=-1.25;
  const cage=new THREE.Group();cage.position.set(3.5,TOP+.08,1.5);add(cage);
  const bar=M({color:'#5a5a62',metalness:.4,roughness:.6});
  for(let i=0;i<5;i++){const o=-.3+i*.15;mesh(new THREE.BoxGeometry(.03,.62,.03),bar,o,.31,-.3,cage);mesh(new THREE.BoxGeometry(.03,.62,.03),bar,o,.31,.3,cage);mesh(new THREE.BoxGeometry(.03,.62,.03),bar,-.3,.31,o,cage);mesh(new THREE.BoxGeometry(.03,.62,.03),bar,.3,.31,o,cage);}
  mesh(new THREE.BoxGeometry(.66,.04,.66),bar,0,.62,0,cage);mesh(new THREE.BoxGeometry(.66,.04,.66),bar,0,.02,0,cage);
  const caged=sugrette();caged.group.position.set(3.5,TOP+.1,1.5);caged.group.scale.setScalar(.85);add(caged.group);
  /* lamps & signs */
  [-12.5,-6.5,-.5].forEach(x=>streetLamp(x,TOP,-.5,'#2f5a3a'));
  signAt(-14.5,TOP,-.5);signAt(1.5,TOP,-.5);signAt(9.5,0,-.5);
  /* valley */
  slab(8,13,-8,-4,0,.08,T.cabbage,'#6a4628');
  slab(9,15,1,6,0,.06,T.dirt,'#6a4628');
  for(let i=0;i<12;i++)for(let j=0;j<10;j++)spr(T.corn,9.25+i*.5+(rnd()-.5)*.1,.06,1.2+j*.5+(rnd()-.5)*.1,.62,1.05);
  fenceRect(9,15,1,6,{z0:3,z1:4});
  /* trees */
  const pick=k=>k[Math.floor(rnd()*k.length)];
  const plateauKinds=[TREE.gum,TREE.gum,TREE.jac,TREE.gum,TREE.wattle],valleyKinds=[TREE.gum,TREE.jac,TREE.gum,TREE.jac],westKinds=[TREE.olive,TREE.olive,TREE.gum];
  const gy=x=>x<4?TOP:0;
  const treeAt=(x,z,tex,s)=>spr(tex,x,gy(x),z,2*s,2.5*s,.6*s,true);
  for(let x=-15.6;x<=15.6;x+=1.15){[-9.5,-8.6,8.6,9.5].forEach(z=>{const X=x+(rnd()-.5)*.45;if(X>3.4&&X<4.6)return;treeAt(X,z+(rnd()-.5)*.3,X<4?pick(plateauKinds):pick(valleyKinds),.92+rnd()*.25);});}
  for(let z=-7.6;z<=7.6;z+=1.1){if(z>-3.6&&z<-.4)continue;treeAt(-15.4+(rnd()-.5)*.3,z+(rnd()-.5)*.3,pick(westKinds),.95+rnd()*.2);treeAt(15.5+(rnd()-.5)*.3,z+(rnd()-.5)*.3,pick(valleyKinds),.95+rnd()*.2);}
  for(let i=0;i<110;i++){const X=(rnd()*2-1)*32,Z=-24+rnd()*38;if(Math.abs(X)<16.6&&Z>-10.6&&Z<10.6)continue;if(X>3.2&&X<4.8)continue;treeAt(X,Z,X<-16?pick(westKinds):X<4?pick(plateauKinds):pick(valleyKinds),.95+rnd()*.35);}
  hills([[18,.1,-22,6,3,4],[26,.1,-17,5,2.4,4],[34,.1,-8,6,3,5],[34,.1,4,5,2.5,4],[28,.1,14,5,2,4],[8,.1,-24,6,3,4],[-4,TOP,-24,5,2.6,4],[-16,TOP,-23,6,3,4],[-28,TOP,-20,5,2.4,4]]);
  treeAt(-6.5,-4.5,TREE.jac,1.05);treeAt(-14.5,-5.5,TREE.wattle,1);
  [[14.5,-6.5],[13.5,-4.5],[6.5,4.5],[5.5,6.5],[15,2]].forEach(p=>treeAt(p[0],p[1],TREE.jac,1));
  /* walkability: world X=tx-16+.5, Z=ty-10+.5 */
  for(let y=0;y<20;y++)for(let x=0;x<32;x++)g.setH(x,y,x<=19?TOP:0);
  [0,1,2,3].forEach(i=>{const hh=TOP*(1-(i+.5)/4);g.setH(20+i,7,hh);g.setH(20+i,8,hh);});
  g.setH(18,10,TOP+.08);g.setH(19,10,TOP+.08);for(let y=10;y<=13;y++){g.setH(18,y,TOP+.08);g.setH(19,y,TOP+.08);}
  g.block(0,0,31,1);g.block(0,18,31,19);g.block(0,0,0,19);g.open(0,7,0,8);g.block(31,0,31,19);g.open(31,7,31,8);
  g.block(3,3,7,6);g.block(14,4,18,6);g.block(1,11,5,13);g.block(13,11,17,13);
  [[6,10],[7,10],[6,11],[7,11],[9,10],[10,10],[9,11],[10,11],[6,13],[7,13],[6,14],[7,14],[9,13],[10,13],[9,14],[10,14],[8,12]].forEach(p=>g.block(p[0],p[1]));
  g.block(9,5);g.block(1,4);g.block(3,9);g.block(9,9);g.block(15,9);g.block(1,9);g.block(17,9);g.block(25,9);
  g.block(19,13);g.block(19,11);
  g.block(24,2,28,5);g.block(30,3);g.block(29,5);g.block(22,14);g.block(21,16);g.block(31,12);
  g.block(20,2);g.block(20,4);g.block(20,10);g.block(20,13);g.block(20,15);
  for(let y=11;y<=15;y++){if(y!==13)g.edge(24,y,25,y);}
  for(let x=25;x<=30;x++){g.edge(x,10,x,11);g.edge(x,15,x,16);}
  markRect(L.grass,25,11,30,15);
  markRect(L.paved,0,7,31,8);markRect(L.paved,11,3,12,16);markRect(L.paved,1,15,19,16);markRect(L.paved,6,10,10,14);markRect(L.paved,18,10,19,13);
  /* talk */
  L.talk.set('5,6',['Bloomridge Healing Centre.','You rest for a moment. Your team feels refreshed!']);
  talkRect(L,3,6,4,6,['The Healing Centre\'s windows are full of potted ferns.']);talkRect(L,6,6,7,6,['The Healing Centre\'s windows are full of potted ferns.']);
  L.talk.set('16,6',['Bloomridge General Store.','Potions, capture gear and the best lamingtons on the range.']);
  talkRect(L,14,6,15,6,['Crates of fresh produce from the valley farms.']);talkRect(L,17,6,18,6,['Crates of fresh produce from the valley farms.']);
  L.talk.set('3,13',['The door is locked.','A wind chime made of gum nuts clinks softly.']);
  L.talk.set('15,13',['A note on the door:','"Gone to judge the garden competition. Back at sunset!"']);
  L.talk.set('1,9',['BLOOMRIDGE','The Garden Town on the Range.']);
  L.talk.set('17,9',['LOOKOUT','Mind the edge. It\'s a long way down to the valley.']);
  L.talk.set('25,9',['ROUTE 2','Down the range to Riverbend City.']);
  ['3,9','9,9','15,9'].forEach(k=>L.talk.set(k,['A cast-iron street lamp, painted garden green.']));
  L.talk.set('8,12',['The fountain sparkles. Someone has tossed in a coin for luck.']);
  [[6,10],[7,10],[6,11],[7,11],[9,10],[10,10],[9,11],[10,11],[6,13],[7,13],[6,14],[7,14],[9,13],[10,13],[9,14],[10,14]].forEach(p=>L.talk.set(p[0]+','+p[1],['Prize-winning flower beds, ready for the Carnival of Flowers.']));
  L.talk.set('19,13',['You look through the telescope...','The green valley stretches out below, all the way to the jacarandas near Riverbend City.']);
  talkRect(L,24,2,28,5,['Rows of cabbages. Better not trample the farmer\'s crop.']);
  ['9,5','30,3','29,5','22,14','21,16'].forEach(k=>L.talk.set(k,['A jacaranda in full purple bloom.']));
  L.talk.set('1,4',['A wattle tree, bright gold against the Bloomridge gardens.']);
  let rescued=false;
  L.talk.set('19,11',()=>rescued?['The empty cage Team Snare left behind.']:['A wire cage. A frightened Sugrette is trapped inside.']);
  npc(L,()=>human(CHAR.nurse),4,7,['Welcome to Bloomridge!','The Healing Centre is open day and night. Rest up before you head down the range.']);
  npc(L,()=>human(CHAR.gardener),5,12,['The Carnival of Flowers starts next week!','Every garden in Bloomridge is competing. Mine\'s the one with the purple pansies.']);
  const kid=npc(L,()=>human(CHAR.kid),7,9,null);
  kid.lines=()=>rescued?['You chased off Team Snare? That\'s so brave!']:['Did you see those people in khaki at the lookout?','They had a net and a cage... I don\'t like them.'];
  const grunt=npc(L,()=>human(CHAR.grunt),18,11,['Oi! Shove off, kid. This is Team Snare business.','This Sugrette\'s worth a fortune to the right buyer overseas.','...Hang on. Are you filming this?!','The Team Snare grunt dropped the cage and bolted down the stairs!']);
  grunt.onEnd=()=>{
    rescued=true;grunt.model.group.visible=false;grunt.model.blob.visible=false;g.open(18,11);L.talk.delete('18,11');
    caged.group.visible=false;
    say(['The cage door swung open.','Sugrette glided out and landed on your shoulder. It wants to come with you!'],()=>{follower.active=true;follower.sprite.visible=true;follower.tx=18;follower.ty=11;placeFollower(true);});
  };
  L.spawn={tx:1,ty:7,face:[1,0]};
  L.exit=(tx,ty,dx,dy)=>{
    if(tx<=0&&dx===-1)return {to:'wattle',spawn:{tx:30,ty:ty===7?11:12,face:[-1,0]},card:['Route 1','Downs farm roads']};
    if(tx>=31&&dx===1)return {say:['Route 2 winds down through the valley to Riverbend City.','This part of Australis hasn\'t been built yet!']};
    return null;
  };
  scatterTufts(L,150,T.tuft,.22);
  L.update=t=>{fw.offset.set(t*.05,t*.08);drops.forEach(d=>{const p=(t*.9+d.userData.ph)%1,a=d.userData.ph*Math.PI*2;d.position.set(-7.5+Math.cos(a)*p*.45,TOP+1.05+Math.sin(p*Math.PI)*.35-p*.6,2.5+Math.sin(a)*p*.45);});};
})(BR);
