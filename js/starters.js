/* Australis: the starter Pokémon. Three lines, nine low-poly models, the partner who follows you, and evolution */

function mon(){const group=new THREE.Group(),root=new THREE.Group();group.add(root);return {group,root};}
/* a glowing part (embers, sparks, venom) that lights up a little more at night */
function ptE(geo,c,glow,x,y,z,parent,sx,sy,sz){const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:c,emissive:glow,emissiveIntensity:.9,flatShading:true,roughness:.6}));m.position.set(x,y,z);if(sx)m.scale.set(sx,sy,sz);m.castShadow=true;parent.add(m);return m;}
function eyePair(root,y,z,dx,r,iris){[-dx,dx].forEach(x=>{pt(G.box(r,r*1.35,.02),iris||'#1a1420',x,y,z,root);pt(G.box(r*.38,r*.42,.012),'#ffffff',x+r*.18,y+r*.3,z+.014,root);});}
/* a flat leaf, used for gum leaves */
function leaf(c,x,y,z,parent,s,rz,ry){const l=pt(G.ball(.1,0),c,x,y,z,parent,.45*s,1.3*s,.16*s);l.rotation.z=rz||0;l.rotation.y=ry||0;return l;}
/* a fan of plates behind the head: the frill */
function frill(parent,y,z,r,n,cols,tip,spread){
  const f=new THREE.Group();f.position.set(0,y,z);parent.add(f);
  for(let i=0;i<n;i++){const a=-spread/2+spread*i/(n-1);const g=new THREE.Group();g.rotation.z=a;f.add(g);
    pt(G.box(r*.36,r,.04),cols[i%cols.length],0,r/2,0,g);if(tip)ptE(G.cone(r*.17,r*.4,4),tip[0],tip[1],0,r+r*.15,0,g);}
  return f;
}

