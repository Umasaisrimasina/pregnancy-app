# Design Document: NurtureNet Platform

## Document Control

**Version:** 1.0  
**Status:** Draft for Review  
**Last Updated:** 2024  
**Classification:** Confidential - Healthcare Architecture  
**Target Audience:** Technical Architects, Healthcare System Administrators, Regulatory Reviewers

---

## Executive Summary

The NurtureNet Platform is a cloud-native, AI-powered maternal risk stratification and care navigation system architected for deployment in the Indian healthcare ecosystem. This design document specifies a serverless, multi-tenant architecture leveraging Amazon Web Services (AWS) managed services and Amazon Bedrock foundation models to deliver probabilistic risk assessment, explainable AI reasoning, and context-aware clinical decision support.

**Hackathon Alignment:** This solution directly addresses the "AI for Healthcare & Life Sciences" hackathon challenge by improving efficiency, understanding, and support within maternal healthcare ecosystems through responsible AI deployment.

The platform addresses critical maternal healthcare delivery gaps through three core architectural pillars:

1. **Intelligent Risk Stratification**: Continuous, AI-driven risk scoring using longitudinal symptom data, clinical vitals, and mental health indicators
2. **Multilingual Accessibility**: Native support for 11 Indian languages with voice interaction capabilities for low-literacy populations
3. **Privacy-Preserving Architecture**: Healthcare-grade security controls with encryption, role-based access, and audit logging

This architecture is designed for national-scale deployment supporting 100,000+ concurrent patients across rural and urban healthcare settings while maintaining sub-2-second response times and 99.9% availability.

### Critical Declarations

**🔒 Data Usage:** This platform is developed and validated using 100% synthetic data and publicly available medical guidelines. NO real patient data is used in development, training, or testing phases.

**⚠️ System Limitations:** This is a clinical decision-support tool, NOT a diagnostic medical device. It cannot replace physician judgment, is not intended for emergency use, and all AI outputs include explicit disclaimers.

**✓ Regulatory Positioning:** Classified as Clinical Decision Support Software (CDSS), not subject to medical device regulations. Compliant with India's Digital Personal Data Protection Act (DPDPA) 2023.

---

## System Overview

### Purpose and Scope

The NurtureNet Platform serves as a clinical decision-support system (not a diagnostic medical device) that enables:


- **Early Detection**: Identification of maternal complication risk patterns through weekly symptom monitoring and AI-powered trend analysis
- **Care Navigation**: Context-aware guidance for pregnant women, ASHA workers, and physicians on appropriate escalation pathways
- **Specialist Access**: Bridging the rural-urban healthcare gap through AI-generated clinical summaries and telehealth integration
- **Mental Health Monitoring**: Automated sentiment analysis of patient journals for perinatal depression and anxiety screening
- **Nutritional Intelligence**: AI-powered dietary analysis and culturally-appropriate nutritional guidance

### Design Principles

The architecture adheres to the following foundational principles:

1. **Privacy by Design**: All health data encrypted at rest and in transit; row-level security; minimal data retention
2. **Responsible AI**: Hallucination mitigation, explainability, human-in-the-loop for critical decisions, explicit disclaimers
3. **Equity and Fairness**: Multilingual support, offline-first design, bias monitoring, culturally-appropriate content
4. **Clinical Safety**: Conservative risk thresholds, multiple escalation pathways, non-diagnostic positioning
5. **Operational Resilience**: Multi-AZ deployment, automated failover, circuit breakers, comprehensive monitoring
6. **Scalability**: Serverless architecture, auto-scaling data stores, stateless compute, multi-tenant isolation

### Key Stakeholders and Use Cases

**Primary Users:**
- **Pregnant Women**: Self-monitoring, symptom tracking, AI assistant interactions, care navigation
- **ASHA Workers**: Patient data collection, risk assessment, escalation decision support
- **Primary Care Physicians**: Patient list management, risk-stratified triage, AI-generated summaries
- **Obstetricians**: Referral review, telehealth consultations, longitudinal risk trajectory analysis

**System Administrators:**
- **Healthcare IT Teams**: Multi-tenant provisioning, configuration management, user administration
- **Platform Engineers**: Infrastructure monitoring, incident response, performance optimization
- **Compliance Officers**: Audit log review, privacy controls verification, regulatory reporting

---

## High-Level Architecture

### Architectural Style

The NurtureNet Platform employs a **serverless, event-driven microservices architecture** with the following characteristics:


- **Compute Layer**: AWS Lambda functions for stateless, auto-scaling request processing
- **API Layer**: Amazon API Gateway for RESTful API management, request routing, and throttling
- **Data Layer**: Amazon DynamoDB for NoSQL health data storage; Amazon S3 for document storage
- **AI Layer**: Amazon Bedrock for foundation model inference; custom prompt engineering for domain adaptation
- **Identity Layer**: Amazon Cognito for user authentication, authorization, and JWT token management
- **Integration Layer**: Amazon Translate for multilingual support; Amazon Polly for text-to-speech
- **Observability Layer**: Amazon CloudWatch for logging, metrics, alarms, and distributed tracing

### Deployment Model

**Multi-Tenant SaaS Architecture:**
- Logical data isolation per healthcare organization (tenant)
- Shared compute and AI infrastructure for cost efficiency
- Per-tenant configuration for risk thresholds, branding, and workflows
- Tenant-scoped IAM policies preventing cross-tenant data access

**Geographic Distribution:**
- Primary deployment in AWS Asia Pacific (Mumbai) region for data residency compliance
- Multi-Availability Zone (Multi-AZ) deployment for fault tolerance
- CloudFront CDN for static asset delivery and latency reduction
- Future expansion to additional Indian regions for disaster recovery

### Integration Points

**External Systems:**
- **SMS Gateway**: Integration with AWS SNS for SMS notifications to ASHA workers and patients
- **Email Service**: Amazon SES for physician digest emails and system notifications
- **Telehealth Platforms**: REST API webhooks for patient summary export to video consultation systems
- **Health Information Exchanges**: HL7 FHIR-compliant API endpoints for interoperability (future)

**Third-Party Services:**
- **Payment Gateway**: Integration for premium feature subscriptions (future commercial model)
- **Analytics Platform**: Data export to business intelligence tools for population health analytics
- **Identity Providers**: SAML/OAuth federation with hospital identity systems

---

## AWS Architecture Breakdown

### Amazon API Gateway

**Role:** Unified API management layer serving as the entry point for all client requests.

**Configuration:**
- **API Type**: REST API with regional endpoint
- **Authentication**: AWS IAM authorization with Cognito User Pool authorizer
- **Throttling**: 10,000 requests per second per tenant with burst capacity of 5,000
- **Request Validation**: JSON schema validation for all POST/PUT requests
- **CORS**: Configured for web and mobile client origins


**API Resources:**
```
/auth
  POST /login - User authentication
  POST /refresh - Token refresh
  POST /logout - Session termination

/patients
  GET /patients - List patients (physician/ASHA view)
  GET /patients/{id} - Retrieve patient record
  POST /patients - Create patient profile
  PUT /patients/{id} - Update patient profile

/checkins
  POST /checkins - Submit symptom check-in
  GET /checkins/{patientId} - Retrieve check-in history

/risk
  GET /risk/{patientId} - Get current risk score
  GET /risk/{patientId}/trajectory - Get risk time-series
  GET /risk/{patientId}/explanation - Get risk justification

/assistant
  POST /assistant/chat - Maternal assistant conversation
  GET /assistant/history/{patientId} - Conversation history

/journal
  POST /journal/entries - Submit journal entry
  GET /journal/entries/{patientId} - Retrieve journal entries
  GET /journal/sentiment/{patientId} - Get sentiment analysis

/nutrition
  POST /nutrition/analyze - Analyze meal description
  GET /nutrition/recommendations/{patientId} - Get dietary guidance

/clinical
  GET /clinical/summary/{patientId} - AI-generated patient summary
  POST /clinical/notes - Physician consultation notes
  GET /clinical/dashboard - Risk-stratified patient list

/escalations
  GET /escalations - List active escalations
  POST /escalations/{id}/acknowledge - Acknowledge escalation
  POST /escalations/{id}/resolve - Mark escalation resolved

/admin
  POST /admin/tenants - Create new tenant
  PUT /admin/tenants/{id} - Update tenant configuration
  GET /admin/metrics - Platform usage metrics
```

**Security Controls:**
- TLS 1.3 encryption for all traffic
- API key rotation every 90 days
- Rate limiting per user and per tenant
- Request/response logging to CloudWatch
- WAF integration for DDoS protection and SQL injection prevention

---

### AWS Lambda Functions

**Role:** Serverless compute layer executing business logic, AI orchestration, and data processing.

**Function Inventory:**


1. **AuthHandler** (Runtime: Python 3.11, Memory: 512MB, Timeout: 10s)
   - Validates Cognito JWT tokens
   - Enforces role-based access control
   - Logs authentication events

2. **CheckinProcessor** (Runtime: Python 3.11, Memory: 1024MB, Timeout: 30s)
   - Validates symptom check-in data
   - Persists to DynamoDB
   - Triggers RiskCalculator via EventBridge

3. **RiskCalculator** (Runtime: Python 3.11, Memory: 2048MB, Timeout: 60s)
   - Invokes Bedrock foundation model for risk scoring
   - Computes risk trajectory
   - Generates explainability output
   - Triggers escalation logic if thresholds exceeded

4. **MaternalAssistant** (Runtime: Python 3.11, Memory: 2048MB, Timeout: 60s)
   - Orchestrates conversational AI via Bedrock
   - Implements hallucination detection
   - Applies medical disclaimer injection
   - Detects emergency keywords and triggers escalation

5. **ClinicalSummarizer** (Runtime: Python 3.11, Memory: 2048MB, Timeout: 45s)
   - Aggregates patient data from DynamoDB
   - Generates AI summary via Bedrock
   - Caches summaries in ElastiCache (future optimization)

6. **SentimentAnalyzer** (Runtime: Python 3.11, Memory: 1024MB, Timeout: 30s)
   - Analyzes journal entries via Bedrock
   - Detects negative sentiment streaks
   - Flags suicidal ideation keywords
   - Triggers mental health escalation

7. **NutrientExtractor** (Runtime: Python 3.11, Memory: 1024MB, Timeout: 30s)
   - Parses meal descriptions via Bedrock
   - Estimates macronutrient and micronutrient content
   - Compares against pregnancy dietary guidelines
   - Generates culturally-appropriate recommendations

8. **EscalationRouter** (Runtime: Python 3.11, Memory: 512MB, Timeout: 15s)
   - Evaluates escalation rules
   - Sends notifications via SNS (SMS) and SES (email)
   - Logs escalation events
   - Updates patient escalation status

9. **TranslationProxy** (Runtime: Python 3.11, Memory: 512MB, Timeout: 20s)
   - Invokes Amazon Translate for UI text and AI responses
   - Caches translations in DynamoDB for cost optimization
   - Handles language detection and fallback logic

10. **TTSGenerator** (Runtime: Python 3.11, Memory: 512MB, Timeout: 20s)
    - Invokes Amazon Polly for text-to-speech
    - Stores audio files in S3 with signed URLs
    - Supports 11 Indian language voices


11. **ReportGenerator** (Runtime: Python 3.11, Memory: 1024MB, Timeout: 45s)
    - Generates PDF patient summaries
    - Stores reports in S3
    - Returns pre-signed download URLs

12. **MetricsAggregator** (Runtime: Python 3.11, Memory: 512MB, Timeout: 30s)
    - Scheduled daily via EventBridge
    - Computes platform usage metrics
    - Generates physician digest emails
    - Publishes custom CloudWatch metrics

**Lambda Configuration Best Practices:**
- Environment variables for configuration (Bedrock model IDs, DynamoDB table names)
- AWS X-Ray tracing enabled for distributed debugging
- Reserved concurrency for critical functions (RiskCalculator, EscalationRouter)
- Dead letter queues (SQS) for failed invocations
- VPC integration for future RDS connectivity (currently not required)

---

### Amazon Bedrock

**Role:** Managed foundation model service providing AI reasoning, natural language understanding, and content generation.

**Model Selection:**
- **Primary Model**: Anthropic Claude 3 Sonnet (claude-3-sonnet-20240229)
  - Reasoning: Strong medical reasoning, low hallucination rate, multilingual support
  - Use Cases: Risk scoring, clinical summaries, maternal assistant, explainability
  - Configuration: Temperature 0.2 (factual accuracy), max tokens 2048

- **Secondary Model**: Amazon Titan Text Embeddings (amazon.titan-embed-text-v1)
  - Use Cases: Semantic search over medical knowledge base, similarity matching
  - Configuration: 1536-dimensional embeddings

**Prompt Engineering Strategy:**

1. **Risk Scoring Prompt Template:**
```
You are a maternal health risk assessment AI. Analyze the following patient data and provide a risk score (0-100) with confidence interval and clinical justification.

Patient Data:
- Gestational Week: {gestational_week}
- Blood Pressure: {bp_systolic}/{bp_diastolic} mmHg
- Blood Glucose: {glucose} mg/dL
- Sleep Hours: {sleep_hours}
- Fatigue Level: {fatigue_level}/10
- Mood Score: {mood_score}/10
- Previous Risk Score: {previous_risk_score}
- Medical History: {medical_history}

Guidelines:
- Preeclampsia risk increases with BP >140/90
- Gestational diabetes risk increases with fasting glucose >95 mg/dL
- Mental health concerns with mood score <4 for 3+ weeks
- Provide specific clinical factors contributing to risk
- Include confidence level (low/medium/high)
- Suggest monitoring frequency

Output Format (JSON):
{
  "risk_score": <0-100>,
  "confidence": "<low|medium|high>",
  "risk_category": "<low|moderate|high>",
  "contributing_factors": ["factor1", "factor2"],
  "clinical_justification": "<explanation>",
  "recommended_actions": ["action1", "action2"]
}
```


2. **Maternal Assistant Prompt Template:**
```
You are a supportive maternal health assistant for pregnant women in India. Provide helpful, culturally-appropriate guidance while maintaining safety boundaries.

Context:
- Patient Risk Level: {risk_level}
- Gestational Week: {gestational_week}
- Language: {language}
- Recent Symptoms: {recent_symptoms}

User Question: {user_question}

Guidelines:
- Use warm, reassuring tone for low-risk patients; cautious tone for high-risk
- Provide culturally-appropriate advice respecting Indian dietary and cultural practices
- NEVER provide medication dosing or diagnostic conclusions
- For emergency symptoms (severe headache, vision changes, severe abdominal pain, bleeding, reduced fetal movement), immediately advise seeking medical care
- Include disclaimer: "This is general guidance. Always consult your healthcare provider for medical advice."
- If question is outside maternal health scope, politely redirect

Response:
```

