/* Australis: Coralport (Cairns), home of Gym 2, and Marlee's glass-bottomed boat gym */

CHAR.marlee={skin:'#d8a070',hair:'#e8c870',top:'#2a4a8a',stripe:'#40c0d0',bottom:'#2a4a8a',shoes:'#f0c030',bun:true};
CHAR.sailor={skin:'#e8b88a',hair:'#5a3a24',top:'#f4f6f8',stripe:'#2a4a8a',bottom:'#2a4a8a',shoes:'#2a2a30',cap:'#f4f6f8',logo:'#2a4a8a'};
CHAR.swimmer={skin:'#a8704a',hair:'#1a1a20',top:'#f08030',stripe:'#ffffff',bottom:'#2a6a8a',shoes:'#f08030'};
CHAR.deckhand={skin:'#c88a5a',hair:'#2a2a30',top:'#2ea89a',bottom:'#3a3a44',shoes:'#f4f6f8',cap:'#2ea89a',logo:'#ffffff'};
CHAR.tourist={skin:'#f2c79a',hair:'#c86a3a',top:'#f0d048',stripe:'#e05080',bottom:'#e8e0d0',shoes:'#8a5a30',hat:'#f4f0e6'};
CHAR.fisher={skin:'#c88a5a',hair:'#8a8a8a',top:'#5a7a4a',bottom:'#4a4a3a',shoes:'#3a2a20',hat:'#c8b070'};
CHAR.ranger={skin:'#a8704a',hair:'#3a2a20',top:'#7a8a4a',bottom:'#5a5a3a',shoes:'#4a3020',hat:'#a8904a'};
CHAR.auntie={skin:'#8a5a3a',hair:'#d8d8d8',top:'#e05080',bottom:'#5a3a6a',shoes:'#2a2a30',bun:true};
CHAR.lagoonKid={skin:'#e8b88a',hair:'#3a2a20',top:'#40c0d0',bottom:'#f08030',shoes:'#f0c030',scale:.8};

/* coral and reef fish under the water */
const CORAL=['#e86a7a','#f0a040','#9a5ad0','#f0e070','#ff8a9a','#5ad0c0'];
function corals(x0,x1,z0,z1,y,n){for(let i=0;i<n;i++){const c=mesh(new THREE.DodecahedronGeometry(.15+rnd()*.25,0),mc(CORAL[i%CORAL.length]),x0+rnd()*(x1-x0),y,z0+rnd()*(z1-z0));c.scale.y=.6+rnd()*1.2;c.castShadow=false;}}
const fishes=[];
function fishSchool(cx,y,cz,n,r){for(let i=0;i<n;i++){const f=mesh(new THREE.ConeGeometry(.07,.24,4),mc(['#f0c030','#40c0d0','#f08030','#ffffff'][i%4]),cx,y,cz);f.rotation.z=Math.PI/2;f.castShadow=false;f.userData={cx,cz,y,r:r*(.4+rnd()*.6),ph:rnd()*6,sp:.4+rnd()*.5};fishes.push(f);}}
function swimFish(list,t){list.forEach(f=>{const u=f.userData,a=t*u.sp+u.ph;f.position.set(u.cx+Math.cos(a)*u.r,u.y+Math.sin(a*2)*.05,u.cz+Math.sin(a)*u.r);f.rotation.y=-a;});}

