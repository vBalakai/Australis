/* Australis: Billabong Wetlands, the floodplain east of Stormhaven */

/* a brolga: tall grey crane with a red head; pairs dance by bowing, leaping and flapping */
function brolga(){
  const group=new THREE.Group(),root=new THREE.Group();group.add(root);
  pt(G.ball(.3),'#a8aeb8',0,1.05,0,root,.85,.8,1.35);
  const wl=new THREE.Group();wl.position.set(-.22,1.1,0);root.add(wl);pt(G.box(.06,.26,.7),'#8a909a',0,0,-.05,wl);
  const wr=new THREE.Group();wr.position.set(.22,1.1,0);root.add(wr);pt(G.box(.06,.26,.7),'#8a909a',0,0,-.05,wr);
  [-.08,.08].forEach(x=>pt(G.cyl(.025,.025,.8,4),'#4a4a50',x,.42,0,root));
  pt(G.cyl(.04,.06,.6,5),'#b8bec8',0,1.42,.3,root).rotation.x=-.4;
  pt(G.ball(.1),'#d04a3a',0,1.72,.42,root);
  const beak=pt(G.cone(.03,.22,4),'#5a5a50',0,1.7,.6,root);beak.rotation.x=Math.PI/2;
  pt(G.box(.12,.1,.1),'#3a3a40',0,.95,-.45,root);
  return {group,root,wl,wr};
}
/* bird hide: a low wooden hut on stilts with a viewing slot */
function birdHide(r,y){
  const g=new THREE.Group();g.position.set(r.cx,y,r.cz);add(g);
  const wood=M({map:rep(T.wood,3,1)}),dark=mc('#4a3220');
  [[-1.3,-.8],[1.3,-.8],[-1.3,.8],[1.3,.8]].forEach(c=>mesh(new THREE.BoxGeometry(.14,1.2,.14),dark,c[0],-.4,c[1],g));
  mesh(new THREE.BoxGeometry(3,1.3,1.9),wood,0,.65,0,g);
  mesh(new THREE.BoxGeometry(2.4,.18,.06),mc('#1a1410'),0,.95,-.96,g);
  mesh(new THREE.BoxGeometry(.8,1,.06),dark,0,.5,.96,g);
  const roof=mesh(new THREE.BoxGeometry(3.5,.12,2.5),M({map:rep(T.roofGreen,3,2)}),0,1.42,0,g);roof.rotation.x=.12;
}

CHAR.croceye={skin:'#a8704a',hair:'#2a2a30',top:'#5a6a3a',stripe:'#e0a030',bottom:'#3a3a2a',shoes:'#3a2a20',hat:'#7a6a3a'};

/* ================= Billabong Wetlands ================= */
const BB=newLoc('billabong',{name:'Billabong Wetlands',sub:'East of Stormhaven · Floodplain',yaw:0,
  mood:{day:['#6a8aa8','#d0dcd8','#b0bcb8',.85,.95],gold:['#a86a5a','#f8c890','#d0a080',.9,.95]},
  wild:{day:['Tadbolt','Mudlet','Brolglet','Cygnette','Croakbolt','Gigglet'],night:['Tadbolt','Frogmourn','Croakbolt','Possnack'],field:'spear grass'}});