3. **Clinical Summary Prompt Template:**
```
Generate a concise clinical summary for a physician reviewing this patient.

Patient Data:
- Demographics: {demographics}
- Gestational Week: {gestational_week}
- Current Risk Score: {risk_score} (Trend: {trend})
- Recent Check-ins: {checkin_summary}
- Abnormal Findings: {abnormal_findings}
- Mental Health Indicators: {sentiment_summary}
- Previous Consultations: {consultation_notes}

Generate a structured summary with:
1. Current Status (2-3 sentences)
2. Risk Assessment (current score, trend, key factors)
3. Recent Changes (new or worsening symptoms)
4. Recommended Actions (next steps based on risk level)

Keep summary under 200 words. Use clinical terminology appropriate for physicians.
```

**Hallucination Mitigation Strategies:**
- Low temperature settings (0.2-0.3) for factual accuracy
- Structured output formats (JSON) to constrain responses
- Knowledge base validation: Cross-reference AI claims against curated maternal health guidelines
- Confidence scoring: Flag low-confidence outputs for human review
- Explicit instruction to cite clinical data points in justifications
- Disclaimer injection in all patient-facing outputs

**Cost Optimization:**
- Prompt caching for repeated system instructions
- Token limit enforcement (max 2048 output tokens)
- Batch processing for non-real-time tasks (daily summaries)
- Model selection based on task complexity (use smaller models for simple classification)

---

### Amazon Cognito

**Role:** User identity and access management service providing authentication, authorization, and user profile management.

**User Pool Configuration:**


- **Sign-in Options**: Email, phone number (for OTP-based authentication)
- **Password Policy**: Minimum 8 characters, requires uppercase, lowercase, number, special character
- **MFA**: Optional for patients and ASHA workers; required for physicians and administrators
- **Account Recovery**: Email and SMS-based password reset
- **User Attributes**: 
  - Standard: email, phone_number, name, preferred_language
  - Custom: tenant_id, role, patient_id, assigned_patients (for ASHA workers)

**User Groups and Roles:**

1. **Patient Role**
   - Permissions: Read/write own health data, access maternal assistant, submit check-ins
   - IAM Policy: Allow DynamoDB queries with `user_id = {cognito:sub}` condition

2. **ASHA Worker Role**
   - Permissions: Read assigned patient data, submit check-ins on behalf of patients, view escalations
   - IAM Policy: Allow DynamoDB queries with `assigned_asha = {cognito:sub}` condition

3. **Physician Role**
   - Permissions: Read all patients in tenant, write consultation notes, generate reports, acknowledge escalations
   - IAM Policy: Allow DynamoDB queries with `tenant_id = {cognito:tenant_id}` condition

4. **Administrator Role**
   - Permissions: Tenant configuration, user management, platform metrics, audit logs
   - IAM Policy: Full access to tenant-scoped resources

**JWT Token Structure:**
```json
{
  "sub": "user-uuid",
  "cognito:groups": ["Physician"],
  "email": "doctor@example.com",
  "custom:tenant_id": "tenant-123",
  "custom:role": "physician",
  "exp": 1234567890,
  "iat": 1234567890
}
```

**Identity Federation:**
- SAML 2.0 integration for hospital identity providers
- OAuth 2.0 support for Google/Facebook social login (patient convenience)
- Attribute mapping from external IdPs to Cognito user attributes

**Security Features:**
- Advanced security mode: Compromised credential detection, unusual sign-in activity alerts
- Account takeover protection: Risk-based adaptive authentication
- User pool analytics: Sign-in activity, MFA adoption, compromised credential events

---

### Amazon DynamoDB

**Role:** Fully managed NoSQL database providing low-latency, scalable storage for health data, user profiles, and application state.

**Table Design:**


1. **Patients Table**
   - Partition Key: `patient_id` (UUID)
   - Sort Key: None (single-item per patient)
   - Attributes: tenant_id, user_id, name, dob, gestational_week, due_date, medical_history, assigned_asha, assigned_physician, language_preference, created_at, updated_at
   - GSI-1: tenant_id (PK), created_at (SK) - for listing patients by tenant
   - GSI-2: assigned_asha (PK), patient_id (SK) - for ASHA worker patient lists
   - Encryption: AWS KMS customer-managed key per tenant
   - Capacity: On-demand billing mode with auto-scaling

2. **CheckIns Table**
   - Partition Key: `patient_id` (UUID)
   - Sort Key: `timestamp` (ISO 8601)
   - Attributes: tenant_id, gestational_week, bp_systolic, bp_diastolic, glucose, sleep_hours, fatigue_level, mood_score, symptoms_text, submitted_by (patient or ASHA), device_type
   - TTL Attribute: expires_at (set to 7 years for compliance)
   - GSI-1: tenant_id (PK), timestamp (SK) - for tenant-wide analytics
   - Capacity: On-demand with burst capacity for weekly check-in spikes

3. **RiskScores Table**
   - Partition Key: `patient_id` (UUID)
   - Sort Key: `timestamp` (ISO 8601)
   - Attributes: tenant_id, risk_score, confidence, risk_category, contributing_factors (list), clinical_justification, recommended_actions (list), model_version, computation_time_ms
   - GSI-1: tenant_id (PK), risk_score (SK) - for risk-stratified patient lists
   - Capacity: On-demand

4. **Conversations Table**
   - Partition Key: `patient_id` (UUID)
   - Sort Key: `message_id` (UUID)
   - Attributes: tenant_id, timestamp, role (user/assistant), content, language, translated_content, model_version, tokens_used, flagged_for_review
   - TTL Attribute: expires_at (90 days for privacy)
   - Capacity: On-demand

5. **JournalEntries Table**
   - Partition Key: `patient_id` (UUID)
   - Sort Key: `timestamp` (ISO 8601)
   - Attributes: tenant_id, entry_text, sentiment_score, sentiment_category, keywords_detected (list), flagged_for_mental_health, consent_to_share
   - Encryption: Field-level encryption for entry_text using client-side encryption
   - TTL Attribute: expires_at (1 year or user-requested deletion)
   - Capacity: On-demand

6. **Escalations Table**
   - Partition Key: `escalation_id` (UUID)
   - Sort Key: None
   - Attributes: tenant_id, patient_id, escalation_type, severity, triggered_by (risk_score/symptom/sentiment), description, status (pending/acknowledged/resolved), assigned_to, created_at, acknowledged_at, resolved_at
   - GSI-1: tenant_id (PK), status (SK) - for active escalation lists
   - GSI-2: assigned_to (PK), created_at (SK) - for physician/ASHA escalation queues
   - Capacity: Provisioned (predictable load)


7. **ClinicalNotes Table**
   - Partition Key: `patient_id` (UUID)
   - Sort Key: `note_id` (UUID)
   - Attributes: tenant_id, timestamp, author_id, note_type (consultation/referral/follow-up), content, visit_date
   - Capacity: On-demand

8. **Tenants Table**
   - Partition Key: `tenant_id` (UUID)
   - Sort Key: None
   - Attributes: organization_name, admin_email, risk_thresholds (map), escalation_config (map), branding_config (map), subscription_tier, created_at, active
   - Capacity: Provisioned (low throughput)

9. **TranslationCache Table**
   - Partition Key: `source_text_hash` (SHA-256)
   - Sort Key: `target_language`
   - Attributes: translated_text, created_at
   - TTL Attribute: expires_at (30 days)
   - Purpose: Reduce Amazon Translate API costs by caching common translations
   - Capacity: On-demand

**Data Access Patterns:**

- **Pattern 1**: Retrieve patient profile → Query Patients table by patient_id
- **Pattern 2**: List patients for physician → Query Patients GSI-1 by tenant_id
- **Pattern 3**: Get patient check-in history → Query CheckIns table by patient_id, sort by timestamp descending
- **Pattern 4**: Get risk trajectory → Query RiskScores table by patient_id, sort by timestamp
- **Pattern 5**: List high-risk patients → Query RiskScores GSI-1 by tenant_id, filter risk_score > 67
- **Pattern 6**: Get ASHA worker's patients → Query Patients GSI-2 by assigned_asha
- **Pattern 7**: Get active escalations → Query Escalations GSI-1 by tenant_id, filter status = pending

**Performance Optimization:**
- DynamoDB Accelerator (DAX) for read-heavy workloads (patient profile lookups)
- Batch operations for bulk data retrieval (patient lists)
- Projection expressions to retrieve only required attributes
- Consistent reads only when data freshness is critical (risk scores)

**Backup and Recovery:**
- Point-in-time recovery (PITR) enabled with 35-day retention
- Daily automated backups to S3 with 90-day retention
- Cross-region replication for disaster recovery (future)

---

### Amazon S3

**Role:** Object storage for documents, reports, audio files, and static assets.

**Bucket Structure:**


1. **preconceive-reports-{region}**
   - Purpose: Patient summary PDFs, clinical reports
   - Structure: `{tenant_id}/{patient_id}/{report_id}.pdf`
   - Encryption: SSE-KMS with customer-managed keys
   - Lifecycle: Transition to Glacier after 90 days, delete after 7 years
   - Access: Pre-signed URLs with 1-hour expiration

2. **preconceive-audio-{region}**
   - Purpose: Text-to-speech audio files from Amazon Polly
   - Structure: `{tenant_id}/{language}/{content_hash}.mp3`
   - Encryption: SSE-S3
   - Lifecycle: Delete after 7 days (regenerate on demand)
   - Access: CloudFront CDN with signed URLs

3. **preconceive-static-{region}**
   - Purpose: Web application assets (HTML, CSS, JavaScript, images)
   - Structure: `/{version}/assets/`
   - Encryption: SSE-S3
   - Lifecycle: Retain indefinitely
   - Access: Public read via CloudFront CDN

4. **preconceive-backups-{region}**
   - Purpose: DynamoDB table backups, audit log archives
   - Structure: `{backup_type}/{date}/{table_name}/`
   - Encryption: SSE-KMS with AWS-managed keys
   - Lifecycle: Transition to Glacier Deep Archive after 30 days, retain 7 years
   - Access: Restricted to backup/restore Lambda functions

**Security Controls:**
- Block public access enabled (except static assets bucket)
- Bucket policies enforcing encryption in transit (TLS)
- Versioning enabled for reports and backups
- Access logging to dedicated audit bucket
- Object Lock for compliance retention (future)

**Performance Optimization:**
- CloudFront CDN for global content delivery
- Transfer Acceleration for large file uploads (future)
- Multipart upload for files >100MB
- S3 Select for querying large JSON/CSV files without full download

---

### Amazon Polly

**Role:** Text-to-speech service converting AI-generated text to natural-sounding audio in 11 Indian languages.

**Configuration:**

- **Supported Languages and Voices:**
  - Hindi: Aditi (female, neural)
  - Bengali: Not natively supported - use Amazon Translate to English, then Polly English voice
  - Telugu: Not natively supported - use Translate + English voice
  - Marathi: Not natively supported - use Translate + Hindi voice (linguistic similarity)
  - Tamil: Not natively supported - use Translate + English voice
  - Gujarati: Aditi (Hindi voice, intelligible to Gujarati speakers)
  - Urdu: Not natively supported - use Translate + Hindi voice
  - Kannada: Not natively supported - use Translate + English voice
  - Odia: Not natively supported - use Translate + English voice
  - Malayalam: Not natively supported - use Translate + English voice
  - Punjabi: Not natively supported - use Translate + Hindi voice


**Note:** For languages without native Polly support, the system uses Amazon Translate to convert to Hindi or English, then applies Polly TTS. This is a known limitation documented in user-facing materials.

- **Voice Engine**: Neural TTS for natural prosody and intonation
- **Output Format**: MP3 (48 kbps for bandwidth optimization)
- **SSML Support**: Enabled for pronunciation control, pauses, emphasis
- **Speech Marks**: Generated for synchronizing text highlighting with audio playback

**Use Cases:**
- Reading symptom check-in questions aloud for low-literacy users
- Converting maternal assistant responses to audio
- Providing audio versions of care instructions and escalation guidance
- Accessibility support for visually impaired users

**Cost Optimization:**
- Cache generated audio files in S3 for 7 days
- Use standard (non-neural) voices for non-critical content
- Limit audio generation to user-requested content (opt-in)

---

### Amazon Translate

**Role:** Neural machine translation service enabling multilingual support across 11 Indian languages.

**Configuration:**

- **Supported Language Pairs:**
  - English ↔ Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam, Punjabi
  - Direct translation between Indian languages (e.g., Hindi → Tamil) via English pivot

- **Translation Strategy:**
  - **UI Text**: Pre-translate static strings, store in DynamoDB TranslationCache
  - **AI-Generated Content**: Real-time translation with caching based on content hash
  - **User Input**: Translate to English for Bedrock processing, translate response back to user language

- **Quality Assurance:**
  - Custom terminology glossaries for medical terms (e.g., "preeclampsia" → language-specific medical term)
  - Formality settings: Formal tone for clinical content, informal for conversational AI
  - Profanity masking disabled (medical terminology may trigger false positives)

**Translation Workflow Example:**
```
User (Hindi) → "मुझे सिरदर्द है" 
  ↓ Translate to English
"I have a headache"
  ↓ Bedrock Maternal Assistant (English)
"Headaches can be common during pregnancy. If severe or accompanied by vision changes, seek immediate care."
  ↓ Translate to Hindi
"गर्भावस्था के दौरान सिरदर्द आम हो सकता है। यदि गंभीर हो या दृष्टि में परिवर्तन के साथ हो, तो तुरंत चिकित्सा सहायता लें।"
  ↓ User (Hindi)
```

**Cost Optimization:**
- Translation caching in DynamoDB (30-day TTL)
- Batch translation for bulk content (educational materials)
- Language detection to avoid unnecessary translation (if user inputs English)

---

### Amazon CloudWatch

**Role:** Unified monitoring, logging, and observability platform for operational insights and incident response.


**Metrics:**

1. **Application Metrics:**
   - API request count, latency (p50, p95, p99), error rate per endpoint
   - Lambda invocation count, duration, error rate, throttles per function
   - Bedrock API calls, token usage, latency per model
   - DynamoDB read/write capacity utilization, throttled requests
   - Cognito authentication success/failure rate, MFA adoption

2. **Business Metrics (Custom):**
   - Daily active users (patients, ASHA workers, physicians)
   - Symptom check-in completion rate
   - Risk score distribution (low/moderate/high)
   - Escalation count by type and severity
   - Maternal assistant conversation count
   - Journal entry submission rate
   - Multilingual usage breakdown

3. **Security Metrics:**
   - Failed authentication attempts per user
   - Unauthorized API access attempts
   - Data access by role (audit trail)
   - Encryption key usage

**Logs:**

- **Application Logs**: Lambda function logs with structured JSON format
  ```json
  {
    "timestamp": "2024-01-15T10:30:00Z",
    "level": "INFO",
    "function": "RiskCalculator",
    "request_id": "abc-123",
    "tenant_id": "tenant-456",
    "patient_id": "patient-789",
    "message": "Risk score computed",
    "risk_score": 45,
    "computation_time_ms": 1234
  }
  ```

- **Access Logs**: API Gateway access logs, S3 access logs, CloudFront access logs
- **Audit Logs**: DynamoDB Streams capturing all data modifications
- **Security Logs**: CloudTrail logs for AWS API calls, Cognito authentication events