/* ---- Coralport props ---- */
/* Marlee's glass-bottomed gym boat, bow pointing east */
function gymBoat(r){
  const gb=new THREE.Group();gb.position.set(r.cx,-.1,r.cz);gb.rotation.y=Math.PI/2;add(gb);
  mesh(new THREE.BoxGeometry(3,.7,6),mc('#f4f6f8'),0,.1,0,gb);mesh(new THREE.BoxGeometry(3.02,.16,6.02),mc('#2e6aa8'),0,.38,0,gb);
  bowPrism(1.5,1.6,.7,'#f4f6f8',0,.45,3,gb);
  mesh(new THREE.BoxGeometry(2.6,.08,5.6),M({map:rep(T.boardwalk,2.6,5.6)}),0,.48,0,gb);
  mesh(new THREE.BoxGeometry(1.4,1,2),mc('#f4f6f8'),.1,1,1.4,gb);mesh(new THREE.BoxGeometry(1.42,.3,2.02),mc('#3a5a7a'),.1,1.2,1.4,gb);
  mesh(new THREE.CylinderGeometry(.04,.04,2.6,5),mc('#d8d8d8'),0,1.8,-1.8,gb);
  const flag=mesh(new THREE.BoxGeometry(.03,.42,.7),mc('#2ea89a'),0,2.85,-1.42,gb);
  mesh(new THREE.BoxGeometry(.9,.06,1),M({map:rep(T.wood,1,1)}),-1.9,.35,0,gb);
  const sign=mesh(new THREE.BoxGeometry(.06,.4,1.6),mc('#2ea89a'),1.52,.75,-1,gb);
  return {gb,flag};
}
/* night-market stall: a striped canopy over a counter, with a lantern */
function stall(x,y,z,col){
  const c=mc(col),w=mc('#f4f0e6');
  [[-.8,-.4],[.8,-.4],[-.8,.4],[.8,.4]].forEach(p=>mesh(new THREE.BoxGeometry(.07,1.5,.07),mc('#6a4a2a'),x+p[0],y+.75,z+p[1]));
  mesh(new THREE.BoxGeometry(1.7,.5,.5),M({map:rep(T.wood,2,1)}),x,y+.25,z+.25);
  for(let i=0;i<4;i++)mesh(new THREE.BoxGeometry(.44,.06,1.1),i%2?w:c,x-.66+i*.44,y+1.55,z).rotation.x=-.12;
  const lm=M({color:'#fff0c0',emissive:'#ffb040',emissiveIntensity:0});lampMats.push(lm);
  mesh(new THREE.IcosahedronGeometry(.12,0),lm,x,y+1.3,z+.45);pointLamp(x,y+1.2,z+.6);
  [[-.5,'#e05040'],[-.15,'#f0c030'],[.2,'#58a840'],[.5,'#f08030']].forEach(f=>mesh(new THREE.BoxGeometry(.24,.12,.2),mc(f[1]),x+f[0],y+.56,z+.3));
}
/* a string of festoon lights between two points */
function festoon(x0,z0,x1,z1,y){
  const lm=M({color:'#fff4d0',emissive:'#ffd27a',emissiveIntensity:0});lampMats.push(lm);
  const n=Math.ceil(Math.hypot(x1-x0,z1-z0)/.5);
  for(let i=0;i<=n;i++){const k=i/n;mesh(new THREE.IcosahedronGeometry(.06,0),lm,x0+(x1-x0)*k,y-Math.sin(k*Math.PI)*.35,z0+(z1-z0)*k).castShadow=false;}
}

