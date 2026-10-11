/* Australis: Canopy Forest, the rainforest route north of Coralport */

CHAR.hiker={skin:'#f2c79a',hair:'#8a4a24',top:'#e07a2a',bottom:'#4a5a3a',shoes:'#5a3a24',cap:'#4a6a3a',logo:'#f0c030',bag:'#3a6a8a'};
CHAR.scientist={skin:'#c88a5a',hair:'#1a1a20',top:'#7a9a6a',coat:'#eef0f2',bottom:'#4a4a3a',shoes:'#3a2a20',glasses:true,hat:'#c8b070'};

/* a cassowary standing in the undergrowth */
function cassowary(){
  const group=new THREE.Group(),root=new THREE.Group();group.add(root);
  pt(G.ball(.42),'#1a1a1e',0,1,0,root,.9,1,1.25);
  [-.12,.12].forEach(x=>{pt(G.cyl(.05,.04,.75,5),'#8a8a5a',x,.38,0,root);pt(G.box(.14,.04,.24),'#6a6a4a',x,.02,.06,root);});
  pt(G.cyl(.06,.1,.7,6),'#2a7ac8',0,1.5,.35,root).rotation.x=-.3;
  pt(G.ball(.12),'#3a9ad8',0,1.86,.46,root);pt(G.cone(.07,.24,5),'#8a6a3a',0,2.04,.42,root);
  const beak=pt(G.cone(.04,.2,4),'#2a2a30',0,1.84,.62,root);beak.rotation.x=Math.PI/2;
  pt(G.ball(.06),'#e03a3a',.05,1.58,.48,root);pt(G.ball(.06),'#e03a3a',-.05,1.58,.48,root);
  return {group,root};
}

/* ================= Canopy Forest ================= */
const CF=newLoc('canopy',{name:'Canopy Forest',sub:'North of Coralport · Rainforest',yaw:0,
  mood:{day:['#6aa0a0','#cfe8d8','#a8c8b8',.8,1.05],gold:['#c08a6a','#f0d0a0','#c8a888',.85,1]},
  wild:{day:['Lorilet','Wrenlet','Cassolet','Sporelet','Quillet'],night:['Glimmet','Frogmourn','Possnack','Sporelet'],field:'ferns'}});
