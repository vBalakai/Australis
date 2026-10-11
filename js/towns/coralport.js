/* Australis: Coralport (Cairns), home of Gym 2, and Marlee's glass-bottomed boat gym */

CHAR.marlee={skin:'#d8a070',hair:'#e8c870',top:'#2a4a8a',stripe:'#40c0d0',bottom:'#2a4a8a',shoes:'#f0c030',bun:true};
CHAR.sailor={skin:'#e8b88a',hair:'#5a3a24',top:'#f4f6f8',stripe:'#2a4a8a',bottom:'#2a4a8a',shoes:'#2a2a30',cap:'#f4f6f8',logo:'#2a4a8a'};
CHAR.swimmer={skin:'#a8704a',hair:'#1a1a20',top:'#f08030',stripe:'#ffffff',bottom:'#2a6a8a',shoes:'#f08030'};
CHAR.deckhand={skin:'#c88a5a',hair:'#2a2a30',top:'#2ea89a',bottom:'#3a3a44',shoes:'#f4f6f8',cap:'#2ea89a',logo:'#ffffff'};
CHAR.tourist={skin:'#f2c79a',hair:'#c86a3a',top:'#f0d048',stripe:'#e05080',bottom:'#e8e0d0',shoes:'#8a5a30',hat:'#f4f0e6'};
CHAR.fisher={skin:'#c88a5a',hair:'#8a8a8a',top:'#5a7a4a',bottom:'#4a4a3a',shoes:'#3a2a20',hat:'#c8b070'};
CHAR.lagoonKid={skin:'#e8b88a',hair:'#3a2a20',top:'#40c0d0',bottom:'#f08030',shoes:'#f0c030',scale:.8};

/* coral and reef fish under the water */
const CORAL=['#e86a7a','#f0a040','#9a5ad0','#f0e070','#ff8a9a','#5ad0c0'];
function corals(x0,x1,z0,z1,y,n){for(let i=0;i<n;i++){const c=mesh(new THREE.DodecahedronGeometry(.15+rnd()*.25,0),mc(CORAL[i%CORAL.length]),x0+rnd()*(x1-x0),y,z0+rnd()*(z1-z0));c.scale.y=.6+rnd()*1.2;c.castShadow=false;}}
const fishes=[];
function fishSchool(cx,y,cz,n,r){for(let i=0;i<n;i++){const f=mesh(new THREE.ConeGeometry(.07,.24,4),mc(['#f0c030','#40c0d0','#f08030','#ffffff'][i%4]),cx,y,cz);f.rotation.z=Math.PI/2;f.castShadow=false;f.userData={cx,cz,y,r:r*(.4+rnd()*.6),ph:rnd()*6,sp:.4+rnd()*.5};fishes.push(f);}}
function swimFish(list,t){list.forEach(f=>{const u=f.userData,a=t*u.sp+u.ph;f.position.set(u.cx+Math.cos(a)*u.r,u.y+Math.sin(a*2)*.05,u.cz+Math.sin(a)*u.r);f.rotation.y=-a;});}