/* ================= Coralport ================= */
const CP=newLoc('coralport',{name:'Coralport',sub:'Far North · Gym 2 · Water',yaw:0});
(function(L){
  const W=56,H=40,p=Plan(W,H,'.'),ter=p.ter,obj=p.obj;
  /* a curved bay: the shore swings north in the middle */
  const sy=x=>27-5*Math.sin(Math.PI*x/55);
  ter.each((x,y)=>y>sy(x)?'~':y>sy(x)-3?':':y>sy(x)-5?'k':null);
  /* the marina and the mangrove creek on the west side */
  ter.ellipse(7,22,5.5,4.6,'~',.2);
  ter.each((x,y)=>x<=2&&y>=14?'~':null);
  ter.each((x,y,c)=>c==='~'&&y>sy(x)-5&&y<=sy(x)-3&&x>2?'b':null);
  ter.rect(5,18,5,22,'b');ter.rect(9,18,9,22,'b');
  ter.path([[2,13],[2,18],[1,22],[1.5,27],[3,30]],1.1,'b');ter.rect(2,29,4,30,'b');
  /* the long curved jetty out to the gym boat */
  ter.path([[34,20],[34.5,25],[36,28.5],[39,31.5],[42,34],[44,36]],1.8,cur=>cur==='~'?'b':null);
  ter.rect(43,35,44,37,'b');
  /* the street, the town and the airport */
  ter.rect(0,11,55,12,'=');ter.rect(0,10,55,10,'+');ter.rect(0,13,55,13,'+');
  ter.rect(2,8,10,9,'+');ter.rect(0,0,12,2,'=');
  ter.path([[27.5,10],[27.5,0]],2,'_');
  ter.rect(44,3,54,9,'+');
  ter.rect(33,9,33,9,'_');ter.rect(40,9,40,9,'_');
  /* esplanade lawn with a swimming lagoon */
  ter.each((x,y,c)=>c==='.'&&y>=14&&x>=11?',':null);
  ter.ellipse(16,15.6,4.6,2.3,':',.1);ter.ellipse(16,15.6,3.3,1.3,'~',.05);
  p.build(3,4,9,7,r=>terminal(r,0));
  p.build(13,6,17,9,r=>healingCentre(r));
  p.build(20,7,24,9,r=>generalStore(r,0,'#2ea89a'));
  const q=(x0,y0,wall,line,roof,door,doorHi)=>p.build(x0,y0,x0+4,y0+2,(r,y)=>qlder({cx:r.cx,cz:r.cz,y,W:r.W,D:r.D,wallTex:boards(wall,line),front:houseFront(wall,line,door,doorHi),roof,lift:.75}));
  q(31,6,'#f8f0e0','#dccfb8',T.roofTeal,'#e07a2a','#f09a4a');
  q(38,6,'#e8f4f0','#c8dcd4',T.roofOrange,'#2e6aa8','#4e8ac8');
  p.build(45,35,50,37,()=>{});
  /* objects */
  obj.rect(3,0,9,2,'X');
  [[46,4],[49,4],[52,4],[46,7],[49,7],[52,7]].forEach(c=>obj.rect(c[0]-1,c[1],c[0],c[1],'X'));
  p.border(2,'rrPrT');
  p.sprinkle('rP',11,3,43,5,.18,'.');
  p.sprinkle('P',11,14,55,22,.07,',:');
  [[12,16],[20,16],[24,19],[30,17],[40,17],[47,19],[52,19]].forEach(c=>{if(ter.get(c[0],c[1])!=='~')obj.set(c[0],c[1],'P');});
  ter.each((x,y,c)=>{if(c==='~'&&x<=3&&y>=13&&obj.get(x,y)===' '&&rnd()<.75)obj.set(x,y,'m');return null;});
  [[5,10],[12,10],[19,10],[26,10],[35,10],[42,10],[50,10],[8,13],[16,13],[24,13],[32,13],[40,13],[48,13]].forEach(c=>obj.set(c[0],c[1],'L'));
  [[22,16],[26,16],[44,16]].forEach(c=>obj.set(c[0],c[1],'B'));
  const SIGNS=[[11,9,['CORALPORT','Gateway to the Reef.']],[33,19,['CORALPORT GYM','Leader: Marlee. Walk to the end of the jetty and climb aboard.']],
    [26,1,['NORTH: Canopy Forest','Rainforest walking tracks, a creek and a waterfall. Beware of cassowaries!']],[4,13,['MANGROVE BOARDWALK','Stay on the boardwalk. Crocodiles live in the mangroves.']],
    [43,8,['NIGHT MARKETS','Open every evening. Tropical fruit, crafts and fresh seafood.']],[11,15,['ESPLANADE LAGOON','Free swimming, all year round. No box jellyfish!']]];
  const PEOPLE=[[35,20,'deckhand',['Marlee runs the gym from her glass-bottomed boat.','Follow the jetty all the way out and climb aboard!']],
    [22,19,'tourist',['I came all this way for the reef!','From the jetty you can see coral right under the water. It\'s like a painting.']],
    [9,22,'fisher',['Nothing\'s biting today...','But I saw a Ringlet hiding under the pontoon. Blue rings and all!'],Math.PI],
    [21,15,'lagoonKid',['The lagoon is the best!','I\'m going to be a dive instructor like Marlee one day.']],
    [49,6,'auntie',['Mango? Lychee? Fresh off the tablelands!','At night these stalls light up like a reef full of glow-fish.']],
    [29,4,'ranger',['Heading up into Canopy Forest?','Ferns grow so thick there that wild Pokémon hide in them like tall grass.','If you see a Cassolet chick, give it room. Its dad will be close by.']],
    [4,29,'swimmer',['Mangroves are nurseries for baby fish. And baby Pokémon!','I count Mudlet here every morning. Last week there were fewer...'],Math.PI/2]];
  SIGNS.concat(PEOPLE).forEach(a=>obj.set(a[0],a[1],' '));

  const built=buildMap(L,p,{tex:{road:T.tarmac,plaza:T.pave,dirt:T.path},bank:T.sand,cliff:T.rock,water:{color:'#b8f6f0',bedTex:T.reefFloor,opacity:.74},
    skirt:[TREE.rain,TREE.rain,T.palmSpr,TREE.gum],tufts:120,lampCol:'#2e6a8a',
    waterTalk:['Clear turquoise water. You can see coral right below the surface!'],benchTalk:['A bench under a palm. The sea breeze is lovely.']});
  const g=L.grid,wp=(x,y)=>g.w(x,y);
  SIGNS.forEach(a=>tileSign(L,a[0],a[1],a[2]));
  PEOPLE.forEach(a=>npc(L,()=>human(CHAR[a[2]]),a[0],a[1],a[3],a[4]?{rot:a[4]}:null));
  /* reef, fish and boats */
  const ws=(x,y)=>{const w=wp(x,y);return w;};
  const [ra,rz0]=ws(30,28),[rb,rz1]=ws(54,39);corals(ra,rb,rz0,rz1,-.6,90);
  const [ma,mz0]=ws(1,24),[mb,mz1]=ws(14,30);corals(ma,mb,mz0,mz1,-.6,25);
  const myFish=[];const before=fishes.length;[[38,30,8],[44,33,7],[50,33,6],[30,27,6]].forEach(f=>{const [x,z]=ws(f[0],f[1]);fishSchool(x,-.35,z,f[2],1.4);});for(let i=before;i<fishes.length;i++)myFish.push(fishes[i]);
  const myBoats=[];[[7,19,Math.PI/2,1],[7,21.5,-Math.PI/2,0],[11,20,Math.PI/2,1],[3.5,20,Math.PI/2,0]].forEach((b,i)=>{const [x,z]=ws(b[0],b[1]);myBoats.push(boat(x,-.15,z,{rot:b[2],mast:!!b[3],stripe:['#e05040','#2ea89a','#f0c030'][i%3],len:2}));});
  const gym=gymBoat(rectOf(L,45,35,50,37));
  door(L,45,36,{to:'cpgym',spawn:{tx:6,ty:14,face:[0,-1]}});
  talkRect(L,46,35,50,37,['Marlee\'s glass-bottomed boat, the Coral Queen. Board from the gangway.']);
  /* doors */
  [5,6,7].forEach(x=>door(L,x,7,{flight:true}));
  door(L,15,9,{say:['Coralport Healing Centre.','You rest for a moment. Your team feels refreshed!']});
  door(L,22,9,{say:['Coralport General Store.','Reef-safe sunscreen, snorkels and capture gear.']});
  door(L,33,8,{say:['A Queenslander painted for the tropics. Wind chimes made of shells clink on the veranda.']});
  door(L,40,8,{say:['Through the louvres you hear a radio: "...another dugong missing from the bay..."']});
  L.airport={tx:6,ty:8,face:[0,1]};
  /* market stalls and festoon lights */
  [[46,4,'#e05040'],[49,4,'#2ea89a'],[52,4,'#f0c030'],[46,7,'#8a5ab8'],[49,7,'#e09038'],[52,7,'#4ab06a']].forEach(s=>{const [x,z]=wp(s[0],s[1]);stall(x-.5,0,z,s[2]);talkRect(L,s[0]-1,s[1],s[0],s[1],['A market stall: '+['tropical fruit','pearl and shell jewellery','hot laksa','batik sarongs','ice-cold sugarcane juice','handmade didgeridoo-shaped flutes'][[[46,4],[49,4],[52,4],[46,7],[49,7],[52,7]].findIndex(c=>c[0]===s[0]&&c[1]===s[1])]+'.']);});
  {const [a,az]=wp(44,5),[b,bz]=wp(54,5);festoon(a,az+.5,b,bz+.5,2.4);const [c,cz]=wp(44,8),[d,dz]=wp(54,8);festoon(c,cz-.2,d,dz-.2,2.4);}
  const [px,pz]=wp(6,1);plane(px,0,pz,0);talkRect(L,3,0,9,2,['An Australis Air plane, ready for the hop down the coast.']);
  /* a mangrove boardwalk lookout */
  L.talk.set('3,30',['The end of the boardwalk. Mud bubbles and pops as crabs dig their burrows.']);
  L.spawn={tx:6,ty:8,face:[0,1]};
  L.exit=(tx,ty,dx,dy)=>(ty<=0&&dy===-1)?{to:'canopy',spawn:{tx:19,ty:44,face:[0,-1]},card:['Canopy Forest','Rainforest track']}:null;
  L.update=t=>{
    if(built.water)built.water.offset.set(t*.02,-t*.05);
    gym.gb.position.y=-.1+Math.sin(t*1.1)*.03;gym.gb.rotation.z=Math.sin(t*.9)*.01;gym.flag.rotation.y=Math.sin(t*3)*.25;
    myBoats.forEach(b=>{b.position.y=b.userData.y+Math.sin(t*1.3+b.userData.ph)*.04;b.rotation.z=Math.sin(t+b.userData.ph)*.04;});
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
  L.exit=(tx,ty,dx,dy)=>(ty>=14&&dy===1)?{to:'coralport',spawn:{tx:44,ty:36,face:[-1,0]}}:null;
  L.update=t=>{wSea.offset.set(t*.02,-t*.04);swimFish(myFish,t);wheel.rotation.z=Math.sin(t*.5)*.3;};
})(CPG);