(function(L){
  const W=40,H=46,p=Plan(W,H,'.'),ter=p.ter,obj=p.obj,H1=2.5;
  /* basalt cliffs across the north, with a waterfall into a plunge pool */
  ter.each((x,y)=>y<=4+Math.round(Math.sin(x*.7)*.8+hash2(x,9)*1.2)?'^':null);
  ter.rect(19,5,25,5,'^');
  ter.ellipse(22,8,3.6,2.3,'~',.15);
  ter.path([[22,8],[19,12],[23,18],[20,25],[24,32],[28,39],[31,46]],2.6,'~');
  /* walking track, a boardwalk bridge and clearings */
  ter.path([[19.5,46],[18,40],[14,35],[13,29],[15,23],[13,17],[16,12],[18,10]],1.4,'_');
  ter.rect(19,43,20,45,'_');
  ter.ellipse(17,10,3.2,2.2,only('.',','),.2);
  ter.rect(17,25,23,25,cur=>cur==='~'?'b':null);
  ter.path([[16,25],[23,25],[28,24],[32,19],[32,15]],1.3,cur=>cur==='~'?'b':cur==='^'?null:'_');
  ter.ellipse(32,12.5,4.2,3,',',.25);
  ter.ellipse(7,22,4.5,3.5,',',.25);ter.path([[11,22],[14,22]],1.2,'_');
  [[9,31,4,3],[8,40,3.4,2.6],[10,12,3,2.5],[30,29,2.6,3],[23,41,3,2.2]].forEach(e=>{ter.ellipse(e[0],e[1],e[2]+1.2,e[3]+1.2,only('.',','),.2);obj.ellipse(e[0],e[1],e[2],e[3],(c,x,y)=>c===' '&&ter.get(x,y)===','?'n':null,.3);});
  ter.path([[13,31],[11,31]],1.2,',');ter.path([[12,40],[17,40]],1.2,',');ter.path([[14,13],[12,12]],1.2,',');ter.path([[28,24],[30,27]],1.2,',');ter.path([[20,41],[18.5,41]],1.2,',');
  p.build(5,19,8,21,(r,y)=>{house({cx:r.cx,cz:r.cz,y,W:r.W,D:r.D,H:1.4,rh:1,roof:T.roofGreen,front:canvasTex(64,24,f=>{f('#8a6a4a',0,0,64,24);for(let y=3;y<24;y+=4)f('#6a4a30',0,y,64,1);[4,44].forEach(x=>{f('#2a2a20',x,6,16,9);f('#a8d8a8',x+2,8,12,5);});f('#2a2a20',24,6,16,18);f('#4a8a4a',26,8,12,16);f('#f0c040',35,16,2,2);}),wall:T.wood,chimney:true});glowAt(r.cx-1.25,y+.65,r.z1+.01,.7,.4);glowAt(r.cx+1.25,y+.65,r.z1+.01,.7,.4);});
  /* the forest itself */
  obj.set(32,11,'Y');obj.rect(31,10,33,10,'X');obj.set(31,11,'X');obj.set(33,11,'X');
  const SIGNS=[[21,44,['CANOPY FOREST','South: Coralport. Track to the falls, 2 km.']],[16,29,['CASSOWARY CROSSING','Slow down. Do not feed. Back away slowly if one approaches.']],
    [20,11,['CRYSTAL VEIL FALLS','No swimming under the falls. Glimmet glow on the cliff at night.']],[10,23,['RANGER STATION','Report injured or trapped Pokémon here.']],[30,15,['THE CURTAIN FIG','Over 500 years old. Its roots hang down like a curtain.']]];
  const PEOPLE=[[17,42,'hiker',['Phew! Hot work in this humidity.','Keep to the track. The ferns either side are full of wild Pokémon.']],
    [30,14,'scientist',['This fig started life as a seed dropped by a Lorilet, high in another tree.','Its roots grew down and strangled the host. Nature is wild!']],
    [7,23,'ranger',['G\'day. This station looks after injured wildlife.','Lately we\'ve been finding snares on the tracks. Wire loops, the poacher kind.','If you see anyone in a Team Snare uniform, tell me straight away.']],
    [16,9,'kid',['Look at the waterfall!','At night the cliff lights up with Glimmet. It looks like the stars came down.']],
    [26,23,'grunt',['Oi! This is a, uh, scientific survey.','These cages? For... measuring. Lorilet. Lots of Lorilet.','...You didn\'t see anything, right? RIGHT?'],-Math.PI/2]];
  SIGNS.concat(PEOPLE).forEach(a=>obj.set(a[0],a[1],' '));
  obj.set(15,30,'X');
  p.border(2,'rrrT',".,^;");
  p.sprinkle('rrrT',0,0,W-1,H-1,.62,'.');
  p.sprinkle('r',0,0,W-1,H-1,.5,'^');

  const built=buildMap(L,p,{H1,tex:{grass:T.lush,lush:T.litter,dirt:T.path},bank:T.mud,cliff:T.rock,water:{color:'#a8d8c8',bedTex:T.bed,opacity:.82},
    skirt:[TREE.rain,TREE.rain,TREE.fig,TREE.gum],skirtDensity:.85,tufts:90,tuft:T.fern,flowerChance:.05,
    waterTalk:['The creek runs cool and clear over smooth stones.'],rockTalk:['A mossy boulder.']});
  const g=L.grid,wp=(x,y)=>g.w(x,y);
  SIGNS.forEach(a=>tileSign(L,a[0],a[1],a[2]));
  PEOPLE.forEach(a=>npc(L,()=>human(CHAR[a[2]]),a[0],a[1],a[3],a[4]?{rot:a[4]}:null));
  door(L,7,21,{say:['Canopy Forest Ranger Station.','A ranger checks your team over. Everyone feels refreshed!']});
  door(L,6,21,{say:['Canopy Forest Ranger Station.','A ranger checks your team over. Everyone feels refreshed!']});
  talkRect(L,31,10,33,11,['The Curtain Fig. Its hanging roots sway gently in the breeze.']);
  /* cassowary in the scrub */
  const cas=cassowary();{const [x,z]=wp(15,30);cas.group.position.set(x,0,z);cas.group.rotation.y=.6;add(cas.group);blob(x,0,z,.4);}
  L.talk.set('15,30',['A Cassowar! Its blue head turns to watch you.','It decides you\'re not worth the trouble and goes back to eating fallen fruit.']);
  /* waterfall: a sheet of water down the cliff, a creek on top and mist below */
  const [fx,fz]=wp(22,5);
  const fallTex=rep(T.fall,3,H1+.4);
  const fall=add(new THREE.Mesh(new THREE.PlaneGeometry(3,H1+.3),M({map:fallTex,roughness:.3,emissive:'#1a3a6a',emissiveIntensity:.25,transparent:true,opacity:.92})));fall.position.set(fx,(H1+.3)/2-.2,fz+.55);
  const topTex=rep(T.water,3,6);const topW=add(new THREE.Mesh(new THREE.PlaneGeometry(2.6,6),M({map:topTex,roughness:.3,transparent:true,opacity:.9,color:'#cfeee6'})));topW.rotation.x=-Math.PI/2;topW.position.set(fx,H1+.03,fz-2.4);
  const foam=[];for(let i=0;i<9;i++)foam.push(spr(T.foam,fx-1.3+i*.33,-.12,fz+.75+rnd()*.3,.5,.38));
  /* glow-worms on the cliff at night */
  const GN=70,gp=new Float32Array(GN*3);for(let i=0;i<GN;i++){gp[i*3]=fx-8+rnd()*16;gp[i*3+1]=.3+rnd()*(H1-.2);gp[i*3+2]=fz+.62;}
  const ggeo=new THREE.BufferGeometry();ggeo.setAttribute('position',new THREE.BufferAttribute(gp,3));
  const glim=add(new THREE.Points(ggeo,new THREE.PointsMaterial({color:'#7af0ff',size:.09,transparent:true,opacity:.95,depthWrite:false})));
  /* butterflies by day: Ulysses blue */
  const BF=10,bf=[];for(let i=0;i<BF;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(.22,.16),new THREE.MeshBasicMaterial({color:'#2a7ae8',side:THREE.DoubleSide}));add(m);bf.push({m,ph:rnd()*6,r:1.5+rnd()*3});}
  L.spawn={tx:19,ty:44,face:[0,-1]};
  L.exit=(tx,ty,dx,dy)=>(ty>=H-1&&dy===1)?{to:'coralport',spawn:{tx:tx<=19?27:28,ty:1,face:[0,1]},card:['Coralport','Gateway to the Reef']}:null;
  L.update=t=>{
    if(built.water)built.water.offset.set(0,-t*.12);
    fallTex.offset.y=t*1.1;topTex.offset.y=t*.4;
    foam.forEach((f,i)=>{f.position.y=-.12+Math.abs(Math.sin(t*3+i))*.12;});
    glim.visible=lampsOn;glim.material.opacity=.6+Math.sin(t*2)*.35;
    bf.forEach((b,i)=>{b.m.visible=!lampsOn;const a=t*.5+b.ph;b.m.position.set(target.x+Math.cos(a)*b.r,target.y+1.2+Math.sin(t*2+b.ph)*.4,target.z+Math.sin(a*1.3)*b.r*.7);b.m.rotation.y=Math.sin(t*14+i)*1.2;});
  };
})(CF);
