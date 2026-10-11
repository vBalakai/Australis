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

/* a saltwater crocodile that cruises slowly back and forth */
function croc(x,z,len){
  const g=new THREE.Group();g.position.set(x,-.2,z);add(g);const s=len||1;
  const skin=mc('#3a4a2a'),belly=mc('#6a7a4a');
  mesh(new THREE.BoxGeometry(1.1*s,.14,.36*s),skin,0,0,0,g);
  mesh(new THREE.BoxGeometry(.5*s,.1,.2*s),skin,.75*s,0,0,g);
  mesh(new THREE.BoxGeometry(.7*s,.08,.14*s),skin,-.85*s,0,0,g);
  for(let i=0;i<5;i++)mesh(new THREE.BoxGeometry(.08,.06,.08),belly,-.4*s+i*.2*s,.09,0,g);
  [-.08,.08].forEach(zz=>{mesh(new THREE.BoxGeometry(.1,.1,.08),skin,.55*s,.08,zz*s,g);mesh(new THREE.BoxGeometry(.04,.04,.03),mc('#f0d040'),.57*s,.12,zz*s+(zz>0?.04:-.04),g);});
  g.userData={x,z,ph:rnd()*6};return g;
}

/* ================= Stormhaven ================= */
const SH=newLoc('stormhaven',{name:'Stormhaven',sub:'Top End · Gym 3 · Electric',yaw:0,
  mood:{day:['#4a5a78','#9aa8bc','#8a96a8',.65,.85],gold:['#8a4a6a','#f0a070','#c8806a',.85,.9]},
  wild:{day:['Tadbolt','Gigglet','Sugrette','Croakbolt','Scarabolt'],night:['Possnack','Tadbolt','Hootlet'],field:'spear grass'}});