**Alarms:**

1. **Critical Alarms (PagerDuty integration):**
   - API error rate > 1% for 5 minutes
   - Lambda function error rate > 5% for 5 minutes
   - DynamoDB throttling events > 10 in 5 minutes
   - Bedrock API latency > 10 seconds (p95)
   - Escalation processing failure

2. **Warning Alarms (Email/Slack):**
   - API latency > 2 seconds (p95) for 10 minutes
   - Lambda concurrent executions > 80% of reserved capacity
   - DynamoDB capacity utilization > 70%
   - Daily check-in completion rate < 70%

3. **Informational Alarms:**
   - New tenant onboarded
   - Unusual spike in user registrations
   - Cost threshold exceeded (billing alarm)

**Dashboards:**

1. **Operational Dashboard**: Real-time system health, API performance, error rates
2. **Clinical Dashboard**: Risk score distributions, escalation trends, patient engagement
3. **Business Dashboard**: User growth, feature adoption, multilingual usage
4. **Security Dashboard**: Authentication metrics, access patterns, anomaly detection

**Log Retention:**
- Application logs: 90 days in CloudWatch, archive to S3 Glacier for 7 years
- Access logs: 30 days in CloudWatch, archive to S3 for 1 year
- Audit logs: 7 years in S3 (compliance requirement)

---

### AWS IAM (Identity and Access Management)

**Role:** Fine-grained access control for AWS services and resources using roles, policies, and permissions boundaries.


**IAM Roles:**

1. **LambdaExecutionRole**
   - Trusted Entity: lambda.amazonaws.com
   - Policies:
     - AWSLambdaBasicExecutionRole (CloudWatch Logs)
     - Custom policy: DynamoDB read/write, Bedrock InvokeModel, S3 GetObject/PutObject, Translate TranslateText, Polly SynthesizeSpeech, SNS Publish, SES SendEmail
   - Permissions Boundary: Restrict to specific resource ARNs (tenant-scoped)

2. **APIGatewayInvocationRole**
   - Trusted Entity: apigateway.amazonaws.com
   - Policies: Lambda InvokeFunction for all API handler functions

3. **CognitoAuthenticatedRole**
   - Trusted Entity: cognito-identity.amazonaws.com
   - Policies: Limited S3 GetObject for user's own reports (condition: s3:prefix = ${cognito-identity.amazonaws.com:sub}/*)

4. **DynamoDBStreamProcessorRole**
   - Trusted Entity: lambda.amazonaws.com
   - Policies: DynamoDB Streams read, CloudWatch Logs write

5. **EventBridgeSchedulerRole**
   - Trusted Entity: events.amazonaws.com
   - Policies: Lambda InvokeFunction for scheduled tasks (MetricsAggregator)

**IAM Policies (Custom):**

1. **TenantScopedDataAccess**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "dynamodb:Query",
           "dynamodb:GetItem",
           "dynamodb:PutItem",
           "dynamodb:UpdateItem"
         ],
         "Resource": "arn:aws:dynamodb:*:*:table/Patients",
         "Condition": {
           "ForAllValues:StringEquals": {
             "dynamodb:LeadingKeys": ["${aws:PrincipalTag/tenant_id}"]
           }
         }
       }
     ]
   }
   ```

2. **BedrockModelAccess**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "bedrock:InvokeModel",
           "bedrock:InvokeModelWithResponseStream"
         ],
         "Resource": [
           "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0",
           "arn:aws:bedrock:*::foundation-model/amazon.titan-embed-text-v1"
         ]
       }
     ]
   }
   ```

3. **S3ReportAccess**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": ["s3:GetObject"],
         "Resource": "arn:aws:s3:::preconceive-reports-*/${aws:PrincipalTag/tenant_id}/*"
       },
       {
         "Effect": "Allow",
         "Action": ["s3:PutObject"],
         "Resource": "arn:aws:s3:::preconceive-reports-*/${aws:PrincipalTag/tenant_id}/*",
         "Condition": {
           "StringEquals": {
             "s3:x-amz-server-side-encryption": "aws:kms"
           }
         }
       }
     ]
   }
   ```

**Security Best Practices:**
- Principle of least privilege: Grant only necessary permissions
- Resource-based policies for cross-account access (future multi-account architecture)
- Service Control Policies (SCPs) at AWS Organizations level
- Regular access reviews using IAM Access Analyzer
- Enforce MFA for human users (administrators)
- Rotate IAM access keys every 90 days (if used)

---

## Component Diagram


```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT APPLICATIONS                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │ Patient Web  │  │ ASHA Mobile  │  │ Physician    │                  │
│  │ App (PWA)    │  │ App          │  │ Dashboard    │                  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                  │
└─────────┼──────────────────┼──────────────────┼──────────────────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │ HTTPS/TLS 1.3
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      AMAZON CLOUDFRONT (CDN)                             │
│                    Static Assets + API Caching                           │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      AMAZON API GATEWAY                                  │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ REST API Endpoints | Request Validation | Throttling | CORS    │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                              │                                           │
│                    ┌─────────┴─────────┐                                │
│                    │  Cognito User     │                                │
│                    │  Pool Authorizer  │                                │
│                    └─────────┬─────────┘                                │
└──────────────────────────────┼───────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      AWS LAMBDA FUNCTIONS                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │ AuthHandler  │  │ Checkin      │  │ Risk         │                  │
│  │              │  │ Processor    │  │ Calculator   │                  │
│  └──────────────┘  └──────┬───────┘  └──────┬───────┘                  │
│  ┌──────────────┐  ┌──────┴───────┐  ┌──────┴───────┐                  │
│  │ Maternal     │  │ Clinical     │  │ Sentiment    │                  │
│  │ Assistant    │  │ Summarizer   │  │ Analyzer     │                  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                  │
│  ┌──────┴───────┐  ┌──────┴───────┐  ┌──────┴───────┐                  │
│  │ Nutrient     │  │ Escalation   │  │ Translation  │                  │
│  │ Extractor    │  │ Router       │  │ Proxy        │                  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                  │
│  ┌──────┴───────┐  ┌──────┴───────┐                                     │
│  │ TTS          │  │ Report       │                                     │
│  │ Generator    │  │ Generator    │                                     │
│  └──────┬───────┘  └──────┬───────┘                                     │
└─────────┼──────────────────┼─────────────────────────────────────────────┘
          │                  │
          │    ┌─────────────┼─────────────┐
          │    │             │             │
          ▼    ▼             ▼             ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ AMAZON BEDROCK  │  │ AMAZON DYNAMODB │  │ AMAZON S3       │
│                 │  │                 │  │                 │
│ Claude 3 Sonnet │  │ • Patients      │  │ • Reports       │
│ Titan Embeddings│  │ • CheckIns      │  │ • Audio Files   │
│                 │  │ • RiskScores    │  │ • Backups       │
│ Prompt          │  │ • Conversations │  │ • Static Assets │
│ Engineering     │  │ • Journals      │  │                 │
│                 │  │ • Escalations   │  │ KMS Encryption  │
└─────────────────┘  │ • ClinicalNotes │  └─────────────────┘
                     │ • Tenants       │
                     │                 │
                     │ KMS Encryption  │
                     │ PITR Enabled    │
                     └─────────────────┘
          │                  │
          ▼                  ▼
┌─────────────────┐  ┌─────────────────┐
│ AMAZON          │  │ AMAZON COGNITO  │
│ TRANSLATE       │  │                 │
│                 │  │ User Pools      │
│ 11 Indian       │  │ Identity Pools  │
│ Languages       │  │ JWT Tokens      │
│                 │  │ MFA Support     │
└─────────────────┘  │ RBAC            │
                     └─────────────────┘
          │
          ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ AMAZON POLLY    │  │ AMAZON SNS      │  │ AMAZON SES      │
│                 │  │                 │  │                 │
│ Text-to-Speech  │  │ SMS             │  │ Email           │
│ Neural Voices   │  │ Notifications   │  │ Notifications   │
│ Hindi Support   │  │ (Escalations)   │  │ (Digests)       │
└─────────────────┘  └─────────────────┘  └─────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      AMAZON CLOUDWATCH                                   │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ Logs | Metrics | Alarms | Dashboards | X-Ray Tracing          │    │
│  └────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      AWS CLOUDTRAIL                                      │
│                    Audit Logs | Compliance                               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Description

### Flow 1: Symptom Check-In Submission and Risk Calculation


**Actors:** Patient (via mobile app), ASHA Worker (on behalf of patient)

**Steps:**

1. **Client Request**: User submits symptom check-in form with vitals (BP, glucose, sleep, fatigue, mood)
2. **API Gateway**: Receives POST /checkins request, validates JWT token via Cognito authorizer
3. **CheckinProcessor Lambda**: 
   - Validates input data (physiological ranges, required fields)
   - Enriches with metadata (timestamp, gestational week, submitter ID)
   - Writes to DynamoDB CheckIns table
   - Publishes event to EventBridge: `CheckInSubmitted`
4. **EventBridge**: Routes event to RiskCalculator Lambda (asynchronous invocation)
5. **RiskCalculator Lambda**:
   - Queries DynamoDB for patient's historical check-ins (last 4 weeks)
   - Queries DynamoDB for patient's medical history and previous risk scores
   - Constructs prompt with clinical context
   - Invokes Bedrock Claude 3 Sonnet with risk scoring prompt
   - Parses JSON response (risk_score, confidence, contributing_factors, justification)
   - Writes to DynamoDB RiskScores table
   - If risk_score > 67, publishes `HighRiskDetected` event to EventBridge
6. **EventBridge**: Routes `HighRiskDetected` to EscalationRouter Lambda
7. **EscalationRouter Lambda**:
   - Creates escalation record in DynamoDB Escalations table
   - Queries DynamoDB for assigned ASHA worker and physician
   - Sends SMS via SNS to ASHA worker
   - Sends email via SES to physician
   - Logs escalation event to CloudWatch
8. **Client Response**: Returns HTTP 201 with check-in ID and computed risk score

**Latency Budget:**
- API Gateway → CheckinProcessor: <500ms
- CheckinProcessor → DynamoDB write: <100ms
- RiskCalculator (async): <5 seconds
- Total user-perceived latency: <600ms (risk calculation happens in background)

**Error Handling:**
- CheckinProcessor validation failure → HTTP 400 with error details
- DynamoDB write failure → Retry with exponential backoff, dead letter queue after 3 attempts
- Bedrock API failure → Fallback to rule-based risk scoring, alert engineering team
- Escalation notification failure → Retry, log to CloudWatch, display in-app alert

---

### Flow 2: Maternal Assistant Conversation

**Actors:** Patient

**Steps:**

1. **Client Request**: User sends message to maternal assistant (text or voice)
2. **API Gateway**: Receives POST /assistant/chat, validates JWT token
3. **MaternalAssistant Lambda**:
   - If voice input: Invokes Transcribe (future) or uses client-side speech-to-text
   - Detects user language (from Cognito user profile or language detection API)
   - If non-English: Invokes TranslationProxy Lambda to translate to English
   - Queries DynamoDB for patient's current risk score and recent symptoms
   - Queries DynamoDB for conversation history (last 5 messages for context)
   - Constructs prompt with patient context and conversation history
   - Invokes Bedrock Claude 3 Sonnet with maternal assistant prompt
   - Applies hallucination detection: Validates claims against medical knowledge base
   - Injects medical disclaimer into response
   - Detects emergency keywords (bleeding, severe pain, vision changes)
   - If emergency detected: Triggers EscalationRouter, prepends urgent care instructions
   - If non-English: Invokes TranslationProxy to translate response to user language
   - Writes conversation to DynamoDB Conversations table
   - If user requests audio: Invokes TTSGenerator Lambda
4. **TTSGenerator Lambda** (if requested):
   - Invokes Amazon Polly with translated text
   - Stores MP3 in S3 audio bucket
   - Returns pre-signed URL (1-hour expiration)
5. **Client Response**: Returns HTTP 200 with assistant message (text and optional audio URL)


**Latency Budget:**
- Translation (if needed): <1 second
- Bedrock inference: <3 seconds
- TTS generation (if requested): <2 seconds
- Total: <6 seconds (acceptable for conversational AI)

**Error Handling:**
- Bedrock timeout → Return fallback message: "I'm having trouble right now. Please try again or contact your healthcare provider."
- Translation failure → Return response in English with apology
- Emergency keyword detection failure → Conservative approach: Flag all ambiguous cases for human review

---

### Flow 3: Clinical Summary Generation

**Actors:** Physician

**Steps:**

1. **Client Request**: Physician opens patient record in clinical dashboard
2. **API Gateway**: Receives GET /clinical/summary/{patientId}, validates JWT token and physician role
3. **ClinicalSummarizer Lambda**:
   - Queries DynamoDB Patients table for patient demographics and medical history
   - Queries DynamoDB CheckIns table for last 4 weeks of check-ins
   - Queries DynamoDB RiskScores table for current score and trajectory
   - Queries DynamoDB JournalEntries table for sentiment summary (if consent given)
   - Queries DynamoDB ClinicalNotes table for previous consultation notes
   - Aggregates data into structured format
   - Constructs prompt with clinical data
   - Invokes Bedrock Claude 3 Sonnet with clinical summary prompt
   - Parses response into structured sections (status, risk assessment, changes, recommendations)
   - Caches summary in ElastiCache with 1-hour TTL (future optimization)
   - Logs summary generation to CloudWatch
4. **Client Response**: Returns HTTP 200 with AI-generated summary (JSON format)

**Latency Budget:**
- DynamoDB queries (parallel): <500ms
- Bedrock inference: <3 seconds
- Total: <3.5 seconds

**Error Handling:**
- DynamoDB query failure → Return partial summary with available data
- Bedrock failure → Return structured data without AI narrative
- Insufficient data → Return message: "Insufficient data for AI summary. Patient has completed X check-ins."

---

### Flow 4: Mental Health Journal Analysis

**Actors:** Patient

**Steps:**

1. **Client Request**: User submits private journal entry
2. **API Gateway**: Receives POST /journal/entries, validates JWT token
3. **SentimentAnalyzer Lambda**:
   - Receives journal entry text
   - Invokes Bedrock Claude 3 Sonnet with sentiment analysis prompt
   - Parses response: sentiment_score (-1 to +1), sentiment_category (negative/neutral/positive), keywords
   - Checks for suicidal ideation keywords (suicide, self-harm, end my life, etc.)
   - If detected: Immediately triggers EscalationRouter with CRITICAL severity
   - Queries DynamoDB for previous 2 journal entries
   - Detects negative sentiment streak (3+ consecutive negative entries)
   - If streak detected: Triggers EscalationRouter with HIGH severity for mental health follow-up
   - Writes entry to DynamoDB JournalEntries table with field-level encryption
   - Logs sentiment analysis (without entry content) to CloudWatch
4. **Client Response**: Returns HTTP 201 with entry ID and optional mental health resources

