/* ---------- fluido vivo nas cores da marca ---------- */
const cv = document.getElementById('gl'), gl = cv.getContext('webgl', { antialias: false, alpha: false });
const FS = `precision highp float;uniform vec2 uR;uniform float uT,uS,uD,uB;uniform vec2 uM;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*n(p);p=p*2.03+17.;a*=.5;}return s;}
void main(){vec2 uv=gl_FragCoord.xy/uR.y;vec2 p=uv*1.05+vec2(uS*.25,uS*.7);float t=uT*.07;
  float md=exp(-4.*length(uv-uM*vec2(uR.x/uR.y,1.)));
  vec2 q=p+.95*vec2(fbm(p+vec2(t,-t)),fbm(p+vec2(5.2-t,1.3+t)))+md*.22;
  vec2 r=q+.75*vec2(fbm(q*1.5+vec2(1.7,9.2)+t),fbm(q*1.5+vec2(8.3,2.8)-t));
  float f=fbm(r*1.05);
  vec3 cr=vec3(.992,.918,.855),pa=vec3(1.,.985,.955),am=vec3(.992,.808,0.),la=vec3(.878,.549,.263),gr=vec3(.105,.1,.1);
  vec3 c=mix(pa,cr,smoothstep(.28,.46,f));
  c=mix(c,am,smoothstep(.47,.6,f));
  c=mix(c,la,smoothstep(.56,.72,f+.2*fbm(q*2.2+3.)-.06));
  c=mix(c,vec3(.72,.36,.12),smoothstep(.8,.95,f)*.6);
  float g=smoothstep(.3,.72,f+uB);vec3 dk=mix(gr,vec3(.2,.1,.05),smoothstep(.2,.42,g));dk=mix(dk,vec3(.6,.28,.09),smoothstep(.4,.58,g));dk=mix(dk,la,smoothstep(.56,.72,g));dk=mix(dk,am,smoothstep(.74,.9,g));dk=mix(dk,vec3(1.,.93,.7),smoothstep(.9,1.,g)*.7);
  gl_FragColor=vec4(mix(c,dk,uD),1.);}`;
let U = null;
if (gl) {
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(o)); return o; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.bindAttribLocation(pr, 0, 'a'); gl.linkProgram(pr); gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  U = Object.fromEntries(['uR', 'uT', 'uS', 'uD', 'uM', 'uB'].map(n => [n, gl.getUniformLocation(pr, n)]));
} else document.body.style.background = 'linear-gradient(160deg,#FDEADA,#FDCE00 55%,#E08C43)';

const cvFrame = now => {
  if (U) {
    const k = innerWidth > 900 ? .5 : .7, w = Math.round(innerWidth * k), h = Math.round(innerHeight * k);
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); }
    fmx += (ftx - fmx) * .05; fmy += (fty - fmy) * .05; fs += (scrollY / innerHeight - fs) * .1;
    gl.uniform2f(U.uR, w, h); gl.uniform1f(U.uT, RM ? 0 : now / 1000); gl.uniform1f(U.uS, fs * .55); const ib = document.querySelector('.intro').getBoundingClientRect().bottom / innerHeight; fd += ((ib > 1 ? .34 : .34 * (1 - Math.min(1, (1 - ib) * 1.3))) - fd) * .07; gl.uniform1f(U.uD, 1); gl.uniform1f(U.uB, fd); gl.uniform2f(U.uM, fmx, fmy);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  requestAnimationFrame(cvFrame);
};
let fd = .34, fmx = .5, fmy = .5, ftx = .5, fty = .5, fs = 0;
addEventListener('pointermove', e => { ftx = e.clientX / innerWidth; fty = 1 - e.clientY / innerHeight; });
requestAnimationFrame(cvFrame);
/* trilha dos treinamentos: a linha se acende com a rolagem e o ponto sobe por ela */
const tri = document.getElementById('trilha'), tf = tri.querySelector('.tf'), tdot = tri.querySelector('.tdot'), sts = [...tri.querySelectorAll('.st')], TL = tf.getTotalLength();
let tp = 0;
const triFrame = () => {
  const r = tri.getBoundingClientRect(), vh = innerHeight;
  const p = Math.min(1, Math.max(0, (vh * .82 - r.top) / (r.height * .95)));
  tp += (p - tp) * (RM ? 1 : .1);
  tf.style.strokeDashoffset = 1 - tp;
  const pt = tf.getPointAtLength(tp * TL);
  tdot.style.transform = `translate(${pt.x / 1000 * r.width}px,${pt.y / 420 * r.height}px)`;
  sts.forEach((s, i) => s.classList.toggle('on', tp > [.2, .52, .84][i]));
  requestAnimationFrame(triFrame);
};
requestAnimationFrame(triFrame);

