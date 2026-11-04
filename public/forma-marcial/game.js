'use strict';
const $=id=>document.getElementById(id),cv=$('game'),ctx=cv.getContext('2d');
ctx.imageSmoothingEnabled=false;
const C={dark:'#191524',ink:'#fff1cf',muted:'#b5a9cc',gold:'#f0cb69',purple:'#c5a0ed',left:'#ca7dea',down:'#41bee3',up:'#60d37d',right:'#ee7f9f'};
const KEY={ArrowLeft:'left',ArrowDown:'down',ArrowUp:'up',ArrowRight:'right',KeyA:'left',KeyS:'down',KeyW:'up',KeyD:'right'};
const glyph={left:'←',down:'↓',up:'↑',right:'→'};
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let game=null,scene='title',paused=false,bpm=80,last=0,fx=true,music=true,ac=null,flash=null,particles=[],studentPose='neutral',masterPose='neutral',studentSide='Ambos lados',masterSide='Ambos lados',poseAge=0,judge=null,scheduledBeat=-1;
const fmt=n=>Math.round(n).toLocaleString('es-AR');
function audio(){try{ac??=new(window.AudioContext||window.webkitAudioContext)();ac.resume();}catch{}}
function note(freq,when,duration=.12,type='sine',vol=.035){if(!ac)return;try{const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.001,when);g.gain.exponentialRampToValueAtTime(vol,when+.012);g.gain.exponentialRampToValueAtTime(.001,when+duration);o.connect(g);g.connect(ac.destination);o.start(when);o.stop(when+duration+.02);}catch{}}
function sfx(ok){if(fx&&ac)note(ok?660:145,ac.currentTime,.12,ok?'sine':'triangle',.035);}
function beatMusic(){if(!music||!ac||!game)return;const b=Math.floor(game.time/game.beat);if(b===scheduledBeat)return;scheduledBeat=b;const now=ac.currentTime;const scale=[110,110,146.83,130.81,110,164.81,146.83,98];note(scale[Math.floor(b/4)%8],now,.28,'triangle',.04);note(b%4===0?73.4:220,now,.1,'sine',.035);if(b%2===0)note([440,523.25,587.33,659.25][Math.floor(b/2)%4],now,.3,'sine',.018);}
function setSpeed(value){bpm=value;$('calm').setAttribute('aria-pressed',String(bpm===80));$('normal').setAttribute('aria-pressed',String(bpm===96));}
function record(){try{const best=Number(localStorage.getItem('forma-marcial-rhythm-best'))||0;$('record').textContent=best?`Tu récord: ${fmt(best)} puntos`:'';}catch{}}
function start(){audio();game=new RhythmGame(FORM,bpm);scene='play';paused=false;studentPose=masterPose='neutral';studentSide=masterSide='Ambos lados';particles=[];judge=null;flash=null;scheduledBeat=-1;$('intro').hidden=true;$('win').hidden=true;$('paused').hidden=true;$('pause').disabled=false;$('pause').textContent='Pausa';cv.focus();$('status').textContent='Comienza Forma Marcial.';}
function pause(){if(scene!=='play')return;paused=!paused;$('paused').hidden=!paused;$('pause').textContent=paused?'Seguir':'Pausa';if(ac){if(paused)ac.suspend();else ac.resume();}if(paused)$('resume').focus();else cv.focus();}
function home(){scene='title';paused=false;game=null;$('intro').hidden=false;$('win').hidden=true;$('paused').hidden=true;$('pause').disabled=true;$('pause').textContent='Pausa';record();$('start').focus();}
function finish(){scene='win';paused=false;$('win').hidden=false;$('pause').disabled=true;const precision=Math.round(100*game.hits/game.notes.length);$('result').textContent=`${fmt(game.score)} puntos · ${precision}% de aciertos · racha ${game.maxCombo}`;try{const best=Number(localStorage.getItem('forma-marcial-rhythm-best'))||0;localStorage.setItem('forma-marcial-rhythm-best',String(Math.max(best,game.score)));}catch{}$('status').textContent='Forma completa. Te ganaste una clase gratis en Irkadefact.';$('again').focus();}
function input(dir){if(scene!=='play'||paused)return;audio();game.input(dir);processEvents();}
function processEvents(){for(const e of game.drain()){if(e.type==='hit'||e.type==='miss'){const ok=e.type==='hit';judge={text:ok?(e.perfect?'¡PERFECTO!':'¡BIEN!'):'¡SEGUÍ!',color:ok?C.gold:C.muted,ttl:.65};flash={dir:e.dir,ttl:.3,ok};sfx(ok);if(ok){studentPose={left:'pak',down:'low',up:'tan',right:'punch'}[e.dir];studentSide=e.block.step.side;poseAge=0;if(!reduced)for(let n=0;n<9;n++)particles.push({x:330,y:174,vx:(Math.random()-.5)*35,vy:-20-Math.random()*30,ttl:.4+Math.random()*.4,color:n%2?C.gold:C[e.dir]});}}else if(e.type==='pose'){const b=e.block;masterPose=b.step.pose;masterSide=b.step.side;studentSide=b.step.side;studentPose=b.hits>=Math.ceil(b.total/2)?b.step.pose:'stance';poseAge=0;if(b.hits===b.total){game.score+=100;judge={text:'¡EN SINTONÍA!',color:C.purple,ttl:.8};}$('status').textContent=`Forma ${Math.round(100*(b.index+1)/FORM.length)} por ciento.`;}else if(e.type==='finish')finish();}}
$('start').onclick=start;$('again').onclick=start;$('pause').onclick=pause;$('resume').onclick=pause;$('home').onclick=home;$('calm').onclick=()=>setSpeed(80);$('normal').onclick=()=>setSpeed(96);$('sound').onclick=()=>{fx=!fx;audio();$('sound').textContent=`Efectos: ${fx?'sí':'no'}`;$('sound').setAttribute('aria-pressed',String(fx));};$('music').onclick=()=>{music=!music;audio();$('music').textContent=`Música: ${music?'sí':'no'}`;$('music').setAttribute('aria-pressed',String(music));};
document.addEventListener('keydown',e=>{if(scene!=='play')return;if(KEY[e.code]){e.preventDefault();if(!e.repeat)input(KEY[e.code]);}if(['KeyP','Escape'].includes(e.code)&&!e.repeat){e.preventDefault();pause();}});
document.querySelectorAll('[data-dir]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);b.classList.add('pressed');input(b.dataset.dir);});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>b.classList.remove('pressed'));b.addEventListener('click',e=>{if(e.detail===0)input(b.dataset.dir);});});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&scene==='play'&&!paused)pause();});window.addEventListener('blur',()=>{if(scene==='play'&&!paused)pause();});
// Original pixel-art scene inspired by the supplied gym video. No video or audio is uploaded.
const bg=document.createElement('canvas');bg.width=480;bg.height=270;const g=bg.getContext('2d');
function rect(x,y,w,h,c,target=ctx){target.fillStyle=c;target.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function text(s,x,y,c=C.ink,size=8,align='center',target=ctx){target.font=`${size}px "Press Start 2P", monospace`;target.textAlign=align;target.textBaseline='top';target.fillStyle=C.dark;target.fillText(s,x+1,y+1);target.fillStyle=c;target.fillText(s,x,y);}
function background(){rect(0,0,480,270,'#252938',g);rect(0,60,480,133,'#79818a',g);for(let i=0;i<500;i++){let x=(i*127+21)%480,y=64+(i*43)%126;rect(x,y,3+(i%6),2+i%4,i%2?'#858c93':'#707982',g);}rect(0,192,480,78,'#777571',g);for(let i=0;i<600;i++)rect((i*73)%480,196+(i*29)%74,i%3+1,1,i%2?'#8b8880':'#66656a',g);rect(0,187,480,7,'#574c49',g);rect(0,60,480,4,'#343f51',g);rect(39,62,7,126,'#27303d',g);rect(430,62,7,126,'#27303d',g);
 for(const x of [88,240,392]){rect(x,59,2,12,'#383e4f',g);rect(x-11,69,24,4,'#d3c09b',g);rect(x-7,73,16,2,'#f4e1aa',g);}rect(208,81,64,62,'#252535',g);rect(211,84,58,56,'#383448',g);text('IRKADEFACT',240,92,C.gold,5,'center',g);g.fillStyle='#a65055';g.beginPath();g.arc(240,118,13,0,Math.PI*2);g.fill();text('詠春',240,110,'#f3d0ad',10,'center',g);
 for(let x=12;x<95;x+=22){rect(x,161,16,13,'#292e38',g);rect(x-1,160,18,2,'#434855',g);rect(x,174,18,4,'#242735',g);rect(x,178,2,13,'#343642',g);rect(x+15,178,2,13,'#343642',g);}rect(402,158,4,33,'#725446',g);rect(394,143,20,6,'#8f6b50',g);rect(394,135,3,9,'#a67d5e',g);rect(411,136,3,9,'#a67d5e',g);rect(400,151,3,7,'#b38b66',g);rect(407,151,3,7,'#b38b66',g);rect(395,190,23,3,'#493e3d',g);
 // small training dummy at the right, far behind the action
 rect(452,127,8,60,'#a77d58',g);rect(444,145,25,4,'#bc9064',g);rect(445,155,10,4,'#bc9064',g);rect(459,166,10,4,'#bc9064',g);rect(450,187,16,5,'#493e3d',g);
}background();
const P={neutral:[[-12,30,-14,48,-14,65],[12,30,14,48,14,65]],stance:[[-12,30,-16,44,-8,43],[12,30,16,44,8,43]],cross:[[-12,30,-6,41,12,29],[12,30,6,41,-12,29]],rotate:[[-12,30,-14,44,-7,40],[12,30,14,44,7,40]],punch:[[-12,30,-3,39,2,26],[12,30,17,44,9,43]],tan:[[-12,30,-9,46,4,36],[12,30,17,44,9,43]],wu:[[-12,30,-6,46,0,29],[12,30,17,44,9,43]],fook:[[-12,30,-7,43,4,35],[12,30,17,44,9,43]],low:[[-12,30,-13,47,-19,60],[12,30,13,47,19,60]],back:[[-12,30,-19,44,-12,53],[12,30,19,44,12,53]],lift:[[-12,30,-12,46,-4,28],[12,30,12,46,4,28]],wide:[[-12,30,-30,33,-47,27],[12,30,30,33,47,27]],spear:[[-12,30,-7,34,-3,18],[12,30,7,34,3,18]],crosslow:[[-12,30,-7,47,6,61],[12,30,7,47,-6,61]],pak:[[-12,30,-22,38,-35,31],[12,30,17,44,9,43]],palm:[[-12,30,-4,40,3,24],[12,30,17,44,9,43]],bong:[[-12,30,-28,24,-7,31],[12,30,17,44,9,43]],close:[[-12,30,-16,44,-8,43],[12,30,16,44,8,43]]};
function armsFor(pose,side){let arms=(P[pose]||P.stance).map(a=>a.slice());if(side==='Derecho')arms=[arms[1].map((v,i)=>i%2?v:-v),arms[0].map((v,i)=>i%2?v:-v)];if(side==='Ambos lados'&&['rotate','tan','wu','fook','punch'].includes(pose))arms=[arms[0],arms[0].map((v,i)=>i%2?v:-v)];return arms;}
let visualArms=[armsFor('neutral','Ambos lados'),armsFor('neutral','Ambos lados')];
function character(x,base,pose,side,master,dt){const slot=master?0:1,target=armsFor(pose,side),blend=reduced?1:Math.min(1,dt*11);for(let a=0;a<2;a++)for(let k=0;k<6;k++)visualArms[slot][a][k]+=(target[a][k]-visualArms[slot][a][k])*blend;const arms=visualArms[slot];ctx.save();ctx.translate(x,base-98);const black=master?'#22212c':'#383047',shade=master?'#171822':'#292337',skin=master?'#c58f6b':'#e0ad86';
 function stroke(points,c,width){ctx.strokeStyle=C.dark;ctx.lineWidth=width+2;ctx.lineJoin='miter';ctx.lineCap='square';ctx.beginPath();ctx.moveTo(Math.round(points[0]),Math.round(points[1]));for(let k=2;k<points.length;k+=2)ctx.lineTo(Math.round(points[k]),Math.round(points[k+1]));ctx.stroke();ctx.strokeStyle=c;ctx.lineWidth=width;ctx.stroke();}
 const closed=pose==='neutral'||pose==='close',foot=closed?6:17;
 rect(-25,97,50,4,'#5e5b60');stroke([-7,60,-9,78,-foot,96],master?'#20212a':'#4d5368',9);stroke([7,60,9,78,foot,96],master?'#20212a':'#4d5368',9);rect(-foot-5,95,11,5,'#272633');rect(foot-5,95,11,5,'#272633');rect(-foot-5,99,11,2,'#afaa9f');rect(foot-5,99,11,2,'#afaa9f');
 rect(-14,27,28,37,C.dark);rect(-12,27,24,35,black);rect(-12,31,5,30,shade);rect(-10,61,20,2,'#48404b');
 if(master){
  // Black patterned training shirt, blue/gold shoulder and light crest from the reference.
  for(let row=0;row<7;row++)for(let col=0;col<4;col++)rect(-9+col*5+(row%2),33+row*4,2,1,'#3d3b42');
  rect(-7,28,14,2,'#3f3c42');rect(-5,28,10,2,'#ba9a63');
  disc(6,41,4,'#aeadab');disc(6,41,2,black);rect(5,38,2,6,'#d1ccc0');
  rect(5,64,4,4,'#9b9b94');rect(6,65,2,2,'#30303a');
 }else rect(5,34,4,4,'#d4b578');
 rect(-4,22,8,7,skin);
 for(const [armIndex,a] of arms.entries()){stroke(a,skin,5);const [sx,sy,ex,ey,hx,hy]=a;stroke([sx,sy,sx+(ex-sx)*.38,sy+(ey-sy)*.38],black,7);
  if(master){
   if(armIndex===0){stroke([sx,sy,sx+(ex-sx)*.22,sy+(ey-sy)*.22],'#2469a2',7);stroke([sx,sy+1,sx+(ex-sx)*.13,sy+1+(ey-sy)*.13],'#cfaa62',2);}
   else{stroke([sx,sy,sx+(ex-sx)*.22,sy+(ey-sy)*.22],'#aaa9a1',7);stroke([sx+(ex-sx)*.32,sy+(ey-sy)*.32,sx+(ex-sx)*.39,sy+(ey-sy)*.39],'#c29b58',2);}
  }
 rect(hx-3,hy-3,6,6,skin);if(['palm','wu','spear'].includes(pose))rect(hx-2,hy-7,4,5,'#e8b795');if(['tan','lift','fook'].includes(pose))rect(hx-1,hy-3,7,2,'#ecc19d');}
 if(master){
  // Short dark hair, full eyebrows, close beard and moustache.
  rect(-9,3,18,22,C.dark);rect(-7,6,14,17,skin);rect(-9,9,2,7,skin);rect(7,9,2,7,skin);
  rect(-7,0,14,3,'#17191f');rect(-9,3,18,5,'#17191f');rect(-9,7,3,7,'#25222a');rect(6,7,3,7,'#25222a');
  rect(-5,10,4,2,'#292029');rect(2,10,4,2,'#292029');rect(-4,13,2,2,'#201c24');rect(3,13,2,2,'#201c24');rect(0,14,2,3,'#a77155');
  rect(-7,17,3,5,'#30252a');rect(4,17,3,5,'#30252a');rect(-5,20,10,5,'#30252a');rect(-3,24,6,1,'#30252a');
  rect(-4,18,8,2,'#30252a');rect(-2,20,4,1,'#c18c71');rect(-1,22,3,2,'#3e2d2e');
 }else{
  rect(-9,3,18,21,C.dark);rect(-7,6,14,17,skin);rect(-9,0,18,7,'#272330');rect(-9,5,4,8,'#272330');rect(5,5,4,8,'#272330');rect(-4,12,2,2,C.dark);rect(3,12,2,2,C.dark);rect(-3,20,6,2,'#bb7c6b');
 }
 ctx.restore();}
function arrow(x,y,dir,color,scale=1){const pts=[[-3,6],[-3,-1],[-7,-1],[0,-8],[7,-1],[3,-1],[3,6]];const rot={up:0,right:Math.PI/2,down:Math.PI,left:-Math.PI/2}[dir];ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(rot);ctx.scale(scale,scale);ctx.beginPath();pts.forEach(([a,b],i)=>i?ctx.lineTo(a,b):ctx.moveTo(a,b));ctx.closePath();ctx.lineWidth=2;ctx.strokeStyle=C.dark;ctx.stroke();ctx.fillStyle=color;ctx.fill();ctx.restore();}
function disc(x,y,r,c){ctx.fillStyle=c;for(let a=-r;a<=r;a++){const w=Math.floor(Math.sqrt(r*r-a*a));ctx.fillRect(Math.round(x-w),Math.round(y+a),w*2+1,1);}}
function draw(dt){ctx.drawImage(bg,0,0);const active=scene==='play'||scene==='win';rect(0,0,480,22,'#29263c');text('AURA '+fmt(game?.score||0),9,7,C.gold,8,'left');text('ENERGÍA',359,8,C.muted,6,'right');for(let i=0;i<8;i++)rect(368+i*12,6,8,11,i<(game?.energy??8)?'#5bcf80':'#484052');
 rect(0,23,480,34,'#252738');rect(0,23,480,1,'#4b4c61');rect(0,56,480,1,'#4b4c61');const target=46,y=40;disc(target,y,12,C.ink);disc(target,y,10,'#44315f');disc(target,y,8,'#2c213e');
 if(game){for(const n of game.notes){if(n.judged)continue;const x=target+(n.at-game.time)*140;if(x>500)break;if(x<-12)continue;arrow(x,y,n.dir,C[n.dir],1.4);}if(flash&&flash.ok){disc(target,y,12,C[flash.dir]);arrow(target,y,flash.dir,C.ink,1.2);}}
 character(151,232,masterPose,masterSide,true,dt);character(330,232,studentPose,studentSide,false,dt);
 text('IRKADEFACT',151,244,C.muted,5);text('VOS',330,244,C.purple,6);
 if(scene==='title'){text('小念頭',240,166,C.gold,14);}if(scene==='play'){
 const first=game.blocks[0].at;if(game.time<first){const countdown=Math.ceil((first-game.time)/game.beat);text(countdown>3?'PREPARATE':String(countdown),240,168,C.gold,17);}
 if(judge){text(judge.text,240,83,judge.color,8);}if(game.combo>=3)text('RACHA '+game.combo,330,124,C.gold,7);
 rect(0,265,480,5,'#30283f');rect(0,265,480*Math.min(1,game.time/game.duration),5,C.purple);
 }
 for(const p of particles)rect(p.x,p.y,2,2,p.color);
}
function frame(now){const dt=Math.min((now-(last||now))/1000,.05);last=now;if(scene==='play'&&!paused){game.update(dt);processEvents();beatMusic();poseAge+=dt;if(judge&&(judge.ttl-=dt)<=0)judge=null;if(flash&&(flash.ttl-=dt)<=0)flash=null;for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=50*dt;p.ttl-=dt;}particles=particles.filter(p=>p.ttl>0);}draw(paused?0:dt);requestAnimationFrame(frame);}
record();requestAnimationFrame(frame);