(function(L){
  const W=48,H=34,p=Plan(W,H,'.'),ter=p.ter,obj=p.obj;
  /* the billabong, a smaller lagoon and muddy margins */
  ter.ellipse(27,15,12.6,7.8,'u',.35);ter.ellipse(40,27,6.8,4.4,'u',.35);
  ter.ellipse(27,15,11,6.4,'~',.3);ter.ellipse(40,27,5.4,3.1,'~',.3);
  ter.path([[33,20],[37,25]],2.2,'~');
  /* boardwalk straight across, with a bird hide in the middle */
  ter.rect(13,15,41,15,cur=>cur==='~'?'b':cur==='u'?'k':null);
  ter.rect(26,13,28,14,cur=>cur==='~'||cur==='u'?'b':null);
  /* red-earth tracks */
  ter.path([[0,16.5],[8,16.5],[13,15]],1.6,'-');
  ter.path([[8,16],[10,9],[16,5],[28,4],[38,5],[44,9],[44,14],[41,15]],1.4,'-');
  ter.path([[41,15],[45,19],[46,26],[44,31],[34,31],[30,27]],1.4,'-');
  p.build(26,13,28,14,(r,y)=>birdHide(r,y));
  /* spear grass, paperbarks, pandanus */
  [[9,26,6,3.5],[12,6,4,2.5],[36,1.5,6,1.4],[46,12,1.6,4],[22,27,4,2.2]].forEach(e=>obj.ellipse(e[0],e[1],e[2],e[3],(c,x,y)=>c===' '&&ter.get(x,y)==='.'?'g':null,.4));
  const SIGNS=[[2,15,['BILLABONG WETLANDS','West: Stormhaven. Stay on the tracks during the wet season.']],[12,14,['CROCODILES LIVE HERE','Keep to the boardwalk. Never lean over the rails.']],
    [14,14,['BIRD HIDE','Quiet please! Birds and Pokémon are watching you too.']],[46,30,['FLOODPLAIN LOOP','Follow the red track around the lagoon and back to the boardwalk.']]];
  const PEOPLE=[[5,15,'ranger',['Welcome to the wetlands. Wet season\'s the best time to visit.','The billabong fills up and every bird in the Top End turns up.'],Math.PI/2],
    [20,24,'scientist',['I\'m counting brolga. Watch: they bow, leap and flap. It\'s a dance!','Their chicks, Brolglet, hide in the spear grass. Look carefully.']],
    [38,21,'grunt',['Oi! This crate? It\'s, uh... eggs. Chicken eggs.','Very big chicken eggs. With scales.','...I\'m going. I\'m going! Don\'t tell the rangers!'],Math.PI],
    [33,30,'kid',['I caught a Barralet this big! Then it got away.','Grandpa says the big crocs live in the deep bit of the billabong.']],
    [42,11,'croceye',['Shh. See those two eyes in the water? That\'s a salty, twelve feet if he\'s an inch.','Team Snare were out here at night, shining torches on the water. Hunting croc nests.','The government says they have a permit. A permit! From Canberra!']]];
  SIGNS.concat(PEOPLE).forEach(a=>obj.set(a[0],a[1],' '));
  [[20,26],[22,26]].forEach(c=>obj.set(c[0],c[1],'X'));
  p.border(2,'ppTP',".,u");
  p.sprinkle('pp',2,2,45,31,.07,'.');
  p.sprinkle('P',2,2,45,31,.02,'.');
  p.sprinkle('m',14,7,40,23,.1,'u');

  const built=buildMap(L,p,{tex:{earth:T.redEarth,mud:T.mud,deck:T.boardwalk},bank:T.mud,cliff:T.rock,water:{color:'#9ab8a0',bedTex:T.mud,opacity:.88},
    skirt:[TREE.paper,TREE.paper,TREE.gum,T.palmSpr],tufts:180,tall:T.spear,flowerChance:.08,
    waterTalk:['Still, dark water dotted with lilies. A pair of eyes watches you from the reeds...']});
  const g=L.grid,wp=(x,y)=>g.w(x,y);
  SIGNS.forEach(a=>tileSign(L,a[0],a[1],a[2]));
  PEOPLE.forEach(a=>npc(L,()=>human(CHAR[a[2]]),a[0],a[1],a[3],a[4]?{rot:a[4]}:null));
  door(L,27,14,{say:['Inside the bird hide it\'s dim and quiet.','Through the slot: magpie geese, jacanas walking on lily pads, and a Cygnette gliding past.','You sit for a while. Your team feels calm and refreshed.']});
  talkRect(L,26,13,28,13,['The bird hide. A slot window looks out over the billabong.']);
  /* lily pads float on the open water */
  const pads=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(ter.get(x,y)!=='~'||rnd()>.32)continue;const [X,Z]=wp(x,y);for(let k=0;k<2;k++)pads.push([X+(rnd()-.5)*.8,Z+(rnd()-.5)*.8,.35+rnd()*.3,rnd()*6]);}
  {const im=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),M({map:T.lily,alphaTest:.5,transparent:false}),pads.length);
    const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),s=new THREE.Vector3(),v=new THREE.Vector3();
    pads.forEach((pd,i)=>{e.set(-Math.PI/2,0,pd[3]);q.setFromEuler(e);s.set(pd[2],pd[2],1);v.set(pd[0],-.12,pd[1]);m4.compose(v,q,s);im.setMatrixAt(i,m4);});im.frustumCulled=false;im.receiveShadow=true;add(im);}
  /* dancing brolga */
  const birds=[[20,26,.4],[22,26,-2.6]].map(c=>{const b=brolga();const [x,z]=wp(c[0],c[1]);b.group.position.set(x,0,z);b.group.rotation.y=c[2];add(b.group);blob(x,0,z,.35);b.ph=rnd()*6;return b;});
  talkRect(L,20,26,22,26,['A pair of brolga, dancing. They bow, leap into the air and trumpet to each other.']);
  /* crocs */
  const crocs=[[22,12],[32,18],[41,27]].map(c=>{const [x,z]=wp(c[0],c[1]);return croc(x,z,1.3);});
  /* fireflies at night */
  const FN=50,fp=new Float32Array(FN*3),fs=[];for(let i=0;i<FN;i++)fs.push(rnd()*6,rnd(),rnd());
  const fgeo=new THREE.BufferGeometry();fgeo.setAttribute('position',new THREE.BufferAttribute(fp,3));
  const flies=add(new THREE.Points(fgeo,new THREE.PointsMaterial({color:'#e8ff7a',size:.11,transparent:true,opacity:.9,depthWrite:false})));flies.frustumCulled=false;
  L.spawn={tx:1,ty:16,face:[1,0]};
  L.exit=(tx,ty,dx)=>(tx<=0&&dx===-1)?{to:'stormhaven',spawn:{tx:54,ty:ty<=16?8:9,face:[-1,0]},card:['Stormhaven','Top End · Gym 3']}:null;
  L.update=t=>{
    if(built.water)built.water.offset.set(t*.005,-t*.01);
    crocs.forEach(c=>{const u=c.userData;c.position.x=u.x+Math.sin(t*.12+u.ph)*1.6;c.position.y=-.22+Math.sin(t*.8+u.ph)*.02;c.rotation.y=Math.cos(t*.12+u.ph)>0?0:Math.PI;});
    birds.forEach((b,i)=>{const k=(t*.6+b.ph)%4;const leap=k>3?Math.sin((k-3)*Math.PI):0;b.root.position.y=leap*.6;b.root.rotation.x=k>1&&k<2?Math.sin((k-1)*Math.PI)*.5:0;const flap=k>2.5?Math.sin(t*10)*.9:.1;b.wl.rotation.z=-flap;b.wr.rotation.z=flap;});
    flies.visible=lampsOn;
    for(let i=0;i<FN;i++){const s=fs[i*3];fp[i*3]=target.x+(fs[i*3+1]-.5)*20+Math.sin(t*.7+s)*.6;fp[i*3+1]=target.y+.4+((Math.sin(t*.9+s*3)+1)/2)*1.6;fp[i*3+2]=target.z+(fs[i*3+2]-.5)*14+Math.cos(t*.5+s)*.6;}
    fgeo.attributes.position.needsUpdate=true;
  };
})(BB);
