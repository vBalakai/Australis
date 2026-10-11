/* Australis: Riverbend City (Brisbane), home of Gym 1, and Jacara's botanic glasshouse gym */

/* ---- Riverbend landmarks ---- */
/* skyscraper with a crown: 'spire', 'step' (stepped top), 'slant' (angled roof) or 'flat' */
function skyscraper(r,h,base,win,crown){
  tower(r.cx,r.cz,r.W-.15,h,r.D-.15,base,win);
  const top=h+.3,cap=mc('#c8ccd2');
  if(crown==='spire'){mesh(new THREE.BoxGeometry(r.W*.5,1.4,r.D*.5),M({map:rep(towerTex(base,win),1,1)}),r.cx,top+.7,r.cz).castShadow=false;mesh(new THREE.ConeGeometry(.3,3.2,4),cap,r.cx,top+3,r.cz).castShadow=false;}
  else if(crown==='step'){mesh(new THREE.BoxGeometry(r.W*.72,1.2,r.D*.72),M({map:rep(towerTex(base,win),2,1)}),r.cx,top+.6,r.cz).castShadow=false;mesh(new THREE.BoxGeometry(r.W*.42,1,r.D*.42),cap,r.cx,top+1.7,r.cz).castShadow=false;}
  else if(crown==='slant'){const s=mesh(new THREE.BoxGeometry(r.W-.1,.25,r.D*1.15),M({color:'#9ab8d0',metalness:.4,roughness:.3}),r.cx,top+.5,r.cz);s.rotation.x=.45;s.castShadow=false;}
  /* glass lobby at street level */
  mesh(new THREE.BoxGeometry(r.W*.6,.9,.08),M({color:'#2a3a4a',roughness:.2}),r.cx,.45,r.z1-.04).castShadow=false;
  glowAt(r.cx,.45,r.z1-.01,r.W*.55,.8);
}
/* City Hall: sandstone, columns and a clock tower */
const CLOCK=canvasTex(16,16,f=>{f('#e8e0c8',0,0,16,16);f('#6a5a3a',0,0,16,1);f('#6a5a3a',0,15,16,1);f('#6a5a3a',0,0,1,16);f('#6a5a3a',15,0,1,16);[[7,2],[13,7],[7,13],[2,7]].forEach(p=>f('#2a2a30',p[0],p[1],2,2));f('#2a2a30',7,4,2,4);f('#2a2a30',8,7,4,2);});
const SANDSTONE=canvasTex(16,16,f=>{f('#e2c48c',0,0,16,16);[3,7,11,15].forEach(y=>f('#c8a870',0,y,16,1));[[2,0],[10,4],[5,8],[13,12]].forEach(p=>f('#c8a870',p[0],p[1],1,3));});
function cityHall(r){
  const body=M({map:rep(SANDSTONE,r.W,2.4)}),top=mc('#d8bc84');
  mesh(new THREE.BoxGeometry(r.W,2.4,r.D-.6),[body,body,top,top,body,body],r.cx,1.2,r.cz-.3);
  mesh(new THREE.BoxGeometry(r.W+.2,.25,r.D-.4),mc('#c8a870'),r.cx,2.5,r.cz-.3);
  /* portico */
  mesh(new THREE.BoxGeometry(r.W*.6,.3,1),mc('#d8bc84'),r.cx,2.15,r.z1-.5);
  for(let i=0;i<6;i++)mesh(new THREE.CylinderGeometry(.12,.14,2,8),mc('#f0e2c0'),r.cx-r.W*.27+i*r.W*.108,1,r.z1-.2);
  const ped=new THREE.Shape();ped.moveTo(-r.W*.32,0);ped.lineTo(r.W*.32,0);ped.lineTo(0,.7);ped.lineTo(-r.W*.32,0);
  const pg=new THREE.ExtrudeGeometry(ped,{depth:.9,bevelEnabled:false});mesh(pg,mc('#e2c48c'),r.cx,2.3,r.z1-.95);
  mesh(new THREE.BoxGeometry(1.1,1.4,.1),mc('#5a3a24'),r.cx,.7,r.z1-.55);
  /* clock tower */
  const tw=M({map:rep(SANDSTONE,1.6,5)});
  mesh(new THREE.BoxGeometry(1.6,5,1.6),tw,r.cx,2.5+2.5,r.cz-.5);
  const cm=M({map:CLOCK});[[0,.81,0],[0,-.81,Math.PI],[.81,0,Math.PI/2],[-.81,0,-Math.PI/2]].forEach(c=>{const p=mesh(new THREE.PlaneGeometry(1.1,1.1),cm,r.cx+c[0],6.6,r.cz-.5+c[1]);p.rotation.y=c[2];p.castShadow=false;});
  mesh(new THREE.CylinderGeometry(.95,.95,.5,12),mc('#e2c48c'),r.cx,7.75,r.cz-.5);
  mesh(new THREE.SphereGeometry(.95,12,6,0,Math.PI*2,0,Math.PI/2),M({color:'#7aa890',metalness:.3,roughness:.5,flatShading:true}),r.cx,8,r.cz-.5);
  mesh(new THREE.ConeGeometry(.12,.8,6),mc('#e8b21e'),r.cx,9.3,r.cz-.5);
  glowAt(r.cx,.7,r.z1-.5,1,1.3);
}
/* Story-style steel truss bridge across the river */
function trussBridge(x0,x1,z0,z1,deckY){
  const steel=mc('#5a6a7e'),len=x1-x0,n=12;
  const hgt=k=>{const u=k/n;const a=Math.abs(u-.25),b=Math.abs(u-.75);return .7+Math.max(0,2.6-Math.min(a,b)*7)+(u>.25&&u<.75?.9:0);};
  [z0+.06,z1-.06].forEach(z=>{
    for(let k=0;k<n;k++){
      const xa=x0+len*k/n,xb=x0+len*(k+1)/n,ha=hgt(k),hb=hgt(k+1);
      const top=mesh(new THREE.BoxGeometry(Math.hypot(xb-xa,hb-ha),.12,.12),steel,(xa+xb)/2,deckY+(ha+hb)/2,z);top.rotation.z=Math.atan2(hb-ha,xb-xa);
      mesh(new THREE.BoxGeometry(.08,ha,.08),steel,xa,deckY+ha/2,z);
      const d=mesh(new THREE.BoxGeometry(Math.hypot(xb-xa,hb),.06,.06),steel,(xa+xb)/2,deckY+hb/2,z);d.rotation.z=(k%2?1:-1)*Math.atan2(hb,xb-xa);
    }
    mesh(new THREE.BoxGeometry(len,.12,.12),steel,(x0+x1)/2,deckY+.35,z);
  });
  [x0+len*.25,x0+len*.75].forEach(x=>{mesh(new THREE.BoxGeometry(.5,4.4+deckY,.5),steel,x,(4.4+deckY)/2-.6,z0+.06);mesh(new THREE.BoxGeometry(.5,4.4+deckY,.5),steel,x,(4.4+deckY)/2-.6,z1-.06);mesh(new THREE.BoxGeometry(.3,.3,z1-z0),steel,x,deckY+3.6,(z0+z1)/2);});
  [x0+len*.4,x0+len*.6].forEach(x=>mesh(new THREE.BoxGeometry(.2,.2,z1-z0),steel,x,deckY+hgt(n/2)+.1,(z0+z1)/2));
}
/* big wheel that turns slowly; its bulbs glow at night */
function ferrisWheel(x,z,R){
  const g=new THREE.Group();g.position.set(x,0,z);add(g);
  const white=mc('#f0f2f4'),hub=R+.9;
  [-.5,.5].forEach(dz=>{[-1,1].forEach(s=>{const leg=mesh(new THREE.BoxGeometry(.16,hub+.2,.16),white,s*R*.32,hub/2,dz,g);leg.rotation.z=-s*.33;});});
  const wheel=new THREE.Group();wheel.position.set(0,hub,0);g.add(wheel);
  const bulbs=M({color:'#fff4d0',emissive:'#ffd27a',emissiveIntensity:0});lampMats.push(bulbs);
  [-.32,.32].forEach(dz=>{const ring=mesh(new THREE.TorusGeometry(R,.06,5,40),white,0,0,dz,wheel);ring.castShadow=false;});
  const cars=[];
  for(let i=0;i<14;i++){const a=i/14*Math.PI*2;const sp=mesh(new THREE.BoxGeometry(.05,R,.05),white,Math.cos(a)*R/2,Math.sin(a)*R/2,0,wheel);sp.rotation.z=a-Math.PI/2;
    mesh(new THREE.IcosahedronGeometry(.08,0),bulbs,Math.cos(a)*R,Math.sin(a)*R,.38,wheel).castShadow=false;
    const car=new THREE.Group();car.position.set(Math.cos(a)*R,Math.sin(a)*R,0);wheel.add(car);
    mesh(new THREE.BoxGeometry(.5,.42,.5),mc(['#e05a6a','#3a8ad0','#f0c030','#4ab06a'][i%4]),0,-.32,0,car);mesh(new THREE.BoxGeometry(.4,.16,.52),mc('#2a3a4a'),0,-.24,0,car);
    cars.push(car);}
  mesh(new THREE.CylinderGeometry(.28,.28,1,10),white,0,0,0,wheel).rotation.x=Math.PI/2;
  return {wheel,cars};
}
/* bougainvillea arch over the riverside walk */
function arbourArch(x,y,z){
  const steel=mc('#6a4a7a'),flower=[mc('#e0408a'),mc('#c83070'),mc('#f070b0')];
  [-.8,.8].forEach(dx=>mesh(new THREE.BoxGeometry(.08,1.6,.08),steel,x+dx,y+.8,z));
  const arc=mesh(new THREE.TorusGeometry(.8,.05,4,12,Math.PI),steel,x,y+1.6,z);arc.castShadow=false;
  for(let i=0;i<9;i++){const a=i/8*Math.PI;mesh(new THREE.IcosahedronGeometry(.16+rnd()*.06,0),flower[i%3],x+Math.cos(a)*.8,y+1.6+Math.sin(a)*.8,z+(rnd()-.5)*.1);}
}
/* a fountain whose spray sparkles */
function fountain(x,y,z){
  mesh(new THREE.CylinderGeometry(1.15,1.25,.35,16),mc('#c8c0b0'),x,y+.17,z);
  const w=mesh(new THREE.CylinderGeometry(1,1,.04,16),M({color:'#8ad0f0',roughness:.15,transparent:true,opacity:.85}),x,y+.33,z);w.castShadow=false;
  mesh(new THREE.CylinderGeometry(.18,.24,.9,8),mc('#c8c0b0'),x,y+.6,z);mesh(new THREE.CylinderGeometry(.45,.2,.12,10),mc('#c8c0b0'),x,y+1.05,z);
  const N=40,pos=new Float32Array(N*3),sd=[];for(let i=0;i<N;i++)sd.push(rnd()*6.28,rnd());
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  add(new THREE.Points(geo,new THREE.PointsMaterial({color:'#e8f6ff',size:.1,transparent:true,opacity:.9,depthWrite:false})));
  return t=>{for(let i=0;i<N;i++){const k=((t*.8+sd[i*2+1])%1),a=sd[i*2];pos[i*3]=x+Math.cos(a)*k*.75;pos[i*3+1]=y+1.1+k*1.2-k*k*1.6;pos[i*3+2]=z+Math.sin(a)*k*.75;}geo.attributes.position.needsUpdate=true;};
}