/* fecho: o símbolo da Oka em 3D, girando; arraste para girar em qualquer direção */
{
  const c3 = document.getElementById('o3'), g = c3.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
  const F3 = `precision highp float;uniform vec2 uR,uA;
vec3 dP=vec3(0.,-.418,0.);
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float bar(vec3 p,vec2 a,vec2 b,float hw,float z){p.z-=z;vec2 d=b-a;float L=length(d);vec2 u=d/L;vec2 q=p.xy-a;
  vec3 e=abs(vec3(dot(q,u)-L*.5,dot(q,vec2(-u.y,u.x)),p.z))-vec3(L*.5,hw,.085);
  return length(max(e,0.))+min(max(e.x,max(e.y,e.z)),0.)-.03;}
float bars(vec3 p){float d=bar(p,vec2(-1.012,-.712),vec2(.522,.829),.115,.1);
  d=min(d,bar(p,vec2(-.503,.797),vec2(1.014,-.713),.1,-.1));
  return min(d,bar(p,vec2(-.747,.3),vec2(.719,.3),.078,.27));}
float map(vec3 p){return min(bars(p),length(p-dP)-.25);}
vec3 nrm(vec3 p){vec2 e=vec2(.002,-.002);return normalize(e.xyy*map(p+e.xyy)+e.yyx*map(p+e.yyx)+e.yxy*map(p+e.yxy)+e.xxx*map(p+e.xxx));}
void main(){vec2 uv=(gl_FragCoord.xy-.5*uR)/uR.y;
  vec3 o=vec3(0.,0.,5.2)/.86,d=normalize(vec3(uv,-2.3));
  o.yz*=rot(uA.y);d.yz*=rot(uA.y);o.xz*=rot(uA.x);d.xz*=rot(uA.x);o.y-=.04;
  float t=0.,glow=0.,hit=0.;
  for(int i=0;i<64;i++){vec3 p=o+d*t;float h=map(p);float ds=length(p-dP)-.25;glow+=.011/(.03+ds*ds)*min(h+.05,.4);
    if(h<.002){hit=1.;break;}t+=h*.9;if(t>14.)break;}
  vec3 col=glow*vec3(1.,.56,.2)*.5;float a=clamp(max(col.r,col.g)*1.4,0.,1.);
  if(hit>.5){vec3 p=o+d*t,n=nrm(p);a=1.;
    if(length(p-dP)<.27){float f=pow(max(dot(n,-d),0.),1.6);col=mix(vec3(1.,.62,.08),vec3(1.,.95,.72),f)*1.25;}
    else{vec3 L=dP-p;float dl=length(L);L/=dl;float att=1./(1.+1.1*dl*dl);
      float dif=max(dot(n,L),0.),fr=pow(1.-max(dot(n,-d),0.),3.);vec3 r=reflect(d,n);
      vec3 env=mix(vec3(.05),vec3(.99,.92,.85),smoothstep(-.1,1.,r.y));
      col=vec3(.96,.44,.13)*(.1+2.3*dif*att)+vec3(1.,.55,.16)*att*.55+fr*env*.8+pow(max(dot(r,normalize(vec3(.4,.8,.5))),0.),50.)*vec3(1.,.95,.88)*.9+glow*vec3(1.,.56,.2)*.3;}
    col=col/(1.+col*.35);}
  gl_FragColor=vec4(col*a,a);}`;
  if (g) {
    const mk = (t, s) => { const o = g.createShader(t); g.shaderSource(o, s); g.compileShader(o); if (!g.getShaderParameter(o, g.COMPILE_STATUS)) console.error(g.getShaderInfoLog(o)); return o; };
    const pr = g.createProgram(); g.attachShader(pr, mk(g.VERTEX_SHADER, 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}')); g.attachShader(pr, mk(g.FRAGMENT_SHADER, F3));
    g.bindAttribLocation(pr, 0, 'a'); g.linkProgram(pr); g.useProgram(pr);
    g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer()); g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW);
    g.enableVertexAttribArray(0); g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0);
    const uR = g.getUniformLocation(pr, 'uR'), uA = g.getUniformLocation(pr, 'uA');
    let ax = -.5, ay = .16, vx = .5, vy = 0, drag = false, lx = 0, ly = 0, vis = false, last = 0;
    new IntersectionObserver(e => { vis = e[0].isIntersecting; }).observe(c3);
    c3.addEventListener('pointerdown', e => { drag = true; lx = e.clientX; ly = e.clientY; vx = vy = 0; c3.setPointerCapture(e.pointerId); });
    c3.addEventListener('pointermove', e => { if (!drag) return; const dx = (e.clientX - lx) * .011, dy = (e.clientY - ly) * .011; lx = e.clientX; ly = e.clientY; ax += dx; ay = Math.min(1.35, Math.max(-1.35, ay + dy)); vx = dx * 60; vy = dy * 60; });
    const up = () => { drag = false; }; c3.addEventListener('pointerup', up); c3.addEventListener('pointercancel', up);
    const f3 = now => {
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      if (vis) {
        if (!drag) { vx += ((RM ? 0 : .5) - vx) * .025; vy *= .93; ax += vx * dt; ay = Math.min(1.35, Math.max(-1.35, ay + vy * dt)); ay += (.16 - ay) * .012; }
        const k = Math.min(devicePixelRatio || 1, 1.5), w = Math.round(c3.clientWidth * k);
        if (c3.width !== w) { c3.width = c3.height = w; g.viewport(0, 0, w, w); }
        g.uniform2f(uR, w, w); g.uniform2f(uA, ax, ay); g.clearColor(0, 0, 0, 0); g.clear(g.COLOR_BUFFER_BIT); g.drawArrays(g.TRIANGLES, 0, 3);
      }
      requestAnimationFrame(f3);
    };
    requestAnimationFrame(f3);
  }
}
