/* Australis: engine setup (renderer, scene, camera, random numbers) */
const stage=document.getElementById('stage');
const canvas=document.getElementById('c');
const err=document.getElementById('err');
function fail(msg){err.hidden=false;err.querySelector('p').textContent=msg;}
if(!window.THREE){fail('The 3D library could not load. Check your connection, then reload the page.');throw new Error('three.js did not load');}
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true});}catch(e){fail('This device could not start WebGL, which the diorama needs to draw the towns.');throw e;}
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.05;renderer.setClearColor(0x000000,0);

const still=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scene=new THREE.Scene();
scene.fog=new THREE.Fog(0xd6ecf7,34,90);
const camera=new THREE.PerspectiveCamera(28,1,1.5,240);
let seed=11;const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
let PARENT=scene;const add=o=>{PARENT.add(o);return o;};
