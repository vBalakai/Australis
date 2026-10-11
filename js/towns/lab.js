/* Australis: the Professor's lab in Wattle Town, where you choose your starter */

const LABFLOOR=canvasTex(16,16,f=>{f('#e8ecee',0,0,16,16);f('#d4dadd',0,0,8,8);f('#d4dadd',8,8,8,8);f('#c4cacd',0,15,16,1);f('#c4cacd',15,0,1,16);});
const SHELF=canvasTex(32,32,f=>{f('#7a5434',0,0,32,32);[2,12,22].forEach(y=>{f('#5a3a20',0,y+8,32,2);let x=2;['#c84838','#3a6ad0','#e0b030','#4a9a48','#8a5ab8','#e07a2a','#2ea89a'].forEach((c,i)=>{const w=2+(i*7+y)%3;f(c,x,y,w,8);f('rgba(255,255,255,.25)',x,y,1,8);x+=w+1;});});});
const MAPSCREEN=canvasTex(48,28,f=>{f('#1a2a3a',0,0,48,28);f('#3a6a8a',1,1,46,26);
  [[12,6,26,16],[10,10,30,10],[16,4,20,20]].forEach(r=>f('#c8743f',r[0],r[1],r[2],r[3]));f('#5aa848',30,4,10,8);f('#5aa848',34,14,8,8);f('#e6d0a0',8,12,4,6);
  [[38,7],[40,16],[22,20],[34,22],[14,15]].forEach(p=>{f('#ffffff',p[0],p[1],2,2);f('#f05050',p[0],p[1],1,1);});f('#f0d048',2,2,14,2);});