**Privacy Controls:**
- Journal content encrypted with patient-specific key
- Default: Journal NOT shared with physicians
- Patient can opt-in to share sentiment summary (not full text) with physician
- Suicidal ideation detection overrides privacy for safety (physician notified)


**Error Handling:**
- Bedrock failure → Store entry without sentiment analysis, retry asynchronously
- Encryption failure → Reject entry, return HTTP 500
- Escalation notification failure → Log to CloudWatch, display in-app alert to patient

---

### Flow 5: Nutrition Analysis

**Actors:** Patient

**Steps:**

1. **Client Request**: User describes meal in natural language (e.g., "I had 2 rotis, dal, and rice")
2. **API Gateway**: Receives POST /nutrition/analyze, validates JWT token
3. **NutrientExtractor Lambda**:
   - Detects user language
   - If non-English: Translates to English via TranslationProxy
   - Invokes Bedrock Claude 3 Sonnet with nutrition extraction prompt
   - Parses response: food_items (list), macronutrients (protein, carbs, fat), micronutrients (iron, folate, calcium)
   - Queries pregnancy dietary guidelines (stored in DynamoDB or S3)
   - Compares extracted nutrients against guidelines
   - Identifies deficiencies or excesses
   - Queries patient's current risk score
   - Generates culturally-appropriate food recommendations (e.g., if hypertension risk, suggest low-sodium Indian foods)
   - If non-English: Translates recommendations back to user language
4. **Client Response**: Returns HTTP 200 with nutrient breakdown and recommendations

**Latency Budget:**
- Translation: <1 second
- Bedrock inference: <3 seconds
- Total: <4 seconds

**Error Handling:**
- Unrecognized food items → Return partial analysis with recognized items
- Bedrock failure → Return generic dietary guidelines without personalization

---

## Synthetic Data Strategy

### Data Usage Declaration

**CRITICAL: This platform uses ONLY synthetic data and publicly available medical guidelines. NO real patient data is used at any stage of development, training, testing, or validation.**

### Synthetic Data Generation Methodology

**Generation Approach:**
1. **Statistical Modeling**: Use publicly available maternal health statistics from WHO, ICMR, and published research to define realistic distributions
2. **Clinical Validation**: Synthetic data reviewed by maternal health experts to ensure clinical plausibility
3. **Demographic Diversity**: Generate data representing diverse Indian demographics (age, geography, socioeconomic status, language)
4. **Edge Case Coverage**: Intentionally generate rare complications and edge cases for robust testing

**Synthetic Patient Profile Generation:**
```python
# Example synthetic data generation (pseudocode)
def generate_synthetic_patient():
    return {
        "age": random.normal(mean=26, std=4.5),  # Based on Indian maternal age distribution
        "gestational_week": random.uniform(8, 40),
        "bp_systolic": random.normal(mean=115, std=12),  # Normal distribution
        "bp_diastolic": random.normal(mean=75, std=8),
        "glucose": random.normal(mean=90, std=15),
        "bmi": random.normal(mean=23, std=3.5),
        "parity": random.choice([0, 1, 2, 3], weights=[0.4, 0.3, 0.2, 0.1]),
        "medical_history": generate_synthetic_history(),
        "location_type": random.choice(["rural", "urban"], weights=[0.65, 0.35])
    }
```

**Synthetic Data Validation:**
- **Clinical Plausibility**: All generated vitals within physiologically possible ranges
- **Statistical Consistency**: Distributions match published epidemiological data
- **Correlation Preservation**: Maintain realistic correlations (e.g., age vs complications)
- **Bias Assessment**: Ensure no systematic bias in synthetic data generation

**Public Data Sources:**
- WHO Maternal Health Guidelines
- ICMR Antenatal Care Guidelines
- Published research papers on maternal health in India
- NFHS (National Family Health Survey) aggregate statistics
- ACOG (American College of Obstetricians and Gynecologists) clinical guidelines

### Synthetic Data Limitations

**Known Limitations:**
- Synthetic data may not capture all real-world complexity and rare edge cases
- Correlations between variables may be simplified compared to real patient data
- Cultural and behavioral factors may be underrepresented
- Model performance on real data may differ from synthetic data performance

**Mitigation Strategies:**
- Conservative risk thresholds to account for uncertainty
- Explicit disclaimers about synthetic data training
- Continuous monitoring and model retraining when real data becomes available (with consent)
- Human-in-the-loop review for high-risk decisions

---

## AI Inference Pipeline Architecture

### End-to-End AI Processing Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     AI INFERENCE PIPELINE                                │
└─────────────────────────────────────────────────────────────────────────┘

1. INPUT STAGE
   ┌──────────────────────────────────────┐
   │ User Input (Symptom Check-in/Query)  │
   └──────────────┬───────────────────────┘
                  │
                  ▼
   ┌──────────────────────────────────────┐
   │ Input Validation & Sanitization      │
   │ - Range checks (BP, glucose)         │
   │ - Required field validation          │
   │ - SQL injection prevention           │
   └──────────────┬───────────────────────┘
                  │
                  ▼
2. CONTEXT ENRICHMENT
   ┌──────────────────────────────────────┐
   │ Retrieve Patient Context             │
   │ - Historical check-ins (4 weeks)     │
   │ - Previous risk scores               │
   │ - Medical history                    │
   │ - Current gestational week           │
   └──────────────┬───────────────────────┘
                  │
                  ▼
3. PROMPT CONSTRUCTION
   ┌──────────────────────────────────────┐
   │ Build Structured Prompt              │
   │ - System instructions                │
   │ - Patient context (JSON)             │
   │ - Clinical guidelines                │
   │ - Few-shot examples                  │
   │ - Safety constraints                 │
   └──────────────┬───────────────────────┘
                  │
                  ▼
4. AI INFERENCE
   ┌──────────────────────────────────────┐
   │ Amazon Bedrock API Call              │
   │ Model: Claude 3 Sonnet               │
   │ Temperature: 0.2 (factual)           │
   │ Max Tokens: 2048                     │
   │ Timeout: 30 seconds                  │
   └──────────────┬───────────────────────┘
                  │
                  ▼
5. RESPONSE PARSING
   ┌──────────────────────────────────────┐
   │ Parse JSON Response                  │
   │ - Extract risk_score                 │
   │ - Extract confidence                 │
   │ - Extract justification              │
   │ - Extract recommendations            │
   └──────────────┬───────────────────────┘
                  │
                  ▼
6. SAFETY FILTERS
   ┌──────────────────────────────────────┐
   │ Hallucination Detection              │
   │ - Knowledge base validation          │
   │ - Confidence thresholding            │
   │ - Keyword blacklist check            │
   │ - Consistency verification           │
   └──────────────┬───────────────────────┘
                  │
                  ▼
   ┌──────────────────────────────────────┐
   │ Emergency Keyword Detection          │
   │ - Bleeding, severe pain, etc.        │
   │ - Override AI output if detected     │
   │ - Trigger immediate escalation       │
   └──────────────┬───────────────────────┘
                  │
                  ▼
   ┌──────────────────────────────────────┐
   │ Disclaimer Injection                 │
   │ - Add "Not a diagnostic tool"        │
   │ - Add "Consult physician"            │
   │ - Add confidence level               │
   └──────────────┬───────────────────────┘
                  │
                  ▼
7. RULE-BASED VALIDATION
   ┌──────────────────────────────────────┐
   │ Clinical Rule Checks                 │
   │ - BP ≥ 160/110 → Force high risk    │
   │ - Glucose ≥ 200 → Force high risk   │
   │ - Take max(AI score, rule score)    │
   └──────────────┬───────────────────────┘
                  │
                  ▼
8. ESCALATION LOGIC
   ┌──────────────────────────────────────┐
   │ Determine Escalation Need            │
   │ - Risk score ≥ 67 → Escalate        │
   │ - Emergency keywords → Escalate      │
   │ - Negative sentiment streak → Flag   │
   └──────────────┬───────────────────────┘
                  │
                  ▼
9. OUTPUT STAGE
   ┌──────────────────────────────────────┐
   │ Return Response to User              │
   │ - Risk score + category              │
   │ - Explainability (contributing       │
   │   factors)                            │
   │ - Recommendations                    │
   │ - Disclaimers                        │
   └──────────────┬───────────────────────┘
                  │
                  ▼
10. AUDIT LOGGING
   ┌──────────────────────────────────────┐
   │ Log to CloudWatch                    │
   │ - Input tokens, output tokens        │
   │ - Latency, confidence                │
   │ - Flags (hallucination, emergency)   │
   │ - User ID, tenant ID                 │
   └──────────────────────────────────────┘
```

### Failure Modes and Fallback Behavior

**Failure Mode 1: Bedrock API Timeout/Unavailability**
- **Detection**: API call exceeds 30-second timeout or returns 5xx error
- **Fallback**: Switch to rule-based risk scoring using clinical thresholds
- **User Notification**: "AI features temporarily unavailable. Using rule-based assessment."
- **Logging**: Alert engineering team, log to CloudWatch with HIGH severity

**Failure Mode 2: Low Confidence AI Output**
- **Detection**: Bedrock returns confidence < 0.7
- **Fallback**: Use rule-based scoring, flag for human review
- **User Notification**: "Risk assessment has lower confidence. Physician review recommended."
- **Logging**: Log low-confidence event, include in daily digest to clinical team

**Failure Mode 3: Hallucination Detected**
- **Detection**: AI output contains blacklisted keywords or unverifiable claims
- **Fallback**: Suppress hallucinated content, regenerate with more conservative prompt
- **User Notification**: "Response under review. Please consult your healthcare provider."
- **Logging**: Flag for immediate human review, log full prompt and response

**Failure Mode 4: Translation Service Unavailable**
- **Detection**: Amazon Translate API returns error
- **Fallback**: Display content in English with apology message
- **User Notification**: "Translation temporarily unavailable. Showing content in English."
- **Logging**: Log translation failure, attempt to serve cached translation if available

**Failure Mode 5: Emergency Keyword Detected**
- **Detection**: User message contains emergency keywords (bleeding, severe pain, vision changes)
- **Override**: Bypass normal AI processing, trigger immediate escalation
- **User Notification**: "URGENT: Seek immediate medical care. Contact [nearest facility]."
- **Logging**: Create CRITICAL escalation, notify physician and ASHA worker immediately

### Human-in-the-Loop Escalation Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                  HUMAN-IN-THE-LOOP WORKFLOW                              │
└─────────────────────────────────────────────────────────────────────────┘

AUTOMATED TIER (No Human Review Required)
┌──────────────────────────────────────┐
│ Low Risk (Score 0-33)                │
│ - Automated response                 │
│ - No escalation                      │
│ - Weekly check-in reminder           │
└──────────────────────────────────────┘

ASSISTED TIER (Human Review Within 24-48 Hours)
┌──────────────────────────────────────┐
│ Moderate Risk (Score 34-66)          │
│ - Automated response + disclaimer    │
│ - ASHA worker notified               │
│ - Physician review within 7 days     │
│ - Human can override AI assessment   │
└──────────────────────────────────────┘

SUPERVISED TIER (Immediate Human Review)
┌──────────────────────────────────────┐
│ High Risk (Score 67-100)              │
│ - AI generates draft escalation      │
│ - Physician reviews BEFORE patient   │
│   notification                        │
│ - Physician can:                     │
│   • Approve escalation               │
│   • Modify escalation                │
│   • Override (mark false positive)   │
│ - Patient notified after approval    │
└──────────────────────────────────────┘

CRITICAL TIER (Immediate Human Intervention)
┌──────────────────────────────────────┐
│ Emergency Keywords Detected           │
│ - Bypass AI, use pre-defined         │
│   emergency protocol                  │
│ - Immediate notification to:         │
│   • Patient (seek care NOW)          │
│   • ASHA worker (urgent)             │
│   • Physician (urgent)                │
│ - Human reviews within 1 hour        │
└──────────────────────────────────────┘
```

### Model Versioning and Rollback Strategy

**Version Control:**
- All prompts versioned in S3 with semantic versioning (v1.0.0, v1.1.0, v2.0.0)
- Lambda functions reference prompt versions via environment variables
- Bedrock model versions pinned (claude-3-sonnet-20240229)

**A/B Testing:**
- Deploy new prompt versions to 10% of traffic initially
- Monitor key metrics: risk score distribution, escalation rate, physician override rate
- Gradual rollout: 10% → 25% → 50% → 100% over 2 weeks

**Rollback Triggers:**
- Escalation rate increases >20% compared to baseline
- Physician override rate increases >15%
- User-reported issues >5 per day
- Hallucination detection rate >5%

**Rollback Procedure:**
1. Detect performance degradation via CloudWatch alarms
2. Automatically revert Lambda environment variable to previous prompt version
3. Notify engineering team
4. Rollback time: <5 minutes (automated)
5. Post-incident review within 24 hours

---

## Clinical Safety Strategy

---

## Clinical Safety Strategy

**Safety-First Design Principles:**

1. **Conservative Risk Assessment**: When in doubt, escalate. False positives are safer than false negatives in maternal health.
2. **Physician Oversight**: All high-risk escalations reviewed by physician before patient notification.
3. **Explicit Limitations**: Every AI output includes disclaimers about system limitations.
4. **Emergency Override**: Emergency symptoms bypass AI and trigger immediate care-seeking instructions.
5. **Continuous Monitoring**: Real-time monitoring of AI performance and safety metrics.

**Safety Controls:**

| Control Layer | Mechanism | Purpose |
|---------------|-----------|---------|
| Input Validation | Range checks, required fields | Prevent invalid data from entering system |
| Prompt Engineering | Safety instructions, constraints | Guide AI to safe, appropriate responses |
| Hallucination Detection | Knowledge base validation | Prevent false medical claims |
| Confidence Thresholding | Suppress low-confidence outputs | Avoid uncertain recommendations |
| Emergency Keyword Detection | Keyword matching | Immediate escalation for emergencies |
| Rule-Based Validation | Clinical thresholds | Catch critical vitals AI might miss |
| Human-in-the-Loop | Physician review | Human oversight for high-risk decisions |
| Disclaimer Injection | Automated text addition | Ensure users understand limitations |
| Audit Logging | CloudWatch logs | Track all AI decisions for review |
| Physician Override | Manual escalation control | Allow clinical judgment to prevail |

**Safety Metrics:**

- **False Negative Rate**: % of high-risk cases missed by AI (Target: <5%)
- **False Positive Rate**: % of low-risk cases incorrectly escalated (Target: <20%)
- **Physician Override Rate**: % of AI escalations overridden by physicians (Target: <15%)
- **Emergency Detection Accuracy**: % of emergency keywords correctly detected (Target: >95%)
- **Hallucination Rate**: % of AI responses flagged for hallucination (Target: <2%)

**Safety Incident Response:**

1. **Detection**: Automated monitoring detects safety issue (e.g., missed high-risk case)
2. **Immediate Action**: Disable affected AI feature, switch to rule-based fallback
3. **Investigation**: Clinical and engineering teams review incident
4. **Root Cause Analysis**: Identify why AI failed (data issue, prompt issue, model issue)
5. **Remediation**: Fix root cause, update prompts/rules, retrain if needed
6. **Validation**: Test fix on synthetic data, validate with clinical team
7. **Gradual Rollout**: Deploy fix to 10% traffic, monitor, then full rollout
8. **Documentation**: Document incident, learnings, and preventive measures

