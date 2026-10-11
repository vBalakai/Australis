/* Australis: the starter Pokémon. Three lines, nine low-poly models, the partner who follows you, and evolution */

/* the designs live in mon-designs.js; the overworld kit builds the simple model that follows you */
const OW_SCALE=[1,.92,.82];
function owModel(form){const R=MD.build(form,'world');const st=MD.LINES.find(l=>l.forms.indexOf(form)>=0).forms.indexOf(form);R.group.scale.setScalar(OW_SCALE[st]);R.ph=rnd()*6;return R;}
/* ---- names, types and lines ---- */
const FORMS={
  gumjo:{name:'Gumjo',dex:'001',type:'Grass',build:()=>owModel('gumjo'),cry:'Gum-gum!',next:'bellowala',blurb:'A koala joey that hides behind a gum leaf like a shield. The gumnut cap on its head is the toughest thing in the bush.'},
  bellowala:{name:'Bellowala',dex:'002',type:'Grass',build:()=>owModel('bellowala'),cry:'BELLOOOW!',next:'koalossus',blurb:'Wears ironbark bracers and carries a broad leaf shield. It plants its feet and lets attacks bounce off, then bellows back.'},
  koalossus:{name:'Koalossus',dex:'003',type:'Grass/Ground',build:()=>owModel('koalossus'),cry:'KO-LOSSS!',next:null,blurb:'A walking fortress of shingled ironbark with a eucalyptus grove on its back and boulder fists. The tank of the starters.'},
  kindrill:{name:'Kindrill',dex:'004',type:'Fire',build:()=>owModel('kindrill'),cry:'Krrik!',next:'frillblaze',blurb:'A frilled-dinosaur hatchling with a scrap of eggshell still on its head. Its frill is folded until it gets cross.'},
  frillblaze:{name:'Frillblaze',dex:'005',type:'Fire',build:()=>owModel('frillblaze'),cry:'Frrrah!',next:'pyragon',blurb:'Sprints like a raptor with its blazing frill half open. Good at everything, so it adapts to any fight.'},
  pyragon:{name:'Pyragon',dex:'006',type:'Fire/Electric',build:()=>owModel('pyragon'),cry:'GRRRAKK!',next:null,blurb:'A great frilled dinosaur with a bony frill that crackles with dry lightning and a tail tipped with a bolt.'},
  puggly:{name:'Puggly',dex:'007',type:'Water',build:()=>owModel('puggly'),cry:'Pug-pug!',next:'spurbill',blurb:'A slim baby platypus. Its bill works like a little water pistol, and three venom nubs are growing on its back.'},
  spurbill:{name:'Spurbill',dex:'008',type:'Water',build:()=>owModel('spurbill'),cry:'Spurr!',next:'platyrant',blurb:'Lies low like a sniper, aiming through the electrosense sight on its bill. It fires water at high pressure and venom quills from its back.'},
  platyrant:{name:'Platyrant',dex:'009',type:'Water/Poison',build:()=>owModel('platyrant'),cry:'PLAA-TYRR!',next:null,blurb:'Its bill compresses water into piercing shots, and the fan of venom quills on its back fires off like homing missiles.'},
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
/* idle animation for the partner and the lab capsules */
function animMon(m,t,moving){if(m.blink)MD.animate(m,t,moving);}