CHAR.jacara={skin:'#d8a070',hair:'#2a1a14',top:'#7a5ab8',stripe:'#b088e0',bottom:'#3a6a30',shoes:'#6a4020',hat:'#e8c870',bun:true};
CHAR.gardenerIvy={skin:'#f2c79a',hair:'#c86a3a',top:'#58a048',bottom:'#6a4a2a',shoes:'#3a2a20',hat:'#d8b860'};
CHAR.botanist={skin:'#c88a5a',hair:'#2a2a30',top:'#eef0f2',coat:'#eef0f2',bottom:'#3a4a6a',shoes:'#2a2a30',glasses:true};
CHAR.commuter={skin:'#e8b88a',hair:'#3a2a20',top:'#3a5a8a',bottom:'#2a2a30',shoes:'#2a2a30',bag:'#6a4a2a'};
CHAR.student={skin:'#f2c79a',hair:'#1a1a20',top:'#9a6ad8',bottom:'#2a3a6a',shoes:'#ffffff',bag:'#e05080',bun:true};
CHAR.jogger={skin:'#a8704a',hair:'#1a1a20',top:'#f05a5a',bottom:'#2a2a30',shoes:'#f0f0f0',cap:'#ffffff',logo:'#f05a5a'};
CHAR.tourist={skin:'#f2c79a',hair:'#c86a3a',top:'#f0d048',stripe:'#e05080',bottom:'#e8e0d0',shoes:'#8a5a30',hat:'#f4f0e6'};
CHAR.suit={skin:'#e8b88a',hair:'#2a2a30',top:'#2a2a3a',stripe:'#8a2030',bottom:'#2a2a3a',shoes:'#1a1a20',bag:'#3a2a20'};
CHAR.lifeguard={skin:'#c88a5a',hair:'#e8c870',top:'#e83a3a',stripe:'#f0d030',bottom:'#f0d030',shoes:'#e83a3a',cap:'#f0d030',logo:'#e83a3a'};
CHAR.pilot={skin:'#d8a070',hair:'#2a2a30',top:'#f4f6f8',stripe:'#2ea89a',bottom:'#2a3a5a',shoes:'#1a1a20',cap:'#2a3a5a',logo:'#f0c030'};
CHAR.elder={skin:'#e8b88a',hair:'#e0e0e0',top:'#8a6a4a',bottom:'#5a5a50',shoes:'#3a2a20',hat:'#c8b890',scale:.95};

