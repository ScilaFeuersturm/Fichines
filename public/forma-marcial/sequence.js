/* Secuencia basada en la variante provista por el taller. Izquierda/derecha son del practicante. */
'use strict';
const FORM = (() => {
 const steps=[];
 const add=(chapter,name,description,pose,keys,side='Ambos lados',slow=false,tip='Hombros sueltos. Codo orientado al centro.')=>steps.push({chapter,name,description,pose,keys,side,slow,tip});
 const open='1 · Apertura y estructura';
 add(open,'Posición inicial','Pies juntos, postura erguida y hombros relajados.','neutral',['↓']);
 add(open,'Apertura de guardia','Cruzá los antebrazos en X frente al pecho y abrí las palmas.','cross',['↑','←']);
 add(open,'Huen Sau → Sau Kuen','Rotá las muñecas, cerrá los puños y recogé a las costillas.','rotate',['←','↓']);
 add(open,'Enraizamiento · talones','Abrí los talones hacia afuera pivotando sobre las puntas.','stance',['←','↓']);
 add(open,'Yee Jee Kim Yeung Ma','Abrí las puntas sobre los talones. Rodillas flexionadas hacia adentro, pelvis ligeramente al frente, espalda recta.','stance',['→','↓']);
 for(const side of ['Izquierdo','Derecho']){
  const ch='2 · Línea central y energía constante';
  const a=(n,d,p,k,slow=false)=>add(ch,n,d,p,k,side,slow,'Sin apuro: codo centrado, hombros relajados y cadera fija.');
  a('Yat Ji Kuen','Lanzá el puño recto hacia la línea media.','punch',['↑','→']);
  a('Huen Sau → recogida','Abrí la mano, rotá la muñeca, cerrá el puño y recogé a la costilla.','rotate',['←','↓']);
  a('Tan Sau','Avanzá lentamente con la palma hacia arriba y el codo cerrado por el centro.','tan',['↑','→'],true);
  a('Huen Sau → Wu Sau','Rotá la muñeca hacia adentro y recogé con la mano de guardia vertical.','wu',['←','↓'],true);
  for(let cycle=1;cycle<=3;cycle++){
   a(`Fook Sau · ${cycle}/3`,'Avanzá con mano puente, manteniendo la intención hacia el centro.','fook',['↓','→'],true);
   a(`Huen Sau → Wu Sau · ${cycle}/3`,'Rotá y volvé a la guardia vertical, con energía constante y sin tensión.','wu',['←','↓'],true);
  }
  a('Corte bajo','Desde el último Wu Sau, descendé la mano en un corte de palma baja.','low',['→','↓']);
  a('Huen Sau → Sau Kuen','Rotá, cerrá el puño y recogé a la costilla.','rotate',['←','↓']);
 }
 const ch='3 · Dirección de fuerza y liberación';
 add(ch,'Gum Sau frontal','Ambas palmas presionan hacia abajo por delante del cuerpo.','low',['→','↓']);
 add(ch,'Gum Sau posterior','Presioná hacia atrás, a los laterales de las caderas.','back',['←','↓']);
 add(ch,'Gum Sau frontal','Volvé al frente presionando hacia abajo.','low',['→','↓']);
 add(ch,'Tok Sau','Subí ambas manos por el centro con las palmas hacia arriba.','lift',['↓','↑']);
 add(ch,'Fak Sau doble','Recogé brevemente los codos y abrí ambos brazos con el canto de la mano.','wide',['↓','←','→']);
 add(ch,'Jut Sau','Retraé ambas manos hacia el esternón con un tirón corto.','wu',['→','↓']);
 add(ch,'Biu Sau','Proyectá ambas manos rectas al frente, como lanzas.','spear',['↑','→']);
 add(ch,'Garn Sau / Jam Sau','Cortá hacia abajo cruzando y abriendo los brazos.','crosslow',['←','↓']);
 add(ch,'Huen Sau → Sau Kuen','Rotá las muñecas, cerrá los puños y recogé a las costillas.','rotate',['←','↓']);
 for(const side of ['Izquierdo','Derecho']){
  const ch='4 · Mecanismos defensivos y transiciones';
  const a=(n,d,p,k)=>add(ch,n,d,p,k,side);
  a('Pak Sau','Desviá hacia el lateral con la palma.','pak',['↑','←']);
  a('Jeung','Rematá con un golpe de palma frontal vertical.','palm',['↑','→']);
  a('Tan Sau','Abrí la mano en Tan Sau, con palma hacia arriba.','tan',['↓','↑']);
  a('Dai Jeung','Descendé con un golpe de palma baja horizontal.','low',['→','↓']);
  a('Garn Sau','Cortá en bloqueo bajo hacia la zona de ingle y muslo.','crosslow',['←','↓']);
  a('Tok Sau','Elevá la mano de manera controlada.','lift',['↓','↑']);
  a('Bong Sau','Proyectá el codo alto hacia afuera en ángulo defensivo.','bong',['↑','←']);
  a('Bong Sau → Tan Sau','Rotá sobre el eje del antebrazo para transformar la defensa en Tan Sau.','tan',['←','↑']);
  a('Wang Jeung','Descargá un golpe de palma horizontal o de corte.','pak',['←','→']);
  a('Huen Sau → Sau Kuen','Rotá, cerrá el puño y recogé a la costilla.','rotate',['←','↓']);
 }
 const end='5 · Cierre de la forma';
 add(end,'Puño izquierdo','Lanzá el puño izquierdo por la línea central.','punch',['↑','→'],'Izquierdo');
 add(end,'Puño derecho','Seguí con el puño derecho por el centro.','punch',['↑','→'],'Derecho');
 add(end,'Huen Sau → Sau Kuen','Rotá las muñecas y recogé ambos puños a las costillas.','rotate',['←','↓']);
 add(end,'Cierre · puntas','Llevá primero las puntas de los pies hacia el centro.','close',['→']);
 add(end,'Cierre · talones','Juntá los talones para volver a la postura inicial.','neutral',['←']);
 add(end,'Respirá','Dejá caer los brazos a los costados, relajá y respirá profundo.','neutral',['↓'], 'Ambos lados',true,'La forma termina. La práctica sigue.');
 return steps;
})();
if(typeof module!=='undefined')module.exports=FORM;
