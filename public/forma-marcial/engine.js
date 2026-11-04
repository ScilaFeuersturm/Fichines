'use strict';
/* Reloj y juicios independientes del render y del audio. */
class RhythmGame {
 constructor(form,bpm=96){this.form=form;this.beat=60/bpm;this.time=0;this.score=0;this.combo=0;this.maxCombo=0;this.hits=0;this.perfects=0;this.misses=0;this.energy=8;this.over=false;this.events=[];this.notes=[];this.blocks=[];
 const dirs={'←':'left','↓':'down','↑':'up','→':'right'};
 form.forEach((step,i)=>{const at=(4+i*3)*this.beat;const block={step,index:i,at,show:at+2*this.beat,hits:0,total:step.keys.length,shown:false};this.blocks.push(block);step.keys.forEach((k,n)=>this.notes.push({at:at+n*(step.keys.length===3?.75:1)*this.beat,dir:dirs[k],block,judged:false}));});this.duration=(4+form.length*3+2)*this.beat;}
 judge(note,ok,delta=0){if(note.judged)return;note.judged=true;const perfect=ok&&Math.abs(delta)<=.09;if(ok){this.hits++;note.block.hits++;this.combo++;this.maxCombo=Math.max(this.combo,this.maxCombo);if(perfect)this.perfects++;this.score+=(perfect?100:60)*(1+Math.min(3,Math.floor((this.combo-1)/12)));this.energy=Math.min(8,this.energy+.12);}else{this.misses++;this.combo=0;this.energy=Math.max(0,this.energy-.5);}this.events.push({type:ok?'hit':'miss',dir:note.dir,perfect,block:note.block});}
 input(dir){if(this.over)return;const nearest=this.notes.filter(n=>!n.judged&&Math.abs(n.at-this.time)<=.22).sort((a,b)=>Math.abs(a.at-this.time)-Math.abs(b.at-this.time))[0];if(nearest)this.judge(nearest,nearest.dir===dir,this.time-nearest.at);}
 update(dt){if(this.over)return;this.time+=Math.max(0,Math.min(dt,.1));for(const n of this.notes)if(!n.judged&&this.time>n.at+.22)this.judge(n,false);for(const b of this.blocks)if(!b.shown&&this.time>=b.show){b.shown=true;this.events.push({type:'pose',block:b});}if(this.time>=this.duration){this.over=true;this.events.push({type:'finish'});}}
 drain(){const out=this.events;this.events=[];return out;}
}
if(typeof module!=='undefined')module.exports=RhythmGame;
