/* Australis: pixel-art textures and sprites, drawn in code */
/* ================= textures ================= */
function canvasTex(w,h,fn){
  const c=document.createElement('canvas');c.width=w;c.height=h;
  const g=c.getContext('2d');
  const f=(col,x,y,ww,hh)=>{g.fillStyle=col;g.fillRect(x,y,ww||1,hh||1);};
  fn(f,w,h);
  const t=new THREE.CanvasTexture(c);
  t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;
  t.encoding=THREE.sRGBEncoding;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;
}
function rep(t,x,y){const n=t.clone();n.needsUpdate=true;n.repeat.set(x,y);return n;}
function fromRows(rows,pal){const h=rows.length,w=Math.max.apply(null,rows.map(r=>r.length));return canvasTex(w,h,f=>{rows.forEach((r,y)=>{for(let x=0;x<r.length;x++){const c=pal[r[x]];if(c)f(c,x,y);}});});}
function grassTex(base,a,b,hi){return canvasTex(16,16,f=>{f(base,0,0,16,16);[[3,4,a],[11,11,b],[7,1,a],[13,5,b],[1,10,a]].forEach(([x,y,c])=>{f(c,x,y,1,2);f(c,x+2,y,1,2);f(c,x+1,y-1,1,2);});f(hi,9,3);f(hi,2,13);f(hi,14,9);});}
const T={};
T.grass=grassTex('#86c867','#6fb455','#5fa548','#b2e08c');
T.lush=grassTex('#6cc060','#52a64a','#45963e','#98dc84');
T.dry=grassTex('#cdbd78','#b49a54','#a88c4a','#e6d8a4');
T.path=canvasTex(16,16,f=>{f('#e6d0a0',0,0,16,16);f('#d0b882',3,5,2,1);f('#d0b882',11,10);f('#d0b882',7,13,2,1);f('#d0b882',13,2);f('#f4e6c6',12,3);f('#f4e6c6',5,10);f('#f4e6c6',9,7);});
T.road=canvasTex(16,16,f=>{f('#c8743f',0,0,16,16);f('#a85c30',2,4,2,1);f('#a85c30',9,9);f('#a85c30',13,13,2,1);f('#dc9460',6,2);f('#dc9460',12,6);f('#dc9460',4,12);});
T.pave=canvasTex(16,16,f=>{f('#d8d4cc',0,0,16,16);f('#bdb7ad',0,7,16,1);f('#bdb7ad',0,15,16,1);f('#bdb7ad',7,0,1,7);f('#bdb7ad',15,8,1,7);f('#eae6de',1,1,2,1);f('#eae6de',9,9,2,1);});
T.stone=canvasTex(16,16,f=>{f('#c4bcaa',0,0,16,16);f('#a49c8a',0,0,16,1);f('#e0d8c6',0,1,16,1);f('#a49c8a',5,6,1,1);f('#a49c8a',11,11,2,1);});
T.cliff=canvasTex(16,16,f=>{f('#a8794c',0,0,16,16);f('#c79b6a',0,5,16,1);f('#8a6038',0,9,16,1);f('#c79b6a',0,12,16,1);f('#8a6038',0,14,16,1);f('#6a4828',5,6,1,2);f('#6a4828',12,10,1,2);f('#5fa548',0,0,16,3);f('#4c8a3a',0,3,16,1);f('#5fa548',3,3,2,1);f('#5fa548',10,3,1,2);f('#86c867',6,0,3,1);});
T.rock=canvasTex(16,16,f=>{f('#9a7a58',0,0,16,16);f('#b8946c',0,2,16,1);f('#7a5a3c',0,5,16,1);f('#b8946c',0,9,16,1);f('#7a5a3c',0,12,16,2);f('#5a3e28',4,6,1,3);f('#5a3e28',11,1,1,3);f('#5a3e28',8,13,1,2);f('#c8a47a',2,10,3,1);});
T.dirt=canvasTex(16,16,f=>{f('#8a5a38',0,0,16,16);f('#764a2c',0,7,16,1);f('#764a2c',0,15,16,1);f('#a06a44',3,3);f('#a06a44',11,10);f('#a06a44',6,12);});
T.bed=canvasTex(16,16,f=>{f('#6e6248',0,0,16,16);f('#857a5c',4,4,2,2);f('#5a5038',10,10,2,1);});
T.wood=canvasTex(16,16,f=>{f('#b07c48',0,0,16,16);[3,7,11,15].forEach(x=>f('#86582e',x,0,1,16));f('#c8925a',1,0,1,16);f('#5a3a1a',1,4);f('#5a3a1a',9,12);});
T.wall=canvasTex(16,16,f=>{f('#e6d6b2',0,0,16,16);[3,7,11,15].forEach(y=>f('#dccaa2',0,y,16,1));});
T.labwall=canvasTex(16,16,f=>{f('#dcd8cc',0,0,16,16);f('#c4bfb0',0,7,16,1);f('#c4bfb0',0,15,16,1);f('#c4bfb0',7,0,1,7);f('#c4bfb0',15,8,1,7);});
T.concrete=canvasTex(16,16,f=>{f('#a9aeb4',0,0,16,16);f('#959aa1',3,4);f('#959aa1',11,9);f('#bcc0c5',7,13);f('#bcc0c5',13,2);});
function corrugated(a,b,c){return canvasTex(16,16,f=>{f(a,0,0,16,16);for(let x=0;x<16;x+=4){f(b,x,0,1,16);f(c,x+1,0,1,16);}});}
T.roofRed=corrugated('#d0503a','#a83c2a','#ec7a5a');
T.roofBlue=corrugated('#4878c8','#3060a8','#78a8e8');
T.roofTeal=corrugated('#2ea89a','#1e8074','#6ad0c4');
T.roofGreen=corrugated('#4a9a48','#357a36','#7ac070');
T.roofOrange=corrugated('#e09038','#b87028','#f8b868');
T.roofPurple=corrugated('#8a5ab8','#6a4098','#b088e0');
T.solar=canvasTex(16,16,f=>{f('#283c78',0,0,16,16);f('#5878b8',0,0,16,1);f('#5878b8',0,8,16,1);f('#5878b8',0,0,1,16);f('#5878b8',8,0,1,16);f('#3c5296',2,2,3,1);});
T.tank=canvasTex(16,16,f=>{f('#b8c0c8',0,0,16,16);for(let x=0;x<16;x+=3){f('#98a0a8',x,0,1,16);f('#d8dee4',x+1,0,1,16);}});
T.water=canvasTex(16,16,f=>{f('#4890e0',0,0,16,16);f('#90c8f8',2,5,4,1);f('#90c8f8',3,4,2,1);f('#90c8f8',10,12,4,1);f('#90c8f8',11,11,2,1);f('#3878c8',9,2,3,1);f('#3878c8',4,13,2,1);});
T.fall=canvasTex(16,16,f=>{f('#6aa8ec',0,0,16,16);[[1,0,6],[5,4,9],[9,1,7],[12,6,8],[14,0,4]].forEach(([x,y,l])=>f('#d4ecff',x,y,1,l));f('#4a88d8',3,8,1,6);f('#4a88d8',11,0,1,5);});
T.sign=canvasTex(16,10,f=>{f('#5a3a1a',0,0,16,10);f('#c88c50',1,1,14,8);f('#8a5a30',3,3,10,1);f('#8a5a30',3,5,8,1);f('#8a5a30',3,7,6,1);});
T.cabbage=canvasTex(16,16,f=>{f('#8a5a38',0,0,16,16);f('#764a2c',0,7,16,1);f('#764a2c',0,15,16,1);f('#58a840',1,1,6,5);f('#58a840',9,9,6,5);f('#90d070',2,2,2,2);f('#90d070',10,10,2,2);f('#3a7a2a',1,5,6,1);f('#3a7a2a',9,13,6,1);});
function bloomTex(a,b,c){return canvasTex(16,16,f=>{f('#4c9a40',0,0,16,16);f(a,1,1,3,3);f(a,9,9,3,3);f(b,9,1,3,3);f(b,1,9,3,3);f(c,5,5,3,3);f(c,13,13,3,3);[[2,2],[10,10],[10,2],[2,10]].forEach(p=>f('#ffffff',p[0],p[1]));});}
T.bloomA=bloomTex('#f080b0','#8a5ad0','#f8b0d0');
T.bloomB=bloomTex('#f8d020','#f08030','#fff080');
T.awning=canvasTex(16,8,f=>{f('#ffffff',0,0,16,8);f('#e05040',0,0,4,8);f('#e05040',8,0,4,8);f('#a83028',0,7,16,1);});