(function(L){
  const W=56,H=40,p=Plan(W,H,'.'),ter=p.ter,obj=p.obj;
  /* clifftop town above a beach, with a mangrove creek cutting a gorge to the sea */
  const cy=x=>21+1.5*Math.sin(x/7),sy=x=>31+1.5*Math.sin(x/5+1);
  ter.each((x,y)=>y<=cy(x)?'^':y>sy(x)?'~':':');
  ter.path([[10,0],[11,7],[9,14],[11,22],[10,27],[11,33]],4.4,'~');
  /* the main road crosses the gorge on a high bridge */
  ter.each((x,y,c)=>(y===8||y===9)?(c==='~'?'b':'!'):null);
  ter.each((x,y,c)=>(y===7||y===10)&&c==='^'?'*':null);
  /* stairs down the cliff, the beach market and the wharf */
  const stairsAt=x=>{const c=Math.floor(cy(x));ter.set(x,c,'%');ter.set(x,c-1,'%');ter.set(x,c+1,'S');ter.set(x,c+2,':');return c;};
  const s1=stairsAt(22),s2=stairsAt(38);
  ter.path([[22,10],[22,s1]],1.2,'%');ter.path([[38,10],[38,s2]],1.2,'%');
  ter.path([[44,24],[44,sy(44)+1],[44,36]],1.8,cur=>cur==='~'?'b':null);ter.rect(41,35,48,37,cur=>cur==='~'?'b':null);
  /* airport, town and the headland observatory */
  ter.rect(0,0,9,1,'!');ter.rect(1,6,8,7,'*');
  ter.rect(43,10,51,16,'*');
  p.build(1,2,7,5,(r,y)=>terminal(r,y));
  p.build(14,3,18,6,(r,y)=>healingCentre(r,y));
  p.build(21,4,25,6,(r,y)=>generalStore(r,y,'#f0c030'));
  const st=(x0,y0,wall,line,roof)=>p.build(x0,y0,x0+4,y0+2,(r,y)=>qlder({cx:r.cx,cz:r.cz,y,W:r.W,D:r.D,wallTex:boards(wall,line),front:T.louvreFront,roof,lift:1.1,lattice:false,stump:'#5a5a5a'}));
  st(28,4,'#e8e4d8','#c0bcae',T.roofTeal);st(34,4,'#f0e8d0','#d0c4a8',T.roofBlue);
  st(15,12,'#e8f0e8','#c4d4c4',T.roofOrange);st(24,12,'#f4ece0','#d8ccb8',T.roofRed);
  ter.rect(17,15,17,16,'%');ter.rect(26,15,26,16,'%');ter.path([[17,16],[26,16]],1,'%');ter.path([[22,10],[22,16]],1,'%');
  p.build(44,10,50,14,(r,y)=>observatory(r,y));
  /* spear grass on the clifftop, mangroves in the creek */
  obj.ellipse(33,15,5,3,(c,x,y)=>c===' '&&ter.get(x,y)==='^'?'g':null,.4);
  obj.ellipse(6,17,2.5,3,(c,x,y)=>c===' '&&ter.get(x,y)==='^'?'g':null,.3);
  ter.each((x,y,c)=>{if(c==='~'&&x<16&&y<34&&obj.get(x,y)===' '&&(ter.get(x-1,y)!=='~'||ter.get(x+1,y)!=='~')&&rnd()<.7)obj.set(x,y,'m');return null;});
  [[27,11],[41,11],[42,5],[20,18]].forEach(c=>obj.set(c[0],c[1],'X'));
  [[18,25],[22,26],[26,25],[30,26],[34,25]].forEach(c=>obj.rect(c[0],c[1],c[0]+1,c[1],'X'));
  obj.rect(46,36,47,37,'X');
  p.border(2,'TOTO',".,^;");
  p.sprinkle('TO',2,2,53,6,.12,'^');
  p.sprinkle('P',2,11,53,20,.04,'^');p.sprinkle('P',14,22,55,30,.04,':');
  [[6,7],[14,7],[19,7],[27,7],[33,7],[40,7],[48,7],[6,10],[27,10],[40,10],[52,10]].forEach(c=>obj.set(c[0],c[1],'L'));
  [[47,19],[49,19]].forEach(c=>obj.set(c[0],c[1],'B'));
  const SIGNS=[[9,6,['STORMHAVEN','Lightning capital of Australis.']],[15,10,['CROCODILE WARNING','Saltwater crocodiles live in this creek. Do not swim, paddle or stand at the edge.']],
    [42,11,['STORMHAVEN GYM','Leader: Ray. "Ride the lightning!"']],[23,s1-1,['SUNSET MARKETS','Down the stairs. Every Thursday and Sunday, from 5pm till late.']],
    [53,7,['EAST: Billabong Wetlands','Floodplains, paperbarks and a bird hide. Brolga dance in the wet season.']],[45,20,['SUNSET LOOKOUT','Best seat in Stormhaven for the evening storms.']]];
  const PEOPLE=[[13,10,'ranger',['Never swim in the creek, mate.','The salties are always watching, even when you can\'t see them.'],Math.PI],
    [30,10,'chaser',['Did you see that bolt?!','Ray says Stormhaven gets more lightning than anywhere else in Australis!']],
    [26,27,'auntie',['Satay, mango, fresh lime! Come, come.','Watch the storm roll in over the water. Best show in town, love.']],
    [41,12,'lineworker',['These pylons catch lightning and store it for the town.','Ray\'s gym runs on pure storm power!']],
    [43,36,'fisher',['Barralet are biting off the wharf tonight.','Saw a boat out past the point with no lights on. Odd, that.'],-Math.PI/2],
    [32,29,'kid',['The sand is still warm from the sun!','Mum says the crocs don\'t come up on this beach. Mostly.']],
    [48,20,'elder',['When I was young, Stormhaven was just a pearling town.','Now the storms power everything. Even Ray\'s gym.']]];
  SIGNS.concat(PEOPLE).forEach(a=>obj.set(a[0],a[1],' '));

  const built=buildMap(L,p,{tex:{road:T.tarmac,plaza:T.pave,dirt:T.redEarth,sand:T.sand},bank:T.mud,cliff:T.redEarth,water:{color:'#9ac0b0',bedTex:T.mud,opacity:.88},
    skirt:[TREE.gum,TREE.olive,T.palmSpr],tufts:140,tall:T.spear,lampCol:'#3a3a44',
    waterTalk:['Murky green water. Something just slid under the surface...','Best keep well back from the edge.'],benchTalk:['You watch the clouds pile up over the sea. A low rumble of thunder rolls in.']});
  const g=L.grid,wp=(x,y)=>g.w(x,y),Hc=g.h(30,5);
  SIGNS.forEach(a=>tileSign(L,a[0],a[1],a[2]));
  PEOPLE.forEach(a=>npc(L,()=>human(CHAR[a[2]]),a[0],a[1],a[3],a[4]?{rot:a[4]}:null));
  /* pylons, market stalls and the wharf kiosk */
  [[27,11],[41,11],[42,5],[20,18]].forEach(c=>{const [x,z]=wp(c[0],c[1]);pylon(x,g.h(c[0],c[1]),z,3.6);L.talk.set(c[0]+','+c[1],['A lightning pylon. It hums and crackles every time the clouds roll in.']);});
  [[18,25,'#e05040'],[22,26,'#f0c030'],[26,25,'#2ea89a'],[30,26,'#8a5ab8'],[34,25,'#e09038']].forEach(s=>{const [x,z]=wp(s[0],s[1]);stall(x+.5,0,z,s[2]);talkRect(L,s[0],s[1],s[0]+1,s[1],['A market stall: '+['satay sticks on the grill','tropical fruit salad','crocodile-tooth necklaces (fake, the sign insists)','hand-dyed sarongs','lime and coconut ice'][[18,22,26,30,34].indexOf(s[0])]+'.']);});
  {const [a,az]=wp(17,24),[b,bz]=wp(36,24);festoon(a,az,b,bz,2.4);}
  {const [x,z]=wp(46,36);const k=new THREE.Group();k.position.set(x+.5,g.h(46,36),z+.5);add(k);
    mesh(new THREE.BoxGeometry(1.8,1.2,1.6),mc('#f4f0e6'),0,.6,0,k);mesh(new THREE.BoxGeometry(2.1,.12,1.9),mc('#2e6aa8'),0,1.26,0,k);mesh(new THREE.BoxGeometry(1.2,.4,.04),mc('#f0c030'),0,1.5,.8,k);glowAt(x+.5,g.h(46,36)+.6,z+1.31,1.2,.5);
    talkRect(L,46,36,47,37,['Fish and chips on the wharf. The smell of hot chips makes your stomach rumble.']);}
  /* doors */
  [3,4,5].forEach(x=>door(L,x,5,{flight:true}));
  door(L,16,6,{say:['Stormhaven Healing Centre.','You rest for a moment. Your team feels refreshed!']});
  door(L,23,6,{say:['Stormhaven General Store.','Raincoats, rubber boots, and spare batteries for your torch.']});
  door(L,30,6,{say:['A stilt house with louvre windows. Up high, it catches every breeze and stays dry in the floods.']});
  door(L,36,6,{say:['Someone\'s strung a hammock between the stilts underneath. Very relaxing.']});
  door(L,17,14,{say:['A sign on the door: "Gone fishing. Back when the barra stop biting."']});
  door(L,26,14,{say:['Through the louvres: a shelf of storm-chasing trophies and a very old Gigglet plush.']});
  door(L,47,14,{to:'shgym',spawn:{tx:7,ty:14,face:[0,-1]}});
  L.airport={tx:4,ty:6,face:[0,1]};
  /* crocs in the creek and off the beach */
  const crocs=[[10,13],[11,26],[10,31],[18,34]].map(c=>{const [x,z]=wp(c[0],c[1]);return croc(x,z,1.2);});
  L.spawn={tx:4,ty:6,face:[0,1]};
  L.exit=(tx,ty,dx)=>(tx>=W-1&&dx===1)?{to:'billabong',spawn:{tx:1,ty:ty<=8?16:17,face:[1,0]},card:['Billabong Wetlands','Top End floodplain']}:null;
  /* rain */
  const RN=320,rp=new Float32Array(RN*6),rs=[];
  for(let i=0;i<RN;i++)rs.push([rnd()*36-18,rnd()*7,rnd()*26-13,.8+rnd()*.6]);
  const rgeo=new THREE.BufferGeometry();rgeo.setAttribute('position',new THREE.BufferAttribute(rp,3));
  const rain=add(new THREE.LineSegments(rgeo,new THREE.LineBasicMaterial({color:'#c8d8f0',transparent:true,opacity:.45})));rain.frustumCulled=false;
  const storm=makeStorm(1);
  L.update=(t,dt)=>{
    if(built.water)built.water.offset.set(t*.01,-t*.02);
    crocs.forEach(c=>{const u=c.userData;c.position.x=u.x+Math.sin(t*.15+u.ph)*1.2;c.position.y=-.22+Math.sin(t*.8+u.ph)*.02;c.rotation.y=Math.cos(t*.15+u.ph)>0?0:Math.PI;});
    orbs.forEach(o=>{if(o.parent===L.group||o.parent&&o.parent.parent===L.group)o.material.emissiveIntensity=1+Math.abs(Math.sin(t*7+o.position.x))*.9;});
    const tx=target.x,tz=target.z,ty=target.y;
    for(let i=0;i<RN;i++){const r=rs[i];const y=ty+((r[1]-t*9*r[3])%7+7)%7;const x=tx+r[0],z=tz+r[2];rp[i*6]=x;rp[i*6+1]=y;rp[i*6+2]=z;rp[i*6+3]=x-.05;rp[i*6+4]=y+.45;rp[i*6+5]=z;}
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
  L.exit=(tx,ty,dx,dy)=>(ty>=14&&dy===1)?{to:'stormhaven',spawn:{tx:47,ty:15,face:[0,1]}}:null;
  const storm=makeStorm(.5);
  L.update=(t,dt)=>{
    tops.forEach((o,i)=>{o.material.emissiveIntensity=1+Math.abs(Math.sin(t*9+i))*1.2;});
    screenM.emissiveIntensity=.6+Math.sin(t*2)*.2;
    arcs.forEach(a=>{a.next-=dt||.016;if(a.next<=0){a.next=.06+rnd()*.1;const on=rnd()<.55;a.line.visible=on;if(on){for(let i=0;i<9;i++){const k=i/8;a.pts[i*3]=a.a.position.x+(a.b.position.x-a.a.position.x)*k+(i%8?(rnd()-.5)*.35:0);a.pts[i*3+1]=a.a.position.y+(i%8?(rnd()-.5)*.35:0);a.pts[i*3+2]=a.a.position.z+(a.b.position.z-a.a.position.z)*k+(i%8?(rnd()-.5)*.35:0);}a.geo.attributes.position.needsUpdate=true;}}});
    storm(t,dt||.016);
  };
})(SHG);