/* ---- Grass: the koala line ---- */
function gumjo(){
  const m=mon(),r=m.root;
  pt(G.ball(.2),'#9aa0b0',0,.2,0,r,1,1,.9);pt(G.ball(.13),'#e2e4ea',0,.2,.1,r);
  pt(G.ball(.23),'#9aa0b0',0,.5,0,r);
  [-.2,.2].forEach(x=>{pt(G.ball(.12),'#9aa0b0',x,.67,-.02,r);pt(G.ball(.07),'#f0f0f4',x,.67,.06,r);});
  pt(G.box(.11,.13,.07),'#2e2e38',0,.46,.22,r);
  eyePair(r,.55,.2,.1,.045);
  leaf('#5aa848',0,.3,.22,r,1.1,.35);
  [-.12,.12].forEach(x=>pt(G.ball(.06,0),'#9aa0b0',x,.32,.17,r));
  leaf('#6ac058',-.05,.76,0,r,.8,.5);leaf('#4a9a3a',.05,.77,0,r,.7,-.4);
  [-.1,.1].forEach(x=>pt(G.ball(.07,0),'#7a808e',x,.04,.06,r,1,.6,1.2));
  return m;
}
function bellowala(){
  const m=mon(),r=m.root;
  pt(G.ball(.34),'#8e94a4',0,.46,0,r,1,1.08,.9);pt(G.ball(.24),'#e2e4ea',0,.44,.14,r,1,1.1,.8);
  pt(G.ball(.3),'#8e94a4',0,.96,.02,r);
  [-.29,.29].forEach((x,i)=>{pt(G.ball(.16),'#8e94a4',x,1.16,-.02,r);pt(G.ball(.1),'#f4f4f6',x,1.16,.07,r);leaf('#5aa848',x*1.25,1.3,-.02,r,.9,i?-.6:.6);});
  pt(G.box(.17,.2,.12),'#2a2a34',0,.9,.3,r);pt(G.box(.08,.04,.02),'#4a4a58',0,.97,.365,r);
  eyePair(r,1.02,.27,.13,.055);
  [-.14,.14].forEach((x,i)=>{const b=pt(G.box(.12,.03,.02),'#4a4a58',x,1.11,.29,r);b.rotation.z=i?-.25:.25;});
  for(let i=0;i<9;i++){const a=i/9*Math.PI*2;leaf(i%2?'#4a9a3a':'#6ac058',Math.sin(a)*.27,.74,Math.cos(a)*.24,r,1.15,0,a);}
  [-.36,.36].forEach(x=>{pt(G.cyl(.08,.07,.36,6),'#8e94a4',x,.5,.06,r);pt(G.cone(.05,.1,4),'#3a3a40',x,.3,.12,r).rotation.x=Math.PI;});
  [-.15,.15].forEach(x=>pt(G.ball(.11,0),'#7a808e',x,.08,.08,r,1,.6,1.3));
  return m;
}
function koalossus(){
  const m=mon(),r=m.root;
  pt(G.ball(.62),'#848896',0,.72,0,r,1.18,.9,1.15);pt(G.ball(.4),'#dcdce4',0,.72,.36,r,1,1.1,.6);
  pt(G.ball(.4),'#848896',0,1.36,.38,r);
  [-.38,.38].forEach(x=>{pt(G.ball(.2),'#848896',x,1.6,.32,r);pt(G.ball(.13),'#f4f4f6',x,1.6,.42,r);});
  pt(G.box(.24,.26,.16),'#2a2a32',0,1.28,.76,r);
  eyePair(r,1.44,.72,.17,.06,'#2a1a10');
  [-.16,.16].forEach((x,i)=>{const b=pt(G.box(.16,.04,.03),'#3a3a44',x,1.53,.73,r);b.rotation.z=i?-.3:.3;});
  /* rocky shoulder plates, from its Ground typing */
  [[-.6,1.05,.1],[.6,1.05,.1],[-.35,1.25,-.3],[.35,1.25,-.3],[0,1.2,-.5]].forEach(p=>{const s=pt(G.ball(.2,0),'#8a6a48',p[0],p[1],p[2],r);s.rotation.set(rnd()*3,rnd()*3,0);});
  /* the eucalyptus grove on its back */
  [[-.25,-.25,.6],[.22,-.32,.75],[0,-.5,.55]].forEach((t,i)=>{pt(G.cyl(.04,.06,t[2],5),'#c8c0b0',t[0],1.25+t[2]/2,t[1],r);pt(G.ball(.22,0),['#4a9a3a','#5aa848','#3e8a34'][i],t[0],1.3+t[2],t[1],r,1,.9,1);pt(G.ball(.14,0),'#7ac060',t[0]+.06,1.42+t[2],t[1]+.04,r);});
  /* front legs like trunks, with root claws */
  [-.52,.52].forEach(x=>{pt(G.cyl(.17,.21,.5,7),'#848896',x,.25,.42,r);[-.07,0,.07].forEach(d=>pt(G.cone(.05,.18,4),'#6a5038',x+d,.04,.58,r).rotation.x=Math.PI/2.2);});
  [-.38,.38].forEach(x=>pt(G.ball(.2,0),'#70747e',x,.14,-.25,r,1,.7,1.3));
  return m;
}