---

## Responsible AI Governance

### AI Ethics Framework

**Principles:**

1. **Beneficence**: AI must improve maternal health outcomes and healthcare access
2. **Non-Maleficence**: AI must not cause harm through incorrect recommendations
3. **Autonomy**: Users retain decision-making authority; AI provides support, not commands
4. **Justice**: AI must perform equitably across all demographic groups
5. **Explainability**: AI decisions must be interpretable and justifiable
6. **Accountability**: Clear responsibility for AI outputs and failures

**Governance Structure:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     AI GOVERNANCE STRUCTURE                              │
└─────────────────────────────────────────────────────────────────────────┘

STRATEGIC OVERSIGHT
┌──────────────────────────────────────┐
│ AI Ethics Board                      │
│ - Clinical advisors                  │
│ - Data privacy experts               │
│ - Patient advocates                  │
│ - Technical leads                    │
│ Meets: Quarterly                     │
│ Role: Policy, ethics review          │
└──────────────────────────────────────┘
                  │
                  ▼
OPERATIONAL MANAGEMENT
┌──────────────────────────────────────┐
│ AI Safety Committee                  │
│ - Product owner                      │
│ - Clinical safety officer            │
│ - Engineering lead                   │
│ - Data scientist                     │
│ Meets: Monthly                       │
│ Role: Performance review, incidents  │
└──────────────────────────────────────┘
                  │
                  ▼
DAILY OPERATIONS
┌──────────────────────────────────────┐
│ On-Call Engineering Team             │
│ - Monitor CloudWatch alarms          │
│ - Respond to safety incidents        │
│ - Review flagged AI outputs          │
│ Available: 24/7                      │
└──────────────────────────────────────┘
```

### Bias Monitoring and Fairness

**Fairness Metrics:**

- **Demographic Parity**: Risk score distributions should be similar across age groups, geographic regions, and socioeconomic strata
- **Equalized Odds**: False positive and false negative rates should be similar across demographic groups
- **Calibration**: Predicted risk scores should match actual complication rates across groups

**Monitoring Process:**

1. **Data Collection**: Track risk scores, escalations, and outcomes by demographic group
2. **Statistical Analysis**: Quarterly analysis of fairness metrics
3. **Bias Detection**: Identify statistically significant disparities (p < 0.05)
4. **Root Cause Analysis**: Investigate why bias exists (data, model, or systemic)
5. **Mitigation**: Adjust model, prompts, or thresholds to reduce bias
6. **Validation**: Re-test fairness metrics after mitigation
7. **Transparency**: Publish annual fairness report

**Bias Mitigation Techniques:**

- **Diverse Synthetic Data**: Ensure training data represents all demographic groups
- **Fairness Constraints**: Add fairness constraints to model training (future ML models)
- **Threshold Adjustment**: Use group-specific risk thresholds if justified clinically
- **Prompt Engineering**: Instruct AI to avoid demographic-based assumptions
- **Human Review**: Flag cases where demographic factors may influence AI output

### Continuous Improvement Process

**Feedback Loops:**

1. **Physician Feedback**: Physicians can flag incorrect AI assessments
2. **Patient Feedback**: Patients can report unhelpful or concerning AI responses
3. **Outcome Tracking**: Track actual maternal complications vs predicted risk
4. **Model Performance**: Monitor AUC-ROC, precision, recall on validation data
5. **Safety Incidents**: Track and analyze all safety incidents

**Improvement Cycle:**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                  CONTINUOUS IMPROVEMENT CYCLE                            │
└─────────────────────────────────────────────────────────────────────────┘

1. MONITOR
   - CloudWatch metrics
   - Physician feedback
   - Patient feedback
   - Safety incidents
   
2. ANALYZE
   - Identify performance gaps
   - Root cause analysis
   - Fairness assessment
   
3. DESIGN
   - Prompt improvements
   - Rule updates
   - Model retraining (future)
   
4. TEST
   - Synthetic data validation
   - A/B testing
   - Clinical review
   
5. DEPLOY
   - Gradual rollout
   - Monitor for regressions
   - Document changes
   
6. EVALUATE
   - Measure impact
   - Compare to baseline
   - Iterate if needed
```

**Quarterly Review Process:**

- **Q1**: Fairness audit, bias assessment
- **Q2**: Safety incident review, prompt optimization
- **Q3**: Performance benchmarking, model evaluation
- **Q4**: Annual report, strategic planning

---

## Data Lifecycle Management

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        DATA LIFECYCLE                                    │
└─────────────────────────────────────────────────────────────────────────┘

1. COLLECTION
   ┌──────────────────────────────────────┐
   │ User Input (Check-in, Journal, Chat) │
   │ - Mobile app / Web app               │
   │ - ASHA worker submission             │
   └──────────────┬───────────────────────┘
                  │ TLS 1.3 Encryption
                  ▼
2. VALIDATION
   ┌──────────────────────────────────────┐
   │ API Gateway + Lambda                 │
   │ - Input validation                   │
   │ - Authentication check               │
   │ - Authorization check                │
   └──────────────┬───────────────────────┘
                  │
                  ▼
3. STORAGE
   ┌──────────────────────────────────────┐
   │ Amazon DynamoDB                      │
   │ - KMS encryption at rest             │
   │ - Row-level security                 │
   │ - Multi-tenant isolation             │
   └──────────────┬───────────────────────┘
                  │
                  ▼
4. PROCESSING
   ┌──────────────────────────────────────┐
   │ Lambda Functions + Bedrock           │
   │ - Risk calculation                   │
   │ - Sentiment analysis                 │
   │ - Clinical summaries                 │
   └──────────────┬───────────────────────┘
                  │
                  ▼
5. RETENTION
   ┌──────────────────────────────────────┐
   │ Time-Based Retention                 │
   │ - Active data: Until 1 year postpartum│
   │ - Historical: 7 years (compliance)   │
   │ - Journals: 1 year or user deletion  │
   │ - Conversations: 90 days             │
   │ - Audit logs: 7 years                │
   └──────────────┬───────────────────────┘
                  │
                  ▼
6. ARCHIVAL
   ┌──────────────────────────────────────┐
   │ Amazon S3 Glacier                    │
   │ - Long-term storage                  │
   │ - Encrypted backups                  │
   │ - Compliance retention               │
   └──────────────┬───────────────────────┘
                  │
                  ▼
7. DELETION
   ┌──────────────────────────────────────┐
   │ Secure Deletion                      │
   │ - User-requested: 30 days            │
   │ - Automated: TTL-based               │
   │ - Verify deletion across all stores  │
   │ - Audit log entry                    │
   └──────────────────────────────────────┘
```

### Data Minimization

**Principles:**
- Collect only data necessary for risk assessment and care navigation
- No collection of unnecessary demographic data (race, religion, caste)
- Optional fields clearly marked (e.g., journal entries)
- Aggregate data for analytics (no individual-level data in reports)

**Data Retention Justification:**

| Data Type | Retention Period | Justification |
|-----------|------------------|---------------|
| Check-ins | 7 years | Medical record retention standard |
| Risk Scores | 7 years | Clinical decision documentation |
| Journal Entries | 1 year | Mental health monitoring, user can delete anytime |
| Conversations | 90 days | Quality improvement, privacy-sensitive |
| Audit Logs | 7 years | Compliance and security investigation |
| Backups | 90 days | Disaster recovery |

---

## Bedrock Model Selection Rationale

**Primary Model: Anthropic Claude 3 Sonnet**

**Selection Criteria:**
1. **Medical Reasoning**: Strong performance on medical knowledge benchmarks
2. **Low Hallucination Rate**: Critical for healthcare applications
3. **Multilingual Support**: Handles English and Indian languages (via translation)
4. **Context Window**: 200K tokens supports extensive patient history
5. **Structured Output**: Reliable JSON generation for programmatic parsing
6. **Safety**: Built-in content filtering and refusal mechanisms

**Alternative Models Considered:**
- **Claude 3 Opus**: Higher accuracy but 3x cost, unnecessary for decision-support use case
- **Claude 3 Haiku**: Lower cost but reduced reasoning capability, insufficient for risk scoring
- **Amazon Titan**: Lower cost but weaker medical reasoning and multilingual support

**Model Version Pinning:**
- Use specific model version (claude-3-sonnet-20240229) to ensure consistent behavior
- Test new versions in staging before production deployment
- Maintain fallback to previous version if new version degrades performance

### Prompt Engineering Methodology

**Principles:**
1. **Role Definition**: Clearly state AI's role and limitations in system prompt
2. **Structured Input**: Provide patient data in consistent JSON format
3. **Structured Output**: Request JSON responses for reliable parsing
4. **Few-Shot Examples**: Include 2-3 examples of desired input-output pairs
5. **Safety Instructions**: Explicit instructions to avoid diagnostic claims, medication advice
6. **Confidence Scoring**: Request AI to indicate uncertainty
7. **Citation Requirements**: Instruct AI to cite specific data points in justifications


**Prompt Template Structure:**

```
<system>
You are {role_description}.

Your capabilities:
- {capability_1}
- {capability_2}

Your limitations:
- You are NOT a diagnostic tool
- You cannot prescribe medications or provide dosing advice
- You cannot replace physician consultation

Safety guidelines:
- {safety_guideline_1}
- {safety_guideline_2}

Output format: {format_specification}
</system>

<context>
{patient_context}
{conversation_history}
{medical_guidelines}
</context>

<examples>
Example 1:
Input: {example_input_1}
Output: {example_output_1}

Example 2:
Input: {example_input_2}
Output: {example_output_2}
</examples>

<task>
{user_input}
</task>
```

**Prompt Versioning:**
- Store prompts in S3 with version tags
- Lambda functions reference prompt versions via environment variables
- A/B testing framework for prompt optimization (future)
- Rollback capability if new prompt degrades performance

### Hallucination Mitigation Strategy

**Detection Mechanisms:**

1. **Knowledge Base Validation:**
   - Maintain curated medical knowledge base (WHO guidelines, ACOG recommendations, ICMR guidelines)
   - After AI generates response, extract factual claims
   - Cross-reference claims against knowledge base
   - Flag claims that cannot be verified

2. **Confidence Thresholding:**
   - Request AI to provide confidence scores for each statement
   - Suppress low-confidence statements (<70%)
   - Display medium-confidence statements (70-85%) with "This is general guidance" disclaimer
   - Display high-confidence statements (>85%) normally

3. **Consistency Checking:**
   - For critical outputs (risk scores), invoke model twice with same input
   - If outputs differ significantly, flag for human review
   - Use ensemble approach: Average risk scores from multiple invocations

4. **Keyword Blacklisting:**
   - Detect absolute claims ("always", "never", "100% safe", "guaranteed")
   - Detect diagnostic language ("you have", "you are diagnosed with")
   - Detect medication advice ("take X mg of", "stop taking")
   - Reject or rewrite responses containing blacklisted patterns

5. **Human-in-the-Loop:**
   - High-risk escalations reviewed by physician before patient notification
   - Flagged responses reviewed by clinical team within 24 hours
   - Feedback loop: Reviewed responses used to improve prompts

**Mitigation Actions:**
- **Suppress**: Remove hallucinated content from response
- **Rewrite**: Regenerate response with more conservative prompt
- **Fallback**: Return rule-based response instead of AI-generated
- **Escalate**: Flag for human review, delay response delivery

### Explainability Implementation

**Risk Score Explainability:**


**Approach:** Prompt AI to provide structured justification citing specific clinical factors.

**Output Format:**
```json
{
  "risk_score": 72,
  "confidence": "high",
  "risk_category": "high",
  "contributing_factors": [
    {
      "factor": "Elevated Blood Pressure",
      "value": "148/96 mmHg",
      "threshold": "140/90 mmHg",
      "contribution_weight": 0.45,
      "explanation": "Blood pressure exceeds preeclampsia threshold for 2 consecutive weeks"
    },
    {
      "factor": "Declining Mood Score",
      "value": "3/10 average over 3 weeks",
      "threshold": "4/10",
      "contribution_weight": 0.25,
      "explanation": "Sustained low mood indicates potential perinatal depression"
    },
    {
      "factor": "Gestational Week",
      "value": "34 weeks",
      "threshold": "N/A",
      "contribution_weight": 0.15,
      "explanation": "Third trimester increases complication risk"
    }
  ],
  "clinical_justification": "Patient shows signs of preeclampsia (elevated BP) and perinatal depression (low mood). Immediate clinical evaluation recommended.",
  "recommended_actions": [
    "Schedule urgent blood pressure check at PHC within 24 hours",
    "Refer for mental health screening",
    "Increase check-in frequency to twice weekly"
  ]
}
```

**Visualization:**
- Clinical dashboard displays contribution weights as horizontal bar chart
- Tooltip on hover shows detailed explanation for each factor
- Color-coding: Red for critical factors, yellow for moderate, green for normal

**Physician Education:**
- In-app tooltips explaining how risk scores are calculated
- Training materials on interpreting AI justifications
- Emphasis: AI is decision-support, not decision-maker

---

## Risk Engine Design

### Risk Scoring Algorithm

**Hybrid Approach: AI + Rule-Based**

**AI Component (Primary):**
- Bedrock Claude 3 Sonnet analyzes patient data and generates probabilistic risk score
- Considers: Vitals, symptoms, medical history, gestational week, previous risk trajectory
- Outputs: Risk score (0-100), confidence interval, contributing factors

**Rule-Based Component (Fallback & Validation):**
- Deterministic rules for critical thresholds:
  - BP ≥ 160/110 → Automatic high-risk (score ≥ 80)
  - Glucose ≥ 200 mg/dL → Automatic high-risk (score ≥ 75)
  - Suicidal ideation keywords → Automatic critical escalation
- Used when Bedrock API unavailable or low-confidence AI output

**Ensemble Logic:**
```python
def compute_risk_score(patient_data):
    # AI-based scoring
    ai_score = invoke_bedrock_risk_model(patient_data)
    
    # Rule-based scoring
    rule_score = apply_clinical_rules(patient_data)
    
    # Ensemble: Take maximum for safety
    final_score = max(ai_score, rule_score)
    
    # Confidence adjustment
    if ai_score.confidence < 0.7:
        final_score = rule_score  # Fallback to rules
    
    return final_score
