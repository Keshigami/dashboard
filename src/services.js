// Single source of truth for the port map. tests/portmap.test.js parses ../PLAN.md and
// checks that PORT_MAP matches it name for name, port for port. Change PLAN.md first.

export const OWNER = {
  name: 'Maximus Friedrich Baluyot',
  headline: 'AI & ML Specialist',
  programme: 'Caltech CTME · Post Graduate Certificate in AI and Machine Learning',
  roles: ['Applied AI Engineer', 'ML Engineer', 'AI Automation Engineer'],
}

// Exactly the rows of the PLAN.md table, in order. `name` is the PLAN.md cell verbatim.
export const PORT_MAP = [
  { name: 'dashboard (React/Vite, links to all)', port: 5173 },
  { name: 'capstone1-vehicle-detection', port: 8101 },
  { name: 'capstone2-structures', port: 8102 },
  { name: 'capstone2-tourism-recommender', port: 8103 },
  { name: 'capstone3-sales-forecast', port: 8104 },
  { name: 'agent-api', port: 8105 },
  { name: 'portfolio/churn_predictor', port: 8111 },
  { name: 'portfolio/ticket_classifier', port: 8112 },
  { name: 'portfolio/internal_kb_qa', port: 8113 },
  { name: 'portfolio/inbox_triage_bot', port: 8114 },
  { name: 'portfolio/model_monitoring_api', port: 8115 },
  { name: 'portfolio/content_ops_assistant', port: 8116 },
  { name: 'portfolio/headstorm_blueprint', port: 8117 },
  { name: 'portfolio/headstorm_menu', port: 8118 },
]

export const SELF_PORT = 5173