/* ---- Fire: the frilled-lizard line ---- */
function kindrill(){
  const m=mon(),r=m.root;
  pt(G.ball(.16),'#f07a28',0,.3,0,r,1,.95,1.25);pt(G.ball(.11),'#ffd060',0,.27,.08,r);
  pt(G.ball(.14),'#f07a28',0,.5,.15,r);pt(G.box(.14,.08,.14),'#f07a28',0,.46,.28,r);
  eyePair(r,.54,.26,.07,.04,'#2a1a10');
  m.frill=frill(r,.48,.05,.12,5,['#e04a2a','#f07a2a'],null,2.2);
  const t1=pt(G.cyl(.06,.09,.26,6),'#f07a28',0,.24,-.26,r);t1.rotation.x=-1.2;
  const t2=pt(G.cyl(.03,.06,.22,6),'#f07a28',0,.17,-.46,r);t2.rotation.x=-1.35;
  m.flame=ptE(G.cone(.06,.16,5),'#ffb030','#ff6a10',0,.18,-.6,r);
  [-.1,.1].forEach(x=>{pt(G.cyl(.04,.05,.2,5),'#d0601e',x,.1,-.02,r);pt(G.box(.07,.03,.1),'#d0601e',x,.02,.03,r);});
  [-.13,.13].forEach(x=>pt(G.cyl(.025,.025,.12,4),'#d0601e',x,.3,.12,r).rotation.x=.8);
  return m;
}
function frillblaze(){
  const m=mon(),r=m.root;
  pt(G.ball(.26),'#e0561e',0,.62,0,r,.9,1.2,.9);pt(G.ball(.17),'#ffc050',0,.6,.12,r,1,1.3,.7);
  pt(G.ball(.19),'#e0561e',0,1.02,.1,r);pt(G.box(.18,.1,.2),'#e0561e',0,.97,.28,r);
  eyePair(r,1.06,.28,.09,.045,'#2a1a10');
  m.frill=frill(r,1,-.02,.3,9,['#d8341e','#f06a20','#e04a2a'],['#ffd040','#ff8a10'],2.9);
  const t1=pt(G.cyl(.06,.11,.4,6),'#e0561e',0,.36,-.32,r);t1.rotation.x=-1;
  const t2=pt(G.cyl(.03,.06,.36,6),'#e0561e',0,.18,-.62,r);t2.rotation.x=-1.4;
  m.flame=ptE(G.cone(.08,.24,5),'#ffb030','#ff6a10',0,.16,-.84,r);
  [-.13,.13].forEach(x=>{pt(G.cyl(.05,.06,.38,5),'#b8441a',x,.19,0,r);pt(G.box(.09,.04,.15),'#b8441a',x,.02,.05,r);});
  [-.22,.22].forEach(x=>{const a=pt(G.cyl(.035,.035,.24,4),'#b8441a',x,.72,.1,r);a.rotation.x=.7;});
  return m;
}
function pyragon(){
  const m=mon(),r=m.root;
  pt(G.ball(.5),'#6a2420',0,.82,0,r,1,.82,1.55);
  ptE(G.box(.5,.16,.9),'#ff8a30','#ff5a10',0,.5,.05,r);
  pt(G.ball(.3),'#6a2420',0,1.28,.78,r);pt(G.box(.3,.16,.36),'#6a2420',0,1.2,1.02,r);
  eyePair(r,1.34,1.05,.12,.05,'#ffd030');
  [-.14,.14].forEach((x,i)=>{const h=pt(G.cone(.05,.3,4),'#2a1a18',x,1.55,.7,r);h.rotation.x=-.6;h.rotation.z=i?-.25:.25;});
  /* the frill crackles with dry lightning */
  m.frill=frill(r,1.25,.55,.55,11,['#3a1a18','#4a2420'],['#ffe040','#ffd000'],3.1);
  m.frill.rotation.x=-.25;
  m.frill.children.forEach((g,i)=>{if(i%2)return;ptE(G.box(.04,.22,.02),'#ffe860','#ffd000',.06,.2,.03,g).rotation.z=.6;ptE(G.box(.04,.2,.02),'#ffe860','#ffd000',-.02,.36,.03,g).rotation.z=-.6;});
  for(let i=0;i<5;i++)pt(G.cone(.07,.22,4),'#2a1a18',0,1.18-i*.04,.3-i*.28,r);
  const t1=pt(G.cyl(.1,.2,.7,6),'#6a2420',0,.62,-.85,r);t1.rotation.x=-1.25;
  const t2=pt(G.cyl(.05,.1,.6,6),'#6a2420',0,.42,-1.38,r);t2.rotation.x=-1.4;
  m.bolt=new THREE.Group();m.bolt.position.set(0,.36,-1.72);r.add(m.bolt);
  [[0,0,.5],[.08,.12,-.6],[0,.24,.5]].forEach(b=>ptE(G.box(.06,.18,.06),'#ffe860','#ffd000',b[0],b[1],0,m.bolt).rotation.z=b[2]);
  [[-.38,.42],[.38,.42],[-.38,-.4],[.38,-.4]].forEach(p=>{pt(G.cyl(.11,.14,.5,6),'#4e1c18',p[0],.25,p[1],r);[-.06,.06].forEach(d=>pt(G.cone(.04,.12,4),'#e8e0d0',p[0]+d,.03,p[1]+.13,r).rotation.x=Math.PI/2);});
  return m;
}