```

### Risk Categories and Thresholds


**Low Risk (0-33):**
- **Characteristics**: Normal vitals, no concerning symptoms, positive mental health indicators
- **Monitoring Frequency**: Weekly check-ins
- **Escalation**: None required
- **Maternal Assistant Tone**: Reassuring, educational

**Moderate Risk (34-66):**
- **Characteristics**: Borderline vitals, mild symptoms, some concerning trends
- **Monitoring Frequency**: Twice-weekly check-ins
- **Escalation**: ASHA worker notified, physician review within 7 days
- **Maternal Assistant Tone**: Cautious, emphasizes monitoring

**High Risk (67-100):**
- **Characteristics**: Abnormal vitals, severe symptoms, negative mental health indicators
- **Monitoring Frequency**: Daily check-ins
- **Escalation**: Immediate ASHA worker and physician notification, clinical evaluation within 24-48 hours
- **Maternal Assistant Tone**: Directive, emphasizes seeking care

**Threshold Customization:**
- Tenants can adjust thresholds based on local clinical protocols
- Default thresholds based on WHO and ACOG guidelines
- Threshold changes logged for audit trail

### Risk Trajectory Analysis

**Time-Series Features:**
- **Trend Direction**: Increasing, stable, or decreasing risk over time
- **Velocity**: Rate of risk score change (points per week)
- **Volatility**: Standard deviation of risk scores (indicates instability)
- **Inflection Points**: Sudden changes in trajectory (trigger alerts)

**Visualization:**
- Line chart with risk zones color-coded (green/yellow/red)
- Annotations for clinical events (visits, medication changes)
- Predictive overlay: Dotted line showing projected risk trajectory (future enhancement)

**Alerting Logic:**
```python
def analyze_trajectory(risk_history):
    if len(risk_history) < 3:
        return "Insufficient data"
    
    recent_scores = risk_history[-3:]
    
    # Detect rapid increase
    if all(recent_scores[i] < recent_scores[i+1] for i in range(2)):
        velocity = (recent_scores[-1] - recent_scores[0]) / 3
        if velocity > 10:  # >10 points per week
            return "ALERT: Rapid risk increase"
    
    # Detect high volatility
    std_dev = calculate_std_dev(recent_scores)
    if std_dev > 15:
        return "ALERT: Unstable risk pattern"
    
    return "Normal trajectory"
```

---

## Security Model

### Data Encryption

**Encryption at Rest:**
- **DynamoDB**: AWS KMS encryption with customer-managed keys (CMK)
  - Separate CMK per tenant for data isolation
  - Key rotation every 365 days
  - Key usage logged to CloudTrail
- **S3**: Server-side encryption (SSE-KMS) for reports and backups
  - Enforce encryption via bucket policies (reject unencrypted uploads)
- **Journal Entries**: Field-level encryption using AWS Encryption SDK
  - Patient-specific data keys derived from master key
  - Encrypted fields: entry_text, keywords_detected

**Encryption in Transit:**
- TLS 1.3 for all client-server communication
- Certificate management via AWS Certificate Manager (ACM)
- HSTS headers enforced (Strict-Transport-Security: max-age=31536000)
- API Gateway enforces HTTPS-only


### Authentication and Authorization

**Authentication Flow:**

1. **User Login**: Client sends credentials to Cognito User Pool
2. **Cognito Validation**: Verifies credentials, checks MFA if enabled
3. **Token Issuance**: Returns JWT access token, ID token, refresh token
4. **API Request**: Client includes access token in Authorization header
5. **API Gateway Validation**: Verifies token signature and expiration
6. **Lambda Authorization**: Extracts user claims (role, tenant_id) from token
7. **Data Access**: Enforces row-level security based on claims

**Token Lifecycle:**
- Access Token: 1-hour expiration
- ID Token: 1-hour expiration
- Refresh Token: 30-day expiration
- Token refresh: Client automatically refreshes before expiration

**Role-Based Access Control (RBAC):**

| Role          | Permissions                                                                 |
|---------------|-----------------------------------------------------------------------------|
| Patient       | Read/write own data, access maternal assistant, submit check-ins            |
| ASHA Worker   | Read assigned patients, submit check-ins on behalf, view escalations        |
| Physician     | Read all tenant patients, write consultation notes, acknowledge escalations |
| Administrator | Tenant configuration, user management, platform metrics                     |

**Row-Level Security:**
- DynamoDB queries include tenant_id filter
- Lambda functions validate user can access requested patient_id
- Cognito token claims used for authorization decisions

**Session Management:**
- Logout: Revoke refresh token via Cognito GlobalSignOut
- Concurrent session limit: 3 devices per user
- Idle timeout: 30 minutes (configurable per tenant)

### Audit Logging

**Logged Events:**
- Authentication: Login, logout, failed attempts, MFA events
- Data Access: Read/write operations with user ID, timestamp, resource ID
- AI Interactions: Bedrock invocations with input/output token counts (not content)
- Escalations: Creation, acknowledgment, resolution
- Configuration Changes: Tenant settings, user role changes
- Security Events: Unauthorized access attempts, encryption key usage

**Log Format (Structured JSON):**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "event_type": "DATA_ACCESS",
  "user_id": "user-123",
  "tenant_id": "tenant-456",
  "role": "physician",
  "action": "READ",
  "resource_type": "patient_record",
  "resource_id": "patient-789",
  "ip_address": "203.0.113.42",
  "user_agent": "Mozilla/5.0...",
  "result": "SUCCESS"
}
```

**Log Storage:**
- CloudWatch Logs: 90-day retention for operational logs
- S3 Glacier: 7-year retention for compliance audit logs
- Log encryption: SSE-KMS
- Log integrity: CloudWatch Logs Insights for tamper detection

**Audit Trail Access:**
- Administrators: Full access to tenant-scoped logs
- Compliance Officers: Read-only access to all logs
- Patients: Access to own data access logs (transparency)

### Vulnerability Management

**Security Scanning:**
- **Dependency Scanning**: Automated scanning of Lambda function dependencies (npm audit, pip-audit)
- **Container Scanning**: ECR image scanning for Lambda container images
- **Infrastructure Scanning**: AWS Config rules for compliance checks
- **Penetration Testing**: Annual third-party penetration testing

**Patch Management:**
- Lambda runtime updates: Quarterly review and update to latest runtime versions
- Dependency updates: Monthly automated pull requests for security patches
- Critical vulnerabilities: Emergency patching within 48 hours

**Incident Response:**
- Security incident playbook documented
- On-call rotation for security incidents
- Incident communication plan (users, regulators)
- Post-incident review and remediation tracking

---

## Privacy Model

### Data Minimization

**Principles:**
- Collect only data necessary for risk assessment and care navigation
- No collection of unnecessary demographic data (race, religion, caste)
- Optional fields clearly marked (e.g., journal entries)


**Data Retention:**
- Active pregnancy data: Retained until 1 year postpartum
- Historical data: Retained for 7 years (medical record retention standard)
- Journal entries: Deleted after 1 year or upon user request
- Conversation logs: Deleted after 90 days
- Audit logs: Retained for 7 years (compliance)

**Data Deletion:**
- User-initiated deletion: Complete data removal within 30 days
- Automated deletion: TTL attributes on DynamoDB items
- Backup deletion: Coordinated deletion from backups
- Deletion verification: Audit log entry confirming deletion

### Consent Management

**Consent Types:**

1. **Platform Use Consent**: Required for account creation
   - Consent to data collection for risk assessment
   - Consent to AI processing of health data
   - Consent to notifications (SMS, email)

2. **Data Sharing Consent**: Optional, granular
   - Share journal sentiment summary with physician (default: NO)
   - Share data with research studies (default: NO)
   - Share anonymized data for platform improvement (default: YES)

3. **Communication Consent**: Optional
   - SMS notifications (default: YES)
   - Email notifications (default: YES)
   - Voice calls (default: NO)

**Consent Tracking:**
- Consent records stored in DynamoDB with timestamp and version
- Consent withdrawal: Immediate effect, data access restricted
- Consent audit trail: All consent changes logged

**Consent UI:**
- Clear, plain-language consent forms
- Multilingual consent forms (11 languages)
- Granular consent toggles in user settings
- Consent version history visible to user

### Data Portability

**Export Functionality:**
- User can request complete data export via settings
- Export format: JSON (machine-readable) and PDF (human-readable)
- Export includes: Profile, check-ins, risk scores, journal entries, conversation history
- Export generation: Asynchronous, delivered via email link within 24 hours
- Export security: Pre-signed S3 URL with 7-day expiration

**Interoperability:**
- FHIR-compliant export format (future)
- Integration with Personal Health Record (PHR) systems
- API for third-party app data access (with user consent)

### Anonymization and De-identification

**Synthetic Data Generation:**
- Training data: 100% synthetic, generated using statistical models
- No real patient data used for model training
- Synthetic data validated for demographic representativeness

**De-identification for Analytics:**
- Population health analytics use de-identified data
- De-identification: Remove direct identifiers (name, phone, email)
- Pseudonymization: Replace patient_id with random hash
- Aggregation: Minimum group size of 10 for reporting

**Re-identification Risk:**
- K-anonymity assessment for exported datasets
- Differential privacy techniques for aggregate statistics (future)
- Regular privacy impact assessments

---

## Scalability Strategy

### Horizontal Scaling

**Serverless Auto-Scaling:**
- Lambda: Automatic scaling to 1,000 concurrent executions per function
- API Gateway: Automatic scaling to 10,000 requests per second
- DynamoDB: On-demand capacity mode scales automatically
- Cognito: Scales to millions of users without configuration

**Reserved Capacity:**
- Lambda reserved concurrency for critical functions (RiskCalculator: 100, EscalationRouter: 50)
- DynamoDB provisioned capacity for predictable workloads (Tenants table)


### Performance Optimization

**Caching Strategy:**

1. **API Gateway Caching:**
   - Cache GET requests for static data (tenant configuration, educational content)
   - TTL: 5 minutes
   - Cache key: Includes tenant_id and language

2. **Translation Caching:**
   - DynamoDB TranslationCache table
   - Cache common UI strings and AI responses
   - TTL: 30 days
   - Estimated cost savings: 70% reduction in Translate API calls

3. **ElastiCache (Future):**
   - Redis cluster for clinical summaries
   - Patient profile caching
   - Risk score caching (1-hour TTL)

**Database Optimization:**
- DynamoDB Global Secondary Indexes for efficient queries
- Projection expressions to retrieve only required attributes
- Batch operations for bulk reads/writes
- DynamoDB Accelerator (DAX) for read-heavy workloads

**Bedrock Optimization:**
- Prompt caching: Reuse system prompts across invocations
- Token limit enforcement: Max 2048 output tokens
- Batch processing: Aggregate non-urgent requests
- Model selection: Use smaller models for simple tasks

### Load Testing

**Target Metrics:**
- 10,000 concurrent users
- 100,000 API requests per minute
- 5,000 risk calculations per minute
- p95 latency < 2 seconds
- Error rate < 0.1%

**Load Testing Tools:**
- AWS Distributed Load Testing solution
- Apache JMeter for API load testing
- Locust for user behavior simulation

**Load Testing Scenarios:**
1. **Peak Check-In Load**: Simulate 5,000 simultaneous check-in submissions
2. **Physician Dashboard Load**: Simulate 500 physicians accessing patient lists
3. **Maternal Assistant Load**: Simulate 1,000 concurrent conversations
4. **Escalation Spike**: Simulate 100 high-risk escalations in 1 minute

**Capacity Planning:**
- Quarterly load testing with 2x expected peak load
- Auto-scaling threshold tuning based on test results
- Cost modeling for projected growth

---

## Deployment Architecture

### Multi-Availability Zone Deployment

**Architecture:**
- API Gateway: Regional endpoint (automatically multi-AZ)
- Lambda: Deployed across multiple AZs
- DynamoDB: Multi-AZ replication (automatic)
- S3: Multi-AZ replication (automatic)
- Cognito: Multi-AZ (automatic)

**Failover Strategy:**
- Automatic failover within 60 seconds
- Health checks every 30 seconds
- Circuit breaker pattern for external dependencies

### Infrastructure as Code

**Tooling:**
- AWS CloudFormation for infrastructure provisioning
- AWS CDK (Python) for higher-level abstractions
- Version control: Git repository with infrastructure code

**Stack Organization:**
```
stacks/
  ├── network-stack.yaml          # VPC, subnets, security groups
  ├── identity-stack.yaml         # Cognito User Pools, IAM roles
  ├── data-stack.yaml             # DynamoDB tables, S3 buckets
  ├── compute-stack.yaml          # Lambda functions, API Gateway
  ├── ai-stack.yaml               # Bedrock configurations
  ├── monitoring-stack.yaml       # CloudWatch dashboards, alarms
  └── tenant-stack-template.yaml  # Per-tenant resources
```

**Deployment Pipeline:**
1. **Development**: Developer commits code to feature branch
2. **CI Build**: GitHub Actions runs unit tests, linting, security scans
3. **Staging Deployment**: Automated deployment to staging environment
4. **Integration Tests**: Automated API tests, load tests
5. **Manual Approval**: Product owner approves production deployment
6. **Production Deployment**: Blue-green deployment with automatic rollback
7. **Smoke Tests**: Automated health checks post-deployment


### Environment Strategy

**Environments:**

1. **Development (dev)**
   - Purpose: Active development and debugging
   - Data: Synthetic test data
   - Bedrock: Shared model access
   - Cost optimization: Minimal resources, auto-shutdown after hours

2. **Staging (staging)**
   - Purpose: Pre-production testing and validation
   - Data: Synthetic data matching production volume
   - Bedrock: Dedicated model access
   - Configuration: Mirrors production

3. **Production (prod)**
   - Purpose: Live user traffic
   - Data: Real patient data (encrypted)
   - Bedrock: Dedicated model access with reserved capacity
   - Configuration: High availability, auto-scaling

**Environment Isolation:**
- Separate AWS accounts per environment (AWS Organizations)
- Cross-account IAM roles for deployment automation
- Network isolation: Separate VPCs per environment
- Data isolation: No production data in non-production environments

### Blue-Green Deployment

**Strategy:**
- Maintain two identical production environments (blue and green)
- Deploy new version to inactive environment (green)
- Run smoke tests on green environment
- Switch traffic from blue to green via API Gateway stage
- Monitor for errors, rollback to blue if issues detected
- Keep blue environment for 24 hours before decommissioning

**Rollback Procedure:**
- Automated rollback if error rate > 1% within 5 minutes
- Manual rollback via API Gateway stage switch
- Rollback time: <2 minutes

### Disaster Recovery

**RTO (Recovery Time Objective): 4 hours**
**RPO (Recovery Point Objective): 1 hour**

**Backup Strategy:**
- DynamoDB: Point-in-time recovery (35-day retention)
- DynamoDB: Daily automated backups to S3
- S3: Cross-region replication to secondary region (future)
- Configuration: Infrastructure as Code in Git (version controlled)

**Disaster Scenarios:**

1. **Single AZ Failure**: Automatic failover to healthy AZ (RTO: 1 minute)
2. **Regional Failure**: Manual failover to secondary region (RTO: 4 hours)
3. **Data Corruption**: Restore from point-in-time backup (RTO: 2 hours)
4. **Security Breach**: Isolate affected resources, restore from clean backup (RTO: 4 hours)

**DR Testing:**
- Quarterly disaster recovery drills
- Annual full regional failover test
- Documented runbooks for each scenario

---

## Monitoring & Observability

### Metrics and KPIs

