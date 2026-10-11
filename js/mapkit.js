/* Australis: map kit.
   A town is painted as two layers of characters, then built into rounded low-poly ground.
   Terrain layer:  . grass  , lush  : sand  = road  + plaza  _ dirt path  - red earth  u mud  k boardwalk
                   ~ water  b bridge or jetty over water  S stairs
                   ^ ; % * ! "  raised terrace (grass, lush, path, plaza, road, sand)
   Object layer:   T gum  J jacaranda  O olive  W wattle  r rainforest  p paperbark  P palm  Y giant fig  m mangrove
                   g tall grass  y dune grass  n fern  f flowers  R rock  L lamp  B bench  X blocked  # building */

/* ---- more pixel-art textures for the bigger maps ---- */
function bladesTex(dark,mid,hi){return canvasTex(16,14,f=>{
  f(dark,0,11,16,3);
  [[1,9],[4,12],[7,10],[10,13],[13,11],[15,7]].forEach(([x,h],i)=>{for(let k=0;k<h;k++){const y=12-k,w=k<h*.35?3:k<h*.75?2:1;f(k<2?dark:(k+i)%4===0?hi:mid,x-(w>1?1:0),y,w,1);}f(hi,x,13-h);});
  f(dark,0,13,16,1);
});}
T.tall=bladesTex('#2a6a2a','#4aa640','#8ad868');
T.dune=bladesTex('#8a7a3a','#c8b45a','#ece0a0');
T.litter=canvasTex(16,16,f=>{f('#5a7a3a',0,0,16,16);[[2,3,'#7a6a3a'],[9,1,'#4a6a30'],[12,9,'#8a7040'],[4,11,'#6a8a44'],[7,6,'#4a6a30'],[13,14,'#7a6a3a']].forEach(([x,y,c])=>f(c,x,y,3,2));f('#a08a50',6,13,2,1);f('#3e5a2a',11,4,1,2);});
T.fern=canvasTex(16,14,f=>{
  f('#1e4a24',2,12,12,2);
  [[8,2,0],[3,5,-1],[13,5,1],[5,8,-1],[11,8,1]].forEach(([x,y,d])=>{for(let k=0;k<6;k++){f('#2e6a34',x+d*k,y+k,1,1);f(k%2?'#5aa848':'#3e8a3e',x+d*k-1,y+k,3,1);}f('#8ad070',x,y);});
});
T.palmSpr=canvasTex(32,40,f=>{
  for(let y=14;y<40;y++){const x=Math.round(15+Math.sin((39-y)/26*1.4)*3);f('#7a5a3a',x,y,3,1);f('#a07850',x,y,1,1);if(y%3===0)f('#5a4028',x,y,3,1);}
  const frond=(dx,dy,droop,c,c2)=>{let x=18,y=13;for(let k=0;k<12;k++){x+=dx;y+=dy+k*droop;const X=Math.round(x),Y=Math.round(y);f(c,X,Y,2,2);if(k%2)f(c2,X,Y+2,1,2);}};
  frond(1,-.6,.13,'#2e7a2e','#4a9a3a');frond(-1,-.6,.13,'#2e7a2e','#4a9a3a');frond(1.1,0,.1,'#3e9a3a','#5ab44a');frond(-1.1,0,.1,'#3e9a3a','#5ab44a');
  frond(.3,-1,.15,'#4aae44','#6ac85a');frond(-.5,-.9,.14,'#4aae44','#6ac85a');
  f('#6a4a2a',16,12,3,3);f('#5a3a1a',17,14,2,2);
});
T.lily=canvasTex(16,16,f=>{f('#3e8a3a',2,4,12,9);f('#3e8a3a',4,2,8,13);f('#5aae4a',4,4,8,7);f('#2e6a2a',8,8,6,1);f('#f8b0d0',6,5,3,2);f('#ffffff',7,5);});
T.cobble=canvasTex(16,16,f=>{f('#b8aa94',0,0,16,16);[[0,0,7,4],[8,0,8,4],[0,5,4,5],[5,5,6,5],[12,5,4,5],[0,11,8,5],[9,11,7,5]].forEach(r=>{f('#cfc2aa',r[0]+1,r[1]+1,r[2]-1,r[3]-1);f('#e2d8c2',r[0]+1,r[1]+1,r[2]-2,1);});});
TREE.rain=treeTex({o:'#14321c',c1:'#1f4d2a',c2:'#2f6a34',c3:'#4a8a40',c4:'#6aa850',t1:'#6a5a44',t2:'#4a3a2a'});
TREE.paper=treeTex({o:'#34462c',c1:'#4e6a40',c2:'#6a8a52',c3:'#8aa86a',c4:'#b0c890',t1:'#ece6da',t2:'#bcb4a4'});
TREE.fig=treeTex({o:'#1a3a1e',c1:'#2a5a2c',c2:'#3a7a38',c3:'#5a9a48',c4:'#7ab85a',t1:'#8a7a60',t2:'#5a4a38'});

