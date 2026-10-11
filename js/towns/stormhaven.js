/* Australis: Stormhaven (Darwin), home of Gym 3, and Ray's storm observatory gym */

CHAR.ray={skin:'#c88a5a',hair:'#2a2a30',top:'#f0c030',coat:'#f0c030',bottom:'#3a3a44',shoes:'#2a2a30',cap:'#2a2a30',logo:'#f0c030',glasses:true};
CHAR.ranger={skin:'#a8704a',hair:'#3a2a20',top:'#7a8a4a',bottom:'#5a5a3a',shoes:'#4a3020',hat:'#a8904a'};
CHAR.chaser={skin:'#f2c79a',hair:'#c86a3a',top:'#3a6ad0',stripe:'#f0c030',bottom:'#2a2a30',shoes:'#f0c030',cap:'#f0c030',logo:'#3a6ad0',scale:.8};
CHAR.auntie={skin:'#8a5a3a',hair:'#d8d8d8',top:'#e05080',bottom:'#5a3a6a',shoes:'#2a2a30',bun:true};
CHAR.lineworker={skin:'#e8b88a',hair:'#5a3a24',top:'#f08030',stripe:'#f4f6f8',bottom:'#2a3a6a',shoes:'#3a2a20',hat:'#f0c030'};
CHAR.engineer={skin:'#d8a070',hair:'#2a2a30',top:'#5a6a7a',stripe:'#f0c030',bottom:'#3a3a44',shoes:'#2a2a30',glasses:true};

/* a lightning flash overlay for storms, shared by the town and the gym */
const boltEl=(function(){const d=document.createElement('div');d.setAttribute('aria-hidden','true');d.style.cssText='position:absolute;inset:0;background:#eef4ff;opacity:0;pointer-events:none';stage.insertBefore(d,document.getElementById('fade'));return d;})();
function makeStorm(intensity){
  let next=2+rnd()*4,flash=0;
  return (t,dt)=>{
    if(still)return;
    next-=dt;if(next<=0){flash=1;next=3+rnd()*6;}
    flash=Math.max(0,flash-dt*3.2);
    const f=flash>.6?flash:flash*(Math.sin(t*90)>0?1:.3);
    boltEl.style.opacity=String(f*.35*intensity);
    hemi.intensity=(hemi.userData.base||.5)+f*1.6*intensity;
  };
}

/* ================= Stormhaven ================= */
const SH=newLoc('stormhaven',{name:'Stormhaven',sub:'Top End · Gym 3 · Electric',yaw:0,grid:Grid(34,22,-17,-11),
  mood:{day:['#4a5a78','#9aa8bc','#8a96a8',.65,.85],gold:['#6a4a5a','#c89878','#9a7a70',.75,.85]},
  wild:{day:['Tadbolt','Gigglet','Sugrette','Croakbolt','Scarabolt'],night:['Possnack','Tadbolt','Hootlet'],field:'spear grass'}});
