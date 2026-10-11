/* Australis: starter designs. Each design is written once and built with a "kit":
   the overworld kit makes the simple model that follows you, the battle kits make the detailed model,
   either faceted (angular, Gen 1 style) or smooth. Only needs three.js. */

const MD=(function(){
  const grad=new THREE.DataTexture(new Uint8Array([64,140,205,255]),4,1,THREE.LuminanceFormat);
  grad.minFilter=grad.magFilter=THREE.NearestFilter;grad.generateMipmaps=false;grad.needsUpdate=true;
  const inkMat=new THREE.MeshBasicMaterial({color:'#1a1820',side:THREE.BackSide});
  const flatten=g=>{const n=g.index?g.toNonIndexed():g;n.computeVertexNormals();return n;};

  /* ---- 2D outlines for flat parts ---- */
  const SH={
    bill(w,len){const s=new THREE.Shape();s.moveTo(-w*.32,0);s.bezierCurveTo(-w*.55,len*.35,-w*.6,len*.85,-w*.3,len);s.quadraticCurveTo(0,len*1.1,w*.3,len);s.bezierCurveTo(w*.6,len*.85,w*.55,len*.35,w*.32,0);s.lineTo(-w*.32,0);return s;},
    barrel(w,len){const s=new THREE.Shape();s.moveTo(-w*.38,0);s.lineTo(-w*.5,len*.25);s.lineTo(-w*.42,len*.92);s.quadraticCurveTo(0,len*1.06,w*.42,len*.92);s.lineTo(w*.5,len*.25);s.lineTo(w*.38,0);s.lineTo(-w*.38,0);return s;},
    leaf(w,len){const s=new THREE.Shape();s.moveTo(0,0);s.quadraticCurveTo(w,len*.42,0,len);s.quadraticCurveTo(-w,len*.42,0,0);return s;},
    plate(w,len){const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(w*.22,len);s.quadraticCurveTo(0,len*1.08,-w*.22,len);s.lineTo(-w/2,0);return s;},
    paddle(w,len){const s=new THREE.Shape();s.moveTo(-w*.25,0);s.quadraticCurveTo(-w*.55,len*.2,-w*.5,len*.6);s.quadraticCurveTo(-w*.45,len,0,len);s.quadraticCurveTo(w*.45,len,w*.5,len*.6);s.quadraticCurveTo(w*.55,len*.2,w*.25,0);s.lineTo(-w*.25,0);return s;},
    shield(w,h){const s=new THREE.Shape();s.moveTo(0,-h/2);s.quadraticCurveTo(w*.55,-h*.3,w/2,h*.3);s.lineTo(0,h/2);s.lineTo(-w/2,h*.3);s.quadraticCurveTo(-w*.55,-h*.3,0,-h/2);return s;},
    bolt(w,h){const s=new THREE.Shape();s.moveTo(-w*.1,h/2);s.lineTo(w*.4,h*.05);s.lineTo(w*.05,h*.05);s.lineTo(w*.2,-h/2);s.lineTo(-w*.4,-h*.02);s.lineTo(-w*.05,-h*.02);s.lineTo(-w*.1,h/2);return s;}
  };

  /* ---- kits ---- */
  function Kit(mode){
    const hi=mode!=='world',facet=mode!=='smooth',mats=new Map();
    const K={hi,mode,glows:[],blink:[]};
    K.mat=(c,glow)=>{const k=c+'|'+(glow||'');if(mats.has(k))return mats.get(k);
      const m=hi?new THREE.MeshToonMaterial({color:c,gradientMap:grad,emissive:glow||'#000000',emissiveIntensity:glow?.9:0})
               :new THREE.MeshStandardMaterial({color:c,flatShading:true,roughness:.85,metalness:0,emissive:glow||'#000000',emissiveIntensity:glow?.9:0});
      mats.set(k,m);return m;};
    const fx=g=>(hi&&facet)?flatten(g):g;
    K.ball=r=>hi?(facet?flatten(new THREE.IcosahedronGeometry(r,2)):new THREE.SphereGeometry(r,28,20)):new THREE.IcosahedronGeometry(r,1);
    K.box=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
    K.cyl=(a,b,h,n)=>fx(new THREE.CylinderGeometry(a,b,h,n||(hi?(facet?8:20):7)));
    K.cone=(r,h,n)=>fx(new THREE.ConeGeometry(r,h,n||(hi?(facet?5:14):5)));
    K.rock=r=>new THREE.DodecahedronGeometry(r,hi&&!facet?1:0);
    K.tor=(r,t,arc)=>new THREE.TorusGeometry(r,t,hi?8:4,hi?24:10,arc||Math.PI*2);
    K.slab=(shape,depth,bevel)=>{const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:hi,bevelThickness:bevel||.01,bevelSize:bevel||.01,bevelSegments:hi?(facet?1:3):1,curveSegments:hi?(facet?5:14):4});g.center();return fx(g);};
    K.g=(parent,x,y,z,r)=>{const g=new THREE.Group();g.position.set(x,y,z);if(r)g.rotation.set(r[0],r[1],r[2]);parent.add(g);return g;};
    /* o: s scale, r rotation, glow emissive colour, line outline thickness (false for none), hi only in battle models */
    K.p=(geo,c,x,y,z,parent,o)=>{o=o||{};if(o.hi&&!hi){const d=new THREE.Group();d.position.set(x,y,z);parent.add(d);return d;}
      const m=new THREE.Mesh(geo,K.mat(c,o.glow));m.position.set(x,y,z);if(o.s)m.scale.set(o.s[0],o.s[1],o.s[2]);if(o.r)m.rotation.set(o.r[0],o.r[1],o.r[2]);m.castShadow=true;
      if(hi&&o.line!==false){const l=new THREE.Mesh(geo,inkMat);l.scale.setScalar(1+(o.line||.05));m.add(l);}
      if(o.glow&&K.glows.indexOf(m.material)<0)K.glows.push(m.material);parent.add(m);return m;};
    /* eyes: 'cute' is a big glossy oval, 'fierce' has a white sclera, a coloured iris and a brow */
    K.eye=(par,x,y,z,s,iris,ry,style)=>{
      const g=K.g(par,x,y,z,[0,ry||0,0]);const side=x>0?1:-1;
      if(!hi){K.p(K.box(s*1.1,s*1.5,s*.4),style==='fierce'?'#f4f0e6':'#16141c',0,0,0,g);
        if(style==='fierce'){K.p(K.box(s*.6,s*.8,s*.1),iris,0,-s*.1,s*.22,g);K.p(K.box(s*1.6,s*.35,s*.3),'#16141c',-side*s*.1,s*.85,0,g,{r:[0,0,side*.35]});}
        else K.p(K.box(s*.4,s*.45,s*.1),'#ffffff',s*.2,s*.35,s*.22,g);
        K.blink.push(g);return g;}
      if(style==='fierce'){
        K.p(K.ball(s),'#f8f4ea',0,0,0,g,{s:[1,.78,.42],line:.09});
        K.p(K.ball(s*.6),iris,-side*s*.08,-s*.05,s*.2,g,{s:[1,1,.4],line:false});
        K.p(K.ball(s*.3),'#14121a',-side*s*.08,-s*.05,s*.29,g,{s:[1,1.3,.4],line:false});
        K.p(K.ball(s*.14),'#ffffff',s*.15,s*.15,s*.34,g,{line:false});
        K.p(K.box(s*2.5,s*.42,s*.45),'#14121a',-side*s*.12,s*.82,s*.08,g,{r:[0,0,side*.38],line:false});
      }else{
        K.p(K.ball(s),'#16141c',0,0,0,g,{s:[.8,1,.42],line:.09});
        K.p(K.ball(s*.56),iris,0,-s*.35,s*.2,g,{s:[.85,.6,.4],line:false});
        K.p(K.ball(s*.3),'#ffffff',s*.28,s*.38,s*.34,g,{line:false});
        K.p(K.ball(s*.14),'#ffffff',-s*.2,-s*.1,s*.38,g,{line:false});
      }
      K.blink.push(g);return g;};
    /* a fan of plates: frills and quill crowns */
    K.fan=(par,x,y,z,n,spread,len,w,cols,o)=>{o=o||{};const f=K.g(par,x,y,z,o.r);
      for(let i=0;i<n;i++){const a=-spread/2+spread*i/Math.max(1,n-1);const arm=K.g(f,0,0,0,[0,0,a]);
        K.p(K.slab(SH.plate(w,len),o.depth||.03,.008),cols[i%cols.length],0,len/2,0,arm,{line:.06});
        if(o.tip)K.p(K.cone(w*.32,len*.32),o.tip,0,len*1.08,0,arm,{glow:o.tipGlow,line:.08});
        if(o.bolt&&i%2===0)K.p(K.slab(SH.bolt(w*.7,len*.55),.012),'#ffe860',0,len*.5,o.depth||.03,arm,{glow:'#ffd000',line:false,hi:true});}
      return f;};
    return K;
  }
  function rigOf(K){const group=new THREE.Group(),root=new THREE.Group();group.add(root);return {group,root,K,glows:K.glows,blink:K.blink};}

  /* ================= Grass: the koala line, the tank ================= */
  const FUR='#8f95a3',FUR2='#747a88',CREAM='#ece6d4',BARK='#7a5232',BARK2='#5a3a22',GUM='#8a5a34',LEAF='#4f9e3e',LEAF2='#3a7e30',NOSE='#2a2a34';
  function gumnut(K,par,x,y,z,r,o){const g=K.g(par,x,y,z,o&&o.rot);
    K.p(K.cyl(r,r*.78,r*.75),GUM,0,0,0,g);K.p(K.cyl(r*1.06,r*1.06,r*.14),'#a06a3c',0,r*.38,0,g,{line:.06});
    K.p(K.box(r*1.5,r*.08,r*.12),'#3a2414',0,r*.46,0,g,{line:false});K.p(K.box(r*.12,r*.08,r*1.5),'#3a2414',0,r*.46,0,g,{line:false});
    return g;}
  function gumjo(K){
    const R=rigOf(K),r=R.root;
    K.p(K.ball(.22),FUR,0,.22,0,r,{s:[1,.95,.9]});K.p(K.ball(.15),CREAM,0,.2,.1,r,{s:[1,1,.6],line:.03});
    const h=R.head=K.g(r,0,.5,.02);
    K.p(K.ball(.24),FUR,0,0,0,h);
    [-1,1].forEach(sd=>{K.p(K.ball(.12),FUR,sd*.21,.13,-.02,h);K.p(K.ball(.075),'#f6f4f0',sd*.21,.13,.04,h,{s:[1,1,.5],line:false});
      K.p(K.cone(.04,.12),'#f6f4f0',sd*.3,.22,-.02,h,{r:[0,0,-sd*.7],hi:true});});
    gumnut(K,h,0,.22,0,.13);
    K.p(K.ball(.06),NOSE,0,-.03,.22,h,{s:[1,1.15,.7]});
    K.eye(h,.1,.06,.19,.05,'#4a8a3a',.3,'cute');K.eye(h,-.1,.06,.19,.05,'#4a8a3a',-.3,'cute');
    /* it hides behind its gum-leaf shield */
    R.shield=K.g(r,0,.27,.22,[.15,0,0]);
    K.p(K.slab(SH.leaf(.14,.32),.02,.008),LEAF,0,0,0,R.shield,{r:[0,0,.25]});K.p(K.box(.012,.26,.012),LEAF2,0,0,.012,R.shield,{r:[0,0,.25],line:false,hi:true});
    [-1,1].forEach(sd=>{K.p(K.ball(.06),FUR,sd*.13,.27,.16,r);K.p(K.ball(.07),FUR2,sd*.1,.04,.07,r,{s:[1,.6,1.2]});});
    return R;}
  function bellowala(K){
    const R=rigOf(K),r=R.root;
    K.p(K.ball(.34),FUR,0,.46,0,r,{s:[1,1.05,.88]});K.p(K.ball(.25),CREAM,0,.44,.15,r,{s:[1,1.1,.55],line:.03});
    const h=R.head=K.g(r,0,.97,.04);
    K.p(K.ball(.3),FUR,0,0,0,h);
    [-1,1].forEach(sd=>{K.p(K.ball(.16),FUR,sd*.29,.16,-.03,h);K.p(K.ball(.1),'#f6f4f0',sd*.29,.16,.05,h,{s:[1,1,.5],line:false});
      [0,1,2].forEach(k=>K.p(K.cone(.045,.15),'#f6f4f0',sd*(.38+k*.02),.26-k*.07,-.03,h,{r:[0,0,-sd*(.9+k*.3)],hi:true}));});
    gumnut(K,h,0,.27,-.02,.17);
    K.p(K.ball(.085),NOSE,0,-.05,.27,h,{s:[1.1,1.25,.75]});
    K.eye(h,.12,.08,.24,.06,'#4a8a3a',.3,'fierce');K.eye(h,-.12,.08,.24,.06,'#4a8a3a',-.3,'fierce');
    /* collar of layered gum leaves */
    for(let i=0;i<10;i++){const a=i/10*Math.PI*2;const g=K.g(r,Math.sin(a)*.24,.74,Math.cos(a)*.21,[0,a,0]);K.p(K.slab(SH.leaf(.08,.2),.015,.006),i%2?LEAF:LEAF2,0,-.06,.04,g,{r:[1.1,0,0]});}
    /* bark bracers and shoulder pads */
    [-1,1].forEach(sd=>{
      K.p(K.cyl(.085,.08,.3),FUR,sd*.37,.6,.02,r,{r:[0,0,sd*.25]});
      const fa=K.g(r,sd*.42,.36,.12,[.5,0,sd*.1]);
      K.p(K.cyl(.1,.09,.28),FUR,0,0,0,fa);[-.08,0,.08].forEach((d,k)=>K.p(K.box(.24,.07,.24),k%2?BARK:BARK2,0,d,0,fa,{r:[0,k*.3,.1*(k-1)]}));
      [-.05,0,.05].forEach(d=>K.p(K.cone(.025,.08),'#2a2420',d,-.17,.06,fa,{r:[Math.PI,0,0],hi:true}));
      [0,1].forEach(k=>K.p(K.box(.22-k*.04,.06,.24-k*.04),k?BARK:BARK2,sd*(.34+k*.02),.78+k*.06,0,r,{r:[0,0,sd*(.5+k*.1)]}));
      K.p(K.cyl(.1,.09,.26),FUR,sd*.16,.13,.02,r);K.p(K.ball(.11),FUR2,sd*.16,.03,.1,r,{s:[1,.5,1.3]});});
    /* a broad leaf shield on its left arm */
    R.shield=K.g(r,.5,.44,.28,[0,.5,0]);
    K.p(K.slab(SH.shield(.42,.56),.04,.012),LEAF,0,0,0,R.shield);K.p(K.slab(SH.shield(.3,.4),.03,.01),'#6cc050',0,0,.03,R.shield,{line:false,hi:true});
    K.p(K.box(.02,.48,.02),LEAF2,0,0,.05,R.shield,{line:false});
    return R;}
  function koalossus(K){
    const R=rigOf(K),r=R.root;
    K.p(K.ball(.62),FUR,0,.82,0,r,{s:[1.2,.95,1.2]});K.p(K.ball(.42),CREAM,0,.74,.44,r,{s:[1,1.1,.5],line:.03});
    /* shingled ironbark armour across the back and shoulders */
    for(let row=0;row<3;row++)for(let c=-1;c<=1;c++)K.p(K.box(.36,.08,.32),(row+c)%2?BARK:BARK2,c*.32,1.36-row*.1,-.12-row*.24,r,{r:[-.35-row*.1,c*.2,c*-.25]});
    [-1,1].forEach(sd=>[0,1,2].forEach(k=>K.p(K.box(.42-k*.06,.08,.4-k*.06),k%2?BARK:BARK2,sd*(.62+k*.02),1.2+k*.08,.12,r,{r:[0,0,sd*(.55+k*.08)]})));
    /* a eucalyptus grove growing out of the armour */
    [[-.28,-.28,.62,LEAF],[.24,-.36,.8,'#5aae44'],[0,-.58,.56,LEAF2]].forEach(t=>{K.p(K.cyl(.04,.06,t[2]),'#e0d8c8',t[0],1.4+t[2]/2,t[1],r);
      [[0,0,0,.2],[.1,-.06,.05,.13],[-.09,-.04,-.06,.12]].forEach(b=>K.p(K.rock(b[3]),t[3],t[0]+b[0],1.42+t[2]+b[1],t[1]+b[2],r));});
    const h=R.head=K.g(r,0,1.36,.5);
    K.p(K.ball(.4),FUR,0,0,0,h);
    [-1,1].forEach(sd=>{K.p(K.ball(.21),FUR,sd*.38,.22,-.04,h);K.p(K.ball(.13),'#f6f4f0',sd*.38,.22,.06,h,{s:[1,1,.5],line:false});
      [0,1,2].forEach(k=>K.p(K.cone(.05,.16),k?'#6ac050':'#4e9a3a',sd*(.5+k*.02),.34-k*.09,-.04,h,{r:[0,0,-sd*(.9+k*.3)]}));});
    K.p(K.box(.56,.08,.1),FUR2,0,.17,.34,h,{r:[.3,0,0]});
    K.p(K.ball(.12),NOSE,0,-.06,.37,h,{s:[1.15,1.25,.75]});
    K.p(K.ball(.2),CREAM,0,-.22,.22,h,{s:[1.2,.6,.8],line:.03});
    K.eye(h,.15,.06,.33,.07,'#5ab040',.3,'fierce');K.eye(h,-.15,.06,.33,.07,'#5ab040',-.3,'fierce');
    gumnut(K,h,0,.36,-.06,.15);
    /* tree-trunk arms with boulder fists */
    [-1,1].forEach(sd=>{
      K.p(K.cyl(.19,.16,.5),FUR,sd*.7,.8,.32,r,{r:[.2,0,sd*.3]});
      const fa=K.g(r,sd*.82,.42,.48);K.p(K.cyl(.17,.22,.48),FUR,0,0,0,fa);
      [-.12,0,.12].forEach((d,k)=>K.p(K.box(.42,.08,.42),k%2?BARK:BARK2,0,d,0,fa,{r:[0,k*.4,0]}));
      const fist=K.p(K.rock(.22),'#8a7a62',sd*.86,.16,.58,r);fist.rotation.set(.4,sd*.6,.2);
      K.p(K.ball(.26),FUR,sd*.5,.3,-.42,r,{s:[1,1,1.2]});K.p(K.ball(.2),FUR2,sd*.52,.06,-.28,r,{s:[1.1,.45,1.35]});});
    R.shield=K.g(r,0,.9,.9);
    return R;}

  /* ================= Fire: the frilled dinosaur line, all-rounders ================= */
  const ORA='#f07428',ORA2='#c0441a',BELLY='#ffd27a',RED='#d8341e';
  function kindrill(K){
    const R=rigOf(K),r=R.root;
    K.p(K.ball(.16),ORA,0,.27,0,r,{s:[1,1.05,1.2]});K.p(K.ball(.11),BELLY,0,.25,.08,r,{s:[1,1.1,.7],line:.03});
    [-.06,.02,.1].forEach(z=>K.p(K.box(.2,.025,.04),ORA2,0,.42,z-.08,r,{r:[.3,0,0],line:false,hi:true}));
    const h=R.head=K.g(r,0,.5,.1);
    K.p(K.ball(.15),ORA,0,0,0,h,{s:[1,.95,1.15]});K.p(K.ball(.1),ORA,0,-.03,.14,h,{s:[.85,.65,1]});
    K.p(K.ball(.07),BELLY,0,-.07,.16,h,{s:[.9,.5,.9],line:false});
    K.eye(h,.08,.04,.1,.045,'#ffb020',.45,'cute');K.eye(h,-.08,.04,.1,.045,'#ffb020',-.45,'cute');
    /* a bit of eggshell still stuck on its head */
    const shell=K.g(h,.02,.11,-.02,[-.2,0,.2]);
    K.p(new THREE.SphereGeometry(.1,K.hi?14:6,K.hi?6:3,0,Math.PI*2,0,Math.PI/2.2),'#f6eedc',0,0,0,shell,{line:.08});
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2;K.p(K.cone(.025,.05),'#f6eedc',Math.cos(a)*.085,-.02,Math.sin(a)*.085,shell,{r:[Math.PI,0,0],hi:true});}
    /* its frill is still folded, like a closed fan */
    R.frill=K.fan(r,0,.48,-.04,5,1.2,.14,.06,[RED,'#f05a2a'],{r:[-.9,0,0],tip:'#ffd040',tipGlow:'#ff9a10'});
    [-1,1].forEach(sd=>{K.p(K.ball(.07),ORA,sd*.1,.15,-.02,r);K.p(K.box(.07,.03,.12),ORA2,sd*.1,.02,.04,r);
      K.p(K.cyl(.02,.02,.08),ORA,sd*.12,.3,.13,r,{r:[.9,0,0]});});
    R.tail=K.g(r,0,.22,-.18);K.p(K.cyl(.05,.08,.24),ORA,0,0,-.08,R.tail,{r:[-1.3,0,0]});K.p(K.cyl(.02,.05,.18),ORA,0,-.06,-.27,R.tail,{r:[-1.45,0,0]});
    R.flame=K.p(K.cone(.05,.16),'#ffb030',0,-.07,-.4,R.tail,{r:[-1.45,0,0],glow:'#ff6a10'});
    return R;}
  function frillblaze(K){
    const R=rigOf(K),r=R.root;
    const body=K.g(r,0,.62,0,[-.25,0,0]);
    K.p(K.ball(.26),'#e05a1c',0,0,0,body,{s:[.85,.9,1.45]});K.p(K.ball(.18),'#ffc458',0,-.08,.12,body,{s:[.8,.8,1.2],line:.03});
    [-1,1].forEach(sd=>[0,1,2].forEach(k=>K.p(K.box(.02,.16,.05),ORA2,sd*.21,.04,.12-k*.14,body,{r:[0,0,sd*.3],line:false,hi:true})));
    for(let i=0;i<6;i++)K.p(K.cone(.04,.11),'#8a2a10',0,.24-i*.01,.18-i*.1,body,{r:[-.4,0,0]});
    const h=R.head=K.g(r,0,1.0,.36);
    K.p(K.ball(.16),'#e05a1c',0,0,0,h,{s:[.9,.85,1.25]});K.p(K.ball(.12),'#e05a1c',0,-.04,.17,h,{s:[.8,.6,1.1]});
    K.p(K.box(.12,.03,.14),'#ffc458',0,-.1,.17,h,{line:false});
    [-1,1].forEach(sd=>K.p(K.cone(.025,.1),'#8a2a10',sd*.07,.13,.04,h,{r:[-.6,0,sd*.3]}));
    K.eye(h,.08,.05,.14,.05,'#ffd030',.5,'fierce');K.eye(h,-.08,.05,.14,.05,'#ffd030',-.5,'fierce');
    R.frill=K.fan(r,0,.98,.22,9,2.5,.3,.09,[RED,'#f06a20','#e04a2a'],{r:[-.35,0,0],tip:'#ffd040',tipGlow:'#ff8a10'});
    [-1,1].forEach(sd=>{K.p(K.cyl(.03,.03,.2),'#e05a1c',sd*.15,.72,.28,r,{r:[1.1,0,0]});K.p(K.cone(.02,.06),'#2a2420',sd*.15,.66,.38,r,{r:[2.4,0,0],hi:true});
      K.p(K.ball(.12),'#e05a1c',sd*.15,.42,-.04,r,{s:[1,1.3,1.1]});
      K.p(K.cyl(.045,.05,.3),'#b8441a',sd*.16,.22,-.07,r,{r:[-.35,0,0]});K.p(K.box(.09,.04,.17),'#b8441a',sd*.16,.03,.03,r);
      K.p(K.cone(.025,.09),'#f4ecd8',sd*.16,.08,.1,r,{r:[1.2,0,0],hi:true});});
    R.tail=K.g(r,0,.5,-.3);K.p(K.cyl(.06,.11,.4),'#e05a1c',0,-.05,-.15,R.tail,{r:[-1.25,0,0]});K.p(K.cyl(.025,.06,.36),'#e05a1c',0,-.13,-.48,R.tail,{r:[-1.4,0,0]});
    R.flame=K.p(K.cone(.08,.24),'#ffb030',0,-.17,-.72,R.tail,{r:[-1.4,0,0],glow:'#ff6a10'});
    return R;}
  function pyragon(K){
    const R=rigOf(K),r=R.root,C='#5a1c16',C2='#3e1210';
    const body=K.g(r,0,1.0,0,[-.25,0,0]);
    K.p(K.ball(.55),C,0,0,0,body,{s:[.95,.95,1.35]});
    K.p(K.ball(.4),'#e8a050',0,-.12,.3,body,{s:[.85,.9,.9],line:.03});
    for(let i=0;i<4;i++)K.p(K.box(.5-i*.04,.025,.04),'#ff7a20',0,.1-i*.12,.62-i*.02,body,{glow:'#ff5a10',line:false,hi:true});
    /* armoured scutes down the spine with glowing seams */
    for(let i=0;i<6;i++){K.p(K.box(.22-i*.015,.1,.16),C2,0,.52-i*.03,.2-i*.16,body,{r:[-.3,0,0]});K.p(K.box(.18,.02,.03),'#ff7a20',0,.5-i*.03,.12-i*.16,body,{glow:'#ff5a10',line:false,hi:true});}
    const h=R.head=K.g(r,0,1.58,.62);
    K.p(K.ball(.3),C,0,0,0,h,{s:[.95,.85,1.35]});
    R.jaw=K.g(h,0,-.14,.12);K.p(K.box(.34,.08,.38),C2,0,0,.08,R.jaw);
    [-.1,-.03,.04,.11].forEach(x=>K.p(K.cone(.022,.07),'#f4ecd8',x,.06,.24,R.jaw,{hi:true}));
    K.p(K.cone(.06,.22),'#f4ecd8',0,.14,.38,h,{r:[.5,0,0]});
    [-1,1].forEach(sd=>K.p(K.cone(.055,.36),'#f4ecd8',sd*.15,.24,.08,h,{r:[-.2,0,-sd*.35]}));
    K.eye(h,.15,.07,.24,.07,'#ffe040',.5,'fierce');K.eye(h,-.15,.07,.24,.07,'#ffe040',-.5,'fierce');
    /* a bony frill that crackles with dry lightning */
    R.frill=K.fan(r,0,1.6,.38,11,3.0,.62,.17,['#3a1210','#4e1c16'],{r:[-.55,0,0],depth:.05,tip:'#f4ecd8',tipGlow:null,bolt:true});
    [-1,1].forEach(sd=>{K.p(K.cyl(.05,.05,.24),C,sd*.28,1.0,.6,r,{r:[1.1,0,0]});K.p(K.cone(.025,.08),'#f4ecd8',sd*.28,.92,.72,r,{r:[2.4,0,0],hi:true});
      K.p(K.ball(.3),C,sd*.36,.62,-.12,r,{s:[1,1.25,1.15]});
      K.p(K.cyl(.13,.15,.42),C2,sd*.38,.24,-.08,r,{r:[-.2,0,0]});K.p(K.box(.24,.07,.32),C2,sd*.38,.04,.05,r);
      [-.07,0,.07].forEach(d=>K.p(K.cone(.03,.1),'#f4ecd8',sd*.38+d,.05,.24,r,{r:[Math.PI/2,0,0],hi:true}));});
    R.tail=K.g(r,0,.85,-.6);K.p(K.cyl(.12,.24,.62),C,0,-.08,-.24,R.tail,{r:[-1.2,0,0]});K.p(K.cyl(.05,.12,.6),C,0,-.24,-.75,R.tail,{r:[-1.35,0,0]});
    R.bolt=K.p(K.slab(SH.bolt(.34,.46),.05,.01),'#ffe860',0,-.3,-1.1,R.tail,{glow:'#ffd000',r:[0,Math.PI/2,0]});
    return R;}

  /* ================= Water: the platypus line, special-attack snipers ================= */
  const BLU='#2b6f8a',BLU2='#1e5468',PALE='#ebe4c8',GUN='#3a4048',GUN2='#262a32',CYAN='#40d8ff',LIME='#b8ff50',LIMEG='#6ae020';
  /* a bill that works like a barrel: glowing bands near the muzzle and a sight on top */
  function barrelBill(K,par,w,len,depth,bands){
    const b=K.g(par,0,0,0);
    K.p(K.slab(SH.barrel(w,len),depth,depth*.4),GUN,0,0,len*.5,b,{r:[Math.PI/2,0,0]});
    for(let i=0;i<bands;i++)K.p(K.box(w*(.86-i*.04),depth*1.25,.025),CYAN,0,0,len*(.72+i*.1),b,{glow:'#18b8ff',line:false});
    b.muzzle=K.p(K.ball(w*.12),'#d8fbff',0,0,len*1.0,b,{glow:CYAN,line:false});
    return b;}
  function quill(K,par,x,y,z,len,r){const q=K.g(par,x,y,z,r);K.p(K.cone(len*.16,len*.35),GUN2,0,len*.12,0,q);K.p(K.cone(len*.11,len*.75),LIME,0,len*.6,0,q,{glow:LIMEG,line:.06});return q;}
  function puggly(K){
    const R=rigOf(K),r=R.root;R.quills=[];
    K.p(K.ball(.16),BLU,0,.19,0,r,{s:[.85,.8,1.6]});K.p(K.ball(.12),PALE,0,.15,.04,r,{s:[.8,.55,1.5],line:.03});
    const h=R.head=K.g(r,0,.27,.22);
    K.p(K.ball(.13),BLU,0,0,0,h,{s:[1,.9,1.05]});
    K.p(K.box(.08,.02,.05),PALE,0,.11,.06,h,{r:[.4,0,0],line:false,hi:true});
    K.eye(h,.07,.04,.1,.04,'#40a8e0',.4,'cute');K.eye(h,-.07,.04,.1,.04,'#40a8e0',-.4,'cute');
    R.bill=K.g(h,0,-.04,.1,[.08,0,0]);const bb=barrelBill(K,R.bill,.2,.24,.04,1);R.muzzle=bb.muzzle;
    for(let i=0;i<3;i++)R.quills.push(quill(K,r,0,.3,-.02-i*.08,.1,[-.5,0,0]));
    [[-.1,.1],[.1,.1],[-.1,-.12],[.1,-.12]].forEach(p=>{K.p(K.ball(.04),BLU,p[0],.06,p[1],r);K.p(K.box(.07,.02,.08),GUN,p[0],.01,p[1]+.02,r);});
    R.tail=K.g(r,0,.15,-.24);K.p(K.slab(SH.paddle(.2,.24),.025,.008),BLU2,0,0,-.12,R.tail,{r:[-Math.PI/2-.12,0,0]});
    return R;}
  function spurbill(K){
    const R=rigOf(K),r=R.root;R.quills=[];
    K.p(K.ball(.24),BLU,0,.33,0,r,{s:[.75,.68,1.85]});K.p(K.ball(.18),PALE,0,.27,.04,r,{s:[.75,.5,1.7],line:.03});
    for(let i=0;i<3;i++)K.p(K.box(.16,.015,.05),PALE,0,.49-i*.005,.12-i*.18,r,{r:[0,.0,0],line:false,hi:true});
    const h=R.head=K.g(r,0,.42,.44);
    K.p(K.ball(.17),BLU,0,0,0,h,{s:[.95,.85,1.15]});
    K.eye(h,.09,.05,.12,.045,CYAN,.5,'fierce');K.eye(h,-.09,.05,.12,.045,CYAN,-.5,'fierce');
    R.bill=K.g(h,0,-.04,.14,[.04,0,0]);const bb=barrelBill(K,R.bill,.24,.42,.05,2);R.muzzle=bb.muzzle;
    /* a scope on top of the bill: its electrosense sight */
    K.p(K.cyl(.025,.025,.14),GUN2,0,.06,.16,R.bill,{r:[Math.PI/2,0,0]});K.p(K.ball(.022),CYAN,0,.06,.24,R.bill,{glow:'#18b8ff',line:false});
    for(let i=0;i<6;i++)R.quills.push(quill(K,r,0,.47-i*.01,.2-i*.11,.22-i*.012,[-.7,0,0]));
    [[-.15,.24],[.15,.24],[-.15,-.26],[.15,-.26]].forEach((p,i)=>{K.p(K.ball(.07),BLU,p[0],.13,p[1],r,{s:[1,1.2,1]});K.p(K.slab(SH.paddle(.13,.13),.02,.006),GUN,p[0]*1.1,.02,p[1]+.06,r,{r:[Math.PI/2,0,0]});
      if(i>1)K.p(K.cone(.025,.1),LIME,p[0]*1.5,.12,p[1],r,{r:[0,0,p[0]>0?-1.3:1.3],glow:LIMEG});});
    R.tail=K.g(r,0,.24,-.44);K.p(K.slab(SH.paddle(.3,.42),.035,.01),BLU2,0,0,-.21,R.tail,{r:[-Math.PI/2-.1,0,0]});
    [-1,1].forEach(sd=>K.p(K.slab(SH.leaf(.05,.16),.015,.005),BLU2,sd*.14,.02,-.32,R.tail,{r:[Math.PI/2,0,sd*1.3],hi:true}));
    return R;}
  function platyrant(K){
    const R=rigOf(K),r=R.root;R.quills=[];
    const B='#1f4e66',B2='#163a4c';
    const body=K.g(r,0,.92,0,[.32,0,0]);
    K.p(K.ball(.38),B,0,0,0,body,{s:[.78,1.15,.95]});K.p(K.ball(.28),PALE,0,-.04,.2,body,{s:[.75,1.1,.6],line:.03});
    /* the quill launcher: rows of venom quills on the shoulders and back, fired like homing missiles */
    const rows=[[5,.42,.3],[7,.38,.16],[7,.32,.0],[5,.24,-.16]];
    rows.forEach((rw,row)=>{const [n,len,y]=rw;for(let i=0;i<n;i++){const a=(i/(n-1)-.5)*2.5;
      R.quills.push(quill(K,body,Math.sin(a)*.26,y+Math.cos(a)*.06,-.24-row*.05+Math.abs(Math.sin(a))*.08,len*(1-Math.abs(a)*.12),[-.75-row*.2,0,-a*.85]));}});
    const h=R.head=K.g(r,0,1.42,.4);
    K.p(K.ball(.22),B,0,0,0,h,{s:[.95,.85,1.15]});
    K.eye(h,.11,.06,.16,.055,CYAN,.5,'fierce');K.eye(h,-.11,.06,.16,.055,CYAN,-.5,'fierce');
    [-1,0,1].forEach(i=>R.quills.push(quill(K,h,i*.08,.16,-.1,.2-Math.abs(i)*.04,[-1.1,0,-i*.4])));
    /* a glowing scope ring around its right eye */
    K.p(K.tor(.075,.012),CYAN,.12,.06,.17,h,{r:[0,.5,0],glow:'#18b8ff',line:false});
    R.bill=K.g(h,0,-.05,.17,[.1,0,0]);const bb=barrelBill(K,R.bill,.32,.66,.065,3);R.muzzle=bb.muzzle;
    K.p(K.box(.05,.05,.5),GUN2,0,.05,.3,R.bill);
    K.p(K.cyl(.03,.03,.18),GUN2,0,.1,.2,R.bill,{r:[Math.PI/2,0,0]});K.p(K.ball(.026),CYAN,0,.1,.3,R.bill,{glow:'#18b8ff',line:false});
    /* slim forearms folded in front, webbed claws */
    [-1,1].forEach(sd=>{K.p(K.cyl(.06,.05,.36),B,sd*.24,1.0,.28,r,{r:[.9,0,sd*.2]});K.p(K.slab(SH.paddle(.14,.14),.02,.006),GUN,sd*.26,.82,.46,r,{r:[.6,0,0]});
      [-.04,0,.04].forEach(d=>K.p(K.cone(.016,.06),'#e8ecf0',sd*.26+d,.78,.53,r,{r:[2.1,0,0],hi:true}));});
    /* strong hind legs with big glowing venom spurs */
    [-1,1].forEach(sd=>{K.p(K.ball(.2),B,sd*.24,.48,-.12,r,{s:[1,1.25,1.15]});K.p(K.cyl(.08,.1,.36),B2,sd*.26,.2,-.04,r,{r:[-.2,0,0]});
      K.p(K.slab(SH.paddle(.2,.24),.03,.008),GUN,sd*.27,.02,.08,r,{r:[Math.PI/2,0,0]});
      K.p(K.cone(.045,.24),LIME,sd*.42,.22,-.1,r,{r:[0,0,-sd*1.2],glow:LIMEG});});
    R.tail=K.g(r,0,.55,-.42);K.p(K.slab(SH.paddle(.44,.62),.05,.014),B2,0,-.1,-.3,R.tail,{r:[-Math.PI/2+.4,0,0]});
    K.p(K.box(.04,.03,.5),CYAN,0,-.06,-.3,R.tail,{r:[.4,0,0],glow:'#18b8ff',line:false,hi:true});
    [-1,1].forEach(sd=>K.p(K.slab(SH.leaf(.07,.24),.02,.006),B2,sd*.22,-.16,-.48,R.tail,{r:[Math.PI/2-.4,0,sd*1.3]}));
    return R;}

  const DESIGNS={gumjo,bellowala,koalossus,kindrill,frillblaze,pyragon,puggly,spurbill,platyrant};
  const LINES=[
    {key:'koala',name:'Koala line',role:'Tank',type:'Grass',forms:['gumjo','bellowala','koalossus'],move:'Bark Bulwark',
     stats:{koalossus:[100,95,120,60,95,60]},blurb:'Bulky and armoured in ironbark. It hides behind a leaf shield, soaks up hits and hits back hard.'},
    {key:'dino',name:'Frilled dinosaur line',role:'All-rounder',type:'Fire',forms:['kindrill','frillblaze','pyragon'],move:'Frill Flare',
     stats:{pyragon:[85,95,85,90,85,90]},blurb:'A frilled-lizard dinosaur with balanced stats. It flares its frill to scare foes, then bites or breathes fire.'},
    {key:'platy',name:'Platypus line',role:'Special sniper',type:'Water',forms:['puggly','spurbill','platyrant'],move:'Hydro Snipe + Homing Quills',
     stats:{platyrant:[70,62,68,125,85,120]},blurb:'Slim and fast. Its bill compresses water into high-pressure shots, and it fires venom quills off its back that home in on targets.'}];
  /* stage 1 and 2 stats scale from the final form */
  function statsFor(form){const L=LINES.find(l=>l.forms.indexOf(form)>=0),st=L.forms.indexOf(form),fin=L.stats[L.forms[2]],k=[.6,.78,1][st];return fin.map(v=>Math.round(v*k));}
  function build(form,mode){const K=Kit(mode);const R=DESIGNS[form](K);R.form=form;return R;}
  /* idle animation shared by the overworld and battle models */
  function animate(R,t,moving){
    const br=Math.sin(t*2.2+(R.ph||0));R.root.scale.set(1+br*.01,1-br*.015,1+br*.01);
    if(R.head)R.head.rotation.z=Math.sin(t*.9+(R.ph||0))*.04;
    if(R.tail)R.tail.rotation.y=Math.sin(t*1.8+(R.ph||0))*.16;
    if(R.frill&&!R.frill.userData.busy)R.frill.scale.setScalar(1+Math.sin(t*3)*.03);
    if(R.flame){R.flame.scale.y=1+Math.sin(t*14)*.2;}
    if(R.bolt)R.bolt.visible=Math.sin(t*7)>-.6;
    if(R.jaw)R.jaw.rotation.x=Math.max(0,Math.sin(t*.7))*.12;
    const ph=(t+(R.ph||0))%4.4,bl=ph<.1?Math.max(.1,1-ph*9):ph<.2?Math.max(.1,(ph-.1)*9):1;R.blink.forEach(e=>e.scale.y=bl);
    const gk=.6+(Math.sin(t*3)+1)*.4;R.glows.forEach(m=>m.emissiveIntensity=gk);
  }
  return {build,animate,LINES,statsFor,DESIGNS};
})();