/* ================= Coralport ================= */
const CP=newLoc('coralport',{name:'Coralport',sub:'Far North · Gym 2 · Water',yaw:0,grid:Grid(34,22,-17,-11)});
(function(L){
  PARENT=L.group;const g=L.grid;
  groundBox(-44,44,-32,4,-.6,0,T.lush);
  groundBox(-44,44,4,40,-.9,-.55,T.reefFloor,T.sand);
  const wSea=waterPlane(-44,44,4,40,-.14,T.water,{opacity:.72,color:'#bff4f0'});
  corals(-6,8,4.5,12,-.5,60);
  const myFish=[];const before=fishes.length;fishSchool(-3,-.35,7,7,1.4);fishSchool(4,-.35,9,6,1.2);for(let i=before;i<fishes.length;i++)myFish.push(fishes[i]);
  /* street, esplanade, beach and jetty */
  slab(-44,44,-5,-3,0,.03,T.pave);
  slab(-44,44,1,3,0,.06,T.boardwalk,'#6a4a2a');
  slab(-44,44,3,4,0,.015,T.sand,'#c8b480');
  slab(-1,1,3,8.2,.05,.08,T.boardwalk,'#6a4a2a');
  for(let z=4;z<=8;z+=1)[-.95,.95].forEach(x=>mesh(new THREE.CylinderGeometry(.07,.07,.8,6),mc('#6a4a2a'),x,-.3,z));
  [-1.05,1.05].forEach(x=>{mesh(new THREE.BoxGeometry(.06,.06,5),railMat,x,.5,5.6);for(let z=3.4;z<=8;z+=1.1)mesh(new THREE.BoxGeometry(.07,.42,.07),railMat,x,.3,z);});
  /* lagoon pool on the esplanade */
  const lg=rectOf(L,13,8,19,10);slab(lg.x0-.2,lg.x1+.2,lg.z0-.2,lg.z1+.2,0,.06,T.sand,'#c8b480');
  const wLag=waterPlane(lg.x0+.1,lg.x1-.1,lg.z0+.1,lg.z1-.1,.08,T.water,{opacity:.9,color:'#a8fff4'});
  /* gym boat moored at the end of the jetty */
  const gb=new THREE.Group();gb.position.set(0,-.1,10);add(gb);
  mesh(new THREE.BoxGeometry(6,.7,3),mc('#f4f6f8'),0,.1,0,gb);mesh(new THREE.BoxGeometry(6.02,.16,3.02),mc('#2e6aa8'),0,.38,0,gb);
  bowPrism(1.5,1.6,.7,'#f4f6f8',0,.45,1.5,gb);
  mesh(new THREE.BoxGeometry(5.6,.08,2.6),M({map:rep(T.boardwalk,5.6,2.6)}),0,.48,0,gb);
  mesh(new THREE.BoxGeometry(2,1,1.4),mc('#f4f6f8'),1.4,1,.1,gb);mesh(new THREE.BoxGeometry(2.02,.3,1.42),mc('#3a5a7a'),1.4,1.2,.1,gb);
  mesh(new THREE.CylinderGeometry(.04,.04,2.6,5),mc('#d8d8d8'),-1.8,1.8,0,gb);
  const flag=mesh(new THREE.BoxGeometry(.7,.42,.03),mc('#2ea89a'),-1.42,2.85,0,gb);
  mesh(new THREE.BoxGeometry(1,.06,.9),M({map:rep(T.wood,1,1)}),0,.35,-1.9,gb);
  /* buildings */
  const ar=rectOf(L,1,2,6,5);terminal(ar,0);slab(-28,-11,-12,-6,0,.03,T.tarmac,'#3a3e46');plane(-20,0,-9,0);
  healingCentre(rectOf(L,9,2,13,5));
  generalStore(rectOf(L,22,3,26,5),0,'#2ea89a');
  const q=(a,c,b,d,wall,line,roof,door,doorHi)=>{const r=rectOf(L,a,c,b,d);qlder({cx:r.cx,cz:r.cz,W:r.W,D:r.D,wallTex:boards(wall,line),front:houseFront(wall,line,door,doorHi),roof,lift:.75});};
  q(28,3,32,5,'#f8f0e0','#dccfb8',T.roofTeal,'#e07a2a','#f09a4a');
  /* palms, marina, rainforest hills */
  [[2,11],[6,11],[10,11],[21,11],[25,11],[29,11],[7,8],[23,8],[31,8],[11,9]].forEach(p=>{const [x,z]=g.w(p[0],p[1]);palm(x,0,z,.9+rnd()*.25,(rnd()-.5)*2);g.block(p[0],p[1]);L.talk.set(p[0]+','+p[1],['A coconut palm, rustling in the sea breeze.']);});
  [[-12,7,0],[-9,9.5,Math.PI],[9,7.5,0],[12,10,Math.PI],[15,7.2,0]].forEach((b,i)=>boat(b[0],-.15,b[1],{rot:b[2],mast:i%2===0,stripe:['#e05040','#2ea89a','#f0c030'][i%3]}));
  hills([[-26,0,-24,7,5,5],[-14,0,-26,8,6,5],[0,0,-27,9,7,6],[14,0,-26,8,6,5],[27,0,-23,7,5,5],[36,0,-14,6,4,5],[-36,0,-14,6,4,5]].map(h=>h));
  const forest=[TREE.gum,TREE.gum,TREE.jac,TREE.gum];
  borderTrees(L,[0,1],[0,33],forest,(tx,ty)=>ty>=14);
  for(let i=0;i<70;i++){const X=(rnd()*2-1)*34,Z=-28+rnd()*16;if(Math.abs(X)<17.2&&Z>-11.4)continue;spr(rnd()<.3?TREE.jac:TREE.gum,X,0,Z,2.2,2.8,.6,true);}
  [[4,11],[14,11],[27,11]].forEach(p=>tileLamp(L,p[0],p[1],'#2e6a8a'));
  tileSign(L,8,7,['CORALPORT','Gateway to the Reef.']);
  tileSign(L,18,13,['CORALPORT GYM','Leader: Marlee. Board at the end of the jetty.']);
  /* grid */
  g.block(0,0,33,1);g.block(0,0,0,21);g.block(33,0,33,21);
  g.block(0,15,33,21);g.open(16,15,17,18);for(let y=15;y<=18;y++){g.setH(16,y,.13);g.setH(17,y,.13);}
  g.block(1,2,6,5);g.block(9,2,13,5);g.block(22,3,26,5);g.block(28,3,32,5);g.block(13,8,19,10);
  talkRect(L,13,8,19,10,['The esplanade lagoon. Locals swim here because the sea has box jellyfish in summer.']);
  for(let x=0;x<34;x++)if(x<16||x>17)L.talk.set(x+',15',['Clear turquoise water. You can see coral right below the surface!']);
  markRect(L.paved,0,6,33,7);markRect(L.paved,0,12,33,14);markRect(L.paved,16,15,17,18);
  door(L,3,5,{flight:true});door(L,4,5,{flight:true});
  door(L,11,5,{say:['Coralport Healing Centre.','You rest for a moment. Your team feels refreshed!']});
  door(L,24,5,{say:['Coralport General Store.','Reef-safe sunscreen, snorkels and capture gear.']});
  door(L,30,5,{say:['A Queenslander painted for the tropics. Wind chimes made of shells clink on the veranda.']});
  door(L,16,19,{to:'cpgym',spawn:{tx:6,ty:14,face:[0,-1]}});door(L,17,19,{to:'cpgym',spawn:{tx:6,ty:14,face:[0,-1]}});
  L.airport={tx:4,ty:6,face:[0,1]};
  npc(L,()=>human(CHAR.deckhand),15,13,['Marlee runs the gym from her glass-bottomed boat.','Walk to the end of the jetty and climb aboard!']);
  npc(L,()=>human(CHAR.tourist),8,12,['I came all this way for the reef!','You can see the coral right from the jetty. It\'s like a painting.']);
  npc(L,()=>human(CHAR.fisher),17,17,['Nothing\'s biting today...','But I saw a Ringlet hiding under the jetty. Blue rings and all!'],{rot:Math.PI});
  npc(L,()=>human(CHAR.lagoonKid),12,9,['The lagoon is the best!','I\'m going to be a dive instructor like Marlee one day.']);
  L.spawn={tx:4,ty:6,face:[0,1]};
  scatterTufts(L,90,T.tuft,.25);
  L.update=t=>{
    wSea.offset.set(t*.02,-t*.05);wLag.offset.set(t*.03,t*.04);
    gb.position.y=-.1+Math.sin(t*1.1)*.03;gb.rotation.z=Math.sin(t*.9)*.01;flag.rotation.y=Math.sin(t*3)*.25;
    boats.forEach(b=>{if(b.parent===L.group){b.position.y=b.userData.y+Math.sin(t*1.3+b.userData.ph)*.04;b.rotation.z=Math.sin(t+b.userData.ph)*.04;}});
    palms.forEach(p=>{if(p.parent===L.group)p.userData.top.rotation.z=Math.sin(t*.9+p.userData.ph)*.06;});
    swimFish(myFish,t);
  };
})(CP);

