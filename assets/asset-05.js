/* Black-hole renderer adapted for the Void Portfolio "show".
   Geodesic ray-marched Schwarzschild black hole + bloom (WebGL2).
   Exposes window.BlackHole; camera is driven externally per-frame. */
(function () {
  'use strict';

  var VS = '#version 300 es\nin vec2 aPos;\nvoid main(){ gl_Position = vec4(aPos, 0.0, 1.0); }';

  var SCENE = [
    '#version 300 es',
    'precision highp float;',
    'out vec4 fragColor;',
    'uniform vec2  uRes;',
    'uniform float uTime;',
    'uniform vec3  uCamPos;',
    'uniform mat3  uCamMat;',
    'uniform float uFov;',
    'uniform float uDiskBright;',
    'uniform float uLens;',
    'uniform float uSpin;',
    'uniform float uDiskInner;',
    'uniform float uDiskOuter;',
    'uniform float uDisk;',
    'uniform float uInside;',
    'uniform float uFlash;',
    'uniform float uBgOnly;',
    'uniform float uHiMode;',
    'uniform float uHiAmt;',
    'const float RS = 1.0;',
    'const int   STEPS = 320;',
    'float hash(vec3 p){ p = fract(p*0.3183099 + vec3(0.71,0.113,0.419)); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }',
    'float noise(vec3 x){',
    '  vec3 p = floor(x); vec3 f = fract(x); f = f*f*(3.0-2.0*f);',
    '  return mix(mix(mix(hash(p+vec3(0,0,0)),hash(p+vec3(1,0,0)),f.x),',
    '                 mix(hash(p+vec3(0,1,0)),hash(p+vec3(1,1,0)),f.x),f.y),',
    '             mix(mix(hash(p+vec3(0,0,1)),hash(p+vec3(1,0,1)),f.x),',
    '                 mix(hash(p+vec3(0,1,1)),hash(p+vec3(1,1,1)),f.x),f.y),f.z);',
    '}',
    'float fbm(vec3 p){ float v=0.0, a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.03; a*=0.5; } return v; }',
    'vec3 starfield(vec3 dir){',
    '  vec3 col = vec3(0.0);',
    '  float n  = fbm(dir*2.6 + 4.0);',
    '  float n2 = fbm(dir*5.5 - 8.0);',
    '  vec3 neb = mix(vec3(0.005,0.013,0.017), vec3(0.010,0.044,0.055), smoothstep(0.3,0.85,n));',
    '  neb += vec3(0.018,0.075,0.090) * pow(max(n2,0.0),3.2) * 0.5;',
    '  neb += vec3(0.008,0.040,0.058) * pow(max(fbm(dir*3.2+20.0),0.0),2.2);',
    '  col += neb*0.5;',
    '  for(int k=0;k<3;k++){',
    '    float scale = 90.0 + float(k)*150.0;',
    '    vec3 g = dir*scale;',
    '    vec3 id = floor(g);',
    '    float h = hash(id + float(k)*23.0);',
    '    float thresh = 0.945;',
    '    if(h > thresh){',
    '      vec3 f = fract(g) - 0.5;',
    '      float d = length(f);',
    '      float star = smoothstep(0.16, 0.0, d);',
    '      float tw = 0.55 + 0.45*sin(uTime*1.8 + h*120.0);',
    '      vec3 sc = mix(vec3(0.58,0.88,1.0), vec3(0.90,0.97,0.94), hash(id+7.0));',
    '      col += sc * star * tw * (h-thresh) * 30.0;',
    '    }',
    '  }',
    '  return col;',
    '}',
    'vec3 blackbody(float t){',
    '  vec3 c = mix(vec3(1.0,0.30,0.06), vec3(1.0,0.62,0.22), smoothstep(0.0,0.38,t));',
    '  c = mix(c, vec3(1.0,0.93,0.78), smoothstep(0.38,0.74,t));',
    '  c = mix(c, vec3(0.78,0.87,1.0), smoothstep(0.74,1.0,t));',
    '  return c;',
    '}',
    'void main(){',
    '  vec2 uv = (gl_FragCoord.xy*2.0 - uRes) / uRes.y;',
    '  vec3 rd = normalize(uCamMat * vec3(uv*uFov, 1.0));',
    '  if(uBgOnly > 0.5){ fragColor = vec4(max(starfield(rd) * uDiskBright, 0.0), 1.0); return; }',
    '  vec3 pos = uCamPos;',
    '  vec3 dir = rd;',
    '  vec3 angmom = cross(pos, dir);',
    '  float h2 = dot(angmom, angmom);',
    '  vec3 col = vec3(0.0);',
    '  float transmit = 1.0;',
    '  float hglow = 0.0;',
    '  bool captured = false;',
    '  for(int i=0;i<STEPS;i++){',
    '    float r2 = dot(pos,pos);',
    '    float r  = sqrt(r2);',
    '    if(r < RS){ captured = true; break; }',
    '    if(r > 42.0 && dot(dir,pos) > 0.0) break;',
    '    float dt = clamp(r*0.075, 0.012, 0.55);',
    '    if(uHiAmt > 0.001){',
    '      if(uHiMode > 3.5 && uHiMode < 4.5) hglow += smoothstep(0.5, 0.0, abs(r - 1.5)) * dt * transmit;',
    '      if(uHiMode > 4.5) hglow += smoothstep(0.2, 0.0, abs(r - 1.06)) * dt * transmit;',
    '    }',
    '    vec3 accel = -uLens * 1.5 * h2 * pos / pow(r2, 2.5);',
    '    vec3 ndir = normalize(dir + accel*dt);',
    '    vec3 npos = pos + ndir*dt;',
    '    if(pos.y*npos.y < 0.0){',
    '      float tt = pos.y / (pos.y - npos.y);',
    '      vec3 hit = mix(pos, npos, tt);',
    '      float rr = length(hit.xz);',
    '      if(rr > uDiskInner && rr < uDiskOuter){',
    '        float tnorm = 1.0 - (rr - uDiskInner)/(uDiskOuter - uDiskInner);',
    '        float ang = atan(hit.z, hit.x);',
    '        float rot = uTime*uSpin*2.2 / pow(rr,1.5);',
    '        vec3 sp = vec3(cos(ang+rot), sin(ang+rot), 0.0)*rr;',
    '        float swirl  = fbm(sp*0.55 + vec3(0,0,rr*0.4));',
    '        float swirl2 = fbm(vec3(cos(ang*3.0+rot*2.2), sin(ang*3.0+rot*2.2), rr*0.6)*1.6);',
    '        float dens = pow(clamp(swirl*0.75 + swirl2*0.55, 0.0, 1.0), 1.7);',
    '        float outer = smoothstep(uDiskOuter, uDiskOuter - (uDiskOuter-uDiskInner)*0.45, rr);',
    '        float inner = smoothstep(uDiskInner, uDiskInner+0.5, rr);',
    '        float intensity = dens * outer * inner * uDisk;',
    '        vec3 vel = normalize(cross(vec3(0.0,1.0,0.0), hit));',
    '        float orb = 0.52 / sqrt(rr);',
    '        float beta = dot(vel, -dir) * orb;',
    '        float doppler = 1.0 / max(1.0 - beta, 0.05);',
    '        float beam = pow(doppler, 3.2);',
    '        vec3 dcol = blackbody(tnorm);',
    '        dcol = mix(dcol, dcol*vec3(0.62,0.80,1.3), clamp(beta*2.2, 0.0, 0.65));',
    '        float emit = intensity * uDiskBright * beam * (0.5 + tnorm*3.2);',
    '        if(uHiAmt > 0.001 && uHiMode > 0.5 && uHiMode < 3.5){',
    '          float hi = 1.0;',
    '          if(uHiMode > 1.5 && uHiMode < 2.5) hi = smoothstep(0.15, -0.3, dot(normalize(hit), normalize(uCamPos)));',
    '          else if(uHiMode > 2.5) hi = clamp(beta*3.5, 0.0, 1.0);',
    '          dcol = mix(dcol, vec3(1.0,0.10,0.08), hi*uHiAmt*0.8);',
    '          emit *= 1.0 + hi*uHiAmt*0.7;',
    '        }',
    '        col += transmit * dcol * emit;',
    '        transmit *= clamp(1.0 - intensity*1.15, 0.0, 1.0);',
    '      }',
    '    }',
    '    pos = npos; dir = ndir;',
    '    if(transmit < 0.02) break;',
    '  }',
    '  if(!captured) col += transmit * starfield(dir);',
    '  if(uHiAmt > 0.001){',
    '    col += vec3(1.0,0.12,0.08) * hglow * uHiAmt * 0.9;',
    '    if(captured && uHiMode > 4.5) col += vec3(0.7,0.05,0.04) * uHiAmt * 0.45;',
    '  }',
    '  if(uInside > 0.001){',
    '    float rr = length(uv);',
    '    float ang = atan(uv.y, uv.x);',
    '    vec3 tcol = vec3(0.0);',
    '    float streak = pow(abs(sin(ang*12.0 + uTime*1.5 + rr*4.0)), 20.0);',
    '    tcol += vec3(0.55,0.7,1.0) * streak * (0.4 + 0.6*smoothstep(0.1,0.8,rr));',
    '    float streak2 = pow(abs(sin(ang*7.0 - uTime*2.3)), 30.0);',
    '    tcol += vec3(0.9,0.5,0.85) * streak2 * smoothstep(0.15,0.9,rr) * 0.8;',
    '    float rings = 0.5 + 0.5*sin(rr*40.0 - uTime*6.0);',
    '    tcol += vec3(0.8,0.35,0.65) * pow(rings,6.0) * 0.35 * (1.0 - smoothstep(0.0,0.9,rr));',
    '    tcol += vec3(1.0,0.9,0.7) * pow(max(0.0, 1.0 - rr*2.2), 4.0) * (0.6 + 0.4*sin(uTime*3.0));',
    '    tcol *= 0.75 + 0.25*sin(uTime*8.0 + rr*25.0);',
    '    col = mix(col, tcol, uInside);',
    '  }',
    '  col = mix(col, vec3(1.0), clamp(uFlash, 0.0, 1.0));',
    '  fragColor = vec4(max(col, 0.0), 1.0);',
    '}'
  ].join('\n');

  var BLUR = [
    '#version 300 es',
    'precision highp float;',
    'out vec4 fragColor;',
    'uniform sampler2D uTex;',
    'uniform vec2 uTexel;',
    'uniform vec2 uDir;',
    'uniform float uThreshold;',
    'void main(){',
    '  vec2 uv = gl_FragCoord.xy * uTexel;',
    '  float w[5];',
    '  w[0]=0.227027; w[1]=0.194595; w[2]=0.121622; w[3]=0.054054; w[4]=0.016216;',
    '  vec2 step = uDir * uTexel;',
    '  vec3 c = texture(uTex, uv).rgb * w[0];',
    '  for(int i=1;i<5;i++){',
    '    float fi = float(i);',
    '    c += texture(uTex, uv + step*fi).rgb * w[i];',
    '    c += texture(uTex, uv - step*fi).rgb * w[i];',
    '  }',
    '  if(uThreshold >= 0.0){',
    '    float l = max(max(c.r,c.g),c.b);',
    '    c *= smoothstep(uThreshold, uThreshold+0.6, l);',
    '  }',
    '  fragColor = vec4(c, 1.0);',
    '}'
  ].join('\n');

  var COMP = [
    '#version 300 es',
    'precision highp float;',
    'out vec4 fragColor;',
    'uniform sampler2D uScene;',
    'uniform sampler2D uBloom;',
    'uniform vec2 uRes;',
    'uniform float uBloomStr;',
    'uniform float uExposure;',
    'vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14), 0.0, 1.0); }',
    'float h21(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }',
    'void main(){',
    '  vec2 uv = gl_FragCoord.xy / uRes;',
    '  vec3 scene = texture(uScene, uv).rgb;',
    '  vec3 bloom = texture(uBloom, uv).rgb;',
    '  vec3 col = scene + bloom * uBloomStr;',
    '  col *= uExposure;',
    '  col = aces(col);',
    '  vec2 q = uv - 0.5;',
    '  col *= 1.0 - dot(q,q)*0.55;',
    '  col = pow(max(col,0.0), vec3(1.0/2.2));',
    '  col += (h21(gl_FragCoord.xy) - 0.5)/255.0;',
    '  fragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  function BlackHole(canvas) {
    this.canvas = canvas;
    this.ok = false;
    try { this._init(); this.ok = true; } catch (e) { console.error('BlackHole init failed:', e); }
  }

  BlackHole.prototype._init = function () {
    var gl = this.gl = this.canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) throw new Error('WebGL2 unavailable');
    this.floatRender = !!gl.getExtension('EXT_color_buffer_float');
    this.floatLinear = !!gl.getExtension('OES_texture_half_float_linear') || this.floatRender;

    var self = this;
    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    }
    function program(fsrc) {
      var p = gl.createProgram();
      gl.attachShader(p, compile(gl.VERTEX_SHADER, VS));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fsrc));
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
      return p;
    }
    this.progScene = program(SCENE);
    this.progBlur = program(BLUR);
    this.progComp = program(COMP);

    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(this.progScene, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    this.uS = {}; this.uBl = {}; this.uC = {};
    ['uRes', 'uTime', 'uCamPos', 'uCamMat', 'uFov', 'uDiskBright', 'uLens', 'uSpin', 'uDiskInner', 'uDiskOuter', 'uDisk', 'uInside', 'uFlash', 'uBgOnly', 'uHiMode', 'uHiAmt']
      .forEach(function (n) { self.uS[n] = gl.getUniformLocation(self.progScene, n); });
    ['uTex', 'uTexel', 'uDir', 'uThreshold'].forEach(function (n) { self.uBl[n] = gl.getUniformLocation(self.progBlur, n); });
    ['uScene', 'uBloom', 'uRes', 'uBloomStr', 'uExposure'].forEach(function (n) { self.uC[n] = gl.getUniformLocation(self.progComp, n); });

    this.resize();
  };

  BlackHole.prototype._makeTarget = function (w, h) {
    var gl = this.gl;
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    if (this.floatRender) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }
    var filt = (this.floatRender && !this.floatLinear) ? gl.NEAREST : gl.LINEAR;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filt);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filt);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    var fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { tex: tex, fb: fb, w: w, h: h };
  };

  BlackHole.prototype.resize = function () {
    var gl = this.gl; if (!gl) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var cw = this.canvas.clientWidth || window.innerWidth;
    var ch = this.canvas.clientHeight || window.innerHeight;
    var scale = Math.min(1, 1400 / (Math.max(cw, ch) * dpr)) * (this.renderScale || 1);
    this.W = Math.max(2, Math.floor(cw * dpr * scale));
    this.H = Math.max(2, Math.floor(ch * dpr * scale));
    this.canvas.width = this.W; this.canvas.height = this.H;
    this.bW = Math.max(2, Math.floor(this.W / 2));
    this.bH = Math.max(2, Math.floor(this.H / 2));
    this.sceneTarget = this._makeTarget(this.W, this.H);
    this.bloomA = this._makeTarget(this.bW, this.bH);
    this.bloomB = this._makeTarget(this.bW, this.bH);
  };

  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function norm(v) { var l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }

  /* o: { time, dist, yaw, pitch, inside, flash, disk, bright, spin, lens } */
  BlackHole.prototype.render = function (o) {
    var gl = this.gl; if (!gl || !this.ok) return;
    var W = this.W, H = this.H, bW = this.bW, bH = this.bH;

    var cy = Math.sin(o.pitch) * o.dist;
    var cxz = Math.cos(o.pitch) * o.dist;
    var camPos = [Math.cos(o.yaw) * cxz, cy, Math.sin(o.yaw) * cxz];
    var fwd = norm([-camPos[0], -camPos[1], -camPos[2]]);
    var right = norm(cross(fwd, [0, 1, 0]));
    if (!isFinite(right[0])) right = [1, 0, 0];
    var up = cross(right, fwd);
    var mat = [right[0], right[1], right[2], up[0], up[1], up[2], fwd[0], fwd[1], fwd[2]];

    var inner = o.diskInner != null ? o.diskInner : 2.55;
    var outer = o.diskOuter != null ? o.diskOuter : 8.95;

    gl.useProgram(this.progScene);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.sceneTarget.fb);
    gl.viewport(0, 0, W, H);
    gl.uniform2f(this.uS.uRes, W, H);
    gl.uniform1f(this.uS.uTime, o.time);
    gl.uniform3fv(this.uS.uCamPos, camPos);
    gl.uniformMatrix3fv(this.uS.uCamMat, false, mat);
    gl.uniform1f(this.uS.uFov, 0.62);
    gl.uniform1f(this.uS.uDiskBright, o.bright != null ? o.bright : 1.05);
    gl.uniform1f(this.uS.uLens, o.lens != null ? o.lens : 1.0);
    gl.uniform1f(this.uS.uSpin, o.spin != null ? o.spin : 1.0);
    gl.uniform1f(this.uS.uDiskInner, inner);
    gl.uniform1f(this.uS.uDiskOuter, outer);
    gl.uniform1f(this.uS.uDisk, o.disk != null ? o.disk : 1.0);
    gl.uniform1f(this.uS.uInside, o.inside || 0);
    gl.uniform1f(this.uS.uFlash, o.flash || 0);
    gl.uniform1f(this.uS.uBgOnly, o.bgOnly ? 1.0 : 0.0);
    gl.uniform1f(this.uS.uHiMode, o.hiMode || 0);
    gl.uniform1f(this.uS.uHiAmt, o.hiAmt || 0);
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.useProgram(this.progBlur);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.bloomA.fb);
    gl.viewport(0, 0, bW, bH);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.sceneTarget.tex);
    gl.uniform1i(this.uBl.uTex, 0);
    gl.uniform2f(this.uBl.uTexel, 1 / bW, 1 / bH);
    gl.uniform2f(this.uBl.uDir, 1.4, 0.0);
    gl.uniform1f(this.uBl.uThreshold, 0.85);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.bloomB.fb);
    gl.bindTexture(gl.TEXTURE_2D, this.bloomA.tex);
    gl.uniform2f(this.uBl.uDir, 0.0, 1.4);
    gl.uniform1f(this.uBl.uThreshold, -1.0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.bloomA.fb);
    gl.bindTexture(gl.TEXTURE_2D, this.bloomB.tex);
    gl.uniform2f(this.uBl.uDir, 2.6, 0.0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.bloomB.fb);
    gl.bindTexture(gl.TEXTURE_2D, this.bloomA.tex);
    gl.uniform2f(this.uBl.uDir, 0.0, 2.6);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.useProgram(this.progComp);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, W, H);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.sceneTarget.tex);
    gl.uniform1i(this.uC.uScene, 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.bloomB.tex);
    gl.uniform1i(this.uC.uBloom, 1);
    gl.uniform2f(this.uC.uRes, W, H);
    gl.uniform1f(this.uC.uBloomStr, 0.95);
    gl.uniform1f(this.uC.uExposure, 1.7);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  window.BlackHole = BlackHole;
})();