/* ---- Water: the platypus line ---- */
/* little glowing dots on the bill: electrosense */
function freckles(parent,y,z,w,n,col,glow){for(let i=0;i<n;i++){const x=(i/(n-1)-.5)*w,zz=z+((i%2)?.03:-.02);ptE(G.ball(.016,0),col,glow,x,y,zz,parent);}}
function puggly(){
  const m=mon(),r=m.root;
  /* a round river-pebble baby: sage-teal body speckled like a creek stone */
  pt(G.ball(.21),'#2f8a80',0,.21,0,r,1.05,.9,1.1);pt(G.ball(.15),'#f2f0d8',0,.17,.08,r,1,.8,1);
  [[.13,.3,-.05],[-.1,.33,-.1],[.16,.18,-.12],[-.17,.2,.02],[.02,.38,-.14]].forEach(d=>pt(G.ball(.028,0),'#1e5a54',d[0],d[1],d[2],r));
  /* soft pink bill with glowing freckles */
  pt(G.ball(.12),'#f08a84',0,.22,.3,r,1.15,.34,1.45);
  freckles(r,.262,.36,.14,5,'#c8f8ff','#30c8ff');
  eyePair(r,.34,.17,.075,.045);
  [-.1,.1].forEach(x=>pt(G.ball(.032,0),'#f07a90',x,.29,.18,r,1,.6,.3));
  /* lily-pad tail with a tiny flower */
  const tail=pt(G.cyl(.17,.17,.03,12),'#38a832',0,.08,-.3,r);tail.scale.z=.85;
  pt(G.box(.03,.032,.12),'#2e7a30',0,.09,-.38,r);
  pt(G.ball(.035,0),'#f6b8d0',.06,.12,-.28,r);pt(G.ball(.015,0),'#fff2a0',.06,.15,-.28,r);
  [[-.14,.12],[.14,.12],[-.13,-.1],[.13,-.1]].forEach(p=>pt(G.box(.09,.03,.1),'#e8766e',p[0],.02,p[1],r));
  return m;
}
function spurbill(){
  const m=mon(),r=m.root;
  /* a sleek creek swimmer marked with swirling currents */
  pt(G.ball(.28),'#22706a',0,.34,0,r,.92,.8,1.55);pt(G.ball(.19),'#eeeed6',0,.27,.16,r,1,.7,1.3);
  [-1,1].forEach(sd=>{[0,1].forEach(k=>{const sw=pt(new THREE.TorusGeometry(.1-k*.035,.018,4,12,Math.PI*1.3),'#7ae8d8',sd*.255,.36+k*.02,-.08+k*.12,r);sw.rotation.y=sd*Math.PI/2;sw.rotation.z=k*.8;});});
  pt(G.ball(.18),'#22706a',0,.48,.42,r);
  pt(G.ball(.14),'#e87a74',0,.45,.72,r,1.2,.3,1.6);
  freckles(r,.48,.76,.18,6,'#c8f8ff','#30c8ff');
  eyePair(r,.56,.57,.09,.042);
  /* reed blades along the back */
  [[.0,.56,.14,.22],[.0,.58,-.02,.28],[.0,.54,-.18,.22],[.0,.48,-.32,.16]].forEach((b,i)=>{const bl=pt(G.box(.04,b[3],.08),i%2?'#7ab838':'#4e8a2a',b[0],b[1]+b[3]*.3,b[2]-b[3]*.25,r);bl.rotation.x=-.95;});
  /* paddle tail fringed like a leaf */
  const tl=pt(G.box(.36,.05,.36),'#185a56',0,.2,-.55,r);tl.rotation.x=-.18;
  [-.13,0,.13].forEach(x=>pt(G.cone(.05,.12,4),'#185a56',x,.18,-.76,r).rotation.x=-Math.PI/2);
  [[-.2,.3],[.2,.3],[-.2,-.22],[.2,-.22]].forEach(p=>pt(G.box(.14,.04,.14),'#d86a64',p[0],.04,p[1],r));
  [-.2,.2].forEach(x=>pt(G.cone(.025,.09,4),'#f0e4c8',x*1.3,.12,-.22,r).rotation.z=x>0?-1.2:1.2);
  return m;
}
function platyrant(){
  const m=mon(),r=m.root;
  /* a hunched billabong guardian with a stone-plated, mossy back */
  const B='#1f4e4a',D='#163a38';
  pt(G.ball(.52),B,0,.76,0,r,1.1,.92,1.25);pt(G.ball(.32),'#e6e4cc',0,.64,.36,r,1,1.1,.6);
  [[0,1.16,-.05,.25],[-.33,1.04,-.2,.2],[.33,1.04,-.2,.2],[-.18,1.06,-.48,.19],[.2,1.04,-.5,.19],[0,.92,-.72,.17],[-.44,.86,.16,.16],[.44,.86,.16,.16]].forEach(p=>{
    const st=pt(G.ball(p[3],0),'#8a8e7c',p[0],p[1],p[2],r,1.1,.6,1.1);st.rotation.y=p[0]*3;
    pt(G.ball(p[3]*.6,0),'#3e9a2e',p[0]+.03,p[1]+p[3]*.38,p[2]-.02,r,1,.5,1);});
  pt(G.ball(.3),B,0,1.12,.5,r);
  /* broad bill like a river stone, freckled with cave-glow */
  pt(G.ball(.26),'#28302e',0,1.02,.92,r,1.35,.36,1.45);
  freckles(r,1.08,1.02,.36,7,'#b8fbff','#20c8ff');
  eyePair(r,1.25,.76,.13,.05,'#f0a818');
  [-.15,.15].forEach((x,i)=>{const b2=pt(G.box(.16,.05,.04),'#0e1e1c',x,1.35,.73,r);b2.rotation.z=i?-.32:.32;});
  /* bowed forearms, knuckles on the ground */
  [-1,1].forEach(sd=>{const x=sd*.5;
    const up=pt(G.cyl(.13,.11,.42,6),B,x+sd*.08,.58,.42,r);up.rotation.z=-sd*.45;
    const lo=pt(G.cyl(.11,.13,.36,6),B,x+sd*.12,.24,.52,r);lo.rotation.z=sd*.25;
    pt(G.box(.28,.12,.26),D,x+sd*.1,.06,.6,r);
    [-.08,0,.08].forEach(d=>pt(G.cone(.032,.12,4),'#d8dccc',x+sd*.1+d,.06,.76,r).rotation.x=Math.PI/2);});
  /* squat haunches with venom spurs that glow like Glimmet */
  [-1,1].forEach(sd=>{const x=sd*.42;
    pt(G.ball(.24),B,x,.32,-.3,r,1,1.1,1.2);pt(G.box(.3,.08,.34),D,x,.04,-.2,r);
    const sp=ptE(G.cone(.075,.34,5),'#c8fcff','#18d0ff',x+sd*.22,.3,-.36,r);sp.rotation.z=-sd*1.2;m['spur'+(sd>0?'R':'L')]=sp;});
  /* big paddle tail with a stone plate */
  const tl=pt(G.box(.74,.09,.64),D,0,.26,-.9,r);tl.rotation.x=-.2;
  pt(G.ball(.17,0),'#8a8e7c',0,.33,-.88,r,1.3,.4,1.2);
  return m;
}