(function(L){
  PARENT=L.group;const g=L.grid;
  groundBox(-44,44,-32,4,-.6,0,T.grass);
  groundBox(-44,44,4,40,-.9,-.5,T.mud,T.mud);
  const wCreek=waterPlane(-44,44,4,40,-.16,T.water,{opacity:.88,color:'#9ab4a0'});
  slab(-44,44,-4,-2,0,.03,T.redEarth,'#8a4a2a');
  slab(-12,-11,-2,3,0,.02,T.redEarth,'#8a4a2a');slab(-5,-4,-2,3,0,.02,T.redEarth,'#8a4a2a');
  /* buildings */
  const ar=rectOf(L,1,3,6,6);terminal(ar,0);slab(-28,-11,-13,-7,0,.03,T.tarmac,'#3a3e46');plane(-20,0,-10,0);
  healingCentre(rectOf(L,9,3,13,6));
  generalStore(rectOf(L,15,4,19,6),0,'#f0c030');
  observatory(rectOf(L,22,2,28,6),0);
  const st=(a,c,b,d,wall,line,roof)=>{const r=rectOf(L,a,c,b,d);qlder({cx:r.cx,cz:r.cz,W:r.W,D:r.D,wallTex:boards(wall,line),front:T.louvreFront,roof,lift:1.1,lattice:false,stump:'#5a5a5a'});};
  st(3,11,7,13,'#e8e4d8','#c0bcae',T.roofTeal);st(10,11,14,13,'#f0e8d0','#d0c4a8',T.roofBlue);
  /* spear grass, pylons, mangroves, crocs */
  const grassTiles=[];for(let y=12;y<=14;y++)for(let x=18;x<=29;x++)grassTiles.push([x,y]);
  grassTiles.forEach(p=>{const [x,z]=g.w(p[0],p[1]);for(let k=0;k<3;k++)spr(T.spear,x-.35+k*.35+(rnd()-.5)*.1,0,z+(rnd()-.5)*.6,.55,.85);});
  [[20,10],[31,10],[31,4]].forEach(p=>{const [x,z]=g.w(p[0],p[1]);pylon(x,0,z,3.6);g.block(p[0],p[1]);L.talk.set(p[0]+','+p[1],['A lightning pylon. It hums and crackles every time the clouds roll in.']);});
  for(let x=-17;x<=17;x+=1.3)spr(MANGROVE,x+(rnd()-.5)*.5,-.2,4.3+rnd()*.6,2,2.3,0,true);
  for(let i=0;i<30;i++)spr(MANGROVE,(rnd()*2-1)*30,-.2,6+rnd()*14,2.2,2.6,0,true);
  const crocs=[];
  [[-6,7.5],[5,9]].forEach(c=>{const grp=new THREE.Group();grp.position.set(c[0],-.2,c[1]);add(grp);
    mesh(new THREE.BoxGeometry(.9,.12,.32),mc('#3a4a2a'),0,0,0,grp);
    [-.08,.08].forEach(z=>{mesh(new THREE.BoxGeometry(.12,.12,.1),mc('#3a4a2a'),-.35,.08,z,grp);mesh(new THREE.BoxGeometry(.04,.04,.03),mc('#f0d040'),-.35,.12,z+(z>0?.05:-.05),grp);});
    grp.userData={x:c[0],z:c[1],ph:rnd()*6};crocs.push(grp);});
  /* trees */
  const tropic=[TREE.gum,TREE.olive,TREE.gum];
  borderTrees(L,[0,1],[0,33],tropic,(tx,ty)=>ty>=14);
  [[8,9],[16,9],[29,8]].forEach(p=>{const [x,z]=g.w(p[0],p[1]);palm(x,0,z,1,(rnd()-.5)*2);g.block(p[0],p[1]);L.talk.set(p[0]+','+p[1],['A palm tree, bent by a hundred wet-season storms.']);});
  for(let i=0;i<60;i++){const X=(rnd()*2-1)*34,Z=-28+rnd()*16;if(Math.abs(X)<17.2&&Z>-11.4)continue;spr(rnd()<.5?TREE.olive:TREE.gum,X,0,Z,2.2,2.8,.6,true);}
  hills([[-24,0,-26,8,3,6],[-8,0,-27,9,3.5,6],[10,0,-27,9,3,6],[26,0,-25,8,3,6]]);
  [[7,9],[14,9],[21,9]].forEach(p=>tileLamp(L,p[0],p[1],'#3a3a44'));
  tileSign(L,2,8,['STORMHAVEN','Lightning capital of Australis.']);
  tileSign(L,16,14,['CROCODILE WARNING','Saltwater crocodiles live in this creek. Do not swim, paddle or stand at the edge.']);
  tileSign(L,22,8,['STORMHAVEN GYM','Leader: Ray. "Ride the lightning!"']);
  /* grid */
  g.block(0,0,33,1);g.block(0,0,0,21);g.block(33,0,33,21);g.block(0,15,33,21);
  g.block(1,3,6,6);g.block(9,3,13,6);g.block(15,4,19,6);g.block(22,2,28,6);g.block(3,11,7,13);g.block(10,11,14,13);
  markRect(L.grass,18,12,29,14);
  markRect(L.paved,0,7,33,8);markRect(L.paved,5,9,5,13);markRect(L.paved,12,9,12,13);
  for(let x=0;x<34;x++)L.talk.set(x+',15',['Murky creek water. Something just slid under the surface...','Best keep well back from the edge.']);
  door(L,3,6,{flight:true});door(L,4,6,{flight:true});
  door(L,11,6,{say:['Stormhaven Healing Centre.','You rest for a moment. Your team feels refreshed!']});
  door(L,17,6,{say:['Stormhaven General Store.','Raincoats, rubber boots, and spare batteries for your torch.']});
  door(L,25,6,{to:'shgym',spawn:{tx:7,ty:14,face:[0,-1]}});
  L.talk.set('5,13',['A stilt house with louvre windows. Up high, it catches every breeze and stays dry in the floods.']);
  L.talk.set('12,13',['Someone\'s strung a hammock between the stilts underneath. Very relaxing.']);
  L.airport={tx:4,ty:7,face:[0,1]};
  npc(L,()=>human(CHAR.ranger),15,14,['Never swim in the creek, mate.','The salties are always watching, even when you can\'t see them.'],{rot:Math.PI});
  npc(L,()=>human(CHAR.chaser),21,10,['Did you see that bolt?!','Ray says Stormhaven gets more lightning than anywhere else in Australis!']);
  npc(L,()=>human(CHAR.auntie),9,9,['Wet season storms roll in every afternoon, love.','Best get under cover when the thunder starts.']);
  npc(L,()=>human(CHAR.lineworker),30,10,['These pylons catch lightning and store it for the town.','Ray\'s gym runs on pure storm power!']);
  L.spawn={tx:4,ty:7,face:[0,1]};
  scatterTufts(L,90,T.tuft,.1);
  /* rain */
  const RN=320,rp=new Float32Array(RN*6),rs=[];
  for(let i=0;i<RN;i++)rs.push([rnd()*36-18,rnd()*6,rnd()*26-13,.8+rnd()*.6]);
  const rgeo=new THREE.BufferGeometry();rgeo.setAttribute('position',new THREE.BufferAttribute(rp,3));
  const rain=add(new THREE.LineSegments(rgeo,new THREE.LineBasicMaterial({color:'#c8d8f0',transparent:true,opacity:.45})));rain.frustumCulled=false;
  const storm=makeStorm(1);
  L.update=(t,dt)=>{
    wCreek.offset.set(t*.01,-t*.02);
    crocs.forEach(c=>{const u=c.userData;c.position.x=u.x+Math.sin(t*.15+u.ph)*2;c.position.y=-.22+Math.sin(t*.8+u.ph)*.02;c.rotation.y=Math.cos(t*.15+u.ph)>0?0:Math.PI;});
    orbs.forEach(o=>{if(o.parent===L.group||o.parent&&o.parent.parent===L.group)o.material.emissiveIntensity=1+Math.abs(Math.sin(t*7+o.position.x))*.9;});
    palms.forEach(p=>{if(p.parent===L.group)p.userData.top.rotation.z=Math.sin(t*1.6+p.userData.ph)*.1;});
    const tx=target.x,tz=target.z;
    for(let i=0;i<RN;i++){const r=rs[i];const y=((r[1]-t*9*r[3])%6+6)%6;const x=tx+r[0],z=tz+r[2];rp[i*6]=x;rp[i*6+1]=y;rp[i*6+2]=z;rp[i*6+3]=x-.05;rp[i*6+4]=y+.45;rp[i*6+5]=z;}
    rgeo.attributes.position.needsUpdate=true;
    storm(t,dt||.016);
  };
})(SH);

