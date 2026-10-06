const HEROES=[
{name:'D.Va',role:'Tank',aim:['tracking'],mobility:3,range:'short',styles:['dive'],maps:['vertical','mixed'],strengths:['peel','pressure','survivability'],summary:'Tank móvel para contestar altura e voltar para proteger aliados.'},
{name:'Reinhardt',role:'Tank',aim:['melee'],mobility:1,range:'short',styles:['brawl'],maps:['close','mixed'],strengths:['survivability','utility'],summary:'Âncora de frontline para espaços onde o time quer avançar junto.'},
{name:'Winston',role:'Tank',aim:['tracking'],mobility:3,range:'short',styles:['dive'],maps:['vertical','mixed'],strengths:['pressure','utility'],summary:'Inicia mergulhos e cria espaço em mapas com acessos verticais.'},
{name:'Sigma',role:'Tank',aim:['projectile'],mobility:1,range:'long',styles:['poke'],maps:['open','mixed'],strengths:['utility','survivability'],summary:'Controle de espaço e pressão consistente em linhas mais abertas.'},
{name:'Zarya',role:'Tank',aim:['tracking'],mobility:1,range:'medium',styles:['brawl'],maps:['close','mixed'],strengths:['peel','pressure'],summary:'Protege engages aliados e cresce em lutas sustentadas.'},
{name:'Roadhog',role:'Tank',aim:['projectile'],mobility:1,range:'medium',styles:['brawl','poke'],maps:['close','mixed'],strengths:['survivability','pressure'],summary:'Autossuficiência e ameaça de pick para variar a condição de vitória.'},
{name:'Ashe',role:'Damage',aim:['hitscan'],mobility:2,range:'long',styles:['poke'],maps:['open','vertical'],strengths:['pressure','utility'],summary:'Hitscan de alcance com boa presença em ângulos e altura.'},
{name:'Tracer',role:'Damage',aim:['tracking'],mobility:3,range:'short',styles:['dive'],maps:['vertical','mixed'],strengths:['pressure','survivability'],summary:'Flanqueamento e pressão constante com grande autonomia.'},
{name:'Soldier: 76',role:'Damage',aim:['tracking','hitscan'],mobility:2,range:'long',styles:['poke'],maps:['open','mixed'],strengths:['pressure','survivability'],summary:'Opção estável de alcance, reposicionamento e autossustento.'},
{name:'Genji',role:'Damage',aim:['projectile'],mobility:3,range:'short',styles:['dive'],maps:['vertical','mixed'],strengths:['pressure','utility'],summary:'Dive vertical para finalizar alvos e explorar janelas curtas.'},
{name:'Reaper',role:'Damage',aim:['tracking'],mobility:2,range:'short',styles:['brawl'],maps:['close','mixed'],strengths:['pressure','survivability'],summary:'Pressão de curta distância para lutas fechadas e frontline.'},
{name:'Mei',role:'Damage',aim:['projectile'],mobility:1,range:'medium',styles:['brawl'],maps:['close','mixed'],strengths:['utility','survivability','peel'],summary:'Controle de espaço e utilidade para dividir lutas.'},
{name:'Cassidy',role:'Damage',aim:['hitscan'],mobility:1,range:'medium',styles:['brawl','poke'],maps:['mixed','open'],strengths:['pressure','peel'],summary:'Hitscan de médio alcance que ajuda a punir aproximações.'},
{name:'Widowmaker',role:'Damage',aim:['hitscan'],mobility:2,range:'long',styles:['poke'],maps:['open','vertical'],strengths:['pressure'],summary:'Cobertura de extremo alcance quando o mapa recompensa sightlines.'},
{name:'Ana',role:'Support',aim:['hitscan','projectile'],mobility:1,range:'long',styles:['poke'],maps:['open','mixed'],strengths:['utility','pressure'],summary:'Suporte de alcance com ferramentas de utilidade decisivas.'},
{name:'Baptiste',role:'Support',aim:['hitscan'],mobility:2,range:'medium',styles:['brawl','poke'],maps:['vertical','mixed'],strengths:['survivability','utility','pressure'],summary:'Sustain, dano e acesso a altura em composições agrupadas.'},
{name:'Brigitte',role:'Support',aim:['melee'],mobility:1,range:'short',styles:['brawl'],maps:['close','mixed'],strengths:['peel','survivability'],summary:'Proteção de backline e presença forte contra pressão próxima.'},
{name:'Kiriko',role:'Support',aim:['projectile'],mobility:3,range:'medium',styles:['dive'],maps:['vertical','mixed'],strengths:['utility','survivability'],summary:'Alta mobilidade e utilidade para acompanhar times espalhados.'},
{name:'Lúcio',role:'Support',aim:['projectile'],mobility:3,range:'short',styles:['brawl','dive'],maps:['close','mixed'],strengths:['utility','survivability'],summary:'Acelera engages e dá mobilidade coletiva ao time.'},
{name:'Mercy',role:'Support',aim:['tracking'],mobility:3,range:'medium',styles:['poke','dive'],maps:['vertical','mixed'],strengths:['utility','survivability'],summary:'Mobilidade e amplificação para acompanhar aliados em ângulos.'},
{name:'Moira',role:'Support',aim:['tracking'],mobility:2,range:'short',styles:['brawl'],maps:['close','mixed'],strengths:['survivability','pressure'],summary:'Sustain simples e escape para lutas próximas e caóticas.'},
{name:'Zenyatta',role:'Support',aim:['projectile'],mobility:1,range:'long',styles:['poke'],maps:['open','mixed'],strengths:['pressure','utility'],summary:'Pressão de longo alcance e amplificação de foco em alvos.'}
];