function houseFront(wall,line,door,doorHi){
  return canvasTex(80,24,f=>{
    f(wall,0,0,80,24);for(let y=3;y<24;y+=4)f(line,0,y,80,1);
    [8,56].forEach(x=>{f('#3a2a2a',x,5,16,11);f('#a8d8f8',x+2,7,12,7);f('#ffffff',x+3,8,3,2);f('#c8b890',x-1,16,18,1);});
    f('#3a2a2a',32,6,16,18);f(door,34,8,12,16);f(doorHi,34,8,12,2);f('#f0c040',42,16,2,2);f('rgba(0,0,0,.12)',0,22,80,2);
  });
}
T.frontRed=houseFront('#f2e6c8','#dccaa2','#9a5a30','#b87040');
T.frontBlue=houseFront('#efe9da','#d6ccb4','#5e3a22','#7a4e30');
T.frontOrange=houseFront('#f6ecd8','#e2d2b0','#3f6fb5','#6a94d4');
T.frontPurple=houseFront('#f2eadc','#ddd0bc','#4a8a3c','#6aa858');
T.labFront=canvasTex(144,32,f=>{
  f('#dcd8cc',0,0,144,32);for(let x=0;x<144;x+=16){f('#c4bfb0',x,3,1,25);}f('#c4bfb0',0,15,144,1);f('#7a7f88',0,28,144,4);f('#58a048',0,0,144,3);f('#3e7a34',0,3,144,1);
  [8,96].forEach(x=>{f('#384048',x,7,40,16);f('#6aa6d8',x+2,9,36,12);f('#9ccaf0',x+2,9,36,5);f('#ffffff',x+4,10,6,2);f('#ffffff',x+12,10,2,2);f('#384048',x+19,9,2,12);});
  f('#2e4a7a',56,2,32,4);f('#f0d048',60,3,4,2);f('#f0d048',66,3,18,2);
  f('#384048',60,7,24,25);f('#5a96c8',62,9,20,23);f('#8cbce4',62,9,20,8);f('#384048',71,9,2,23);f('#ffffff',64,11,3,5);
});
T.centreFront=canvasTex(80,35,f=>{
  f('#e8e0d0',0,0,80,35);f('#2ea89a',0,0,80,3);f('#8a8478',0,32,80,3);
  f('#2a3038',28,4,24,13);f('#ffffff',30,5,20,11);
  f('#f06890',33,7,5,3);f('#f06890',42,7,5,3);f('#f06890',33,9,14,3);f('#f06890',35,12,10,1);f('#f06890',37,13,6,1);f('#f06890',39,14,2,1);f('#ffc0d4',34,8,2,1);
  [4,56].forEach(x=>{f('#2a3038',x,17,20,12);f('#a8d8f8',x+2,19,16,8);f('#ffffff',x+3,20,4,2);});
  f('#2a3038',28,18,24,17);f('#88c8e8',30,20,20,15);f('#2a3038',39,20,2,15);f('#ffffff',32,22,3,6);
});
T.storeFront=canvasTex(80,27,f=>{
  f('#f4ead2',0,0,80,27);f('#2a3038',18,1,44,7);f('#4a9a48',19,2,42,5);
  [[22,3],[27,3],[32,3],[37,3],[42,3],[47,3],[52,3],[57,3]].forEach(p=>f('#ffffff',p[0],p[1],3,3));
  [5,55].forEach(x=>{f('#2a3038',x,11,20,12);f('#a8d8f8',x+2,13,16,8);f('#e09038',x+2,18,5,3);f('#58a840',x+8,18,5,3);f('#e05040',x+13,18,4,3);});
  f('#2a3038',32,10,16,17);f('#a8d8f8',34,12,12,15);f('#ffffff',35,13,2,5);
});