const LAB=newLoc('lab',{name:'Professor\'s Lab',sub:'Wattle Town · Choose your partner',yaw:0,indoor:true,grid:Grid(13,11,-6.5,-5.5)});
(function(L){
  PARENT=L.group;const g=L.grid,wp=(x,y)=>g.w(x,y);
  room(-6.5,6.5,-5.5,5.5,LABFLOOR,T.labwall,2.6);
  /* bookshelves and the big map screen on the back wall */
  [[0,3],[9,12]].forEach(([a,b])=>{const r=rectOf(L,a,0,b,0);const sm=M({map:rep(SHELF,(b-a+1)/2,1)}),side=mc('#6a4428');mesh(new THREE.BoxGeometry(r.W,2.1,.7),[side,side,side,side,sm,side],r.cx,1.05,r.z0+.4);});
  const sc=mesh(new THREE.BoxGeometry(3.4,2,.1),[mc('#2a3038'),mc('#2a3038'),mc('#2a3038'),mc('#2a3038'),M({map:MAPSCREEN,emissive:'#3a6a8a',emissiveIntensity:.35}),mc('#2a3038')],0,1.5,-5.35);
  g.block(0,0,12,0);
  talkRect(L,0,0,3,0,['Shelves of field notes: "Koala calls of the Darling Downs", "Frill displays, a study", "Platypus electrosense, vol. 2".']);
  talkRect(L,9,0,12,0,['Old books about Australis legends. One spine just says "The Great Serpent".']);
  talkRect(L,4,0,8,0,['A map of Australis. Pins mark every place a Pokémon has gone missing this year. There are a lot of pins.']);
  /* the table with three capsules */
  const tr=rectOf(L,4,3,8,3);
  mesh(new THREE.BoxGeometry(tr.W,.12,.9),mc('#f4f6f8'),tr.cx,.82,tr.cz);mesh(new THREE.BoxGeometry(tr.W-.3,.76,.7),mc('#5ac0b0'),tr.cx,.38,tr.cz);
  g.block(4,3,8,3);talkRect(L,5,3,5,3,['A clipboard: "Partner Pokémon program. Choose with your heart."']);talkRect(L,7,3,7,3,['A tray of Poké Balls, polished and ready.']);
  const caps={};const CAPGLASS=new THREE.MeshStandardMaterial({color:'#e8f8ff',roughness:.05,metalness:.2,transparent:true,opacity:.14,depthWrite:false});
  STARTERS.forEach((k,i)=>{
    const tx=4+i*2,[x,z]=wp(tx,3);
    mesh(new THREE.CylinderGeometry(.34,.38,.14,14),metal,x,.95,z);
    mesh(new THREE.TorusGeometry(.35,.04,5,20),mc(['#4a9a48','#e0602a','#2e7ac8'][i]),x,1.02,z).rotation.x=Math.PI/2;
    const glass=mesh(new THREE.SphereGeometry(.36,14,8,0,Math.PI*2,0,Math.PI/2),CAPGLASS,x,1.02,z);glass.castShadow=false;glass.scale.y=1.7;glass.renderOrder=2;
    const m=FORMS[k].build();m.group.scale.setScalar(.62);m.group.position.set(x,1.02,z);add(m.group);
    caps[k]={m,tx,taken:false};
    L.talk.set(tx+',3',()=>{
      const f=FORMS[k];
      if(STATE.starter)return caps[k].taken?['The capsule is empty.']:[f.name+' presses its face against the glass and waves at you.'];
      return {sprite:true,lines:[f.name+', the '+['Koala','Frilled Lizard','Platypus'][i]+' Pokémon. '+f.type+' type.',f.blurb,'Will you choose '+f.name+' as your partner?'],
        onEnd:()=>choose([{label:'Yes, '+f.name+'!',fn:()=>pickStarter(k)},{label:'Not yet',fn:null}])};
    });
  });
  /* desk, tanks and plants */
  {const [x,z]=wp(1,4);mesh(new THREE.BoxGeometry(1.8,.1,.8),mc('#b07c48'),x+.5,.75,z);[[-.3,-.3],[1.3,-.3],[-.3,.3],[1.3,.3]].forEach(c=>mesh(new THREE.BoxGeometry(.08,.75,.08),mc('#8a5a30'),x+c[0],.37,z+c[1]));
    mesh(new THREE.BoxGeometry(.8,.55,.06),[mc('#2a3038'),mc('#2a3038'),mc('#2a3038'),mc('#2a3038'),M({color:'#3a8ad0',emissive:'#3a8ad0',emissiveIntensity:.5}),mc('#2a3038')],x+.5,1.1,z-.2);
    g.block(0,4,2,4);talkRect(L,0,4,2,4,['The Professor\'s computer. The screen says: "Snare sightings: Bloomridge lookout. Tell the new trainer to be careful."']);}
  [[12,3],[12,5]].forEach(c=>{const [x,z]=wp(c[0],c[1]);mesh(new THREE.BoxGeometry(.8,.7,.8),mc('#d8dce4'),x,.35,z);const w=mesh(new THREE.BoxGeometry(.72,.6,.72),M({color:'#8ad0f0',transparent:true,opacity:.55,roughness:.1}),x,1,z);w.castShadow=false;pt(G.ball(.12,0),'#5aa848',x,.85,z,L.group);g.block(c[0],c[1]);L.talk.set(c[0]+','+c[1],['A specimen tank. A sleepy Burrowlet is curled up in the soil.']);});
  [[0,9],[12,9],[0,1],[12,1]].forEach(c=>{const [x,z]=wp(c[0],c[1]);mesh(new THREE.CylinderGeometry(.22,.18,.36,8),mc('#c86a3a'),x,.18,z);spr(TREE.gum,x,.3,z,.9,1.1);g.block(c[0],c[1]);});
  slab(-1,1,4.6,5.5,0,.03,T.awning,'#a83028');
  /* the Professor and your rival */
  const prof=npc(L,()=>human(CHAR.prof),6,1,null);
  prof.lines=()=>STATE.starter?['Take good care of '+partnerName()+'. Pokémon trust the people who look after them.','Head east through the wheat country to Bloomridge, then on to Riverbend City.','And be careful. Pokémon have been going missing all over Australis.']
    :['Ah, there you are! Welcome to my lab.','Australis is full of Pokémon you won\'t find anywhere else in the world.','On the table are three of them: Gumjo, Kindrill and Puggly.','Take a look at each capsule, and choose the partner you want to travel with.'];
  const rival=npc(L,()=>human(CHAR.rival),10,5,null,{rot:-Math.PI/2});
  let rivalMon=null;
  rival.lines=()=>STATE.starter?['My '+FORMS[RIVAL_PICK[STATE.starter]].name+' has the type advantage over your '+FORMS[STATE.starter].name+'. Just saying.','See you on the road. I\'ll beat you to Riverbend!']:['Hurry up and pick! I\'m choosing right after you.','...So I can pick the one that beats yours. Obviously.'];
  function pickStarter(k){
    const f=FORMS[k],rk=RIVAL_PICK[k],rf=FORMS[rk];
    caps[k].taken=true;caps[k].m.group.visible=false;
    startPartner(k,P.tx,P.ty+1);
    say(['You chose '+f.name+'!',f.name+': "'+f.cry+'"','Rival: "Then I\'ll take '+rf.name+'! '+rf.type+' beats '+f.type+', you know."'],()=>{
      caps[rk].taken=true;caps[rk].m.group.visible=false;
      const keep=PARENT;PARENT=L.group;rivalMon=npc(L,()=>rf.build(),11,5,[rf.name+': "'+rf.cry+'"','It puffs itself up proudly next to your rival.'],{hop:true,rot:-Math.PI/2});PARENT=keep;
      say(['Professor: "Wonderful! A trainer and their partner. There\'s nothing like it."','"You can talk to '+f.name+' any time. Just turn and face it."','"When you\'re ready, head east to Bloomridge. Your journey starts now!"']);
    });
  }
  L.spawn={tx:6,ty:9,face:[0,-1]};
  L.exit=(tx,ty,dx,dy)=>(ty>=10&&dy===1)?{to:'wattle',spawn:{tx:7,ty:18,face:[0,1]}}:null;
  L.update=t=>{STARTERS.forEach((k,i)=>{const c=caps[k];if(c.taken)return;c.m.group.rotation.y=Math.sin(t*.8+i)*.6;c.m.group.position.y=1.02+Math.abs(Math.sin(t*2.2+i))*.05;animMon(c.m,t,false);});
    sc.material[4].emissiveIntensity=.3+Math.sin(t*1.5)*.08;};
})(LAB);