const core=window.OWPoolCore;
const form=document.querySelector('#builder-form');
const roleSelect=document.querySelector('#role');
const comfort=document.querySelector('#comfort-heroes');
const result=document.querySelector('#pool-result');
const roster=document.querySelector('#hero-roster');
const STORAGE='ow-hero-pool-builder-v1';
let rosterRole='Tank';
let lastBuilt=null;

function escapeHtml(value=''){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function showToast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('on');setTimeout(()=>el.classList.remove('on'),1800);}
function roleLabel(role){return role==='Damage'?'Dano':role==='Support'?'Suporte':'Tank';}
function styleLabel(value){return ({dive:'Dive',brawl:'Brawl',poke:'Poke'})[value]||value;}
function rangeLabel(value){return ({short:'Curto',medium:'Médio',long:'Longo'})[value]||value;}

function renderComfort(){
  const current=roleSelect.value;
  const selected=new Set([...comfort.querySelectorAll('input:checked')].map(i=>i.value));
  comfort.innerHTML=HEROES.filter(hero=>hero.role===current).map(hero=>`<label class="hero-pill"><input type="checkbox" name="comfort" value="${escapeHtml(hero.name)}" ${selected.has(hero.name)?'checked':''}><span>${escapeHtml(hero.name)}</span></label>`).join('');
}

function renderRoster(){
  roster.innerHTML=HEROES.filter(hero=>hero.role===rosterRole).map(hero=>`
    <article class="hero-card-item">
      <div class="hero-initial">${escapeHtml(hero.name.slice(0,2).toUpperCase())}</div>
      <div><div class="hero-card-top"><strong>${escapeHtml(hero.name)}</strong><span>${escapeHtml(hero.styles.map(styleLabel).join(' · '))}</span></div>
      <p>${escapeHtml(hero.summary)}</p>
      <div class="tags"><span>${rangeLabel(hero.range)}</span><span>Mobilidade ${hero.mobility===3?'alta':hero.mobility===2?'média':'baixa'}</span><span>${escapeHtml(hero.aim.join(' / '))}</span></div></div>
    </article>`).join('');
}

function selectedComfort(){return [...comfort.querySelectorAll('input:checked')].map(input=>input.value);}

function buildInput(){
  const values=Object.fromEntries(new FormData(form));
  return {
    role:values.role,
    style:values.style,
    map:values.map,
    aim:values.aim,
    mobility:values.mobility,
    priorities:[...form.querySelectorAll('[name="priority"]:checked')].map(input=>input.value),
    comfort:selectedComfort()
  };
}

