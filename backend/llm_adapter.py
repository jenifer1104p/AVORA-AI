"""Optional local LLM adapter. Works with LM Studio or llama.cpp server's OpenAI-compatible API.
No Ollama dependency. If not configured, AVORA's ML/NLP features work without it.
"""
import os, requests
def ask_local_llm(prompt):
    base=os.getenv('LOCAL_LLM_BASE_URL','').strip()
    if not base:return {'enabled':False,'message':'Optional local LLM is not configured. ML features remain available.'}
    try:
        r=requests.post(base.rstrip('/')+'/chat/completions',headers={'Authorization':'Bearer '+os.getenv('LOCAL_LLM_API_KEY','not-needed')},json={'model':os.getenv('LOCAL_LLM_MODEL','local-model'),'messages':[{'role':'system','content':'You are AVORA, a careful career development assistant. Do not invent qualifications or guarantee hiring outcomes.'},{'role':'user','content':prompt}],'temperature':0.4},timeout=90)
        r.raise_for_status(); data=r.json(); return {'enabled':True,'answer':data['choices'][0]['message']['content']}
    except Exception as e:return {'enabled':True,'error':'Local model request failed: '+str(e)}
