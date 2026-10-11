/* Australis: Route 3, the Surf Coast, east of Riverbend City */

/* ---- seaside props ---- */
function lighthouse(x,y,z){
  const white=M({color:'#f4f6f4',flatShading:true}),red=M({color:'#d83a32',flatShading:true});
  mesh(new THREE.CylinderGeometry(.7,.95,3.6,10),white,x,y+1.8,z);
  mesh(new THREE.CylinderGeometry(.72,.74,.5,10),red,x,y+2.4,z);
  mesh(new THREE.CylinderGeometry(.95,.95,.12,12),mc('#2a3038'),x,y+3.66,z);
  const lamp=M({color:'#fff8d0',emissive:'#ffe080',emissiveIntensity:0});lampMats.push(lamp);
  mesh(new THREE.CylinderGeometry(.5,.5,.7,10),lamp,x,y+4.05,z);
  mesh(new THREE.ConeGeometry(.65,.6,10),red,x,y+4.7,z);
  mesh(new THREE.BoxGeometry(.6,1,.1),mc('#2a3038'),x,y+.5,z+.88);
  const beam=new THREE.Mesh(new THREE.ConeGeometry(1.1,9,12,1,true),new THREE.MeshBasicMaterial({color:'#fff6c0',transparent:true,opacity:.18,depthWrite:false,side:THREE.DoubleSide}));
  beam.geometry.translate(0,-4.5,0);beam.rotation.z=Math.PI/2;
  const pivot=new THREE.Group();pivot.position.set(x,y+4.05,z);pivot.add(beam);add(pivot);
  glowAt(x,y+.5,z+.9,.5,.9);
  return pivot;
}
function lifeguardTower(x,y,z){
  const red=mc('#e83a3a'),yel=mc('#f0d030'),wood=mc('#d8d0c0');
  [[-.5,-.5],[.5,-.5],[-.5,.5],[.5,.5]].forEach(c=>mesh(new THREE.BoxGeometry(.1,1.6,.1),wood,x+c[0],y+.8,z+c[1]));
  mesh(new THREE.BoxGeometry(1.3,.1,1.3),wood,x,y+1.6,z);
  mesh(new THREE.BoxGeometry(1.1,.8,1.1),red,x,y+2.05,z);mesh(new THREE.BoxGeometry(1.12,.25,1.12),yel,x,y+2.2,z);
  const roof=mesh(new THREE.ConeGeometry(1.05,.5,4),red,x,y+2.7,z);roof.rotation.y=Math.PI/4;
  for(let i=0;i<4;i++)mesh(new THREE.BoxGeometry(.4,.08,.18),wood,x+.75,y+.2+i*.4,z+.62);
}
function sandcastle(x,y,z){
  const s=mc('#e6cf94'),s2=mc('#d8bc7c');
  mesh(new THREE.BoxGeometry(.7,.22,.7),s,x,y+.11,z);
  [[-.25,-.25],[.25,-.25],[-.25,.25],[.25,.25]].forEach(c=>{mesh(new THREE.CylinderGeometry(.1,.12,.36,6),s2,x+c[0],y+.4,z+c[1]);mesh(new THREE.ConeGeometry(.12,.14,6),s,x+c[0],y+.65,z+c[1]);});
  mesh(new THREE.BoxGeometry(.02,.24,.02),mc('#8a6a4a'),x,y+.5,z);mesh(new THREE.BoxGeometry(.16,.1,.02),mc('#e83a3a'),x+.08,y+.58,z);
}
function car(x,y,z,col,rot,len){
  const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=rot||0;add(g);len=len||1.6;
  const body=M({color:col,flatShading:true});
  mesh(new THREE.BoxGeometry(len,.36,.8),body,0,.36,0,g);mesh(new THREE.BoxGeometry(len*.55,.32,.74),body,-len*.08,.68,0,g);
  mesh(new THREE.BoxGeometry(len*.56,.2,.76),M({color:'#a8d0e8',roughness:.2}),-len*.08,.7,0,g);
  [[-len*.32,.4],[len*.32,.4],[-len*.32,-.4],[len*.32,-.4]].forEach(w=>mesh(new THREE.CylinderGeometry(.17,.17,.12,10),mc('#22242a'),w[0],.17,w[1],g).rotation.x=Math.PI/2);
  return g;
}
/* foam lines that roll in toward a shoreline: shore(y) gives the waterline x for each row */
function surfLines(L,shore,y0,y1,dir){
  const mats=[0,1,2].map(()=>new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.8,depthWrite:false}));
  const lines=[];const g=L.grid;
  for(let y=y0;y<=y1;y+=1.4){
    for(let k=0;k<3;k++){const m=new THREE.Mesh(new THREE.BoxGeometry(.18,.04,1.5),mats[k]);add(m);lines.push({m,y,k});}
  }
  return t=>{lines.forEach(l=>{const ph=((t*.22+l.k/3+l.y*.07)%1),d=(1-ph)*3.4+.15;const [,z]=g.w(0,l.y);const xs=shore(l.y)+g.ox+.5;l.m.position.set(xs+dir*d,-.11,z+Math.sin(l.y)*.2);l.m.scale.z=.6+ph*.6;});
    mats.forEach((m,k)=>{m.opacity=.85;});};
}