function renderResult(built,input){
  if(!built.pool.length){result.className='pool-result empty-state';result.innerHTML='<strong>Sem recomendação</strong><p>Não há heróis suficientes para esta função no dataset do MVP.</p>';return;}
  const cards=built.pool.map((entry,index)=>`
    <article class="pool-card ${index===0?'anchor':''}">
      <div class="slot-label">${entry.slot}</div>
      <div class="pool-card-title"><div class="hero-initial">${escapeHtml(entry.hero.name.slice(0,2).toUpperCase())}</div><div><strong>${escapeHtml(entry.hero.name)}</strong><span>${entry.hero.styles.map(styleLabel).join(' · ')}</span></div></div>
      <p>${escapeHtml(entry.hero.summary)}</p>
      <small>${escapeHtml(entry.reason)}</small>
    </article>`).join('');
  result.className='pool-result';
  result.innerHTML=`
    <div class="pool-summary"><div><strong>${roleLabel(input.role)} · ${input.style==='any'?'estilo flexível':styleLabel(input.style)}</strong><span>${input.map==='open'?'linhas abertas':input.map==='vertical'?'verticalidade':input.map==='close'?'espaços fechados':'mapas mistos'}</span></div><button class="save-button" id="save-pool" type="button">Salvar pool</button></div>
    <div class="pool-cards">${cards}</div>
    <div class="coverage"><span>Cobertura do trio</span><div>${built.coverage.styles.map(v=>`<b>${styleLabel(v)}</b>`).join('')}${built.coverage.ranges.map(v=>`<b>${rangeLabel(v)}</b>`).join('')}</div></div>`;
  document.querySelector('#save-pool').addEventListener('click',()=>savePool(built,input));
}

function savePool(built,input){
  const saved=readSaved();
  const record={id:crypto.randomUUID?.()||String(Date.now()),createdAt:Date.now(),input,heroes:built.pool.map(entry=>entry.hero.name)};
  saved.unshift(record);localStorage.setItem(STORAGE,JSON.stringify(saved.slice(0,12)));showToast('Pool salvo neste dispositivo.');renderSaved();
}
function readSaved(){try{const value=JSON.parse(localStorage.getItem(STORAGE)||'[]');return Array.isArray(value)?value:[];}catch{return[];}}
function renderSaved(){
  const list=document.querySelector('#saved-list'),saved=readSaved();
  list.innerHTML=saved.length?saved.map(item=>`
    <article class="saved-item"><div><strong>${item.heroes.map(escapeHtml).join(' · ')}</strong><span>${roleLabel(item.input.role)} · ${new Date(item.createdAt).toLocaleDateString('pt-BR')}</span></div><button type="button" data-delete="${escapeHtml(item.id)}">Excluir</button></article>`).join(''):'<div class="empty-state"><strong>Nenhum pool salvo.</strong><p>Monte um trio e toque em “Salvar pool”.</p></div>';
}

form.addEventListener('submit',event=>{event.preventDefault();const input=buildInput();const built=core.buildPool(HEROES,input);lastBuilt={built,input};renderResult(built,input);});
roleSelect.addEventListener('change',renderComfort);
document.querySelector('#role-tabs').addEventListener('click',event=>{const button=event.target.closest('[data-role-view]');if(!button)return;rosterRole=button.dataset.roleView;document.querySelectorAll('[data-role-view]').forEach(el=>el.classList.toggle('active',el===button));renderRoster();});
document.querySelector('#saved-toggle').addEventListener('click',()=>{document.querySelector('#saved-panel').hidden=false;renderSaved();document.querySelector('#saved-panel').scrollIntoView({behavior:'smooth'});});
document.querySelector('#saved-close').addEventListener('click',()=>document.querySelector('#saved-panel').hidden=true);
document.querySelector('#saved-list').addEventListener('click',event=>{const button=event.target.closest('[data-delete]');if(!button)return;localStorage.setItem(STORAGE,JSON.stringify(readSaved().filter(item=>item.id!==button.dataset.delete)));renderSaved();showToast('Pool removido.');});

renderComfort();renderRoster();renderSaved();