/* ================= Coralport Gym: the glass-bottomed boat ================= */
const CPG=newLoc('cpgym',{name:'Coralport Gym',sub:'Glass-bottomed boat · Water',yaw:0,grid:Grid(13,15,-6.5,-7.5)});
(function(L){
  PARENT=L.group;const g=L.grid;
  groundBox(-60,60,-60,60,-2.4,-1.6,T.reefFloor,T.sand);
  corals(-3,3,-3,3,-1.6,40);corals(-12,12,-12,12,-1.6,40);
  const myFish=[];const before=fishes.length;fishSchool(0,-1.2,0,10,1.6);fishSchool(-6,-1.1,4,6,1.2);for(let i=before;i<fishes.length;i++)myFish.push(fishes[i]);
  const wSea=waterPlane(-60,60,-60,60,-.55,T.water,{opacity:.62,color:'#bff4f0'});
  /* hull and deck, with a glass panel in the middle */
  const hull=mc('#f4f6f8');
  mesh(new THREE.BoxGeometry(13.4,1,.4),hull,0,-.35,7.3);mesh(new THREE.BoxGeometry(.4,1,15),hull,-6.7,-.35,0);mesh(new THREE.BoxGeometry(.4,1,15),hull,6.7,-.35,0);
  bowPrism(6.9,-3.6,.95,'#f4f6f8',0,.1,-7.5);
  slab(-6.5,6.5,-7.6,-7.5,-.1,.2,T.boardwalk,'#5a3a20');
  const deck=(x0,x1,z0,z1)=>slab(x0,x1,z0,z1,-.1,.2,T.boardwalk,'#5a3a20');
  deck(-6.5,6.5,-7.5,-2.5);deck(-6.5,6.5,2.5,7.5);deck(-6.5,-2.5,-2.5,2.5);deck(2.5,6.5,-2.5,2.5);
  const glass=mesh(new THREE.BoxGeometry(5,.04,5),GLASS,0,.06,0);glass.castShadow=false;
  for(let i=0;i<=5;i++){mesh(new THREE.BoxGeometry(.05,.05,5),mc('#c8d4dc'),-2.5+i,.09,0).castShadow=false;mesh(new THREE.BoxGeometry(5,.05,.05),mc('#c8d4dc'),0,.09,-2.5+i).castShadow=false;}
  [-6.4,6.4].forEach(x=>{mesh(new THREE.BoxGeometry(.06,.06,15),railMat,x,.6,0);for(let z=-7;z<=7;z+=1.2)mesh(new THREE.BoxGeometry(.07,.5,.07),railMat,x,.35,z);});
  mesh(new THREE.BoxGeometry(12.8,.06,.06),railMat,0,.6,-7.4);
  /* helm, crates, life rings */
  const [hx,hz]=g.w(6,1);mesh(new THREE.BoxGeometry(.6,.7,.4),mc('#8a5a30'),hx,.45,hz);const wheel=mesh(new THREE.TorusGeometry(.32,.04,5,12),mc('#c08848'),hx,.95,hz+.22);g.block(6,1);L.talk.set('6,1',['The helm. Marlee steers the gym out to the reef every morning.']);
  [[2,11],[10,3],[11,3]].forEach(p=>{const [x,z]=g.w(p[0],p[1]);mesh(new THREE.BoxGeometry(.8,.7,.8),M({map:rep(T.wood,1,1)}),x,.45,z);g.block(p[0],p[1]);L.talk.set(p[0]+','+p[1],['A crate of snorkels and flippers.']);});
  const [rx,rz]=g.w(10,12);mesh(new THREE.BoxGeometry(.1,.9,.1),railMat,rx,.55,rz);mesh(new THREE.TorusGeometry(.26,.08,6,12),mc('#e05040'),rx,.8,rz+.1);g.block(10,12);L.talk.set('10,12',['A life ring. Safety first on Marlee\'s boat!']);
  g.block(0,0,12,0);g.block(0,0,0,14);g.block(12,0,12,14);
  for(let y=5;y<=9;y++)for(let x=4;x<=8;x++)g.setH(x,y,.08);
  for(let y=0;y<15;y++)for(let x=0;x<13;x++)if(!(x>=4&&x<=8&&y>=5&&y<=9))g.setH(x,y,.1);
  npc(L,()=>human(CHAR.sailor),3,7,['Sailor Finn: "Look down! The whole reef is right under your feet."','"Marlee\'s Dugling loves to nap on the sea floor."'],{rot:Math.PI/2});
  npc(L,()=>human(CHAR.swimmer),9,10,['Swimmer Kai: "I swam laps around this boat this morning!"','"Marlee\'s Pokémon are slow, but they just won\'t go down."'],{rot:-Math.PI/2});
  gymLeader(L,()=>human(CHAR.marlee),6,2,{badge:'reef',
    intro:['G\'day and welcome aboard! I\'m Marlee, Coralport\'s Gym Leader.','Out here on the reef, patience wins. My Pokémon can outlast anything.','Let\'s see how long you can stay afloat!'],
    battle:['Gym Leader Marlee sent out Chinchou!','Chinchou\'s Thunder Wave crackled across the deck!','Chinchou fainted! Marlee sent out Wingull!','Wingull fainted! Marlee sent out Dugling!','Dugling used Rest and fell asleep...','Your partner pressed the attack before it woke up. Dugling fainted!','Marlee: "Ha! You rode that wave all the way in. Well done!"','You received the Reef Badge!','Australis Air will now fly you to Stormhaven.'],
    after:['Next stop is Stormhaven, up in the Top End.','Ray\'s Electric Pokémon hit hard and fast. Bring something that can take a jolt!']});
  L.spawn={tx:6,ty:14,face:[0,-1]};
  L.exit=(tx,ty,dx,dy)=>(ty>=14&&dy===1)?{to:'coralport',spawn:{tx:16,ty:18,face:[0,-1]}}:null;
  L.update=t=>{wSea.offset.set(t*.02,-t*.04);swimFish(myFish,t);wheel.rotation.z=Math.sin(t*.5)*.3;};
})(CPG);
