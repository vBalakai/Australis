/* Australis: polished battle models. Smooth shapes, cel shading and ink outlines.
   The low-poly models in starters.js stay as the overworld models that follow you. */

const BM=(function(){
  const grad=new THREE.DataTexture(new Uint8Array([70,150,215,255]),4,1,THREE.LuminanceFormat);
  grad.minFilter=grad.magFilter=THREE.NearestFilter;grad.generateMipmaps=false;grad.needsUpdate=true;
  const ink=new THREE.MeshBasicMaterial({color:'#1c1a24',side:THREE.BackSide});
  const cache=new Map();
  const toon=(c,glow)=>{const k=c+(glow||'');if(!cache.has(k))cache.set(k,new THREE.MeshToonMaterial({color:c,gradientMap:grad,emissive:glow||'#000000',emissiveIntensity:glow?.9:0}));return cache.get(k);};
  /* a part with a cel-shaded material and a back-face ink outline */
  function part(geo,c,x,y,z,parent,o){
    o=o||{};const m=new THREE.Mesh(geo,o.glow?new THREE.MeshToonMaterial({color:c,gradientMap:grad,emissive:o.glow,emissiveIntensity:.9}):toon(c));
    m.position.set(x,y,z);if(o.s)m.scale.set(o.s[0],o.s[1],o.s[2]);if(o.r)m.rotation.set(o.r[0],o.r[1],o.r[2]);
    if(o.line!==false){const l=new THREE.Mesh(geo,ink);l.scale.setScalar(1+(o.line||.06));m.add(l);}
    parent.add(m);return m;
  }
  const S=(r,w,h)=>new THREE.SphereGeometry(r,w||28,h||20);
  /* a rounded, flat slab from a 2D outline: bills, tails and leaves */
  function slab(shape,depth,bevel){const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelThickness:bevel,bevelSize:bevel,bevelSegments:4,curveSegments:20});g.center();return g;}
  function roundRect(w,h,r){const s=new THREE.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;}
  /* a duck-bill outline: wide and round at the tip, narrower where it meets the face */
  function billShape(w,len){const s=new THREE.Shape();s.moveTo(-w*.32,0);s.bezierCurveTo(-w*.55,len*.35,-w*.62,len*.85,-w*.3,len);s.quadraticCurveTo(0,len*1.12,w*.3,len);s.bezierCurveTo(w*.62,len*.85,w*.55,len*.35,w*.32,0);s.lineTo(-w*.32,0);return s;}
  function leafShape(w,len){const s=new THREE.Shape();s.moveTo(0,0);s.quadraticCurveTo(w,len*.45,0,len);s.quadraticCurveTo(-w,len*.45,0,0);return s;}
  function padShape(r){const s=new THREE.Shape();s.absarc(0,0,r,.32,Math.PI*2-.32,false);s.lineTo(0,0);s.lineTo(Math.cos(.32)*r,Math.sin(.32)*r);return s;}
  /* glossy anime eyes: dark oval, coloured lower iris and two highlights; returns the group so it can blink */
  function eye(parent,x,y,z,size,iris,ry,angry){
    const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry||0;parent.add(g);
    part(S(size),'#14121c',0,0,0,g,{s:[.78,1,.42],line:.08});
    part(S(size*.55),iris,0,-size*.35,size*.2,g,{s:[.85,.6,.4],line:false});
    part(S(size*.3),'#ffffff',size*.28,size*.38,size*.34,g,{line:false});
    part(S(size*.14),'#ffffff',-size*.2,-size*.1,size*.38,g,{line:false});
    if(angry)part(new THREE.BoxGeometry(size*2.2,size*.42,size*.4),'#14121c',x>0?-size*.1:size*.1,size*1.25,size*.1,g,{r:[0,0,x>0?.42:-.42],line:false});
    return g;
  }
  function freckleRow(parent,y,z,w,n,curve){const out=[];for(let i=0;i<n;i++){const k=i/(n-1)-.5,dz=-Math.abs(k)*curve;out.push(part(S(.024,10,8),'#3ab8ff',k*w,y,z+dz+((i%2)?.025:-.02),parent,{glow:'#1a90ff',line:false}));}return out;}

  /* ---------- Puggly ---------- */
  function puggly(){
    const root=new THREE.Group(),rig={root,blink:[],glow:[]};
    const TEAL='#33b0a4',TEAL2='#23887f',CREAM='#fff6dc',PINK='#f47c80',PINK2='#d65a64';
    const body=new THREE.Group();root.add(body);rig.body=body;
    part(S(.42),TEAL,0,.42,0,body,{s:[1,.9,.92]});
    part(S(.3),CREAM,0,.38,.17,body,{s:[1,1.05,.72],line:.03});
    const head=new THREE.Group();head.position.set(0,.86,.04);body.add(head);rig.head=head;
    part(S(.36),TEAL,0,0,0,head,{s:[1.06,.95,.98]});
    [[.2,.26,-.12,.05],[-.24,.2,-.08,.04],[.06,.32,-.2,.035],[.3,-.02,-.12,.035],[-.3,.04,-.16,.04]].forEach(d=>part(S(d[3],12,10),TEAL2,d[0],d[1],d[2],head,{s:[1,.7,1],line:false}));
    [[.28,-.1,.22],[-.3,-.08,.2],[.22,.16,-.32]].forEach(d=>part(S(.05,12,10),TEAL2,d[0]+.02,d[1]-.42,d[2],body,{s:[1,.7,1],line:false}));
    rig.blink.push(eye(head,.15,.1,.27,.115,'#2f6fd0',.3),eye(head,-.15,.1,.27,.115,'#2f6fd0',-.3));
    [-1,1].forEach(sd=>part(S(.06,14,10),'#ff9ab0',sd*.27,-.03,.24,head,{s:[1.2,.6,.4],line:false}));
    const bill=new THREE.Group();bill.position.set(0,-.14,.27);bill.rotation.x=.32;head.add(bill);rig.bill=bill;
    part(slab(billShape(.46,.36),.06,.035),PINK,0,0,.16,bill,{r:[Math.PI/2,0,0]});
    part(new THREE.SphereGeometry(.21,24,12,0,Math.PI*2,0,Math.PI/2),PINK2,0,-.04,.15,bill,{s:[1.12,.25,.92],r:[Math.PI,0,0],line:false});
    rig.glow.push(...freckleRow(bill,.05,.24,.24,5,.08));
    [-.06,.06].forEach(x=>part(S(.016,8,6),'#a8343e',x,.05,.31,bill,{line:false}));
    /* little webbed paws */
    [-1,1].forEach(sd=>{part(S(.09,16,12),PINK,sd*.24,.28,.3,body,{s:[1,.75,1.1]});part(S(.11,16,12),PINK,sd*.2,.05,.2,body,{s:[1.1,.45,1.4]});
      [-.05,0,.05].forEach(d=>part(S(.03,8,6),PINK2,sd*.2+d,.04,.34,body,{line:false}));});
    /* lily-pad tail with a flower */
    const tail=new THREE.Group();tail.position.set(0,.12,-.36);root.add(tail);rig.tail=tail;
    part(slab(padShape(.34),.03,.015),'#4cc04a',0,0,-.26,tail,{r:[Math.PI/2,0,Math.PI/2+.0],line:.04});
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2+.5;part(new THREE.BoxGeometry(.012,.012,.26),'#2e8a32',Math.cos(a)*.13,.025,-.26+Math.sin(a)*.13,tail,{r:[0,-a+Math.PI/2,0],line:false});}
    const fl=new THREE.Group();fl.position.set(.12,.06,-.36);tail.add(fl);
    for(let i=0;i<5;i++){const a=i/5*Math.PI*2;part(S(.045,12,8),'#ffc0d8',Math.cos(a)*.05,.02,Math.sin(a)*.05,fl,{s:[1,.5,1],line:.05});}
    part(S(.03,10,8),'#ffe070',0,.04,0,fl,{line:false});
    return rig;
  }

  /* ---------- Spurbill ---------- */
  function spurbill(){
    const root=new THREE.Group(),rig={root,blink:[],glow:[]};
    const TEAL='#1f8c86',TEAL2='#156a66',CREAM='#fff4d8',PINK='#ee7078',PINK2='#cc4c58',AQUA='#8ff4e6';
    const body=new THREE.Group();root.add(body);rig.body=body;
    part(S(.4),TEAL,0,.48,-.05,body,{s:[.92,.78,1.55]});
    part(S(.32),CREAM,0,.36,.08,body,{s:[.9,.6,1.4],line:.03});
    /* swirling current markings */
    [-1,1].forEach(sd=>[[0,.52,.0,.16],[0,.46,-.3,.11]].forEach(c=>{const t=part(new THREE.TorusGeometry(c[3],.022,8,28,Math.PI*1.4),AQUA,sd*.355,c[1],c[2],body,{r:[0,sd*Math.PI/2,.6],line:false});}));
    const head=new THREE.Group();head.position.set(0,.7,.5);body.add(head);rig.head=head;
    part(S(.28),TEAL,0,0,0,head,{s:[1,.92,1.05]});
    part(new THREE.TorusGeometry(.12,.02,8,24,Math.PI*1.2),AQUA,0,.16,-.06,head,{r:[Math.PI/2.4,0,.4],line:false});
    rig.blink.push(eye(head,.13,.09,.2,.095,'#2f9ad8',.4,true),eye(head,-.13,.09,.2,.095,'#2f9ad8',-.4,true));
    const bill=new THREE.Group();bill.position.set(0,-.1,.22);bill.rotation.x=.22;head.add(bill);rig.bill=bill;
    part(slab(billShape(.46,.48),.055,.03),PINK,0,0,.22,bill,{r:[Math.PI/2,0,0]});
    rig.glow.push(...freckleRow(bill,.045,.28,.26,7,.06));
    part(new THREE.BoxGeometry(.3,.012,.012),PINK2,0,.05,.42,bill,{line:false});
    /* reed blades down the back */
    [[.0,.82,.2,.42,-.55],[.0,.84,-.05,.5,-.75],[.0,.8,-.3,.42,-.95],[.0,.72,-.52,.32,-1.1]].forEach((b,i)=>{
      const g=new THREE.Group();g.position.set(b[0],b[1],b[2]);g.rotation.x=b[4];body.add(g);
      part(slab(leafShape(.07,b[3]),.02,.01),i%2?'#8ee04a':'#5cc23a',0,b[3]/2,0,g,{r:[0,Math.PI/2,0],line:.05});});
    /* legs and webbed feet, with small spurs */
    [[-.26,.36],[.26,.36],[-.26,-.42],[.26,-.42]].forEach((p,i)=>{part(S(.11,16,12),TEAL,p[0],.18,p[1],body,{s:[1,1.2,1]});part(S(.12,16,12),PINK,p[0]*1.08,.04,p[1]+.06,body,{s:[1.1,.4,1.4]});
      if(i>1)part(new THREE.ConeGeometry(.035,.14,10),'#fff0d0',p[0]*1.45,.16,p[1],body,{r:[0,0,p[0]>0?-1.2:1.2],line:.08});});
    const tail=new THREE.Group();tail.position.set(0,.36,-.62);root.add(tail);rig.tail=tail;
    part(slab(roundRect(.42,.5,.18),.06,.03),TEAL2,0,0,-.22,tail,{r:[Math.PI/2+.25,0,0]});
    [-.12,0,.12].forEach(x=>part(new THREE.ConeGeometry(.05,.14,12),TEAL2,x,-.12,-.5,tail,{r:[-Math.PI/2-.25,0,0],line:.06}));
    return rig;
  }

  /* ---------- Platyrant ---------- */
  function platyrant(){
    const root=new THREE.Group(),rig={root,blink:[],glow:[],spurs:[]};
    const B='#1d6b64',B2='#124c48',CREAM='#f4ecd0',STONE='#9a9c88',MOSS='#5abf3a',BILL='#3a4444';
    const body=new THREE.Group();root.add(body);rig.body=body;
    part(S(.72),B,0,1.0,0,body,{s:[1.08,.92,1.18],r:[.22,0,0]});
    part(S(.5),CREAM,0,.88,.42,body,{s:[1,1.12,.55],line:.03});
    /* river-stone plates with moss */
    [[0,1.62,-.1,.3],[-.42,1.48,-.28,.24],[.42,1.48,-.28,.24],[-.22,1.42,-.64,.22],[.24,1.4,-.66,.22],[0,1.18,-.92,.2],[-.6,1.22,.18,.2],[.6,1.22,.18,.2]].forEach(p=>{
      const st=new THREE.Mesh(new THREE.DodecahedronGeometry(p[3],1),toon(STONE));st.position.set(p[0],p[1],p[2]);st.scale.set(1.15,.6,1.1);st.rotation.y=p[0]*3;
      const l=new THREE.Mesh(st.geometry,ink);l.scale.setScalar(1.07);st.add(l);body.add(st);
      [[.05,.0],[-.06,.05],[0,-.07]].forEach((d,k)=>part(S(p[3]*(.42-k*.08),14,10),k?'#7ad848':MOSS,p[0]+d[0]*p[3]*3,p[1]+p[3]*.42,p[2]+d[1]*p[3]*3,body,{s:[1,.6,1],line:.05}));});
    const head=new THREE.Group();head.position.set(0,1.5,.78);body.add(head);rig.head=head;
    part(S(.42),B,0,0,0,head,{s:[1.06,.9,1]});
    rig.blink.push(eye(head,.19,.12,.31,.12,'#ffb020',.4,true),eye(head,-.19,.12,.31,.12,'#ffb020',-.4,true));
    const bill=new THREE.Group();bill.position.set(0,-.16,.34);bill.rotation.x=.38;head.add(bill);rig.bill=bill;
    part(slab(billShape(.78,.62),.09,.05),BILL,0,0,.28,bill,{r:[Math.PI/2,0,0]});
    part(new THREE.BoxGeometry(.06,.05,.4),'#5a6462',0,.08,.24,bill,{line:.08});
    rig.glow.push(...freckleRow(bill,.075,.36,.5,9,.12));
    /* knuckle-walking forearms */
    [-1,1].forEach(sd=>{
      part(S(.24,20,14),B,sd*.72,1.0,.38,body,{s:[1,1.3,1]});
      part(new THREE.CylinderGeometry(.16,.24,.62,18),B,sd*.86,.56,.56,body,{r:[.15,0,sd*.25]});
      part(S(.24,20,14),B2,sd*.94,.16,.66,body,{s:[1.1,.6,1.1]});
      [-.1,0,.1].forEach(d=>part(new THREE.ConeGeometry(.045,.18,10),CREAM,sd*.94+d,.12,.9,body,{r:[Math.PI/2,0,0],line:.08}));});
    /* haunches with glowing venom spurs */
    [-1,1].forEach(sd=>{
      part(S(.34,20,14),B,sd*.56,.42,-.42,body,{s:[1,1.05,1.15]});
      part(S(.24,20,14),B2,sd*.6,.07,-.24,body,{s:[1.1,.45,1.4]});
      const sp=part(new THREE.ConeGeometry(.09,.42,14),'#c8fcff',sd*.92,.46,-.5,body,{glow:'#18d0ff',r:[0,0,-sd*1.15],line:.06});rig.spurs.push(sp);});
    const tail=new THREE.Group();tail.position.set(0,.42,-1.05);root.add(tail);rig.tail=tail;
    part(slab(roundRect(.86,.8,.34),.1,.05),B2,0,0,-.32,tail,{r:[Math.PI/2+.32,0,0]});
    const ts=new THREE.Mesh(new THREE.DodecahedronGeometry(.2,1),toon(STONE));ts.position.set(0,.06,-.36);ts.scale.set(1.3,.45,1.2);const tl=new THREE.Mesh(ts.geometry,ink);tl.scale.setScalar(1.07);ts.add(tl);tail.add(ts);
    return rig;
  }

  const BUILD={puggly,spurbill,platyrant};
  /* idle animation: breathing, blinking, a wagging tail, bill bob and pulsing glow */
  function animate(rig,t){
    const br=Math.sin(t*2.2);
    rig.body.scale.set(1+br*.012,1-br*.018,1+br*.012);
    if(rig.head){rig.head.rotation.z=Math.sin(t*.9)*.05;rig.head.rotation.x=Math.sin(t*1.3)*.03;}
    if(rig.tail)rig.tail.rotation.y=Math.sin(t*1.8)*.18;
    if(rig.bill)rig.bill.rotation.x=(rig.bill.userData.r0===undefined?(rig.bill.userData.r0=rig.bill.rotation.x):rig.bill.userData.r0)+Math.max(0,Math.sin(t*1.1))*.06;
    const ph=t%4.2,bl=ph<.12?Math.max(.08,1-ph/.06):ph<.24?Math.max(.08,(ph-.12)/.12):1;
    rig.blink.forEach(e=>e.scale.y=bl);
    const gk=.6+(Math.sin(t*3)+1)*.4;rig.glow.forEach(g=>g.material.emissiveIntensity=gk);
    (rig.spurs||[]).forEach(s=>s.material.emissiveIntensity=.7+Math.abs(Math.sin(t*2))*.8);
  }
  return {BUILD,animate};
})();
