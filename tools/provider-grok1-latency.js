 1 // tools/provider-grok1-latency.js
 2 import crypto from "node:crypto";
 3 
 4 const now = () => Number(process.hrtime.bigint()) / 1e6; // ms high-resolution
 5 
 6 export async function runGrok1Timed({
 7   apiKey = process.env.GROK_API_KEY,
 8   endpoint = process.env.GROK_API_URL || "https://api.x.ai/v1/chat/completions",
 9   model = "grok-1",
10   prompt,
11   stream = true,
12   max_tokens = 256,
13   temperature = 0.2,
14   metadata = {},
15 }) {
16   if (!apiKey) throw new Error("Missing GROK_API_KEY");
17 
18   const prompt_hash = crypto.createHash("sha256")
19     .update(prompt)
20     .digest("hex")
21     .slice(0, 16);
22 
23   const t0 = now(); // enqueue → before HTTP send
24 
25   const body = {
26     model,
27     messages: [{ role: "user", content: prompt }],
28     max_tokens,
29     temperature,
30     stream
31   };
32 
33   const t1 = now();
34   const res = await fetch(endpoint, {
35     method: "POST",
36     headers: {
37       "Authorization": `Bearer ${apiKey}`,
38       "Content-Type": "application/json"
39     },
40     body: JSON.stringify(body)
41   });
42   const t2 = now();
43 
44   if (!res.ok) {
45     const errTxt = await res.text().catch(()=> "");
46     throw new Error(`Grok1 HTTP ${res.status}: ${errTxt}`);
47   }
48 
49   let t_firstToken = null;
50   let t_lastToken = null;
51   let outText = "";
52   let outputTokens = 0;
53 
54   if (stream) {
55     const reader = res.body.getReader();
56     const decoder = new TextDecoder();
57     let buffer = "";
58     while (true) {
59       const { done, value } = await reader.read();
60       if (done) break;
61       buffer += decoder.decode(value, { stream: true });
62 
63       const lines = buffer.split("\n");
64       buffer = lines.pop();
65       for (const line of lines) {
66         if (!line.startsWith("data:")) continue;
67         const dataStr = line.slice(5).trim();
68         if (dataStr === "[DONE]") { t_lastToken = now(); break; }
69         try {
70           const evt = JSON.parse(dataStr);
71           const delta = evt.choices?.[0]?.delta?.content ?? "";
72           if (delta) {
73             if (!t_firstToken) t_firstToken = now();
74             outText += delta;
75             outputTokens += 1; // rough proxy
76           }
77         } catch {}
78       }
79     }
80     if (!t_lastToken) t_lastToken = now();
81   } else {
82     const json = await res.json();
83     const content = json.choices?.[0]?.message?.content ?? "";
84     t_firstToken = t2;
85     t_lastToken  = now();
86     outText = content;
87     outputTokens = content.split(/\s+/).length; // proxy
88   }
89 
90   const http_connect_ms  = t2 - t1;
91   const client_queue_ms  = t1 - t0;
92   const ttft_ms          = t_firstToken - t1;
93   const gen_duration_ms  = t_lastToken - t_firstToken;
94   const total_ms         = t_lastToken - t0;
95   const tokens_per_s     = outputTokens && gen_duration_ms > 0
96     ? (outputTokens / (gen_duration_ms/1000))
97     : 0;
98 
99   const log = {
100     ts: new Date().toISOString(),
101     provider: "grok-1",
102     model,
103     prompt_hash,
104     http_connect_ms: Math.round(http_connect_ms),
105     client_queue_ms: Math.round(client_queue_ms),
106     ttft_ms: Math.round(ttft_ms),
107     gen_duration_ms: Math.round(gen_duration_ms),
108     total_ms: Math.round(total_ms),
109     output_tokens: outputTokens,
110     tokens_per_s: Number(tokens_per_s.toFixed(2)),
111     ...metadata,
112   };
113 
114   console.log(JSON.stringify({ type: "provider_latency", ...log }));
115 
116   return { text: outText, metrics: log };
117 }

