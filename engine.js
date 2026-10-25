export const acts = [
 {name:'A convincing stand-in',line:'The theatre is empty. Someone must still hold the curtain.',lesson:'Stand on the brass switch a, leave your double, then walk through curtain A.',map:['########','#P.aA.K#','######.#','#E.....#','########']},
 {name:'The impossible entrance',line:'They remember seeing you here. That is the useful part.',lesson:'Your double is already across the wall. Take the ticket, then trade places.',map:['#########','#P.K#...#','#...#D.E#','#########']},
 {name:'One role at a time',line:'A perfect alibi cannot be in two places. A good one can move.',lesson:'Pass curtain A, recall your double, then give it a new job on switch b.',map:['##########','#P.aA....#','#####.##.#','#K....bB.#','########.#','#E.......#','##########']},
 {name:'The usher believes you',line:'He watches the double. You take the side door.',lesson:'The red sightline stops at your double. Keep it there while crossing behind it.',map:['#########','#P......#','#>..D...#','####.####','#K..aA.E#','#########']},
 {name:'An inconvenient witness',line:'A witness is useful until they see the wrong thing.',lesson:'Cross behind your double first. Recall it only once you are out of the usher’s row.',map:['##########','#P.......#','#>..D....#','######.###','#KAa.....#','#######.##','#E......K#','##########']},
 {name:'The final bow',line:'Two tickets. One double. Leave them with a story they can believe.',lesson:'Your double waits beyond the wall. Both tickets must leave with the real performer.',map:['###########','#P.K#D.aAK#','#...#..##.#','#####.....#','#E..B.b...#','###########']}
];
export const moves={up:[0,-1],right:[1,0],down:[0,1],left:[-1,0]};
export const actions=[...Object.keys(moves),'double','recall','swap'];
export function board(act){
 const w=act.map[0].length,h=act.map.length,cells=act.map.join('');
 if(act.map.some(r=>r.length!==w))throw Error('Ragged board');
 const start=cells.indexOf('P'),exit=cells.indexOf('E'),keys=[...cells].flatMap((c,i)=>c==='K'?[i]:[]),echo=cells.indexOf('D');
 if(start<0||exit<0)throw Error('Missing stage endpoints');
 return {...act,w,h,cells,start,exit,keyCells:keys,echo:echo<0?null:echo};
}
export function initial(b){return {p:b.start,e:b.echo,k:0};}
export function open(b,s,i){const c=b.cells[i];return c==='A'||c==='B'?[s.p,s.e].some(p=>p!==null&&b.cells[p]===c.toLowerCase()):true;}
export function sight(b,s){
 const lit=new Set();
 for(let i=0;i<b.cells.length;i++){
  const c=b.cells[i],d={'^':[0,-1],'>':[1,0],'v':[0,1],'<':[-1,0]}[c];if(!d)continue;
  let x=i%b.w+d[0],y=Math.floor(i/b.w)+d[1];
  while(x>=0&&y>=0&&x<b.w&&y<b.h){const n=y*b.w+x;if(b.cells[n]==='#'||!open(b,s,n))break;if(n===s.e)break;lit.add(n);x+=d[0];y+=d[1];}
 }
 return lit;
}
export function won(b,s){return s.p===b.exit&&s.k===(1<<b.keyCells.length)-1;}
export function step(b,s,a){
 if(!actions.includes(a))return {state:s,ok:false,reason:'Unknown action.'};
 let t={...s};
 if(a==='double'){if(s.e!==null)return {state:s,ok:false,reason:'Only one double. Recall it before leaving another.'};t.e=s.p;}
 else if(a==='recall'){if(s.e===null)return {state:s,ok:false,reason:'There is no double to recall.'};t.e=null;}
 else if(a==='swap'){if(s.e===null||s.e===s.p)return {state:s,ok:false,reason:'Walk away from your double before trading places.'};[t.p,t.e]=[s.e,s.p];}
 else{const [dx,dy]=moves[a],x=s.p%b.w+dx,y=Math.floor(s.p/b.w)+dy;if(x<0||y<0||x>=b.w||y>=b.h)return {state:s,ok:false,reason:'The edge of the stage.'};t.p=y*b.w+x;}
 const tile=b.cells[t.p];
 if(tile==='#')return {state:s,ok:false,reason:'A wall. Even the best alibi cannot walk through it.'};
 if('^>v<'.includes(tile))return {state:s,ok:false,reason:'The usher is standing there.'};
 if(!open(b,t,t.p))return {state:s,ok:false,reason:'Curtain closed. Someone must hold the matching switch.'};
 if(sight(b,t).has(t.p))return {state:s,ok:false,reason:'The usher would see you. Your double blocks his line of sight.'};
 const key=b.keyCells.indexOf(t.p);if(key>=0)t.k|=1<<key;
 return {state:t,ok:true,reason:won(b,t)?'A clean exit. Your alibi holds.':key>=0&&!(s.k&(1<<key))?'Ticket pocketed. Only the real performer can collect it.':a==='swap'?'A change of places. No one noticed.':a==='double'?'Your double holds the pose.':a==='recall'?'The double dissolves.':'One quiet step.'};
}
const id=s=>[s.p,s.e??'-',s.k].join(',');
export function solve(b,start=initial(b),allowed=actions){
 if(won(b,start))return [];
 const queue=[start],seen=new Set([id(start)]),prev=new Map();
 for(let head=0;head<queue.length;head++)for(const a of allowed){const r=step(b,queue[head],a);if(!r.ok)continue;const key=id(r.state);if(seen.has(key))continue;seen.add(key);prev.set(key,{from:id(queue[head]),action:a});if(won(b,r.state)){const path=[];let k=key;while(prev.has(k)){const p=prev.get(k);path.push(p.action);k=p.from;}return path.reverse();}queue.push(r.state);}
 return null;
}
