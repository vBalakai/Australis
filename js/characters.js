/* Australis: low-poly 3D models for trainers, NPCs and Pokemon */
/* ---- low-poly character models (face +Z by default) ---- */
const mcache=new Map();
const mc=c=>{if(!mcache.has(c))mcache.set(c,new THREE.MeshStandardMaterial({color:c,flatShading:true,roughness:.85,metalness:0}));return mcache.get(c);};
function pt(geo,c,x,y,z,parent,sx,sy,sz){const m=new THREE.Mesh(geo,mc(c));m.position.set(x,y,z);if(sx)m.scale.set(sx,sy,sz);m.castShadow=true;parent.add(m);return m;}
const G={box:(w,h,d)=>new THREE.BoxGeometry(w,h,d),ball:(r,d)=>new THREE.IcosahedronGeometry(r,d===undefined?1:d),dome:r=>new THREE.SphereGeometry(r,8,4,0,Math.PI*2,0,Math.PI/2),cyl:(a,b,h,n)=>new THREE.CylinderGeometry(a,b,h,n||8),cone:(r,h,n)=>new THREE.ConeGeometry(r,h,n||6)};
const CHAR={
  player:{skin:'#f2c79a',hair:'#5a3a24',top:'#3a6ad0',stripe:'#f0c030',bottom:'#2a3a6a',shoes:'#c84838',cap:'#d0402e',logo:'#ffffff',bag:'#f0c030'},
  rival:{skin:'#f2c79a',hair:'#2a2a30',top:'#e07a2a',stripe:'#ffffff',bottom:'#3a3a44',shoes:'#2a2a30',cap:'#3a9a4a',logo:'#ffffff'},
  prof:{skin:'#f2c79a',hair:'#c8c8d0',top:'#5aa0d0',coat:'#eef0f2',bottom:'#5a4a3a',shoes:'#3a2a20',glasses:true},
  nurse:{skin:'#e8b88a',hair:'#4a3020',top:'#5ac0b0',bottom:'#3a8a80',shoes:'#f4f6f8',bun:true,badge:'#f06890'},
  gardener:{skin:'#e8b88a',hair:'#9a9a9a',top:'#4a9a48',bottom:'#3a6a30',shoes:'#6a4020',hat:'#e8c870'},
  kid:{skin:'#f2c79a',hair:'#8a4a24',top:'#e05080',bottom:'#2a3a6a',shoes:'#ffffff',cap:'#f0c030',logo:'#e05080',scale:.8},
  grunt:{skin:'#e8b88a',hair:'#3a3a2a',top:'#a89060',stripe:'#e0802a',bottom:'#6a5a3a',shoes:'#3a2a20',cap:'#3a3a2a',logo:'#e0802a',mask:'#5a4a3a'}
};
function human(o){
  const group=new THREE.Group(),root=new THREE.Group();group.add(root);root.scale.setScalar(.85*(o.scale||1));
  const leg=x=>{const g=new THREE.Group();g.position.set(x,.4,0);root.add(g);pt(G.box(.15,.32,.17),o.bottom,0,-.17,0,g);pt(G.box(.17,.09,.25),o.shoes,0,-.36,.03,g);return g;};
  const legL=leg(-.1),legR=leg(.1);
  const torso=new THREE.Group();torso.position.y=.38;root.add(torso);
  pt(G.box(.46,.42,.3),o.top,0,.21,0,torso);
  if(o.stripe)pt(G.box(.47,.07,.31),o.stripe,0,.3,0,torso);
  if(o.coat){pt(G.box(.5,.52,.33),o.coat,0,.14,0,torso);pt(G.box(.13,.3,.02),o.top,0,.27,.17,torso);}
  if(o.badge)pt(G.box(.08,.08,.02),o.badge,-.12,.3,.16,torso);
  if(o.bag){pt(G.box(.34,.32,.14),o.bag,0,.22,-.21,torso);pt(G.box(.04,.36,.04),'#2a2a30',-.14,.26,.13,torso);pt(G.box(.04,.36,.04),'#2a2a30',.14,.26,.13,torso);}
  const arm=x=>{const g=new THREE.Group();g.position.set(x,.38,0);torso.add(g);pt(G.box(.12,.3,.13),o.coat||o.top,0,-.14,0,g);pt(G.ball(.07,0),o.skin,0,-.32,0,g);return g;};
  const armL=arm(-.3),armR=arm(.3);
  const head=new THREE.Group();head.position.y=.8;root.add(head);
  pt(G.ball(.3),o.skin,0,.28,0,head);
  pt(G.dome(.32),o.hair,0,.3,-.02,head);pt(G.box(.5,.3,.2),o.hair,0,.24,-.17,head);
  if(o.bun)pt(G.ball(.12),o.hair,0,.5,-.2,head);
  if(o.cap){pt(G.dome(.335),o.cap,0,.32,0,head);pt(G.box(.36,.04,.22),o.cap,0,.34,.27,head);pt(G.box(.11,.08,.02),o.logo,0,.45,.29,head);}
  if(o.hat){pt(G.cyl(.5,.5,.03,12),o.hat,0,.5,0,head);pt(G.cyl(.24,.27,.18,10),o.hat,0,.6,0,head);pt(G.cyl(.275,.275,.04,10),'#c84838',0,.53,0,head);}
  if(o.glasses){pt(G.box(.12,.1,.01),'#d8eef8',-.1,.28,.29,head);pt(G.box(.12,.1,.01),'#d8eef8',.1,.28,.29,head);pt(G.box(.34,.02,.02),'#3a3a44',0,.32,.29,head);}
  [-.1,.1].forEach(x=>{pt(G.box(.06,.1,.02),'#2a2030',x,.28,.3,head);pt(G.box(.025,.03,.01),'#ffffff',x+.012,.31,.312,head);});
  if(o.mask)pt(G.box(.44,.14,.1),o.mask,0,.15,.24,head);
  return {group,root,legL,legR,armL,armR,head};
}
function animHuman(m,t,moving,phase){
  const sw=moving?Math.sin(phase)*.75:0;
  m.legL.rotation.x=sw;m.legR.rotation.x=-sw;m.armL.rotation.x=-sw*.8;m.armR.rotation.x=sw*.8;
  m.root.position.y=moving?Math.abs(Math.sin(phase))*.05:Math.max(0,Math.sin(t*2+(m.ph||0)))*.012;
  m.head.rotation.z=moving?0:Math.sin(t*.8+(m.ph||0))*.04;
}
function warblet(){
  const group=new THREE.Group(),root=new THREE.Group();group.add(root);
  pt(G.ball(.2),'#3a3a44',0,.24,0,root,1,.9,1.15);pt(G.ball(.15),'#f4f4f4',0,.21,.09,root,1,.9,.8);
  pt(G.ball(.15),'#9aa0aa',0,.47,.08,root);
  const beak=pt(G.cone(.05,.14,4),'#e0c040',0,.46,.27,root);beak.rotation.x=Math.PI/2;
  [-.07,.07].forEach(x=>pt(G.box(.04,.06,.02),'#2a2030',x,.51,.215,root));
  [-.19,.19].forEach(x=>pt(G.ball(.1),'#2a2a32',x,.26,-.02,root,.5,.9,1.3));
  pt(G.box(.12,.04,.2),'#2a2a32',0,.27,-.27,root);
  [-.06,.06].forEach(x=>pt(G.cyl(.015,.015,.1,4),'#e0c040',x,.05,0,root));
  return {group,root};
}
function gumjo(){
  const group=new THREE.Group(),root=new THREE.Group();group.add(root);
  pt(G.ball(.2),'#9aa0b0',0,.2,0,root,1,1,.9);pt(G.ball(.13),'#d8dce4',0,.2,.1,root);
  pt(G.ball(.23),'#9aa0b0',0,.5,0,root);
  [-.2,.2].forEach(x=>{pt(G.ball(.11),'#9aa0b0',x,.66,-.02,root);pt(G.ball(.065),'#e8eaf0',x,.66,.06,root);});
  pt(G.box(.1,.12,.06),'#3a3a44',0,.46,.22,root);
  [-.1,.1].forEach(x=>pt(G.box(.04,.06,.02),'#2a2030',x,.55,.21,root));
  const leaf=pt(G.ball(.14,0),'#5aa848',0,.3,.22,root,.55,1.3,.2);leaf.rotation.z=.35;
  [-.12,.12].forEach(x=>pt(G.ball(.06,0),'#9aa0b0',x,.32,.17,root));
  return {group,root};
}
function sugrette(){
  const group=new THREE.Group(),root=new THREE.Group();group.add(root);
  pt(G.ball(.14),'#b8bcc8',0,.16,0,root,1,.85,1.25);pt(G.ball(.1),'#f4f0f4',0,.14,.07,root);
  pt(G.ball(.13),'#b8bcc8',0,.34,.09,root);pt(G.box(.04,.02,.22),'#4a4a58',0,.465,.06,root);
  [-.09,.09].forEach(x=>{pt(G.cone(.06,.15,5),'#b8bcc8',x,.48,.06,root);pt(G.cone(.035,.09,5),'#f0a0c0',x,.47,.09,root);});
  [-.055,.055].forEach(x=>pt(G.ball(.036,0),'#2a2030',x,.36,.2,root));
  const tail=pt(G.cyl(.025,.04,.34,5),'#b8bcc8',0,.2,-.27,root);tail.rotation.x=1.15;
  pt(G.ball(.04,0),'#4a4a58',0,.27,-.42,root);
  [-.15,.15].forEach(x=>pt(G.box(.1,.02,.22),'#d8dce4',x,.17,0,root));
  return {group,root};
}
function turnTo(o,yaw,k){let d=yaw-o.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));o.rotation.y+=d*(still?1:k);}