/* ---- names, types and lines ---- */
const FORMS={
  gumjo:{name:'Gumjo',dex:'001',type:'Grass',build:gumjo,cry:'Gum-gum!',next:'bellowala',blurb:'A koala joey that never lets go of its gum leaf. The leaf on its head is a sprout that grows as it does.'},
  bellowala:{name:'Bellowala',dex:'002',type:'Grass',build:bellowala,cry:'BELLOOOW!',next:'koalossus',blurb:'Wears a collar of gum leaves. Its grunting Gum Bellow shakes leaves off trees and makes foes flinch.'},
  koalossus:{name:'Koalossus',dex:'003',type:'Grass/Ground',build:koalossus,cry:'KO-LOSSS!',next:null,blurb:'A bush guardian with a eucalyptus grove on its back, rooted deep in the earth. Loud, awake, and never sleepy.'},
  kindrill:{name:'Kindrill',dex:'004',type:'Fire',build:kindrill,cry:'Krrik!',next:'frillblaze',blurb:'A frilled-lizard hatchling. When it is startled its little frill flicks open and sparks fly from its tail.'},
  frillblaze:{name:'Frillblaze',dex:'005',type:'Fire',build:frillblaze,cry:'Frrrah!',next:'pyragon',blurb:'Sprints on two legs with its blazing frill spread wide. Frill Flare lowers a foe\'s Attack on sight.'},
  pyragon:{name:'Pyragon',dex:'006',type:'Fire/Electric',build:pyragon,cry:'GRRRAKK!',next:null,blurb:'A dragon lizard whose frill crackles with static, like the dry lightning that starts outback fires.'},
  puggly:{name:'Puggly',dex:'007',type:'Water',build:puggly,cry:'Pug-pug!',next:'spurbill',blurb:'A puggle as round and speckled as a creek pebble. Tiny glowing freckles on its bill feel the sparks of prey, and it steers with its lily-pad tail.'},
  spurbill:{name:'Spurbill',dex:'008',type:'Water',build:spurbill,cry:'Spurr!',next:'platyrant',blurb:'Swirls of current run down its sides and reeds grow along its back. It hunts with its eyes shut, so Electrosense means it never misses.'},
  platyrant:{name:'Platyrant',dex:'009',type:'Water/Poison',build:platyrant,cry:'PLAA-TYRR!',next:null,blurb:'A billabong guardian whose stone-plated back grows moss. Its venom spurs glow in the dark like Glimmet, warning poachers away.'},
  sugrette:{name:'Sugrette',dex:'018',type:'Electric/Fairy',build:sugrette,cry:'Sug-sug!',next:null,blurb:'A sugar glider that crackles with static when it is happy.'}
};
const STARTERS=['gumjo','kindrill','puggly'];
/* the starter each one is weak to: what your rival picks */
const RIVAL_PICK={gumjo:'kindrill',kindrill:'puggly',puggly:'gumjo'};
function partnerName(){return STATE.partner?FORMS[STATE.partner].name:'your partner';}