**System Health Metrics:**
- API availability: 99.9% uptime target
- API latency: p95 < 2 seconds, p99 < 5 seconds
- Error rate: < 0.1% of requests
- Lambda cold start rate: < 5% of invocations
- DynamoDB throttling: 0 throttled requests

**AI Performance Metrics:**
- Bedrock API latency: p95 < 3 seconds
- Bedrock error rate: < 0.5%
- Hallucination detection rate: % of responses flagged
- Risk score computation time: p95 < 5 seconds
- Translation accuracy: Manual review of sample translations

**Business Metrics:**
- Daily active users (DAU): Patients, ASHA workers, physicians
- Weekly check-in completion rate: Target > 80%
- Risk score distribution: % low/moderate/high risk patients
- Escalation rate: Escalations per 100 patients per week
- Maternal assistant engagement: Conversations per patient per week
- Physician dashboard usage: Logins per physician per week

**Clinical Outcome Metrics (Long-term):**
- Early complication detection rate
- Escalation appropriateness (physician review)
- Patient satisfaction scores
- Reduction in inappropriate specialist referrals


### Dashboards

**1. Operational Dashboard (Real-Time)**
- API request rate and latency (per endpoint)
- Lambda invocation count and duration (per function)
- Error rate and error types
- DynamoDB capacity utilization
- Bedrock API usage and costs
- Active user count

**2. Clinical Dashboard (Daily)**
- Risk score distribution histogram
- High-risk patient count and trend
- Escalation count by type and severity
- Check-in completion rate by patient cohort
- Mental health flag rate
- Physician response time to escalations

**3. Business Dashboard (Weekly)**
- User growth (new registrations, active users)
- Feature adoption (maternal assistant, journal, nutrition)
- Multilingual usage breakdown
- Geographic distribution (rural vs urban)
- Tenant-level metrics (per healthcare organization)

**4. Security Dashboard (Continuous)**
- Failed authentication attempts
- Unauthorized access attempts
- Encryption key usage
- Anomalous data access patterns
- Security scan results

**5. Cost Dashboard (Daily)**
- AWS service costs by category (compute, storage, AI)
- Cost per patient per month
- Cost trends and projections
- Budget alerts

### Alerting Strategy

**Alert Severity Levels:**

1. **Critical (PagerDuty, SMS)**
   - API error rate > 1% for 5 minutes
   - Lambda function error rate > 5% for 5 minutes
   - DynamoDB throttling > 10 events in 5 minutes
   - Bedrock API unavailable
   - Escalation processing failure
   - Security breach detected

2. **High (Email, Slack)**
   - API latency p95 > 2 seconds for 10 minutes
   - Lambda concurrent executions > 80% of limit
   - DynamoDB capacity utilization > 70%
   - Daily check-in completion rate < 70%
   - Unusual spike in high-risk patients (>2 standard deviations)

3. **Medium (Slack)**
   - API latency p95 > 1.5 seconds for 15 minutes
   - Lambda cold start rate > 10%
   - Translation cache miss rate > 50%
   - Cost exceeds daily budget by 20%

4. **Low (Email digest)**
   - New tenant onboarded
   - Unusual user registration spike
   - Prompt version changed
   - Infrastructure configuration changed

**Alert Routing:**
- Critical alerts: On-call engineer (24/7 rotation)
- High alerts: Engineering team + product owner
- Medium alerts: Engineering team
- Low alerts: Daily digest to engineering lead

**Alert Fatigue Prevention:**
- Alert deduplication (suppress duplicate alerts within 1 hour)
- Alert aggregation (combine related alerts)
- Alert tuning (quarterly review of thresholds)
- Runbooks for common alerts

### Distributed Tracing

**AWS X-Ray Integration:**
- Enabled for all Lambda functions
- Trace API requests end-to-end (API Gateway → Lambda → DynamoDB/Bedrock)
- Identify performance bottlenecks
- Visualize service dependencies

**Trace Sampling:**
- 100% sampling for errors
- 10% sampling for successful requests (cost optimization)
- 100% sampling for requests > 5 seconds

**Trace Analysis:**
- Identify slow Bedrock API calls
- Detect DynamoDB hot partitions
- Analyze Lambda cold start impact
- Correlate errors across services

---

## Future Enhancements

### Phase 2 Enhancements (6-12 months)


1. **Predictive Risk Modeling**
   - Machine learning models trained on longitudinal data
   - Predict risk trajectory 2-4 weeks ahead
   - Early intervention recommendations
   - Model: Amazon SageMaker with custom ML pipeline

2. **Wearable Device Integration**
   - Integration with fitness trackers and smartwatches
   - Continuous heart rate, sleep, and activity monitoring
   - Automated check-in data collection
   - Protocols: Apple HealthKit, Google Fit, Fitbit API

3. **Telehealth Integration**
   - Video consultation scheduling within platform
   - AI-generated patient summaries sent to telehealth provider
   - Post-consultation note integration
   - Partners: Practo, mfine, Tata 1mg

4. **Advanced NLP for Symptom Extraction**
   - Free-text symptom description instead of structured forms
   - NLP extraction of symptoms, severity, duration
   - Reduces data entry burden
   - Technology: Amazon Comprehend Medical (adapted for Indian context)

5. **Community Health Worker Mobile App**
   - Offline-first mobile app for ASHA workers
   - Bulk check-in submission for multiple patients
   - Route optimization for home visits
   - Technology: React Native with local SQLite database

### Phase 3 Enhancements (12-24 months)

1. **Federated Learning for Model Improvement**
   - Train AI models on decentralized data (privacy-preserving)
   - Each tenant contributes to model improvement without sharing raw data
   - Technology: TensorFlow Federated, AWS Federated Learning

2. **Voice-First Interface**
   - Complete voice-based interaction for low-literacy users
   - Voice check-in submission
   - Voice maternal assistant conversations
   - Technology: Amazon Lex for conversational AI, Polly for TTS

3. **Postpartum Care Extension**
   - Extend platform to postpartum period (0-6 months)
   - Postpartum depression screening
   - Infant health monitoring
   - Breastfeeding support

4. **Population Health Analytics**
   - Aggregate analytics across tenants (de-identified)
   - Identify regional health trends
   - Public health reporting
   - Research collaboration with academic institutions

5. **FHIR Interoperability**
   - Full FHIR R4 compliance for data exchange
   - Integration with national health information exchanges
   - EHR system integration (hospital EMRs)
   - Technology: AWS HealthLake for FHIR data lake

6. **AI Model Fine-Tuning**
   - Fine-tune Bedrock models on synthetic maternal health data
   - Improve accuracy for Indian clinical context
   - Reduce hallucination rate
   - Technology: Amazon Bedrock custom model import

### Research and Innovation

1. **Explainable AI Research**
   - Collaborate with academic institutions on XAI techniques
   - Publish research on AI explainability in maternal health
   - Contribute to open-source XAI libraries

2. **Bias Mitigation Research**
   - Develop novel fairness metrics for healthcare AI
   - Test bias mitigation techniques (reweighting, adversarial debiasing)
   - Publish fairness reports and methodologies

3. **Synthetic Data Generation**
   - Develop advanced synthetic data generation techniques
   - Ensure synthetic data captures rare complications
   - Open-source synthetic data generation tools

4. **Low-Resource Language NLP**
   - Improve NLP for Indian languages with limited training data
   - Collaborate with language technology researchers
   - Contribute to multilingual NLP benchmarks

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Acceptance Criteria Testing Prework

Given the complexity and scale of this platform with 22 requirements containing over 100 acceptance criteria, I will focus on the most critical testable properties that validate core system correctness. Many acceptance criteria relate to UI/UX design, infrastructure configuration, or operational procedures that are not amenable to automated property-based testing.

**Key Testable Areas:**
1. Data integrity and persistence (check-ins, risk scores)
2. Risk calculation logic and thresholds
3. Authentication and authorization
4. Encryption and security controls
5. Multi-tenant data isolation
6. API input validation
7. Escalation logic
8. Translation and multilingual support

**Non-Testable Areas:**
- UI aesthetics and user experience
- Infrastructure provisioning and configuration
- Manual operational procedures
- Third-party service availability
- Regulatory compliance documentation
- Business metrics and KPIs

### Core Correctness Properties

#### Property 1: Check-In Data Persistence

*For any* valid symptom check-in submission (with physiologically plausible vitals), when persisted to DynamoDB, querying by patient_id and timestamp should return an equivalent check-in record with all submitted fields intact.

**Validates: Requirements 2.4**

**Rationale:** This is a fundamental data integrity property ensuring that health data is not lost or corrupted during storage. This is a round-trip property (write → read → verify equivalence).

---

#### Property 2: Risk Score Bounds

*For any* patient data input to the risk calculation engine, the computed risk score must be within the range [0, 100] inclusive, and the risk category must correctly correspond to the score (low: 0-33, moderate: 34-66, high: 67-100).

**Validates: Requirements 3.2, 3.4**

**Rationale:** This validates that the risk scoring system produces outputs within the defined bounds and that categorization logic is consistent with score values.

---

#### Property 3: Risk Score Monotonicity with Critical Vitals

*For any* patient data, if blood pressure is increased to exceed 160/110 mmHg (severe hypertension threshold) while keeping all other factors constant, the computed risk score must increase or remain at maximum (100).

**Validates: Requirements 3.5**

**Rationale:** This validates that the risk engine correctly responds to critical vital sign thresholds. This is a metamorphic property testing the relationship between input changes and output changes.

---

#### Property 4: Authentication Token Validation

*For any* API request with an expired or invalid JWT token, the API Gateway must return HTTP 403 Forbidden and must not execute the requested Lambda function.

**Validates: Requirements 1.4**

**Rationale:** This validates that authentication controls prevent unauthorized access. This is a security property ensuring the system correctly rejects invalid credentials.

---

#### Property 5: Row-Level Security Enforcement

*For any* patient data query by a user, the returned results must only include patients where either (a) the patient_id matches the user's own ID, or (b) the patient's tenant_id matches the user's tenant_id AND the user has appropriate role permissions.

**Validates: Requirements 12.3**

**Rationale:** This validates multi-tenant data isolation and role-based access control. This is a critical security property preventing data leakage across tenants.

---

#### Property 6: Encryption at Rest

*For any* health data written to DynamoDB (CheckIns, RiskScores, JournalEntries), the data must be encrypted using AWS KMS with a customer-managed key, verifiable through DynamoDB table encryption settings.

**Validates: Requirements 12.1**

**Rationale:** This validates that encryption controls are correctly configured. While we cannot directly test the encryption algorithm, we can verify that encryption is enabled.

---

#### Property 7: Input Validation for Blood Pressure

*For any* symptom check-in submission with blood pressure values outside physiologically plausible ranges (systolic < 70 or > 200, diastolic < 40 or > 130), the system must reject the submission with HTTP 400 Bad Request.

**Validates: Requirements 2.3**

**Rationale:** This validates input validation logic prevents invalid data from entering the system. This is an error condition property.

---

#### Property 8: Escalation Trigger for High Risk

*For any* risk score calculation that results in a score ≥ 67 (high-risk threshold), an escalation record must be created in the Escalations table with status "pending" and the assigned ASHA worker and physician must be notified.

**Validates: Requirements 11.1**

**Rationale:** This validates that the escalation logic correctly triggers for high-risk patients. This is a critical safety property ensuring timely clinical intervention.

---

#### Property 9: Translation Cache Consistency

*For any* text translated from English to a target language, if the same source text is translated again to the same target language within 30 days, the system must return the cached translation (verifiable by checking TranslationCache table hit rate).

**Validates: Requirements 9.3 (indirectly - cost optimization)**

**Rationale:** This validates that the translation caching mechanism works correctly, reducing API costs and improving performance.

---

#### Property 10: Multi-Tenant Data Isolation

*For any* two patients belonging to different tenants (tenant_id_A ≠ tenant_id_B), a query by a user in tenant_A must never return data belonging to a patient in tenant_B, regardless of the user's role.

**Validates: Requirements 15.1, 15.6**

**Rationale:** This is a critical security property ensuring complete data isolation between healthcare organizations. This prevents cross-tenant data leakage.

---

#### Property 11: Risk Trajectory Ordering

*For any* patient with multiple risk scores, when querying the risk trajectory, the returned risk scores must be ordered by timestamp in ascending order (oldest first).

**Validates: Requirements 4.1**

**Rationale:** This validates that time-series data is correctly ordered for visualization and analysis.

---

#### Property 12: Maternal Assistant Disclaimer Injection

*For any* response generated by the Maternal Assistant AI, the response text must contain a medical disclaimer statement indicating the system is not a diagnostic tool and cannot replace physician consultation.

**Validates: Requirements 5.3**

**Rationale:** This validates a critical safety control ensuring users understand the limitations of AI-generated medical guidance.

---

#### Property 13: Emergency Keyword Detection

*For any* user message to the Maternal Assistant containing emergency keywords (bleeding, severe pain, vision changes, reduced fetal movement), the system must trigger the escalation logic and prepend urgent care-seeking instructions to the response.

**Validates: Requirements 5.4**

**Rationale:** This validates that the system correctly identifies and responds to emergency situations, a critical patient safety property.

---

#### Property 14: Journal Entry Privacy

*For any* journal entry submitted by a patient, the entry content must not be accessible to physicians unless the patient has explicitly granted consent (consent_to_share = true), with the exception of suicidal ideation detection which overrides privacy for safety.

**Validates: Requirements 7.7**

**Rationale:** This validates privacy controls for sensitive mental health data while maintaining safety overrides.

---

#### Property 15: Sentiment Streak Detection

*For any* patient with 3 or more consecutive journal entries with negative sentiment (sentiment_category = "negative"), the system must create a mental health escalation flag.

**Validates: Requirements 7.3**

**Rationale:** This validates the mental health screening logic correctly identifies concerning patterns.

---

#### Property 16: Token Expiration Enforcement

*For any* API request with a JWT access token that has expired (current time > token exp claim), the system must reject the request with HTTP 401 Unauthorized and require re-authentication.

**Validates: Requirements 1.6**

**Rationale:** This validates session management and prevents use of stale authentication tokens.

---

#### Property 17: Audit Log Completeness

*For any* data access operation (read or write) on patient health data, an audit log entry must be created in CloudWatch Logs containing user_id, tenant_id, resource_type, resource_id, action, and timestamp.

**Validates: Requirements 12.5**

**Rationale:** This validates that all data access is logged for compliance and security auditing.

---

#### Property 18: Data Deletion Completeness

*For any* user-initiated data deletion request, all personal health information associated with the user's patient_id must be removed from all DynamoDB tables within 30 days, verifiable by querying all tables.

**Validates: Requirements 12.4**

**Rationale:** This validates the right to deletion (data portability) is correctly implemented.

---

#### Property 19: Multilingual UI Consistency

*For any* user interface text element, if a user has selected a non-English language preference, the displayed text must be in the selected language (verified by checking that the text does not match the English source text).

**Validates: Requirements 9.2**

**Rationale:** This validates that language preferences are correctly applied throughout the user interface.

---

#### Property 20: Risk Score Explainability Presence

