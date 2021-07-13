import{l as n,f as s,G as a}from"./framework.5c8a4622.js";const o='{"title":"v-show","description":"","frontmatter":{},"headers":[{"level":2,"title":"vShow 在生命周期中改变 display 属性","slug":"vshow-在生命周期中改变-display-属性"},{"level":2,"title":"withDirectives 在 VNode 上增加 dir 属性","slug":"withdirectives-在-vnode-上增加-dir-属性"},{"level":2,"title":"派发更新时 patch，注册 postRenderEffect 事件","slug":"派发更新时-patch，注册-postrendereffect-事件"},{"level":2,"title":"flushJobs 的结束（finally）调用 postRenderEffect","slug":"flushjobs-的结束（finally）调用-postrendereffect"},{"level":2,"title":"总结","slug":"总结"}],"relativePath":"chapter7/v-show.md","lastUpdated":1610980635795}',t={},p=a('<h1 id="v-show"><a class="header-anchor" href="#v-show" aria-hidden="true">#</a> v-show</h1><p>同样地，对于 <code>v-show</code> 指令，我们在 Vue 3 在线模版编译平台输入这样一个栗子：</p><div class="language-javascript"><pre><code><span class="token operator">&lt;</span>div v<span class="token operator">-</span>show<span class="token operator">=</span><span class="token string">&quot;visible&quot;</span><span class="token operator">&gt;</span><span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>\n</code></pre></div><p>那么，由它编译生成的 <code>render</code> 函数：</p><div class="language-javascript"><pre><code><span class="token function">render</span><span class="token punctuation">(</span><span class="token parameter">_ctx<span class="token punctuation">,</span> _cache<span class="token punctuation">,</span> $props<span class="token punctuation">,</span> $setup<span class="token punctuation">,</span> $data<span class="token punctuation">,</span> $options</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">return</span> <span class="token function">_withDirectives</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token function">_openBlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token function">_createBlock</span><span class="token punctuation">(</span><span class="token string">&quot;div&quot;</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token number">512</span> <span class="token comment">/* NEED_PATCH */</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span> \n  <span class="token punctuation">[</span>\n    <span class="token punctuation">[</span>_vShow<span class="token punctuation">,</span> _ctx<span class="token punctuation">.</span>visible<span class="token punctuation">]</span>\n  <span class="token punctuation">]</span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>此时，这个栗子在 <code>visible</code> 为 <code>false</code> 时，渲染到页面上的 HTML： <div align="center"><img width="400" src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b69bbf36d8f5469a84336b0dd0344502~tplv-k3u1fbpfcp-zoom-1.image"></div></p><p>从上面的 <code>render</code> 函数可以看出，不同于 <code>v-if</code> 的三目运算符表达式，<code>v-show</code> 的 <code>render</code> 函数返回的是 <code>_withDirectives()</code> 函数的执行。</p><p>前面，我们已经简单介绍了 <code>_openBlock()</code> 和 <code>_createBlock()</code> 函数。那么，除开这两者，接下来我们逐点分析一下这个 <code>render</code> 函数，首当其冲的是 <code>vShow</code> ～</p><h2 id="vshow-在生命周期中改变-display-属性"><a class="header-anchor" href="#vshow-在生命周期中改变-display-属性" aria-hidden="true">#</a> vShow 在生命周期中改变 display 属性</h2><p><code>_vShow</code> 在源码中则对应着 <code>vShow</code>，它被定义在 <code>packages/runtime-dom/src/directives/vShow</code>。它的职责是对 <code>v-show</code> 指令进行<strong>特殊处理</strong>，主要表现在 <code>beforeMount</code>、<code>mounted</code>、<code>updated</code>、<code>beforeUnMount</code> 这四个生命周期中：</p><div class="language-javascript"><pre><code><span class="token comment">// packages/runtime-dom/src/directives/vShow.ts</span>\n<span class="token keyword">export</span> <span class="token keyword">const</span> vShow<span class="token operator">:</span> ObjectDirective<span class="token operator">&lt;</span>VShowElement<span class="token operator">&gt;</span> <span class="token operator">=</span> <span class="token punctuation">{</span>\n  <span class="token function">beforeMount</span><span class="token punctuation">(</span><span class="token parameter">el<span class="token punctuation">,</span> <span class="token punctuation">{</span> value <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> transition <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    el<span class="token punctuation">.</span>_vod <span class="token operator">=</span> el<span class="token punctuation">.</span>style<span class="token punctuation">.</span>display <span class="token operator">===</span> <span class="token string">&#39;none&#39;</span> <span class="token operator">?</span> <span class="token string">&#39;&#39;</span> <span class="token operator">:</span> el<span class="token punctuation">.</span>style<span class="token punctuation">.</span>display\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>transition <span class="token operator">&amp;&amp;</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 处理 tansition 逻辑</span>\n      <span class="token operator">...</span>\n    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n      <span class="token function">setDisplay</span><span class="token punctuation">(</span>el<span class="token punctuation">,</span> value<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function">mounted</span><span class="token punctuation">(</span><span class="token parameter">el<span class="token punctuation">,</span> <span class="token punctuation">{</span> value <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> transition <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>transition <span class="token operator">&amp;&amp;</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 处理 tansition 逻辑</span>\n      <span class="token operator">...</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function">updated</span><span class="token punctuation">(</span><span class="token parameter">el<span class="token punctuation">,</span> <span class="token punctuation">{</span> value<span class="token punctuation">,</span> oldValue <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> transition <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>value <span class="token operator">===</span> <span class="token operator">!</span>oldValue<span class="token punctuation">)</span> <span class="token keyword">return</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span>transition<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 处理 tansition 逻辑</span>\n      <span class="token operator">...</span>\n    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n      <span class="token function">setDisplay</span><span class="token punctuation">(</span>el<span class="token punctuation">,</span> value<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function">beforeUnmount</span><span class="token punctuation">(</span><span class="token parameter">el<span class="token punctuation">,</span> <span class="token punctuation">{</span> value <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">setDisplay</span><span class="token punctuation">(</span>el<span class="token punctuation">,</span> value<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>对于 <code>v-show</code> 指令会处理两个逻辑：普通 <code>v-show</code> 或 <code>transition</code> 时的 <code>v-show</code> 情况。通常情况下我们只是使用 <code>v-show</code> 指令，<strong>命中的就是前者</strong>。</p><blockquote><p>这里我们只对普通 <code>v-show</code> 情况展开分析。</p></blockquote><p>普通 <code>v-show</code> 情况，都是调用的 <code>setDisplay()</code> 函数，以及会传入两个变量：</p><ul><li><code>el</code> 当前使用 <code>v-show</code> 指令的<strong>真实元素</strong></li><li><code>v-show</code> 指令对应的 <code>value</code> 的值</li></ul><p>接着，我们来看一下 <code>setDisplay()</code> 函数的定义：</p><div class="language-javascript"><pre><code><span class="token keyword">function</span> <span class="token function">setDisplay</span><span class="token punctuation">(</span><span class="token parameter">el<span class="token operator">:</span> VShowElement<span class="token punctuation">,</span> value<span class="token operator">:</span> unknown</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token keyword">void</span> <span class="token punctuation">{</span>\n  el<span class="token punctuation">.</span>style<span class="token punctuation">.</span>display <span class="token operator">=</span> value <span class="token operator">?</span> el<span class="token punctuation">.</span>_vod <span class="token operator">:</span> <span class="token string">&#39;none&#39;</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p><code>setDisplay()</code> 函数正如它本身<strong>命名的语意</strong>一样，是通过改变该元素的 CSS 属性 <code>display</code> 的值来动态的控制 <code>v-show</code> 绑定的元素的<strong>显示</strong>或隐藏。</p><p>并且，我想大家可能注意到了，当 <code>value</code> 为 <code>true</code> 的时候，<code>display</code> 是等于的 <code>el.vod</code>，而 <code>el.vod</code> 则等于这个真实元素的 CSS <code>display</code> 属性（默认情况下为空）。所以，当 <code>v-show</code> 对应的 <code>value</code> 为 <code>true</code> 的时候，<strong>元素显示与否是取决于它本身</strong>的 CSS <code>display</code> 属性。</p><blockquote><p>其实，到这里 <code>v-show</code> 指令的本质在源码中的体现已经出来了。但是，仍然会留有一些疑问，例如 <code>withDirectives</code> 做了什么？<code>vShow</code> 在生命周期中对 <code>v-show</code> 指令的处理又是如何运用的？</p></blockquote><h2 id="withdirectives-在-vnode-上增加-dir-属性"><a class="header-anchor" href="#withdirectives-在-vnode-上增加-dir-属性" aria-hidden="true">#</a> withDirectives 在 VNode 上增加 dir 属性</h2><p><code>withDirectives()</code> 顾名思义和指令相关，即在 Vue 3 中和指令相关的元素，最后生成的 <code>render</code> 函数都会调用 <code>withDirectives()</code> 处理指令相关的逻辑，<strong>将 <code>vShow</code> 的逻辑作为 <code>dir</code> 属性添加</strong>到 <code>VNode</code> 上。</p><p><code>withDirectives()</code> 函数的定义：</p><div class="language-javascript"><pre><code><span class="token comment">// packages/runtime-core/src/directives.ts</span>\n<span class="token keyword">export</span> <span class="token keyword">function</span> withDirectives<span class="token operator">&lt;</span><span class="token constant">T</span> <span class="token keyword">extends</span> <span class="token class-name">VNode</span><span class="token operator">&gt;</span><span class="token punctuation">(</span>\n  vnode<span class="token operator">:</span> <span class="token constant">T</span><span class="token punctuation">,</span>\n  directives<span class="token operator">:</span> DirectiveArguments\n<span class="token punctuation">)</span><span class="token operator">:</span> <span class="token constant">T</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> internalInstance <span class="token operator">=</span> currentRenderingInstance\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>internalInstance <span class="token operator">===</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    __DEV__ <span class="token operator">&amp;&amp;</span> <span class="token function">warn</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">withDirectives can only be used inside render functions.</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n    <span class="token keyword">return</span> vnode\n  <span class="token punctuation">}</span>\n  <span class="token keyword">const</span> instance <span class="token operator">=</span> internalInstance<span class="token punctuation">.</span>proxy\n  <span class="token keyword">const</span> bindings<span class="token operator">:</span> DirectiveBinding<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> vnode<span class="token punctuation">.</span>dirs <span class="token operator">||</span> <span class="token punctuation">(</span>vnode<span class="token punctuation">.</span>dirs <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span>\n  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> directives<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">let</span> <span class="token punctuation">[</span>dir<span class="token punctuation">,</span> value<span class="token punctuation">,</span> arg<span class="token punctuation">,</span> modifiers <span class="token operator">=</span> <span class="token constant">EMPTY_OBJ</span><span class="token punctuation">]</span> <span class="token operator">=</span> directives<span class="token punctuation">[</span>i<span class="token punctuation">]</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isFunction</span><span class="token punctuation">(</span>dir<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token operator">...</span>\n    <span class="token punctuation">}</span>\n    bindings<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      dir<span class="token punctuation">,</span>\n      instance<span class="token punctuation">,</span>\n      value<span class="token punctuation">,</span>\n      oldValue<span class="token operator">:</span> <span class="token keyword">void</span> <span class="token number">0</span><span class="token punctuation">,</span>\n      arg<span class="token punctuation">,</span>\n      modifiers\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token keyword">return</span> vnode\n<span class="token punctuation">}</span>\n</code></pre></div><p>首先，<code>withDirectives()</code> 会获取当前渲染实例处理<strong>边缘条件</strong>，即如果在 <code>render</code> 函数外面使用 <code>withDirectives()</code> 则会抛出异常：</p><blockquote><p>&quot;withDirectives can only be used inside render functions.&quot;</p></blockquote><p>然后，在 <code>vnode</code> 上绑定 <code>dirs</code> 属性，并且遍历传入的 <code>directives</code> 数组，而对于我们这个栗子 <code>directives</code> 就是：</p><div class="language-javascript"><pre><code><span class="token punctuation">[</span>\n  <span class="token punctuation">[</span>_vShow<span class="token punctuation">,</span> _ctx<span class="token punctuation">.</span>visible<span class="token punctuation">]</span>\n<span class="token punctuation">]</span>\n</code></pre></div><p>显然此时只会<strong>迭代一次</strong>（数组长度为 1）。并且从 <code>render</code> 传入的 参数可以知道，从 <code>directives</code> 上解构出的 <code>dir</code> 指的是 <code>_vShow</code>，即我们上面介绍的 <code>vShow</code>。由于 <code>vShow</code> 是一个对象，所以会重新构造（<code>bindings.push()</code>）一个 <code>dir</code> 给 <code>VNode.dir</code>。</p><p><code>VNode.dir</code> 的作用体现在 <code>vShow</code> 在生命周期改变元素的 CSS <code>display</code> 属性，而这些<strong>生命周期会作为派发更新的结束回调被调用</strong>。</p><blockquote><p>接下来，我们一起来看看其中的调用细节～</p></blockquote><h2 id="派发更新时-patch，注册-postrendereffect-事件"><a class="header-anchor" href="#派发更新时-patch，注册-postrendereffect-事件" aria-hidden="true">#</a> 派发更新时 patch，注册 <code>postRenderEffect</code> 事件</h2><p>相信大家应该都知道 Vue 3 提出了 <code>patchFlag</code> 的概念，其用来针对不同的场景来执行对应的 <code>patch</code> 逻辑。那么，对于上面这个栗子，我们会命中 <code>patchElement</code> 的逻辑。</p><p>而对于 <code>v-show</code> 之类的指令来说，由于 <code>Vnode.dir</code> 上绑定了处理元素 CSS <code>display</code> 属性的相关逻辑（ <code>vShow</code> 定义好的生命周期处理）。所以，此时 <code>patchElement()</code> 中会为注册一个 <code>postRenderEffect</code> 事件。</p><div class="language-javascript"><pre><code><span class="token comment">// packages/runtime-core/src/renderer.ts</span>\n<span class="token keyword">const</span> <span class="token function-variable function">patchElement</span> <span class="token operator">=</span> <span class="token punctuation">(</span>\n    <span class="token parameter">n1<span class="token operator">:</span> VNode<span class="token punctuation">,</span>\n    n2<span class="token operator">:</span> VNode<span class="token punctuation">,</span>\n    parentComponent<span class="token operator">:</span> ComponentInternalInstance <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>\n    parentSuspense<span class="token operator">:</span> SuspenseBoundary <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">,</span>\n    isSVG<span class="token operator">:</span> boolean<span class="token punctuation">,</span>\n    optimized<span class="token operator">:</span> boolean</span>\n  <span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n    <span class="token operator">...</span>\n    <span class="token comment">// 此时 dirs 是存在的</span>\n    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>vnodeHook <span class="token operator">=</span> newProps<span class="token punctuation">.</span>onVnodeUpdated<span class="token punctuation">)</span> <span class="token operator">||</span> dirs<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 注册 postRenderEffect 事件</span>\n      <span class="token function">queuePostRenderEffect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n        vnodeHook <span class="token operator">&amp;&amp;</span> <span class="token function">invokeVNodeHook</span><span class="token punctuation">(</span>vnodeHook<span class="token punctuation">,</span> parentComponent<span class="token punctuation">,</span> n2<span class="token punctuation">,</span> n1<span class="token punctuation">)</span>\n        dirs <span class="token operator">&amp;&amp;</span> <span class="token function">invokeDirectiveHook</span><span class="token punctuation">(</span>n2<span class="token punctuation">,</span> n1<span class="token punctuation">,</span> parentComponent<span class="token punctuation">,</span> <span class="token string">&#39;updated&#39;</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span><span class="token punctuation">,</span> parentSuspense<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n    <span class="token operator">...</span>\n  <span class="token punctuation">}</span>\n</code></pre></div><p>这里我们简单分析一下 <code>queuePostRenderEffect()</code> 和 <code>invokeDirectiveHook()</code> 函数：</p><ul><li><p><code>queuePostRenderEffect()</code>，<code>postRenderEffect</code> 事件注册是通过 <code>queuePostRenderEffect()</code> 函数完成的，因为 <code>effect</code> 都是维护在一个队列中（为了保持 <code>effect</code> 的有序），这里是 <code>pendingPostFlushCbs</code>，所以对于 <code>postRenderEffect</code> 也是一样的会被<strong>进队</strong></p></li><li><p><code>invokeDirectiveHook()</code>，由于 <code>vShow</code> 封装了对元素 CSS <code>display</code> 属性的处理，所以 <code>invokeDirective()</code> 的本职是调用指令相关的生命周期处理。并且，需要注意的是此时是<strong>更新逻辑</strong>，所以<strong>只会调用 <code>vShow</code> 中定义好的 <code>update</code> 生命周期</strong></p></li></ul><h2 id="flushjobs-的结束（finally）调用-postrendereffect"><a class="header-anchor" href="#flushjobs-的结束（finally）调用-postrendereffect" aria-hidden="true">#</a> flushJobs 的结束（finally）调用 <code>postRenderEffect</code></h2><p>到这里，我们已经围绕 <code>v-Show</code> 介绍完了 <code>vShow</code>、<code>withDirectives</code>、<code>postRenderEffect</code> 等概念。但是，万事具备只欠东风，还缺少一个<strong>调用 <code>postRenderEffect</code> 事件的时机</strong>，即处理 <code>pendingPostFlushCbs</code> 队列的时机。</p><p>在 Vue 3 中 <code>effect</code> 相当于 Vue 2.x 的 <code>watch</code>。虽然变了个命名，但是仍然保持着一样的调用方式，都是调用的 <code>run()</code> 函数，然后由 <code>flushJobs()</code> 执行 <code>effect</code> 队列。而调用 <code>postRenderEffect</code> 事件的时机<strong>则是在执行队列的结束</strong>。</p><p><code>flushJobs()</code> 函数的定义：</p><div class="language-javascript"><pre><code><span class="token comment">// packages/runtime-core/src/scheduler.ts</span>\n<span class="token keyword">function</span> <span class="token function">flushJobs</span><span class="token punctuation">(</span><span class="token parameter">seen<span class="token operator">?</span><span class="token operator">:</span> CountMap</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  isFlushPending <span class="token operator">=</span> <span class="token boolean">false</span>\n  isFlushing <span class="token operator">=</span> <span class="token boolean">true</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>__DEV__<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    seen <span class="token operator">=</span> seen <span class="token operator">||</span> <span class="token keyword">new</span> <span class="token class-name">Map</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">flushPreFlushCbs</span><span class="token punctuation">(</span>seen<span class="token punctuation">)</span>\n  <span class="token comment">// 对 effect 进行排序</span>\n  queue<span class="token punctuation">.</span><span class="token function">sort</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">getId</span><span class="token punctuation">(</span>a<span class="token operator">!</span><span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token function">getId</span><span class="token punctuation">(</span>b<span class="token operator">!</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n  <span class="token keyword">try</span> <span class="token punctuation">{</span>\n    <span class="token keyword">for</span> <span class="token punctuation">(</span>flushIndex <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> flushIndex <span class="token operator">&lt;</span> queue<span class="token punctuation">.</span>length<span class="token punctuation">;</span> flushIndex<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 执行渲染 effect</span>\n      <span class="token keyword">const</span> job <span class="token operator">=</span> queue<span class="token punctuation">[</span>flushIndex<span class="token punctuation">]</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span>job<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        <span class="token operator">...</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>\n    <span class="token operator">...</span>\n    <span class="token comment">// postRenderEffect 事件的执行时机</span>\n    <span class="token function">flushPostFlushCbs</span><span class="token punctuation">(</span>seen<span class="token punctuation">)</span>\n    <span class="token operator">...</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre></div><p>在 <code>flushJobs()</code> 函数中会执行三种 <code>effect</code> 队列，分别是 <code>preRenderEffect</code>、<code>renderEffect</code>、<code>postRenderEffect</code>，它们各自对应 <code>flushPreFlushCbs()</code>、<code>queue</code>、<code>flushPostFlushCbs</code>。</p><p>那么，显然 <code>postRenderEffect</code> 事件的<strong>调用时机</strong>是在 <code>flushPostFlushCbs()</code>。而 <code>flushPostFlushCbs()</code> 内部则会遍历 <code>pendingPostFlushCbs</code> 队列，即执行之前在 <code>patchElement</code> 时注册的 <code>postRenderEffect</code> 事件，<strong>本质上就是执行</strong>：</p><div class="language-javascript"><pre><code><span class="token function">updated</span><span class="token punctuation">(</span><span class="token parameter">el<span class="token punctuation">,</span> <span class="token punctuation">{</span> value<span class="token punctuation">,</span> oldValue <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> transition <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>value <span class="token operator">===</span> <span class="token operator">!</span>oldValue<span class="token punctuation">)</span> <span class="token keyword">return</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span>transition<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token operator">...</span>\n  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n    <span class="token comment">// 改变元素的 CSS display 属性</span>\n    <span class="token function">setDisplay</span><span class="token punctuation">(</span>el<span class="token punctuation">,</span> value<span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span><span class="token punctuation">,</span>\n</code></pre></div><h2 id="总结"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2><p>相比较 <code>v-if</code> 简单干脆地通过 <code>patch</code> 直接更新元素，<code>v-show</code> 的处理就略显复杂。这里我们重新梳理一下整个过程：</p><ul><li>首先，由 <code>widthDirectives</code> 来生成最终的 <code>VNode</code>。它会给 <code>VNode</code> 上绑定 <code>dir</code> 属性，即 <code>vShow</code> 定义的在生命周期中对元素 CSS <code>display</code> 属性的处理</li><li>其次，在 <code>patchElement</code> 的阶段，会注册 <code>postRenderEffect</code> 事件，用于调用 <code>vShow</code> 定义的 <code>update</code> 生命周期处理 CSS <code>display</code> 属性的逻辑</li><li>最后，在派发更新的结束，调用 <code>postRenderEffect</code> 事件，即执行 <code>vShow</code> 定义的 <code>update</code> 生命周期，更改元素的 CSS <code>display</code> 属性</li></ul><div align="center"><img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a2179d0b950e4de7b319372fb87c52b0~tplv-k3u1fbpfcp-zoom-1.image"></div>',49);t.render=function(a,o,t,e,c,u){return n(),s("div",null,[p])};export default t;export{o as __pageData};
