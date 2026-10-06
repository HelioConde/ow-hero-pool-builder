(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.OWPoolCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const MOBILITY={low:1,medium:2,high:3};

  function baseScore(hero,input){
    if(hero.role!==input.role)return -Infinity;
    let score=0;
    const reasons=[];
    if(input.style==='any'||hero.styles.includes(input.style)){score+=4;if(input.style!=='any')reasons.push('combina com seu estilo '+input.style);}
    if(input.aim==='any'||hero.aim.includes(input.aim)){score+=3;if(input.aim!=='any')reasons.push('usa a mecânica que você prefere');}
    if(input.map&&hero.maps.includes(input.map)){score+=2;reasons.push('funciona bem no tipo de mapa escolhido');}
    if(input.mobility!=='any'){
      const target=MOBILITY[input.mobility]||2;
      const diff=Math.abs(hero.mobility-target);
      score+=Math.max(0,2-diff);
      if(diff===0)reasons.push('tem a mobilidade que você pediu');
    }
    (input.priorities||[]).forEach(priority=>{
      if(hero.strengths.includes(priority)){score+=1.5;reasons.push('entrega '+priority);}
    });
    return {score,reasons};
  }

  function complementBonus(hero,selected){
    if(!selected.length)return 0;
    let bonus=0;
    const styles=new Set(selected.flatMap(item=>item.styles));
    const ranges=new Set(selected.map(item=>item.range));
    const aims=new Set(selected.flatMap(item=>item.aim));
    if(hero.styles.some(style=>!styles.has(style)))bonus+=2.5;
    if(!ranges.has(hero.range))bonus+=1.5;
    if(hero.aim.some(aim=>!aims.has(aim)))bonus+=1;
    const selectedStrengths=new Set(selected.flatMap(item=>item.strengths));
    bonus+=hero.strengths.filter(value=>!selectedStrengths.has(value)).length*.35;
    return bonus;
  }

  function buildPool(heroes,input){
    const candidates=heroes.filter(hero=>hero.role===input.role);
    if(candidates.length<3)return {pool:[],coverage:null};
    const comfort=new Set(input.comfort||[]);
    const scored=candidates.map(hero=>({hero,...baseScore(hero,input)})).sort((a,b)=>b.score-a.score||a.hero.name.localeCompare(b.hero.name));
    const selected=[];

    const anchor=scored.find(item=>comfort.has(item.hero.name))||scored[0];
    if(anchor)selected.push(anchor.hero);

    while(selected.length<3){
      const remaining=scored.filter(item=>!selected.some(hero=>hero.name===item.hero.name));
      remaining.sort((a,b)=>(b.score+complementBonus(b.hero,selected))-(a.score+complementBonus(a.hero,selected)));
      if(!remaining.length)break;
      selected.push(remaining[0].hero);
    }

    const pool=selected.map((hero,index)=>{
      const base=baseScore(hero,input);
      const role=index===0?'Âncora':index===1?'Complemento':'Cobertura';
      const reason=base.reasons.slice(0,2).join(' · ')||'amplia a cobertura do trio';
      return {hero,slot:role,reason};
    });

    return {
      pool,
      coverage:{
        styles:[...new Set(selected.flatMap(hero=>hero.styles))],
        ranges:[...new Set(selected.map(hero=>hero.range))],
        maps:[...new Set(selected.flatMap(hero=>hero.maps))],
        strengths:[...new Set(selected.flatMap(hero=>hero.strengths))]
      }
    };
  }

  return {buildPool,baseScore,complementBonus};
});