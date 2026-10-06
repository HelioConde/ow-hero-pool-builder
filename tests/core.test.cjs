const {test}=require('node:test');
const assert=require('node:assert/strict');
const core=require('../core.js');

const heroes=[
{name:'Dive',role:'Damage',aim:['tracking'],mobility:3,range:'short',styles:['dive'],maps:['vertical'],strengths:['pressure']},
{name:'Poke',role:'Damage',aim:['hitscan'],mobility:1,range:'long',styles:['poke'],maps:['open'],strengths:['utility']},
{name:'Brawl',role:'Damage',aim:['projectile'],mobility:2,range:'medium',styles:['brawl'],maps:['close'],strengths:['survivability']},
{name:'Tank',role:'Tank',aim:['tracking'],mobility:2,range:'medium',styles:['brawl'],maps:['mixed'],strengths:['peel']}
];

test('respeita a função escolhida',()=>{
 const result=core.buildPool(heroes,{role:'Damage',style:'any',map:'mixed',aim:'any',mobility:'any',priorities:[],comfort:[]});
 assert.equal(result.pool.length,3);
 assert.ok(result.pool.every(entry=>entry.hero.role==='Damage'));
});

test('usa herói de conforto como âncora quando possível',()=>{
 const result=core.buildPool(heroes,{role:'Damage',style:'any',map:'open',aim:'any',mobility:'any',priorities:[],comfort:['Brawl']});
 assert.equal(result.pool[0].hero.name,'Brawl');
 assert.equal(result.pool[0].slot,'Âncora');
});

test('favorece correspondência de estilo e mecânica',()=>{
 const input={role:'Damage',style:'poke',map:'open',aim:'hitscan',mobility:'low',priorities:['utility'],comfort:[]};
 assert.ok(core.baseScore(heroes[1],input).score>core.baseScore(heroes[0],input).score);
});

test('bônus de complemento favorece cobertura nova',()=>{
 const selected=[heroes[0]];
 assert.ok(core.complementBonus(heroes[1],selected)>0);
});