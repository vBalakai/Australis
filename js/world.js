/* Australis: walkable grids, NPCs, talk spots and locations */
/* grid helpers */
function Grid(W,H,ox,oz){
  const b=new Uint8Array(W*H),edges=new Set(),hgt=new Float32Array(W*H);
  const g={W,H,ox,oz,
    block(x0,y0,x1,y1){for(let y=y0;y<=(y1===undefined?y0:y1);y++)for(let x=x0;x<=(x1===undefined?x0:x1);x++)if(x>=0&&y>=0&&x<W&&y<H)b[y*W+x]=1;},
    open(x0,y0,x1,y1){for(let y=y0;y<=(y1===undefined?y0:y1);y++)for(let x=x0;x<=(x1===undefined?x0:x1);x++)if(x>=0&&y>=0&&x<W&&y<H)b[y*W+x]=0;},
    blocked(x,y){return x<0||y<0||x>=W||y>=H||b[y*W+x]===1;},
    edge(ax,ay,bx,by){edges.add(ax+','+ay+'>'+bx+','+by);edges.add(bx+','+by+'>'+ax+','+ay);},
    edgeBlocked(ax,ay,bx,by){return edges.has(ax+','+ay+'>'+bx+','+by);},
    setH(x,y,h){if(x>=0&&y>=0&&x<W&&y<H)hgt[y*W+x]=h;},
    h(x,y){return (x<0||y<0||x>=W||y>=H)?0:hgt[y*W+x];},
    w(x,y){return [x+ox+.5,y+oz+.5];}
  };
  return g;
}
function scatterTufts(L,count,tex,flowerChance,yOf){
  const g=L.grid;
  for(let n=0,i=0;n<count&&i<4000;i++){
    const tx=Math.floor(rnd()*g.W),ty=Math.floor(rnd()*g.H);
    if(g.blocked(tx,ty)||L.paved.has(tx+','+ty)||L.grass.has(tx+','+ty))continue;
    const [x,z]=g.w(tx,ty);const X=x+(rnd()-.5)*.8,Z=z+(rnd()-.5)*.8;n++;
    const y=yOf?yOf(tx,ty):g.h(tx,ty);
    if(rnd()<flowerChance)spr(FLOWERS[Math.floor(rnd()*FLOWERS.length)],X,y,Z,.42,.42);else spr(tex,X,y,Z,.5,.38);
  }
}
const C=1/13;
function npc(L,build,tx,ty,lines,opt){
  const [x,z]=L.grid.w(tx,ty);const y=L.grid.h(tx,ty);
  const m=build();m.group.position.set(x,y,z);m.group.rotation.y=(opt&&opt.rot)||0;add(m.group);
  m.blob=blob(x,y,z,.32);m.base=y;m.hop=!!(opt&&opt.hop);m.ph=rnd()*6;m.targetRot=m.group.rotation.y;
  L.actors.push(m);L.grid.block(tx,ty);
  const n={tx,ty,model:m,sprite:m.group,lines,onEnd:opt&&opt.onEnd};L.talk.set(tx+','+ty,()=>n);
  return n;
}
function talkRect(L,x0,y0,x1,y1,lines){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)L.talk.set(x+','+y,lines);}
function newLoc(id,o){const L=Object.assign({id,actors:[],talk:new Map(),grass:new Set(),paved:new Set(),group:new THREE.Group(),update:null},o);L.group.visible=false;scene.add(L.group);return L;}
function markRect(set,x0,y0,x1,y1){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)set.add(x+','+y);}