// The 13 cards. `id` is the PLAN.md name; `group` is Capstones or a portfolio role.
export const SERVICES = [
  {
    id: 'capstone1-vehicle-detection',
    title: 'Vehicle detection',
    group: 'Capstones',
    tag: 'Capstone 1 · Autonomous driving',
    what: 'Upload a road image; a Keras CNN names the vehicle and draws its bounding box. Part 2 is the Tesla autopilot incident EDA.',
    stack: ['TensorFlow / Keras', 'OpenCV', 'FastAPI'],
    ui: 'FastAPI + upload page',
    tryIt: 'Pick a sample image, press Run, read the box and label.',
  },
  {
    id: 'capstone2-structures',
    title: 'Historical structures',
    group: 'Capstones',
    tag: 'Capstone 2 · Part 1',
    what: 'Transfer-learning classifier (MobileNetV2 / EfficientNet, frozen backbone, dense head with dropout) that tells the category of a heritage structure from a photo.',
    stack: ['TensorFlow', 'Transfer learning', 'FastAPI'],
    ui: 'FastAPI + upload page',
    tryIt: 'Pick a gallery image, get class and confidence.',
  },
  {
    id: 'capstone2-tourism-recommender',
    title: 'Tourism recommender',
    group: 'Capstones',
    tag: 'Capstone 2 · Part 2',
    what: 'EDA on tourists, places and ratings for Indonesia’s five largest cities, then a collaborative and content-based engine that suggests places for a user or a set of interests.',
    stack: ['pandas', 'scikit-learn', 'FastAPI'],
    ui: 'FastAPI + page',
    tryIt: 'Pick a user id or type interests, get ranked places.',
  },
  {
    id: 'capstone3-sales-forecast',
    title: 'Restaurant sales forecast',
    group: 'Capstones',
    tag: 'Capstone 3 · Fresh Analytics',
    what: 'EDA over restaurants, items and daily sales (weekday, month, quarter, best store, best item), then linear regression, random forest, XGBoost and LSTM forecasts per store and item.',
    stack: ['pandas', 'XGBoost', 'LSTM', 'FastAPI'],
    ui: 'FastAPI + HTML dashboard',
    tryIt: 'Choose a store and item, read the forecast chart.',
  },
  {
    id: 'agent-api',
    title: 'Agent API',
    group: 'Capstones',
    tag: 'Capstone · Agent',
    what: 'The capstone agent rebuilt on common/llm.py: POST /ask answers through Anthropic, OpenAI or Gemini from env, or a deterministic offline mode when no key is set.',
    stack: ['FastAPI', 'common/llm.py', 'Anthropic'],
    ui: 'FastAPI /ask + chat page',
    tryIt: 'Type a question, press Run; the badge shows which provider answered.',
  },
  {
    id: 'portfolio/churn_predictor',
    title: 'Telecom churn predictor',
    group: 'ML Engineer',
    tag: 'Tabular classification',
    what: 'Logistic regression baseline against a random forest champion on telecom churn; feature importance explains each probability score.',
    stack: ['scikit-learn', 'pandas', 'Streamlit'],
    ui: 'Streamlit',
    tryIt: 'Use the sample customer, press Predict, read the churn probability.',
  },
  {
    id: 'portfolio/model_monitoring_api',
    title: 'Model monitoring API',
    group: 'ML Engineer',
    tag: 'MLOps',
    what: 'A prediction endpoint instrumented with Prometheus middleware: latency, status codes and score distribution exposed on /metrics.',
    stack: ['FastAPI', 'Prometheus', 'MLOps'],
    ui: 'FastAPI + /metrics',
    tryIt: 'Send a prediction, then open /metrics and find the histogram.',
  },
  {
    id: 'portfolio/ticket_classifier',
    title: 'Support ticket classifier',
    group: 'Applied AI',
    tag: 'LLM structured output',
    what: 'An LLM in JSON mode tags and prioritises a support ticket into structured metadata an inbox can route on.',
    stack: ['FastAPI', 'Pydantic', 'common/llm.py'],
    ui: 'FastAPI + page',
    tryIt: 'Paste a sample ticket, press Run, read tags and priority.',
  },
  {
    id: 'portfolio/internal_kb_qa',
    title: 'Internal KB Q&A',
    group: 'Applied AI',
    tag: 'RAG with citations',
    what: 'Chunks internal PDFs, embeds them locally, retrieves by similarity and answers with grounded citations.',
    stack: ['RAG', 'local embeddings', 'Streamlit'],
    ui: 'Streamlit',
    tryIt: 'Ask the sample question, check the cited passage.',
  },
  {
    id: 'portfolio/inbox_triage_bot',
    title: 'Ops inbox triage bot',
    group: 'AI Automation Engineer',
    tag: 'Workflow automation',
    what: 'Extracts intent and structured metadata from an email, validates it against a schema, then routes it to CRM or Slack.',
    stack: ['Pydantic', 'common/llm.py', 'Streamlit'],
    ui: 'Streamlit',
    tryIt: 'Use a sample email, press Triage, see the route decision.',
  },
  {
    id: 'portfolio/content_ops_assistant',
    title: 'Content ops assistant',
    group: 'AI Automation Engineer',
    tag: 'Multi-channel generation',
    what: 'One campaign brief becomes email, social and ad copy; brand and tone sliders rewrite the system prompt live.',
    stack: ['Prompt templates', 'common/llm.py', 'Streamlit'],
    ui: 'Streamlit',
    tryIt: 'Load the sample brief, move a tone slider, generate.',
  },
  {
    id: 'portfolio/headstorm_blueprint',
    title: 'Blueprint analysis',
    group: 'Computer Vision',
    tag: 'Headstorm AI suite',
    what: 'Three-stage pipeline for architectural drawings: classify the view (EfficientNet-B0), read dimensions and labels (EasyOCR), segment rooms and walls (OpenCV).',
    stack: ['PyTorch', 'EasyOCR', 'OpenCV', 'Gradio'],
    ui: 'Gradio',
    tryIt: 'Click the first example, press Analyze, read the report.',
  },
  {
    id: 'portfolio/headstorm_menu',
    title: 'Menu digitisation',
    group: 'Computer Vision',
    tag: 'Headstorm AI suite',
    what: 'OCR plus spatial line grouping turns a photographed restaurant menu into structured item and price rows; a batch engine scales it to a thousand menus.',
    stack: ['EasyOCR', 'OpenCV', 'Gradio'],
    ui: 'Gradio',
    tryIt: 'Click a sample menu, press Digitise, inspect the table.',
  },
]

export const GROUPS = [
  { key: 'Capstones', label: 'Capstones', sub: 'Caltech CTME PGC AIML' },
  { key: 'Applied AI', label: 'Applied AI', sub: 'NLP, RAG, LLM orchestration' },
  { key: 'ML Engineer', label: 'ML Engineer', sub: 'Tabular modelling, MLOps, service reliability' },
  { key: 'AI Automation Engineer', label: 'AI Automation Engineer', sub: 'Agentic workflows, triage' },
  { key: 'Computer Vision', label: 'Computer Vision', sub: 'Headstorm AI engineering submission' },
]

export function portOf(id) {
  const row = PORT_MAP.find((r) => r.name === id)
  if (!row) throw new Error(`no port for ${id}`)
  return row.port
}