CHAR.surfer={skin:'#c88a5a',hair:'#f0d070',top:'#2aa8b8',stripe:'#f0f0f0',bottom:'#2a3a6a',shoes:'#c88a5a'};
CHAR.birder={skin:'#e8b88a',hair:'#8a5a34',top:'#6a7a4a',bottom:'#8a7a5a',shoes:'#4a3020',hat:'#c8b070',glasses:true,bag:'#5a4a30'};
CHAR.keeper={skin:'#e8b88a',hair:'#d8d8d8',top:'#2a4a8a',stripe:'#f4f6f8',bottom:'#2a2a30',shoes:'#1a1a20',cap:'#2a4a8a',logo:'#f4f6f8'};

/* ================= Route 3 ================= */
const R3=newLoc('route3',{name:'Route 3',sub:'The Surf Coast',yaw:0,
  wild:{day:['Pouchlet','Warblet','Gigglet','Shellet','Burrowlet'],night:['Possnack','Shellet','Frogmourn'],field:'coastal heath'}});
(function(L){
  const W=44,H=34,p=Plan(W,H,'.'),ter=p.ter,obj=p.obj;
  const shore=y=>35.5+1.8*Math.sin(y/5.5);
  /* sea, beach and dunes */
  ter.each((x,y)=>x>shore(y)?'~':x>shore(y)-9?':':null);
  /* rocky headland with a lighthouse */
  ter.ellipse(37,3.5,8,6,'^',.25);
  ter.path([[36,9],[37,4]],1.2,'%');ter.rect(35,4,39,5,'%');ter.set(36,10,'S');ter.set(36,11,':');
  /* the road in from Riverbend, a car park and the sandy track to the surf club */
  ter.rect(0,15,19,16,'=');ter.rect(15,17,20,20,'=');
  ter.path([[19,15.5],[23,16],[26,17],[29,17]],1.4,'_');ter.path([[25,21],[30,21]],1.2,'_');
  ter.path([[19,16],[19,25],[21,29],[21,33]],1.3,'_');
  /* wildflower heath */
  ter.ellipse(9,7,7,4.5,only('.',','),.4);ter.ellipse(10,26,8,5,only('.',','),.4);
  p.build(23,18,27,20,(r,y)=>{house({cx:r.cx,cz:r.cz,y,W:r.W,D:r.D,H:1.6,rh:.9,roof:T.roofTeal,front:canvasTex(80,24,f=>{f('#f4f0e6',0,0,80,24);f('#e83a3a',0,0,80,5);f('#f0d030',0,5,80,2);f('#ffffff',20,1,40,3);[6,54].forEach(x=>{f('#2a3038',x,9,20,10);f('#a8d8f8',x+2,11,16,6);});f('#2a3038',32,9,16,15);f('#c84838',34,11,12,13);}),wall:T.labwall,chimney:false});
    glowAt(r.cx-1.6,y+.7,r.z1+.01,1,.5);glowAt(r.cx+1.6,y+.7,r.z1+.01,1,.5);});
  p.build(36,2,38,3,()=>{});
  /* tall grass and dune grass */
  obj.ellipse(9,7.5,5.2,3,only(' ','g'),.4);
  obj.ellipse(10,26,6,3.5,only(' ','g'),.4);
  obj.ellipse(4,20,2.5,2.2,only(' ','g'),.3);
  obj.ellipse(14,11,2.5,1.6,only(' ','g'),.3);
  [[29,25,2.2,3.2],[29,12,2,2],[28,31,2.6,1.8]].forEach(e=>obj.ellipse(e[0],e[1],e[2],e[3],(c,x,y)=>c===' '&&ter.get(x,y)===':'?'y':null,.3));
  /* trees, rocks, benches and things on the sand */
  p.border(2,'TTOW');
  p.sprinkle('TO',2,2,26,32,.05,'.,');
  p.sprinkle('P',22,8,30,32,.04,':');
  [[33,11],[34,12],[40,10],[41,9],[30,8],[31,7]].forEach(c=>obj.set(c[0],c[1],'R'));
  [[14,13],[17,13]].forEach(c=>obj.set(c[0],c[1],'B'));
  [[2,14],[19,14],[22,17],[22,21]].forEach(c=>obj.set(c[0],c[1],'L'));
  obj.set(33,22,'X');obj.set(31,20,'X');obj.set(34,20,'X');obj.rect(16,17,17,17,'X');obj.rect(16,19,17,19,'X');obj.set(31,28,'X');
  const SIGNS=[[2,17,['ROUTE 3: THE SURF COAST','West: Riverbend City.']],[21,22,['SURF LIFE SAVING CLUB','Swim between the red and yellow flags.']],
    [20,31,['ROAD CLOSED','The coast road south was washed out in the last big storm. Please fly with Australis Air instead.']],[35,6,['SANDY POINT LIGHTHOUSE','Built to guide ships past the reef shoals.']]];
  const PEOPLE=[[31,18,'surfer',['Surf\'s pumping today!','Wild Pouchlet ride the waves with me sometimes. They\'re better at it than I am.']],
    [10,12,'birder',['Shh! You\'ll scare them.','The heath is full of wild Pokémon. Walk through the tall grass and they\'ll come to you.','At night, Frogmourn come out to hunt moths around the lamps.'],Math.PI],
    [30,28,'kid',['I\'m building a castle for the Shellets!','They keep crawling in through the front door.'],-Math.PI/2],
    [37,7,'keeper',['The lighthouse has kept ships off the shoals for a hundred years.','Last month I saw lights on the water at night. Boats with no names...','Team Snare, if you ask me. Poaching Shellet eggs off the beach.']],
    [26,22,'lifeguard',['Welcome to the Surf Club!','The rips here can drag you straight out to sea. Always swim between the flags.']],
    [27,30,'grunt',['Oi! Whaddaya want?','I\'m just... enjoying the beach. In my uniform. With this empty egg crate.','Get lost, kid!'],Math.PI]];
  SIGNS.concat(PEOPLE).forEach(a=>obj.set(a[0],a[1],' '));

  const built=buildMap(L,p,{tex:{road:T.tarmac,dirt:T.path},bank:T.sand,cliff:T.rock,water:{color:'#c0f4f0',bedTex:T.sand,opacity:.8},
    skirt:[TREE.gum,TREE.olive,TREE.olive,TREE.wattle],tufts:180,flowerChance:.3,
    waterTalk:['Big blue waves curl in and crash on the sand. Too rough to swim here.'],rockTalk:['A rock covered in barnacles. A tiny crab scuttles away.']});
  const g=L.grid,wp=(x,y)=>g.w(x,y);
  SIGNS.forEach(a=>tileSign(L,a[0],a[1],a[2]));
  PEOPLE.forEach(a=>npc(L,()=>human(CHAR[a[2]]),a[0],a[1],a[3],a[4]?{rot:a[4]}:null));
  const [lx,lz]=wp(37,2);const beam=lighthouse(lx,1,lz+.5);
  door(L,37,3,{say:['The lighthouse door is locked.','A sign says: "Keeper\'s quarters. Knock loudly, I\'m a bit deaf."']});
  door(L,25,20,{say:['Surf Life Saving Club.','Rescue boards, rescue tubes and a fridge full of icy poles. You rest for a moment. Your team feels refreshed!']});
  const [tx,tz]=wp(33,22);lifeguardTower(tx,0,tz);L.talk.set('33,22',['The lifeguard tower. A pair of binoculars sits on the railing.']);
  [[31,20],[34,20]].forEach(c=>{const [x,z]=wp(c[0],c[1]);mesh(new THREE.BoxGeometry(.05,1.3,.05),mc('#d8d8d8'),x,.65,z);mesh(new THREE.BoxGeometry(.5,.32,.02),mc('#e83a3a'),x+.27,1.12,z);mesh(new THREE.BoxGeometry(.5,.16,.025),mc('#f0d030'),x+.27,1.04,z);});
  const [sx,sz]=wp(31,28);sandcastle(sx,0,sz);L.talk.set('31,28',['A very fine sandcastle with four towers and a little flag.']);
  const [c1x,c1z]=wp(16,17);car(c1x+.5,0,c1z,'#e0a030',0);const [c2x,c2z]=wp(16,19);car(c2x+.5,0,c2z,'#4a8ad0',0,2);
  talkRect(L,16,17,17,17,['A ute with three surfboards strapped to the roof.']);talkRect(L,16,19,17,19,['A campervan. Somebody\'s cooking sausages on a tiny stove.']);
  /* surfers bobbing out past the break */
  const surfers=[[39,16],[40,24],[41,13]].map(c=>{const [x,z]=wp(c[0],c[1]);const m=human(CHAR.surfer);m.group.position.set(x,-.05,z);m.group.rotation.y=-Math.PI/2;add(m.group);
    mesh(new THREE.BoxGeometry(.4,.06,1.5),mc(['#f0d030','#e05a6a','#ffffff'][c[1]%3]),0,0,0,m.group).position.y=-.02;return {m,x,z,ph:rnd()*6};});
  const surf=surfLines(L,shore,10,33,1);
  L.spawn={tx:1,ty:15,face:[1,0]};
  L.exit=(tx,ty,dx)=>(tx<=0&&dx===-1)?{to:'riverbend',spawn:{tx:54,ty:ty<=15?19:20,face:[-1,0]},card:['Riverbend City','Brisbane River']}:null;
  L.update=t=>{
    if(built.water)built.water.offset.set(-t*.05,t*.01);
    surf(t);
    surfers.forEach(s=>{s.m.group.position.y=-.08+Math.sin(t*1.2+s.ph)*.06;s.m.group.rotation.z=Math.sin(t*.9+s.ph)*.06;});
    beam.visible=lampsOn;beam.rotation.y=t*.8;
  };
})(R3);