/* ---- painting ---- */
function hash2(x,y){let h=(Math.imul(x|0,374761393)+Math.imul(y|0,668265263))|0;h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967296;}
function Paint(W,H,fill){
  const a=new Array(W*H).fill(fill);
  const P={W,H,a,
    inside:(x,y)=>x>=0&&y>=0&&x<W&&y<H,
    get:(x,y)=>P.inside(x,y)?a[y*W+x]:null,
    set(x,y,c){x=Math.round(x);y=Math.round(y);if(!P.inside(x,y))return P;const v=typeof c==='function'?c(a[y*W+x],x,y):c;if(v!=null)a[y*W+x]=v;return P;},
    rect(x0,y0,x1,y1,c){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)P.set(x,y,c);return P;},
    ellipse(cx,cy,rx,ry,c,noise){for(let y=Math.floor(cy-ry-2);y<=Math.ceil(cy+ry+2);y++)for(let x=Math.floor(cx-rx-2);x<=Math.ceil(cx+rx+2);x++){const d=((x-cx)/rx)**2+((y-cy)/ry)**2;if(d<=1+(noise?(hash2(x,y)-.5)*noise:0))P.set(x,y,c);}return P;},
    path(pts,w,c){const r=w/2;for(let i=0;i<pts.length-1;i++){const [ax,ay]=pts[i],[bx,by]=pts[i+1],dx=bx-ax,dy=by-ay,L2=dx*dx+dy*dy;
      for(let y=Math.floor(Math.min(ay,by)-r-1);y<=Math.ceil(Math.max(ay,by)+r+1);y++)for(let x=Math.floor(Math.min(ax,bx)-r-1);x<=Math.ceil(Math.max(ax,bx)+r+1);x++){let t=L2?((x-ax)*dx+(y-ay)*dy)/L2:0;t=Math.max(0,Math.min(1,t));if(Math.hypot(x-ax-dx*t,y-ay-dy*t)<=r+.01)P.set(x,y,c);}}return P;},
    each(f){for(let y=0;y<H;y++)for(let x=0;x<W;x++){const v=f(x,y,a[y*W+x]);if(v!=null)a[y*W+x]=v;}return P;},
    stamp(rows,x0,y0){rows.forEach((r,j)=>{for(let i=0;i<r.length;i++)if(r[i]!==' ')P.set(x0+i,y0+j,r[i]);});return P;}
  };
  return P;
}
/* paint only over certain characters: ter.ellipse(..., only('.,', 'g')) */
const only=(chars,c)=>cur=>chars.indexOf(cur)>=0?c:null;
const except=(chars,c)=>cur=>chars.indexOf(cur)<0?c:null;
function Plan(W,H,base){
  const p={W,H,ter:Paint(W,H,base||'.'),obj:Paint(W,H,' '),blds:[],
    build(x0,y0,x1,y1,fn){p.obj.rect(x0,y0,x1,y1,'#');p.blds.push({x0,y0,x1,y1,fn});return p;},
    clear(x0,y0,x1,y1){p.obj.rect(x0,y0,x1,y1,' ');return p;},
    /* scatter objects on open ground of the given terrain */
    sprinkle(ch,x0,y0,x1,y1,dens,ok){ok=ok||'.,';for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(p.obj.get(x,y)===' '&&ok.indexOf(p.ter.get(x,y))>=0&&rnd()<dens)p.obj.set(x,y,ch[Math.floor(rnd()*ch.length)]);return p;},
    /* a ring of trees around the edge, leaving roads, water and paths open */
    border(w,ch,ok){ok=ok||'.,^;';for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(x>=w&&y>=w&&x<W-w&&y<H-w)continue;if(p.obj.get(x,y)===' '&&ok.indexOf(p.ter.get(x,y))>=0)p.obj.set(x,y,ch[Math.floor(rnd()*ch.length)]);}return p;}};
  return p;
}