/* ================= Riverbend City ================= */
const RB=newLoc('riverbend',{name:'Riverbend City',sub:'Brisbane River · Gym 1 · Grass',yaw:0});
(function(L){
  const W=56,H=40,p=Plan(W,H,'.'),ter=p.ter,obj=p.obj;
  /* the river winds through the middle in an S-bend */
  const rc=y=>28+5*Math.sin(y/39*Math.PI*2);
  ter.each((x,y)=>Math.abs(x-rc(y))<=2.6?'~':null);
  ter.rect(25,18,31,21,'~');
  /* riverside walks on both banks */
  ter.each((x,y,c)=>c!=='~'&&x>rc(y)+2.6&&x<=rc(y)+4.6?'+':null);
  ter.each((x,y,c)=>c!=='~'&&y<17&&x<rc(y)-2.6&&x>=rc(y)-4.4?'_':null);
  /* botanic gardens, north-west */
  ter.ellipse(12.5,7.5,11,6.2,except('~+_',','),.35);
  ter.ellipse(19.5,6,2.8,1.9,'~',.2);
  ter.path([[11,9],[11,18]],1.3,'_');
  ter.path([[3,12],[7,11],[11,11],[15,10],[19,9.5],[22,8],[24,6]],1.2,'_');
  ter.path([[5,3],[5,8],[3,12]],1.1,'_');
  /* civic plaza on the main road */
  ter.rect(3,13,19,17,'+');
  /* main road with a bridge over the river */
  ter.each((x,y,c)=>(y===19||y===20)?(x>=25&&x<=31?'b':'='):null);
  ter.each((x,y,c)=>(y===18||y===21)&&c!=='~'?'+':null);
  /* Paddington hill, a terrace that ends in cliffs above the river */
  ter.ellipse(11,31,9.5,5.6,except('~','^'),.25);
  ter.path([[4,30],[18,30]],1,'%');ter.path([[5,35],[17,35]],1,'%');ter.path([[11,26],[11,35]],1.2,'%');
  ter.rect(17,31,19,33,'*');
  ter.set(11,25,'S');ter.path([[11,22],[11,24]],1.2,'_');
  /* CBD plaza, north-east */
  ter.each((x,y,c)=>c!=='~'&&y>=2&&y<=17&&x>=rc(y)+4.6&&x<=53?'+':null);
  /* South Bank: lawns, a city beach with a lagoon, and the big wheel */
  ter.each((x,y,c)=>c==='.'&&y>=22&&y<=37&&x>rc(y)+4.6&&x<=44?',':null);
  ter.ellipse(38,31,5.6,3.4,':',.2);ter.ellipse(38.5,31.4,3.4,1.7,'~',.1);
  ter.rect(31,34,35,37,'+');
  /* airport and tarmac, south-east */
  ter.rect(45,26,54,33,'+');ter.rect(40,34,55,39,'=');ter.path([[49,21],[49,26]],2.2,'=');
  /* CityCat pontoon */
  ter.rect(34,11,35,13,cur=>cur==='~'?'b':null);
  ter.rect(25,29,25,31,cur=>cur==='~'?'b':null);

  /* buildings */
  p.build(8,5,14,8,r=>{glasshouse(r,0);});
  p.build(5,14,9,17,r=>healingCentre(r));
  p.build(13,15,17,17,r=>generalStore(r,0,'#8a5ab8'));
  const q=(x0,y0,wall,line,roof,door,doorHi)=>ter.rect(x0,y0,x0+4,y0+2,'^')&&p.build(x0,y0,x0+4,y0+2,(r,y)=>qlder({cx:r.cx,cz:r.cz,y,W:r.W,D:r.D,wallTex:boards(wall,line),front:houseFront(wall,line,door,doorHi),roof}));
  q(5,27,'#f2ead8','#d8ccb0',T.roofRed,'#3a6a4a','#5a8a6a');
  q(13,27,'#cfe0ea','#aac0cc',T.roofGreen,'#8a3a2a','#aa5a4a');
  q(4,32,'#f4e2a8','#d8c488',T.roofRed,'#3a4a8a','#5a6aaa');
  q(13,32,'#f0d8e0','#d4b8c4',T.roofBlue,'#4a7a3a','#6a9a5a');
  const towers=[[38,3,40,5,11,'#7aa0c0','#c8e0f4','flat'],[42,2,45,4,16,'#5a7a9a','#a8c8e4','step'],[47,2,49,4,10,'#8a9aaa','#d8e4ee','slant'],[51,3,53,5,13,'#4a6a8a','#9ac0e0','flat'],
    [38,9,40,11,8,'#9aaab8','#e0e8f0','slant'],[43,9,45,11,18,'#6a8aa8','#b8d4ec','spire'],[48,9,50,11,12,'#5a7088','#a0bcd8','step'],[52,8,53,11,9,'#8aa0b4','#d0e0ec','flat'],
    [38,13,40,15,7,'#a0907a','#e8dcc4','flat'],[42,13,44,15,10,'#4a6a8a','#9ac0e0','slant']];
  towers.forEach(t=>p.build(t[0],t[1],t[2],t[3],r=>fadeGroup(r,t[4]+1,()=>skyscraper(r,t[4],t[5],t[6],t[7]))));
  p.build(46,13,51,16,r=>fadeGroup(r,8,()=>cityHall(r)));
  p.build(46,28,52,31,r=>terminal(r,0));
  obj.rect(45,6,46,7,'X');
  obj.rect(32,35,34,35,'X');
  obj.rect(44,36,50,38,'X');
  /* trees, flowers and the rest */
  p.border(2,'TTJT');
  p.sprinkle('JJTf',2,2,24,13,.22,',');
  p.sprinkle('ff',2,2,24,13,.1,',');
  [[3,9],[6,4],[16,3],[22,10],[23,4],[4,12]].forEach(c=>obj.set(c[0],c[1],'J'));
  p.sprinkle('JJT',3,22,23,25,.18,'.');
  p.sprinkle('J',2,26,20,37,.16,'^');
  p.sprinkle('TTJ',36,22,55,25,.3,'.');p.sprinkle('TT',51,26,55,33,.3,'.');
  p.sprinkle('P',31,22,44,37,.035,',:');
  [[2,13],[2,17],[20,13],[20,17]].forEach(c=>obj.set(c[0],c[1],'J'));
  [[33,28],[43,29],[33,32],[43,33],[36,27],[41,27]].forEach(c=>obj.set(c[0],c[1],'P'));
  /* lamps and benches */
  [[4,18],[10,18],[19,18],[22,21],[34,18],[40,18],[46,18],[53,18],[34,21],[40,21],[46,21]].forEach(c=>obj.set(c[0],c[1],'L'));
  [[37,4],[37,10],[37,14],[33,26],[31,30]].forEach(c=>obj.set(c[0],c[1],'L'));
  [[42,7],[49,7],[18,32],[8,10],[16,12]].forEach(c=>obj.set(c[0],c[1],'B'));
  obj.rect(18,31,19,31,' ');obj.set(19,33,'X');
  [[35,29],[41,29]].forEach(c=>obj.set(c[0],c[1],'X'));
  obj.rect(55,34,55,39,'X');
  const SIGNS=[[2,16,['RIVERBEND CITY','Where the river bends and the jacarandas bloom.']],
    [12,9,['RIVERBEND GYM','Leader: Jacara. "Rooted in patience, blooming with strength."']],
    [10,9,['RIVERBEND BOTANIC GARDENS','Home of the oldest glasshouse in Australis.']],
    [12,23,['PADDINGTON HILL','Queenslander houses and a lookout over the river cliffs. Up the stairs.']],
    [36,17,['RIVERWALK','Follow the river south to South Bank and its city beach.']],
    [30,24,['SOUTH BANK','City beach, lagoon and the Wheel of Riverbend.']],
    [47,25,['AUSTRALIS AIR','Flights to Coralport need the Jacaranda Badge.']],
    [53,22,['EAST: Route 3, the Surf Coast.','Beaches, surf and dune grass. Watch for wild Pokémon in the heath.']],
    [44,17,['CITY HALL','Open weekdays. The Ministry of Wildlife Trade has an office on level 3.']]];
  const PEOPLE=[[20,18,'commuter',['Jacara\'s glasshouse is the oldest building in Riverbend.','Some say the jacaranda inside was the very first one in Australis.']],
    [16,10,'student',['When the jacarandas bloom, uni exams are close.','Every Riverbend student knows that feeling!']],
    [6,10,'gardener',['The gardens run all the way down to the river.','Take the path east and you\'ll come out on the riverwalk.']],
    [36,7,'jogger',['Morning! I run the riverwalk loop every day.','Across the bridge and down to South Bank. Best view in the city!']],
    [47,18,'suit',['...Yes, Minister. The shipment will be ready.','Oh! A kid. Move along, nothing to see here.'],Math.PI],
    [34,24,'tourist',['This beach is in the middle of a city! And it\'s free!','I\'ve already been on the big wheel three times.']],
    [38,28,'lifeguard',['Swim between the flags, champ.','The lagoon\'s shallow, but I keep an eye on everyone.']],
    [35,36,'kid',['From the top of the wheel you can see Paddington Hill!','And the river bends like a snake. Like a GIANT snake.']],
    [16,31,'elder',['I\'ve lived on this hill sixty years.','Back then, wild Pokémon nested on the cliffs. Not so many now...','People say men come at night with cages. I don\'t like it.'],Math.PI/2],
    [52,32,'pilot',['Australis Air flies from here to every corner of the region.','Your first badge will get you a seat to Coralport.']]];
  SIGNS.concat(PEOPLE).forEach(a=>obj.set(a[0],a[1],' '));

  const built=buildMap(L,p,{tex:{road:T.tarmac,plaza:T.pave,dirt:T.path},bank:T.rock,cliff:T.rock,water:{color:'#cfe2d8',bedTex:T.bed},
    skirt:[TREE.gum,TREE.gum,TREE.jac,TREE.olive],lampCol:'#2f3a4a',tufts:160,
    waterTalk:['The wide, brown Brisbane River... er, Riverbend River. CityCat ferries glide past.'],
    benchTalk:['A park bench under the jacarandas. Purple petals drift down around you.']});
  const g=L.grid,wp=(tx,ty)=>g.w(tx,ty);
  /* landmarks that sit on top of the map */
  const [bx0]=wp(25,19),[bx1]=wp(31,19),[,bz0]=wp(25,19),[,bz1]=wp(25,20);
  trussBridge(bx0-.5,bx1+.5,bz0-.5,bz1+.5,.14);
  const [fx,fz]=wp(45,6);const spray=fountain(fx+.5,0,fz+.5);
  const [wx,wz]=wp(33,35);const fw=ferrisWheel(wx,wz,3.4);
  for(let y=22;y<=37;y+=2){const tx=Math.round(rc(y)+3.6);if(g.blocked(tx,y))continue;const [ax,az]=wp(tx,y);arbourArch(ax,0,az);}
  const [px,pz]=wp(47,37);plane(px,0,pz,Math.PI);
  /* lagoon lifeguard flags */
  [[35,29],[41,29]].forEach(c=>{const [x,z]=wp(c[0],c[1]);mesh(new THREE.BoxGeometry(.05,1.3,.05),mc('#d8d8d8'),x,.65,z);mesh(new THREE.BoxGeometry(.5,.32,.02),mc('#e83a3a'),x+.27,1.12,z);mesh(new THREE.BoxGeometry(.5,.16,.025),mc('#f0d030'),x+.27,1.04,z);});
  /* lookout telescope on the cliff */
  const [lx,lz]=wp(19,33);mesh(new THREE.CylinderGeometry(.05,.07,.9,6),metal,lx,1.45,lz);const scope=mesh(new THREE.CylinderGeometry(.08,.12,.6,8),mc('#3a5a8a'),lx,2,lz);scope.rotation.z=1.2;
  L.talk.set('19,33',['A coin telescope. Across the river, the CBD towers sparkle.','Far to the south-east, a white airliner climbs out over the bay.']);
  SIGNS.forEach(a=>tileSign(L,a[0],a[1],a[2]));
  /* doors */
  door(L,11,8,{to:'rbgym',spawn:{tx:7,ty:15,face:[0,-1]}});
  door(L,7,17,{say:['Riverbend Healing Centre.','You rest for a moment. Your team feels refreshed!']});
  door(L,15,17,{say:['Riverbend General Store.','Potions, capture gear and mango smoothies. A sign says "Back in five minutes".']});
  [48,49,50].forEach(x=>door(L,x,31,{flight:true}));
  [48,49].forEach(x=>door(L,x,16,{say:['Riverbend City Hall.','A guard at the desk: "Level 3 is closed to the public today. Ministry business."']}));
  door(L,7,29,{say:['A Queenslander on tall stumps. A cool breeze blows under the house.']});
  door(L,15,29,{say:['Nobody\'s home. A Warblet is singing on the veranda railing.']});
  door(L,6,34,{say:['A note on the door: "Gone to the markets at South Bank. Back by lunch!"']});
  door(L,15,34,{say:['Through the window you can see a wall covered in Gym Leader posters.']});
  towers.forEach(t=>{for(let x=t[0];x<=t[2];x++)L.talk.set(x+','+t[3],['A glass office tower. Everyone inside is very busy.']);});
  talkRect(L,45,6,46,7,['The Queen Street fountain. Coins glint at the bottom. Somebody wished for a shiny Pokémon.']);
  talkRect(L,32,35,34,35,['The Wheel of Riverbend. It\'s closed for maintenance today, but it still turns for the lights.']);
  talkRect(L,44,36,50,38,['An Australis Air plane being refuelled for the next flight.']);
  L.airport={tx:49,ty:32,face:[0,1]};
  PEOPLE.forEach(a=>npc(L,()=>human(CHAR[a[2]]),a[0],a[1],a[3],a[4]?{rot:a[4]}:null));
  L.spawn={tx:1,ty:19,face:[1,0]};
  L.exit=(tx,ty,dx)=>{
    if(tx<=0&&dx===-1)return {to:'bloom',spawn:{tx:30,ty:ty<=19?7:8,face:[-1,0]},card:['Route 2','Valley farmland']};
    if(tx>=W-1&&dx===1)return {to:'route3',spawn:{tx:1,ty:ty<=19?15:16,face:[1,0]},card:['Route 3','The Surf Coast']};
    return null;
  };
  /* ferry, petals and wheel */
  const ferry=boat(0,-.08,0,{len:2.6,hull:'#f4f6f8',stripe:'#2e6aa8'});ferry.scale.setScalar(.8);
  const PETALS=70,pp=new Float32Array(PETALS*3),ps=[];for(let i=0;i<PETALS;i++)ps.push(rnd()*10,rnd(),rnd());
  const pgeo=new THREE.BufferGeometry();pgeo.setAttribute('position',new THREE.BufferAttribute(pp,3));
  const petals=add(new THREE.Points(pgeo,new THREE.PointsMaterial({color:'#b08ae0',size:.12,depthWrite:false,transparent:true,opacity:.95})));petals.frustumCulled=false;
  L.update=t=>{
    if(built.water)built.water.offset.y=-t*.08;
    const k=(Math.sin(t*.05)+1)/2,fy=23+k*14,[fxw,fzw]=g.w(0,0);
    ferry.position.set(rc(fy)+fxw,-.08+Math.sin(t*1.4)*.03,fy+fzw);ferry.rotation.y=Math.cos(t*.05)>0?-Math.PI/2:Math.PI/2;
    for(let i=0;i<PETALS;i++){const s=ps[i*3];pp[i*3+1]=target.y+3.4-((s*.31+t*.18)%1)*3.4;pp[i*3]=target.x+(ps[i*3+1]-.5)*22+Math.sin(t*1.3+s)*.3;pp[i*3+2]=target.z+(ps[i*3+2]-.5)*16;}
    pgeo.attributes.position.needsUpdate=true;
    fw.wheel.rotation.z=t*.12;fw.cars.forEach(c=>c.rotation.z=-t*.12);
    spray(t);
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
  L.exit=(tx,ty,dx,dy)=>(ty>=15&&dy===1)?{to:'riverbend',spawn:{tx:11,ty:9,face:[0,1]}}:null;
  L.update=t=>{wp.offset.set(t*.03,t*.05);};
})(RBG);