*For any* computed risk score, the response must include a clinical_justification field that is non-empty and contains at least one contributing factor with a specific clinical data point citation.

**Validates: Requirements 3.3**

**Rationale:** This validates that the explainability layer provides meaningful justifications for risk assessments, not just scores.

---

### Property Reflection

After reviewing the 20 properties above, I identify the following potential redundancies:

- **Properties 4 and 16** both test authentication token validation but at different stages (invalid vs expired). These are distinct edge cases and should both be retained.
- **Properties 5 and 10** both test multi-tenant isolation but from different angles (row-level security vs complete isolation). Property 10 is more comprehensive and subsumes Property 5 for multi-tenant scenarios. However, Property 5 also covers single-tenant RBAC, so both should be retained.
- **Properties 6 and 12** test different aspects (encryption configuration vs content validation) and should both be retained.

**Conclusion:** All 20 properties provide unique validation value and should be retained. No redundancies identified that warrant removal.

---

## Error Handling

### Error Categories


**1. Client Errors (4xx)**
- **400 Bad Request**: Invalid input data (e.g., BP values out of range, missing required fields)
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Valid authentication but insufficient permissions
- **404 Not Found**: Requested resource does not exist
- **429 Too Many Requests**: Rate limit exceeded

**2. Server Errors (5xx)**
- **500 Internal Server Error**: Unexpected Lambda function error
- **502 Bad Gateway**: Bedrock API timeout or unavailability
- **503 Service Unavailable**: DynamoDB throttling or service degradation
- **504 Gateway Timeout**: Request exceeded API Gateway timeout (29 seconds)

### Error Response Format

**Standard Error Response:**
```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Blood pressure values must be within physiologically plausible ranges",
    "details": {
      "field": "bp_systolic",
      "value": 250,
      "constraint": "Must be between 70 and 200 mmHg"
    },
    "request_id": "abc-123-def-456",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

**Error Codes:**
- `INVALID_INPUT`: Client provided invalid data
- `AUTHENTICATION_FAILED`: Invalid credentials
- `AUTHORIZATION_FAILED`: Insufficient permissions
- `RESOURCE_NOT_FOUND`: Requested resource does not exist
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `AI_SERVICE_UNAVAILABLE`: Bedrock API unavailable
- `DATABASE_ERROR`: DynamoDB operation failed
- `INTERNAL_ERROR`: Unexpected server error

### Retry Strategy

**Client-Side Retries:**
- **Exponential Backoff**: Initial delay 100ms, multiply by 2 each retry, max 5 retries
- **Retryable Errors**: 500, 502, 503, 504, 429
- **Non-Retryable Errors**: 400, 401, 403, 404
- **Jitter**: Add random jitter (0-100ms) to prevent thundering herd

**Server-Side Retries:**
- **Lambda Retries**: Automatic retry for failed invocations (2 retries with exponential backoff)
- **DynamoDB Retries**: AWS SDK automatic retry with exponential backoff
- **Bedrock Retries**: 3 retries with exponential backoff for transient errors
- **Dead Letter Queue**: Failed messages sent to SQS DLQ after exhausting retries

### Circuit Breaker Pattern

**Implementation:**
- Monitor Bedrock API error rate
- If error rate > 50% over 1 minute, open circuit (stop calling Bedrock)
- Fallback to rule-based risk scoring during circuit open
- After 30 seconds, attempt single test request (half-open state)
- If test succeeds, close circuit and resume normal operation
- If test fails, remain open for another 30 seconds

**Benefits:**
- Prevents cascading failures
- Reduces load on failing service
- Provides graceful degradation

### Graceful Degradation

**Degraded Modes:**

1. **Bedrock Unavailable:**
   - Fallback: Rule-based risk scoring using clinical thresholds
   - Maternal Assistant: Return pre-written FAQ responses
   - Clinical Summaries: Return structured data without AI narrative
   - User Notification: "AI features temporarily unavailable"

2. **Translation Service Unavailable:**
   - Fallback: Display content in English with apology message
   - Cache: Serve cached translations if available
   - User Notification: "Translation temporarily unavailable"

3. **Database Throttling:**
   - Fallback: Return cached data if available
   - Retry: Exponential backoff with jitter
   - User Notification: "System experiencing high load, please retry"

4. **Notification Service Unavailable:**
   - Fallback: Display in-app notification instead of SMS/email
   - Retry: Queue notifications for later delivery
   - User Notification: "Notification delivery delayed"

---

## Testing Strategy

### Testing Pyramid

**Unit Tests (70% of tests):**
- Test individual Lambda functions in isolation
- Mock external dependencies (DynamoDB, Bedrock, Translate)
- Test input validation logic
- Test error handling paths
- Test utility functions (encryption, parsing, formatting)
- Framework: pytest (Python), Jest (JavaScript)
- Coverage Target: >80% code coverage

**Integration Tests (20% of tests):**
- Test Lambda functions with real AWS services (DynamoDB, S3)
- Test API Gateway → Lambda → DynamoDB flows
- Test authentication and authorization flows
- Test multi-tenant data isolation
- Environment: Dedicated testing AWS account
- Framework: pytest with boto3, Postman/Newman

**Property-Based Tests (10% of tests):**
- Test universal properties across randomized inputs
- Validate correctness properties defined in design document
- Generate diverse test cases automatically
- Framework: Hypothesis (Python), fast-check (JavaScript)
- Configuration: Minimum 100 iterations per property test

### Property-Based Testing Implementation

**Library Selection:**
- **Python**: Hypothesis (mature, well-documented, integrates with pytest)
- **JavaScript**: fast-check (TypeScript support, integrates with Jest)

**Test Structure:**
```python
from hypothesis import given, strategies as st
import pytest

@given(
    bp_systolic=st.integers(min_value=70, max_value=200),
    bp_diastolic=st.integers(min_value=40, max_value=130),
    glucose=st.floats(min_value=50, max_value=300),
    sleep_hours=st.floats(min_value=0, max_value=24),
    fatigue_level=st.integers(min_value=1, max_value=10),
    mood_score=st.integers(min_value=1, max_value=10)
)
@pytest.mark.property_test
def test_risk_score_bounds(bp_systolic, bp_diastolic, glucose, sleep_hours, fatigue_level, mood_score):
    """
    Feature: preconceive-ai-platform
    Property 2: Risk Score Bounds
    
    For any patient data input to the risk calculation engine, the computed risk score 
    must be within the range [0, 100] inclusive, and the risk category must correctly 
    correspond to the score.
    """
    patient_data = {
        "bp_systolic": bp_systolic,
        "bp_diastolic": bp_diastolic,
        "glucose": glucose,
        "sleep_hours": sleep_hours,
        "fatigue_level": fatigue_level,
        "mood_score": mood_score
    }
    
    result = calculate_risk_score(patient_data)
    
    # Property assertions
    assert 0 <= result["risk_score"] <= 100, "Risk score must be in [0, 100]"
    
    if 0 <= result["risk_score"] <= 33:
        assert result["risk_category"] == "low"
    elif 34 <= result["risk_score"] <= 66:
        assert result["risk_category"] == "moderate"
    else:
        assert result["risk_category"] == "high"
```

**Property Test Configuration:**
- Minimum 100 iterations per test (Hypothesis default)
- Seed randomization for reproducibility
- Shrinking enabled to find minimal failing examples
- Timeout: 60 seconds per property test

**Property Test Tagging:**
- All property tests tagged with `@pytest.mark.property_test`
- Tag includes feature name and property number
- Tag includes property statement from design document
- Enables selective test execution and reporting

### End-to-End Tests

**Scope:**
- Test complete user workflows (check-in submission → risk calculation → escalation)
- Test across multiple services (API Gateway → Lambda → DynamoDB → Bedrock)
- Test with real AWS services in staging environment
- Validate UI functionality with Selenium/Playwright

**Test Scenarios:**
1. Patient completes check-in, risk score computed, no escalation (low risk)
2. Patient completes check-in, high risk detected, escalation triggered, notifications sent
3. Patient chats with maternal assistant, emergency keyword detected, escalation triggered
4. Physician logs in, views patient list, generates clinical summary
5. ASHA worker submits check-in on behalf of patient, risk score computed

**Frequency:**
- Run on every deployment to staging
- Run nightly on production (read-only tests)

### Load and Performance Testing

**Tools:**
- AWS Distributed Load Testing solution
- Apache JMeter for API load testing
- Locust for user behavior simulation

**Test Scenarios:**
1. **Baseline Load**: 1,000 concurrent users, 10,000 requests/minute
2. **Peak Load**: 10,000 concurrent users, 100,000 requests/minute
3. **Stress Test**: Gradually increase load until system degrades
4. **Spike Test**: Sudden 10x traffic increase
5. **Endurance Test**: Sustained load for 4 hours

**Performance Targets:**
- p95 latency < 2 seconds
- p99 latency < 5 seconds
- Error rate < 0.1%
- Throughput: 100,000 requests/minute

### Security Testing

**Automated Security Scans:**
- **Dependency Scanning**: npm audit, pip-audit, Snyk
- **SAST**: SonarQube for code quality and security vulnerabilities
- **DAST**: OWASP ZAP for runtime vulnerability scanning
- **Infrastructure Scanning**: AWS Config rules, Prowler

**Manual Security Testing:**
- **Penetration Testing**: Annual third-party penetration test
- **Security Code Review**: Quarterly review of authentication and authorization code
- **Threat Modeling**: Annual threat modeling workshop

**Security Test Cases:**
- SQL injection attempts (should be blocked by input validation)
- Cross-site scripting (XSS) attempts (should be blocked by output encoding)
- Authentication bypass attempts (should be blocked by Cognito)
- Authorization bypass attempts (should be blocked by IAM policies)
- Data leakage across tenants (should be prevented by row-level security)

### Continuous Integration Pipeline

**Pipeline Stages:**

1. **Code Commit**: Developer pushes code to GitHub
2. **Linting**: Run code linters (pylint, eslint)
3. **Unit Tests**: Run all unit tests with coverage reporting
4. **Property Tests**: Run all property-based tests
5. **Security Scans**: Run dependency scanning and SAST
6. **Build**: Package Lambda functions, create deployment artifacts
7. **Deploy to Dev**: Automated deployment to development environment
8. **Integration Tests**: Run integration tests against dev environment
9. **Deploy to Staging**: Automated deployment to staging environment
10. **E2E Tests**: Run end-to-end tests against staging
11. **Load Tests**: Run load tests against staging
12. **Manual Approval**: Product owner approves production deployment
13. **Deploy to Production**: Blue-green deployment to production
14. **Smoke Tests**: Run critical path tests against production
15. **Monitor**: Watch CloudWatch metrics for anomalies

**Pipeline Tools:**
- **CI/CD**: GitHub Actions
- **Artifact Storage**: AWS S3
- **Deployment**: AWS CloudFormation / CDK
- **Test Reporting**: GitHub Actions test reports, Allure

---

## Appendices

### Appendix A: Glossary of AWS Services

- **Amazon API Gateway**: Managed service for creating, publishing, and managing REST APIs
- **AWS Lambda**: Serverless compute service for running code without provisioning servers
- **Amazon Bedrock**: Managed service for accessing foundation models via API
- **Amazon Cognito**: User identity and access management service
- **Amazon DynamoDB**: Fully managed NoSQL database service
- **Amazon S3**: Object storage service for files and backups
- **Amazon Polly**: Text-to-speech service with neural voices
- **Amazon Translate**: Neural machine translation service
- **Amazon CloudWatch**: Monitoring and observability service
- **AWS IAM**: Identity and Access Management for fine-grained permissions
- **AWS KMS**: Key Management Service for encryption key management
- **Amazon SNS**: Simple Notification Service for SMS and push notifications
- **Amazon SES**: Simple Email Service for transactional emails
- **AWS X-Ray**: Distributed tracing service for debugging
- **AWS CloudTrail**: Audit logging service for AWS API calls

### Appendix B: Compliance and Regulatory Considerations

**India-Specific Regulations:**
- **Digital Personal Data Protection Act (DPDPA) 2023**: Requires consent, data minimization, right to deletion
- **Information Technology Act 2000**: Governs electronic records and digital signatures
- **Clinical Establishments Act**: Regulates healthcare facilities (may apply to platform operators)

**International Standards:**
- **HIPAA-Inspired Controls**: While not directly applicable in India, HIPAA principles inform privacy design
- **ISO 27001**: Information security management system certification (future goal)
- **ISO 13485**: Medical device quality management (if classified as medical device)

**AI-Specific Considerations:**
- **EU AI Act**: If expanding to Europe, platform may be classified as "high-risk AI system"
- **WHO Guidelines on AI for Health**: Ethical principles for AI in healthcare
- **NITI Aayog Responsible AI Principles**: Indian government guidelines on AI ethics

**Medical Device Classification:**
- **Current Positioning**: Decision-support tool, NOT a diagnostic medical device
- **Regulatory Strategy**: Avoid diagnostic claims, emphasize physician oversight
- **Future Considerations**: If adding diagnostic features, may require CDSCO approval

### Appendix C: Cost Estimation

**Monthly Cost Breakdown (10,000 active patients):**

- **Compute (Lambda)**: $500 (5M invocations, 1GB memory, 5s avg duration)
- **API Gateway**: $350 (100M requests)
- **DynamoDB**: $800 (on-demand, 50M read units, 10M write units)
- **Bedrock (Claude 3 Sonnet)**: $3,000 (10M input tokens, 2M output tokens)
- **S3**: $100 (1TB storage, 10M requests)
- **Cognito**: $275 (50,000 MAU)
- **Translate**: $150 (1M characters)
- **Polly**: $40 (1M characters)
- **CloudWatch**: $200 (logs, metrics, alarms)
- **Data Transfer**: $300 (3TB egress)
- **SNS/SES**: $100 (100,000 SMS, 500,000 emails)

**Total Monthly Cost**: ~$5,815 (~$0.58 per patient per month)

**Cost Optimization Strategies:**
- Translation caching (70% cost reduction)
- Reserved Lambda concurrency for predictable workloads
- DynamoDB reserved capacity for stable tables
- S3 lifecycle policies (Glacier for old data)
- Bedrock prompt caching

### Appendix D: References

1. World Health Organization. (2023). "WHO recommendations on antenatal care for a positive pregnancy experience."
2. American College of Obstetricians and Gynecologists. (2023). "ACOG Practice Bulletins."
3. Indian Council of Medical Research. (2023). "Guidelines for Antenatal Care and Skilled Attendance at Birth."
4. Amazon Web Services. (2024). "AWS Well-Architected Framework."
5. Anthropic. (2024). "Claude 3 Model Card and Evaluation Results."
6. Government of India. (2023). "Digital Personal Data Protection Act 2023."
7. NITI Aayog. (2021). "Responsible AI for All: Principles for AI."
8. IEEE. (2019). "Ethically Aligned Design: A Vision for Prioritizing Human Well-being with Autonomous and Intelligent Systems."

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024 | AI Architect | Initial design document creation |

---

**End of Design Document**