/* ---- terrain table ---- */
const TER={
  '.':{top:'grass'},',':{top:'lush'},':':{top:'sand'},'=':{top:'road'},'+':{top:'plaza'},'_':{top:'dirt'},'-':{top:'earth'},'u':{top:'mud'},'k':{top:'deck'},'c':{top:'cobble'},
  '^':{lvl:1,top:'grass'},';':{lvl:1,top:'lush'},'%':{lvl:1,top:'dirt'},'*':{lvl:1,top:'plaza'},'!':{lvl:1,top:'road'},'"':{lvl:1,top:'sand'},'&':{lvl:1,top:'earth'},
  'S':{stairs:true,top:'grass'},'~':{water:true},'b':{water:true,deck:true}
};
/* every surface sits at its own small height, so neighbouring paths never share a plane */
const TOPH={grass:.002,lush:.004,mud:.006,sand:.008,earth:.010,dirt:.012,cobble:.013,road:.014,plaza:.016,deck:.02};
const TREES={T:'gum',J:'jac',O:'olive',W:'wattle',r:'rain',p:'paper'};

/* ---- soft tiles: straight edges, chamfered outside corners and filled inside corners, so shapes read as curves ---- */
const CH=.42;
const DIR8=[[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1],[1,0]];
function GB(){return {p:[],u:[]};}
function gbTri(g,a,b,c,ua,ub,uc){g.p.push(a[0],a[1],a[2],b[0],b[1],b[2],c[0],c[1],c[2]);g.u.push(ua[0],ua[1],ub[0],ub[1],uc[0],uc[1]);}
const tuv=v=>[v[0],-v[2]];
/* an upward-facing triangle whatever order its corners arrive in */
function triUp(g,a,b,c){const ny=(b[2]-a[2])*(c[0]-a[0])-(b[0]-a[0])*(c[2]-a[2]);if(ny>0)gbTri(g,a,b,c,tuv(a),tuv(b),tuv(c));else gbTri(g,a,c,b,tuv(a),tuv(c),tuv(b));}
/* a wall from P to Q (x,z pairs) between y0 and y1, facing direction (ox,oz) */
function gbWall(g,P,Q,y0,y1,ox,oz){
  const tx=Q[0]-P[0],tz=Q[1]-P[1];
  if(tz*ox-tx*oz<0){const t=P;P=Q;Q=t;}
  const tl=Math.hypot(tx,tz)||1,ux=(Q[0]-P[0])/tl,uz=(Q[1]-P[1])/tl,uP=P[0]*ux+P[1]*uz,uQ=Q[0]*ux+Q[1]*uz,v0=1-(y1-y0);
  const p0=[P[0],y0,P[1]],p1=[P[0],y1,P[1]],q0=[Q[0],y0,Q[1]],q1=[Q[0],y1,Q[1]];
  gbTri(g,p0,q1,q0,[uP,v0],[uQ,1],[uQ,v0]);gbTri(g,p0,p1,q1,[uP,v0],[uP,1],[uQ,1]);
}
/* corners in order NW, NE, SE, SW: [corner sign x, sign z, the two edge neighbours] */
const CORNERS=[[-1,-1],[1,-1],[1,1],[-1,1]];
/* build one surface: in(x,y) says which tiles belong (null = beyond the edge, counts as matching); y is the surface height; walls drop to y0 */
function gbShape(top,wall,cells,inSet,X0,Z0,y,y0){
  cells.forEach(c=>{
    const me=inSet(c.x,c.y);if(me===null)return;
    const X=c.x+X0,Z=c.y+Z0;
    const nb=(dx,dz)=>{const v=inSet(c.x+dx,c.y+dz);return v===null?me:v;};
    if(me){
      const pts=[],edges=[];
      CORNERS.forEach(([sx,sz])=>{
        const cut=!nb(sx,0)&&!nb(0,sz);
        const cx=X+sx*.5,cz=Z+sz*.5;
        if(cut){
          /* the two chamfer points, in walking order around the tile */
          const a=[cx-sx*CH,cz],b=[cx,cz-sz*CH],first=(sx===sz)?b:a,second=(sx===sz)?a:b;
          pts.push(first,second);if(wall)gbWall(wall,first,second,y0,y,sx,sz);
        }else pts.push([cx,cz]);
      });
      const C=[X,y,Z];
      for(let i=0;i<pts.length;i++){const P=pts[i],Q=pts[(i+1)%pts.length];triUp(top,C,[P[0],y,P[1]],[Q[0],y,Q[1]]);}
      if(wall){
        [[0,-1],[1,0],[0,1],[-1,0]].forEach(([dx,dz])=>{
          if(nb(dx,dz))return;
          /* straight edge between the corners on this side, shortened where a corner was cut */
          const e=[],k=dx===0?(dz<0?[0,1]:[2,3]):(dx>0?[1,2]:[3,0]);
          k.forEach(ci=>{const [sx,sz]=CORNERS[ci];const cut=!nb(sx,0)&&!nb(0,sz);const cx=X+sx*.5,cz=Z+sz*.5;
            if(!cut)e.push([cx,cz]);else e.push(dx===0?[cx-sx*CH,cz]:[cx,cz-sz*CH]);});
          gbWall(wall,e[0],e[1],y0,y,dx,dz);
        });
      }
    }else{
      /* fill inside corners of a neighbouring shape */
      CORNERS.forEach(([sx,sz])=>{
        if(inSet(c.x+sx,c.y)!==true||inSet(c.x,c.y+sz)!==true||inSet(c.x+sx,c.y+sz)!==true)return;
        const cx=X+sx*.5,cz=Z+sz*.5,a=[cx-sx*CH,cz],b=[cx,cz-sz*CH];
        triUp(top,[cx,y,cz],[a[0],y,a[1]],[b[0],y,b[1]]);
        if(wall)gbWall(wall,a,b,y0,y,-sx,-sz);
      });
    }
  });
}
function gbBox(g,x0,x1,y0,y1,z0,z1){
  const b=new THREE.BoxGeometry(x1-x0,y1-y0,z1-z0).toNonIndexed();b.translate((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);
  const pa=b.attributes.position.array,ua=b.attributes.uv.array;
  for(let i=0;i<pa.length;i++)g.p.push(pa[i]);
  /* world-sized uvs so planks and stone keep their scale */
  for(let i=0;i<pa.length/3;i++){const nx=Math.abs(b.attributes.normal.array[i*3]),ny=Math.abs(b.attributes.normal.array[i*3+1]);const X=pa[i*3],Y=pa[i*3+1],Z=pa[i*3+2];if(ny>.5)g.u.push(X,-Z);else if(nx>.5)g.u.push(Z,Y);else g.u.push(X,Y);}
}
function gbMesh(g,mat,cast){
  if(!g.p.length)return null;
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(g.p,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(g.u,2));geo.computeVertexNormals();
  const m=new THREE.Mesh(geo,mat);m.receiveShadow=true;m.castShadow=!!cast;add(m);return m;
}

/* ---- batched sprites: one draw call per texture instead of one per tree ---- */
function SpriteBatch(){
  const lists=new Map(),shadows=[];
  return {
    add(tex,x,y,z,sx,sy,cast,shadow){const k=tex.uuid+(cast?'c':'');if(!lists.has(k))lists.set(k,{tex,cast,items:[]});lists.get(k).items.push([x,y,z,sx,sy*BB_Y]);if(shadow)shadows.push([x,y,z,shadow]);},
    build(){
      const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),s=new THREE.Vector3(),p=new THREE.Vector3();
      lists.forEach(l=>{const im=new THREE.InstancedMesh(planeGeo,smat(l.tex),l.items.length);l.items.forEach((it,i)=>{p.set(it[0],it[1],it[2]);s.set(it[3],it[4],1);m4.compose(p,q,s);im.setMatrixAt(i,m4);});
        im.frustumCulled=false;if(l.cast){im.castShadow=true;im.customDepthMaterial=depthFor(l.tex);}add(im);});
      if(shadows.length){const im=new THREE.InstancedMesh(blobGeo,blobMat,shadows.length);const qq=new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI/2,0,0));
        shadows.forEach((b,i)=>{p.set(b[0],b[1]+.03,b[2]);s.set(b[3],b[3]*.8,1);m4.compose(p,qq,s);im.setMatrixAt(i,m4);});im.frustumCulled=false;add(im);}
    }
  };
}