/* swap the model that follows you */
function setPartner(form){
  STATE.partner=form;
  const old=follower.model;if(old&&old.group.parent)old.group.parent.remove(old.group);
  const m=FORMS[form].build();m.ph=rnd()*6;scene.add(m.group);follower.model=m;follower.sprite=m.group;
  m.group.visible=follower.active;
}
function startPartner(form,tx,ty){
  STATE.starter=form;STATE.team=[form];
  follower.active=true;setPartner(form);follower.tx=tx;follower.ty=ty;placeFollower(true);followerBlob.visible=true;
}
/* a new Pokémon joins: it follows you if you have nobody yet, otherwise it joins the team */
function joinTeam(form,tx,ty,cb){
  if(!STATE.partner){startPartner(form,tx,ty);if(cb)cb();return;}
  STATE.team.push(form);say([FORMS[form].name+' joined your team!',FORMS[STATE.partner].name+' looks very pleased to have a new friend.'],cb);
}
/* evolution: a flash, a spin and a new model */
function evolvePartner(cb){
  const f=FORMS[STATE.partner];if(!f||!f.next){if(cb)cb();return;}
  const from=f.name,to=FORMS[f.next].name;
  say(['What? '+from+' is evolving!'],()=>{flashScreen();setPartner(f.next);STATE.team[0]=f.next;placeFollower();say(['Congratulations! Your '+from+' evolved into '+to+'!'],cb);});
}
/* idle animation shared by all the forms */
function animMon(m,t,moving){
  if(m.frill)m.frill.scale.setScalar(1+Math.sin(t*3+(m.ph||0))*.04);
  if(m.flame){m.flame.scale.y=1+Math.sin(t*14)*.2;m.flame.material.emissiveIntensity=.8+Math.sin(t*9)*.3;}
  if(m.bolt)m.bolt.visible=Math.sin(t*7)>-.6;
  if(m.spurL){const k=.7+Math.abs(Math.sin(t*2))*.6;m.spurL.material.emissiveIntensity=k;m.spurR.material.emissiveIntensity=k;}
}