/* ================= Stormhaven Gym: the Storm Observatory ================= */
const PANEL=canvasTex(16,16,f=>{f('#2a303c',0,0,16,16);f('#3a4250',1,1,14,6);f('#3a4250',1,9,14,6);f('#5ac0ff',3,3,2,1);f('#f0c030',10,12,2,1);f('#5ac0ff',12,4);});
const SHG=newLoc('shgym',{name:'Stormhaven Gym',sub:'Storm Observatory · Electric',yaw:0,indoor:true,grid:Grid(15,15,-7.5,-7.5)});
(function(L){
  PARENT=L.group;const g=L.grid;
  room(-7.5,7.5,-7.5,7.5,T.metal,PANEL,3);
  slab(-.5,.5,-6,7.5,0,.02,T.conduit,'#3a4050');slab(-6,6,-.5,.5,0,.02,T.conduit,'#3a4050');
  const coils=[[3,11],[11,11],[3,7],[11,7],[5,3],[9,3]],tops=[];
  coils.forEach(p=>{const [x,z]=g.w(p[0],p[1]);
    mesh(new THREE.CylinderGeometry(.32,.4,.3,10),mc('#4a505c'),x,.15,z);
    mesh(new THREE.CylinderGeometry(.14,.18,1.5,8),mc('#b87a3a'),x,1,z);
    for(let i=0;i<4;i++)mesh(new THREE.TorusGeometry(.2,.04,4,10),mc('#d8a050'),x,.5+i*.32,z).rotation.x=Math.PI/2;
    mesh(new THREE.TorusGeometry(.32,.1,6,14),mc('#c8ccd4'),x,1.85,z).rotation.x=Math.PI/2;
    const om=M({color:'#e8f6ff',emissive:'#7ac8ff',emissiveIntensity:1.2});const o=mesh(new THREE.IcosahedronGeometry(.16,1),om,x,2,z);tops.push(o);
    g.block(p[0],p[1]);L.talk.set(p[0]+','+p[1],['A tesla coil. Your hair stands on end just standing near it.']);});
  /* electric arcs that jump between coil pairs */
  const arcs=[[0,2],[1,3],[4,5]].map(pr=>{const geo=new THREE.BufferGeometry();const pts=new Float32Array(9*3);geo.setAttribute('position',new THREE.BufferAttribute(pts,3));const line=add(new THREE.Line(geo,new THREE.LineBasicMaterial({color:'#c8eaff'})));line.frustumCulled=false;return {line,pts,geo,a:tops[pr[0]],b:tops[pr[1]],next:0};});
  /* Ray's console */
  const [cx,cz]=g.w(7,1);
  mesh(new THREE.BoxGeometry(3,.8,.7),mc('#3a4250'),cx,.4,cz);
  const screenM=M({color:'#1a2a3a',emissive:'#3aa0ff',emissiveIntensity:.8});
  [-1,0,1].forEach(o=>mesh(new THREE.BoxGeometry(.8,.5,.06),screenM,cx+o*1,1.25,cz-.2));
  g.block(6,1,8,1);talkRect(L,6,1,8,1,['Storm radar screens. A huge cell is building over the Top End right now.']);
  g.block(0,0,14,0);g.block(0,0,0,14);g.block(14,0,14,14);
  npc(L,()=>human(CHAR.engineer),5,9,['Engineer Lee: "Those coils are charged by the town\'s lightning pylons."','"Don\'t touch anything shiny!"'],{rot:Math.PI/2});
  npc(L,()=>human(CHAR.chaser),9,5,['Storm Chaser Tia: "I\'ve chased storms across the whole Top End."','"Ray\'s Pokémon are faster than any lightning bolt I\'ve seen!"'],{rot:-Math.PI/2});
  gymLeader(L,()=>human(CHAR.ray),7,2,{badge:'thunder',
    intro:['Welcome to the Storm Observatory! I\'m Ray, Stormhaven\'s Gym Leader.','I\'ve chased storms my whole life. Out here, speed is everything.','Let\'s see if you can keep up with the lightning!'],
    battle:['Gym Leader Ray sent out Joltik!','Joltik used Thunder Wave! The air crackled with static!','Joltik fainted! Ray sent out Volglider!','Volglider fainted! Ray sent out Chucklebolt!','Chucklebolt laughed like rolling thunder and struck fast!','Your partner weathered the storm. Chucklebolt fainted!','Ray: "Now that\'s what I call riding the lightning!"','You received the Thunderhead Badge!','The next flight, to Redheart in the red desert, is coming soon.'],
    after:['Every storm passes eventually. That\'s what makes them worth chasing.','Redheart is out in the red desert. Ranger Dusty will be waiting.']});
  L.spawn={tx:7,ty:14,face:[0,-1]};
  L.exit=(tx,ty,dx,dy)=>(ty>=14&&dy===1)?{to:'stormhaven',spawn:{tx:25,ty:7,face:[0,1]}}:null;
  const storm=makeStorm(.5);
  L.update=(t,dt)=>{
    tops.forEach((o,i)=>{o.material.emissiveIntensity=1+Math.abs(Math.sin(t*9+i))*1.2;});
    screenM.emissiveIntensity=.6+Math.sin(t*2)*.2;
    arcs.forEach(a=>{a.next-=dt||.016;if(a.next<=0){a.next=.06+rnd()*.1;const on=rnd()<.55;a.line.visible=on;if(on){for(let i=0;i<9;i++){const k=i/8;a.pts[i*3]=a.a.position.x+(a.b.position.x-a.a.position.x)*k+(i%8?(rnd()-.5)*.35:0);a.pts[i*3+1]=a.a.position.y+(i%8?(rnd()-.5)*.35:0);a.pts[i*3+2]=a.a.position.z+(a.b.position.z-a.a.position.z)*k+(i%8?(rnd()-.5)*.35:0);}a.geo.attributes.position.needsUpdate=true;}}});
    storm(t,dt||.016);
  };
})(SHG);