/* ---- build a painted plan into a location ---- */
function buildMap(L,plan,o){
  o=o||{};PARENT=L.group;
  const W=plan.W,H=plan.H,ter=plan.ter,obj=plan.obj,H1=o.H1||1,MG=o.margin===undefined?14:o.margin;
  const g=L.grid=Grid(W,H,-Math.floor(W/2),-Math.floor(H/2));const ox=g.ox,oz=g.oz;
  const base=o.base||'grass';
  const TX=Object.assign({grass:T.grass,lush:T.lush,sand:T.sand,road:T.tarmac,plaza:T.pave,dirt:T.path,earth:T.redEarth,mud:T.mud,deck:T.boardwalk,cobble:T.cobble},o.tex||{});
  /* cell info, clamped beyond the edges so roads, coasts and rivers run on past the map */
  const EW=W+MG*2,EH=H+MG*2,cells=new Array(EW*EH);
  for(let ey=0;ey<EH;ey++)for(let ex=0;ex<EW;ex++){
    const x=ex-MG,y=ey-MG,inMap=x>=0&&y>=0&&x<W&&y<H;
    const cx=Math.max(0,Math.min(W-1,x)),cy=Math.max(0,Math.min(H-1,y));
    let t=TER[ter.get(cx,cy)]||TER['.'];
    if(!inMap){if(t.stairs)t={top:base};else if(t.deck)t=TER['~'];}
    cells[ey*EW+ex]={x,y,inMap,water:!!t.water,deck:!!t.deck,stairs:!!t.stairs,lvl:t.stairs?.5:(t.lvl||0),top:t.top||base};
  }
  const cell=(x,y)=>{const ex=x+MG,ey=y+MG;if(ex<0||ey<0||ex>=EW||ey>=EH)return null;return cells[ey*EW+ex];};
  const anyWater=cells.some(c=>c.water);
  /* ground: land (with banks where it meets water), terraces with cliffs, then surface decals */
  const land=GB(),bank=GB(),terr=GB(),cliff=GB(),decals={};
  const wy=(o.water&&o.water.y!==undefined)?o.water.y:-.15,bedY=(o.water&&o.water.bed!==undefined)?o.water.bed:-.62;
  const X0=ox+.5,Z0=oz+.5;
  gbShape(land,anyWater?bank:null,cells,(x,y)=>{const c=cell(x,y);return c?!c.water:null;},X0,Z0,0,bedY);
  gbShape(terr,cliff,cells,(x,y)=>{const c=cell(x,y);return c?c.lvl===1:null;},X0,Z0,H1,0);
  const keys=new Set();cells.forEach(c=>{if(!c.water&&!c.stairs&&c.top!==base)keys.add(c.top+'|'+c.lvl);});
  keys.forEach(key=>{const [k,lv]=key.split('|'),lvl=+lv;if(!decals[k])decals[k]=GB();
    gbShape(decals[k],null,cells,(x,y)=>{const c=cell(x,y);return c?(!c.water&&!c.stairs&&c.top===k&&c.lvl===lvl):null;},X0,Z0,(lvl===1?H1:0)+(TOPH[k]||.002),0);});
  gbMesh(land,M({map:TX[base]}));
  gbMesh(bank,M({map:o.bank||T.cliff}));
  gbMesh(terr,M({map:TX[base]}),true);
  gbMesh(cliff,M({map:o.cliff||T.cliff}),true);
  Object.keys(decals).forEach(k=>gbMesh(decals[k],M({map:TX[k]})));
  /* water and the bed beneath it */
  let waterTex=null;
  if(anyWater){
    const ww=o.water||{},x0=ox-MG,x1=ox+W+MG,z0=oz-MG,z1=oz+H+MG;
    const bed=add(new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,z1-z0),M({map:rep(ww.bedTex||T.sand,x1-x0,z1-z0)})));bed.rotation.x=-Math.PI/2;bed.position.set((x0+x1)/2,bedY,(z0+z1)/2);bed.receiveShadow=true;
    waterTex=rep(ww.tex||T.water,x1-x0,z1-z0);
    const wm=add(new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,z1-z0),M({map:waterTex,roughness:.25,transparent:true,opacity:ww.opacity||.86,color:ww.color||'#ffffff',depthWrite:false})));
    wm.rotation.x=-Math.PI/2;wm.position.set((x0+x1)/2,wy,(z0+z1)/2);wm.receiveShadow=true;wm.renderOrder=1;
  }
  /* a bridge or jetty sits at clifftop height when any part of it lands on a terrace */
  const deckHi=new Set(),seenD=new Set();
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const c=cell(x,y);if(!c.deck||seenD.has(x+','+y))continue;
    const comp=[],q=[[x,y]];seenD.add(x+','+y);let hi=false;
    while(q.length){const [a,b]=q.pop();comp.push(a+','+b);[[0,-1],[0,1],[-1,0],[1,0]].forEach(dd=>{const n=cell(a+dd[0],b+dd[1]);if(!n)return;const k=(a+dd[0])+','+(b+dd[1]);
      if(n.deck&&n.inMap){if(!seenD.has(k)){seenD.add(k);q.push([a+dd[0],b+dd[1]]);}}else if(!n.water&&n.lvl===1)hi=true;});}
    if(hi)comp.forEach(k=>deckHi.add(k));
  }
  /* stairs: three steps rising toward the terrace */
  const steps=GB();
  /* decks: planks, posts and rails over water */
  const deck=GB(),posts=GB(),rails=GB();
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const c=cell(x,y),X=x+ox+.5,Z=y+oz+.5;
    if(c.stairs){
      let d=[0,-1];[[0,-1],[0,1],[-1,0],[1,0]].forEach(dd=>{const n=cell(x+dd[0],y+dd[1]);if(n&&n.lvl===1&&!n.stairs)d=dd;});
      for(let k=0;k<3;k++){const a0=-.5+k/3,a1=a0+1/3,h=H1*(k*2+1)/6+(k===2?H1/6:0);
        if(d[0]===0){const z0=d[1]>0?Z+a0:Z-a1,z1=d[1]>0?Z+a1:Z-a0;gbBox(steps,X-.46,X+.46,0,h,z0,z1);}
        else{const x0=d[0]>0?X+a0:X-a1,x1=d[0]>0?X+a1:X-a0;gbBox(steps,x0,x1,0,h,Z-.46,Z+.46);}}
      g.setH(x,y,H1/2);
    }
    if(c.deck){
      const hi=deckHi.has(x+','+y);
      const top=(hi?H1:0)+(o.deckH||.14);
      gbBox(deck,X-.5,X+.5,top-.1,top,Z-.5,Z+.5);
      if((x+y)%2===0)gbBox(posts,X-.07,X+.07,bedY,top-.1,Z-.07,Z+.07);
      [[0,-1],[0,1],[-1,0],[1,0]].forEach(dd=>{const n=cell(x+dd[0],y+dd[1]);if(!n||!n.water||n.deck)return;
        const ex=X+dd[0]*.46,ez=Z+dd[1]*.46;
        if(dd[0]===0)gbBox(rails,X-.5,X+.5,top+.4,top+.46,ez-.03,ez+.03);else gbBox(rails,ex-.03,ex+.03,top+.4,top+.46,Z-.5,Z+.5);
        gbBox(rails,ex-.04,ex+.04,top,top+.44,ez-.04,ez+.04);});
      g.setH(x,y,top);
    }
  }
  gbMesh(steps,M({map:o.stairTex||T.stone}),true);
  gbMesh(deck,M({map:o.deckTex||T.boardwalk}),true);
  gbMesh(posts,mc('#5a3a20'));
  gbMesh(rails,M({map:T.wood}),true);
  /* grid: heights and blocked water */
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=cell(x,y);
    if(c.water&&!c.deck)g.block(x,y);
    if(c.lvl===1)g.setH(x,y,H1);
  }
  /* objects */
  const SB=SpriteBatch();
  const tall=o.tall||T.tall,FL=FLOWERS;
  const solidAt=(x,y,lvl)=>{const ob=obj.get(x,y);if(ob==='#'||ob==='X')return true;const c=cell(x,y);return !!c&&c.lvl>lvl+.1;};
  const treeAt=(tex,x,y,s,yy)=>{
    const c=cell(x,y),X0=x+ox+.5,Z=y+oz+.5,Y=yy===undefined?g.h(x,y):yy;
    let sx=2*s,sy=2.5*s,X=X0+(rnd()-.5)*.3;
    const lb=solidAt(x-1,y,c.lvl),rb=solidAt(x+1,y,c.lvl);
    if(lb&&rb){X=X0;sx=Math.min(sx,1.05);sy=Math.min(sy,1.5);}else if(lb){X=X0+.2;sx=Math.min(sx,1.5);}else if(rb){X=X0-.2;sx=Math.min(sx,1.5);}
    SB.add(tex,X,Y,Z+(rnd()-.5)*.25,sx,sy,true,.55*Math.min(s,1.2));
  };
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const ch=obj.get(x,y);if(!ch||ch===' ')continue;
    const X=x+ox+.5,Z=y+oz+.5,Y=g.h(x,y),k=x+','+y;
    if(TREES[ch]){treeAt(TREE[TREES[ch]],x,y,.92+rnd()*.28);g.block(x,y);}
    else if(ch==='P'){SB.add(T.palmSpr,X+(rnd()-.5)*.2,Y,Z,2.1,2.7*(.9+rnd()*.25),true,.45);g.block(x,y);}
    else if(ch==='Y'){SB.add(TREE.fig,X,Y,Z,5.2,6,true,1.6);g.block(x,y);}
    else if(ch==='m'){SB.add(MANGROVE,X+(rnd()-.5)*.3,cell(x,y).water?-.25:Y,Z,2*(.9+rnd()*.3),2.3*(.9+rnd()*.3),true,0);g.block(x,y);}
    else if(ch==='g'||ch==='y'||ch==='n'){const tx=ch==='g'?tall:ch==='y'?T.dune:T.fern;[[-.22,-.34],[.24,-.3],[-.26,-.04],[.2,0],[-.2,.28],[.26,.32]].forEach(d=>SB.add(tx,X+d[0],Y,Z+d[1],.66,.56));L.grass.add(k);}
    else if(ch==='f'){for(let i=0;i<3;i++)SB.add(FL[Math.floor(rnd()*FL.length)],X+(rnd()-.5)*.8,Y,Z+(rnd()-.5)*.8,.42,.42);}
    else if(ch==='R'){const r=mesh(new THREE.DodecahedronGeometry(.42+rnd()*.12,0),rockMat,X,Y+.22,Z);r.rotation.set(rnd()*3,rnd()*3,0);r.scale.y=.8;g.block(x,y);L.talk.set(k,o.rockTalk||['A big, sun-warmed boulder.']);}
    else if(ch==='L'){streetLamp(X,Y,Z,o.lampCol);g.block(x,y);L.talk.set(k,['A street lamp. Moths love it at night.']);}
    else if(ch==='B'){const bm=mc('#b07040');mesh(new THREE.BoxGeometry(1,.08,.36),bm,X,Y+.34,Z);mesh(new THREE.BoxGeometry(1,.3,.06),bm,X,Y+.55,Z-.18);[-.42,.42].forEach(d=>mesh(new THREE.BoxGeometry(.08,.32,.3),railMat,X+d,Y+.16,Z));g.block(x,y);L.talk.set(k,o.benchTalk||['A bench. You sit for a moment and watch the world go by.']);}
    else if(ch==='X'||ch==='#'){g.block(x,y);}
  }
  /* water talk */
  if(o.waterTalk)for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=cell(x,y);if(c.water&&!c.deck)L.talk.set(x+','+y,o.waterTalk);}
  /* grass tufts on open ground */
  const tuftTex=o.tuft||T.tuft;
  for(let n=0,i=0;n<(o.tufts===undefined?140:o.tufts)&&i<6000;i++){
    const x=Math.floor(rnd()*W),y=Math.floor(rnd()*H),c=cell(x,y);
    if(c.water||c.stairs||c.top!==base||obj.get(x,y)!==' ')continue;n++;
    const X=x+ox+.5+(rnd()-.5)*.8,Z=y+oz+.5+(rnd()-.5)*.8;
    if(rnd()<(o.flowerChance||.15))SB.add(FL[Math.floor(rnd()*FL.length)],X,g.h(x,y),Z,.42,.42);else SB.add(tuftTex,X,g.h(x,y),Z,.5,.38);
  }
  /* forest beyond the edges */
  const skirt=o.skirt||[TREE.gum,TREE.gum,TREE.olive];
  cells.forEach(c=>{
    if(c.inMap||c.water||rnd()>(o.skirtDensity||.5))return;
    if(c.top!==base)return;
    for(const d of DIR8){const n=cell(c.x+d[0],c.y+d[1]);if(n&&(n.top!==base||n.water)&&!(o.skirtNearWater&&n.water))return;}
    const tex=skirt[Math.floor(rnd()*skirt.length)];
    const X=c.x+ox+.5+(rnd()-.5)*.6,Z=c.y+oz+.5+(rnd()-.5)*.6,Y=c.lvl===1?H1:0;
    if(tex===T.palmSpr)SB.add(tex,X,Y,Z,2.1,2.8,true,.45);else SB.add(tex,X,Y,Z,2*(.95+rnd()*.3),2.5*(.95+rnd()*.3),true,.6);
  });
  SB.build();
  /* buildings last, on top of the finished ground */
  plan.blds.forEach(b=>{const r=rectOf(L,b.x0,b.y0,b.x1,b.y1);r.tx0=b.x0;r.ty0=b.y0;r.tx1=b.x1;r.ty1=b.y1;r.doorX=Math.floor((b.x0+b.x1+1)/2);b.fn(r,g.h(b.x0,b.y0));});
  return {water:waterTex,cell,SB};
}

/* walkable world position of a tile, for props placed after the map */
function tileXZ(L,tx,ty){return L.grid.w(tx,ty);}