function treeTex(p,bloom){
  return canvasTex(32,40,f=>{
    f(p.t1,13,24,6,15);f(p.t2,13,24,2,15);f(p.t2,10,38,12,2);
    const blobs=[[16,12,11],[8,16,7],[24,16,7],[16,19,8],[11,8,6],[21,8,6]];
    const inside=(x,y)=>blobs.some(b=>(x+.5-b[0])*(x+.5-b[0])+(y+.5-b[1])*(y+.5-b[1])<b[2]*b[2]);
    for(let y=0;y<30;y++)for(let x=0;x<32;x++){
      if(!inside(x,y))continue;
      const edge=!inside(x-1,y)||!inside(x+1,y)||!inside(x,y-1)||!inside(x,y+1);
      if(edge){f(p.o,x,y);continue;}
      const dl=Math.hypot(x-11,y-7)+((x*7+y*13)%5)*.7;
      f(dl<5?p.c4:dl<9.5?p.c3:dl<15?p.c2:p.c1,x,y);
    }
    if(bloom){[[9,6],[15,3],[21,6],[25,11],[19,15],[11,14],[6,11],[14,9],[23,18],[9,20],[16,21],[18,4],[12,17],[27,15]].forEach((q,i)=>{f('#f8d020',q[0],q[1],2,2);if(i%2===0)f('#fff088',q[0],q[1]);});}
  });
}
const TREE={
  gum:treeTex({o:'#24482a',c1:'#3a7a3a',c2:'#58a048',c3:'#80c060',c4:'#a8e080',t1:'#8a5a34',t2:'#5a3418'}),
  olive:treeTex({o:'#3e4a2c',c1:'#5e6e44',c2:'#7e9058',c3:'#a0b07a',c4:'#c4d0a0',t1:'#e8e0d0',t2:'#b8ac98'}),
  wattle:treeTex({o:'#2e5a28',c1:'#4a8a3c',c2:'#64a84e',c3:'#88c868',c4:'#b0e090',t1:'#8a5a34',t2:'#5a3418'},true),
  jac:treeTex({o:'#3a2466',c1:'#5a3a90',c2:'#7a5ab8',c3:'#9a80d8',c4:'#c8b0f0',t1:'#6a4a30',t2:'#4a3220'})
};
T.wheat=canvasTex(12,16,f=>{[1,4,7,10].forEach((x,i)=>{const o=i%2;f('#8a6a18',x+1,3+o,1,13-o);f('#c99a30',x,5+o,1,11-o);f('#f4d468',x,1+o,2,5);f('#fff4b0',x,o,1,1);});});
T.corn=canvasTex(12,20,f=>{[1,6,10].forEach((x,i)=>{const o=i%2*2;f('#3e8a32',x+1,o+2,1,18-o);f('#5ca040',x,o+2,1,18-o);f('#7cc858',x+2,o+6,2,1);f('#7cc858',x-1,o+11,1,1);f('#f0d048',x,o+8,2,4);f('#fff4a0',x,o+8,1,1);f('#e8d890',x,o,1,2);});});
T.tuft=canvasTex(8,6,f=>{f('#5fa548',1,2,1,4);f('#4c8a3a',3,0,1,6);f('#5fa548',5,1,1,5);f('#4c8a3a',6,3,1,3);f('#9ad070',3,0,1,2);f('#9ad070',5,1,1,1);});
T.dtuft=canvasTex(8,6,f=>{f('#b49a54',1,2,1,4);f('#9a804a',3,0,1,6);f('#b49a54',5,1,1,5);f('#e6d8a4',3,0,1,2);});
function flowerTex(c){return canvasTex(8,8,f=>{f('#4c8a3a',3,4,1,4);f('#4c8a3a',4,6,2,1);f(c,3,1,1,3);f(c,2,2,3,1);f('#f8f080',3,2);});}
const FLOWERS=['#e84848','#ffffff','#f8d020','#f080b0','#9a6ad8'].map(flowerTex);
T.foam=canvasTex(8,6,f=>{f('#ffffff',1,2,3,3);f('#ffffff',4,1,3,4);f('#d4ecff',2,4,4,2);});
T.drop=canvasTex(4,4,f=>{f('#d4ecff',1,0,2,4);f('#ffffff',1,1,1,1);});
T.scare=canvasTex(16,24,f=>{f('#6a4020',7,8,2,16);f('#6a4020',0,10,16,2);f('#4878c8',4,9,8,8);f('#2a2030',4,9,8,1);f('#e8d090',5,3,6,6);f('#2a2030',6,5);f('#2a2030',9,5);f('#b07040',3,2,10,2);f('#b07040',5,0,6,2);f('#e0b440',4,16,2,3);f('#e0b440',10,16,2,3);});
