# AWS Implementation Cost Analysis - PreConceive Platform

## Executive Summary

This document provides a detailed cost analysis for implementing the PreConceive maternal health platform using AWS services. Estimates are based on three growth scenarios with realistic usage patterns for a healthcare application.

**Target Architecture:** Serverless, scalable, HIPAA-compliant maternal health platform

---

## 📊 Usage Scenarios

### Scenario 1: **Startup Phase** (1,000-5,000 active users)
- 3,000 monthly active users
- 10,000 API requests per day
- Average session: 15 minutes, 3x per week

### Scenario 2: **Growth Phase** (10,000-50,000 active users)
- 25,000 monthly active users
- 100,000 API requests per day
- Average session: 20 minutes, 4x per week

### Scenario 3: **Scale Phase** (100,000+ active users)
- 150,000 monthly active users
- 1,000,000 API requests per day
- Average session: 25 minutes, 5x per week

---

## 💰 Monthly Cost Breakdown by Service Category

## 🤖 AI Layer

### Amazon Bedrock (AI-powered health insights, chat, recommendations)

| Scenario | Model | Requests/Month | Input Tokens | Output Tokens | Monthly Cost |
|----------|-------|----------------|--------------|---------------|-------------|
| **Startup** | Claude 3.5 Sonnet | 90,000 | 4.5M | 1.35M | **$18.00** |
| **Growth** | Claude 3.5 Sonnet | 750,000 | 37.5M | 11.25M | **$150.00** |
| **Scale** | Claude 3.5 Sonnet | 4,500,000 | 225M | 67.5M | **$900.00** |

**Assumptions:**
- Average 3 AI interactions per user per week
- 50 input tokens, 15 output tokens average per request
- Claude 3.5 Sonnet: $0.003/1K input, $0.015/1K output tokens

### Amazon Comprehend (Sentiment analysis for mood tracking, journal entries)

| Scenario | Requests/Month | Units Processed | Monthly Cost |
|----------|----------------|-----------------|-------------|
| **Startup** | 45,000 | 45K units | **$22.50** |
| **Growth** | 375,000 | 375K units | **$187.50** |
| **Scale** | 2,250,000 | 2.25M units | **$1,125.00** |

**Assumptions:**
- 1.5 sentiment analysis calls per user per week (mood journals)
- $0.0001 per unit (100 chars) for sentiment analysis
- Average 1,000 characters per entry = 10 units

### Amazon SageMaker (Optional - Risk prediction models)

| Scenario | Instance Type | Hours/Month | Inference | Monthly Cost |
|----------|---------------|-------------|-----------|-------------|
| **Startup** | ml.t3.medium | 730 hours | 90K requests | **$45.00** |
| **Growth** | ml.m5.large | 730 hours | 750K requests | **$145.00** |
| **Scale** | ml.m5.xlarge | 730 hours | 4.5M requests | **$380.00** |

**Assumptions:**
- Real-time endpoint for risk scoring
- ml.t3.medium: $0.062/hour, ml.m5.large: $0.199/hour, ml.m5.xlarge: $0.398/hour
- 1 inference per user per session

**AI Layer Subtotal:**
- **Startup: $85.50/month**
- **Growth: $482.50/month**
- **Scale: $2,405.00/month**

---

## 🚀 Application Layer

### Amazon API Gateway (REST API for all backend calls)

| Scenario | API Calls/Month | Data Transfer (GB) | Monthly Cost |
|----------|-----------------|-------------------|-------------|
| **Startup** | 300,000 | 30 GB | **$16.00** |
| **Growth** | 3,000,000 | 300 GB | **$115.00** |
| **Scale** | 30,000,000 | 3,000 GB | **$1,020.00** |

**Assumptions:**
- $3.50 per million API calls (first 333M)
- $0.09/GB data transfer out
- Average 10 API calls per session
- Average 10KB per response

### AWS Lambda (Serverless compute for all backend logic)

| Scenario | Invocations/Month | Compute (GB-sec) | Monthly Cost |
|----------|-------------------|------------------|-------------|
| **Startup** | 300,000 | 75,000 | **$15.50** |
| **Growth** | 3,000,000 | 750,000 | **$125.00** |
| **Scale** | 30,000,000 | 7,500,000 | **$1,200.00** |

**Assumptions:**
- 1 Lambda invocation per API call
- 512MB memory, 250ms average duration
- $0.20 per 1M requests, $0.0000166667 per GB-second
- First 1M requests free, 400,000 GB-seconds free (factored in)

### AWS Amplify (Frontend hosting, CI/CD, custom domain)

| Scenario | Build Minutes | Hosting (GB-month) | Data Transfer (GB) | Monthly Cost |
|----------|---------------|-------------------|-------------------|-------------|
| **Startup** | 100 | 5 GB | 50 GB | **$18.00** |
| **Growth** | 100 | 5 GB | 500 GB | **$60.00** |
| **Scale** | 200 | 10 GB | 5,000 GB | **$540.00** |

**Assumptions:**
- Build minutes: $0.01/minute (100-200 builds/month)
- Hosting: $0.023/GB stored, $0.15/GB served
- 3-5 MB average page load per user

**Application Layer Subtotal:**
- **Startup: $49.50/month**
- **Growth: $300.00/month**
- **Scale: $2,760.00/month**

---

## 💾 Data Layer

### Amazon DynamoDB (User data, health records, tracking data)

| Scenario | Storage (GB) | Read Units | Write Units | Monthly Cost |
|----------|--------------|-----------|-------------|-------------|
| **Startup** | 10 GB | On-Demand | On-Demand | **$35.00** |
| **Growth** | 75 GB | On-Demand | On-Demand | **$250.00** |
| **Scale** | 500 GB | On-Demand | On-Demand | **$1,800.00** |

**Assumptions:**
- On-Demand pricing: $1.25/million write requests, $0.25/million read requests
- Storage: $0.25/GB-month
- Startup: 10M reads, 2M writes/month
- Growth: 100M reads, 20M writes/month
- Scale: 1B reads, 200M writes/month
- Average 50KB per user profile and health records

### Amazon S3 (Images, documents, backups)

| Scenario | Storage (GB) | PUT Requests | GET Requests | Data Transfer | Monthly Cost |
|----------|--------------|--------------|--------------|---------------|-------------|
| **Startup** | 50 GB | 10,000 | 50,000 | 10 GB | **$5.00** |
| **Growth** | 500 GB | 100,000 | 500,000 | 100 GB | **$30.00** |
| **Scale** | 5,000 GB | 1,000,000 | 5,000,000 | 1,000 GB | **$225.00** |

**Assumptions:**
- S3 Standard: $0.023/GB-month
- PUT: $0.005 per 1,000 requests
- GET: $0.0004 per 1,000 requests
- Data transfer out: $0.09/GB

**Data Layer Subtotal:**
- **Startup: $40.00/month**
- **Growth: $280.00/month**
- **Scale: $2,025.00/month**

---

## 🔐 Security Layer

### Amazon Cognito (User authentication, MFA, user pools)

| Scenario | Monthly Active Users | Monthly Cost |
|----------|---------------------|-------------|
| **Startup** | 3,000 MAU | **$13.75** |
| **Growth** | 25,000 MAU | **$112.50** |
| **Scale** | 150,000 MAU | **$675.00** |

**Assumptions:**
- $0.00275 per MAU after first 50,000 free MAU (prorated)
- Includes MFA, advanced security features
- First 50 MAU free

### AWS KMS (Encryption keys for sensitive health data)

| Scenario | Keys | Requests/Month | Monthly Cost |
|----------|------|----------------|-------------|
| **Startup** | 5 keys | 300,000 | **$5.50** |
| **Growth** | 10 keys | 3,000,000 | **$11.00** |
| **Scale** | 20 keys | 30,000,000 | **$31.00** |

**Assumptions:**
- $1.00 per key per month
- $0.03 per 10,000 requests
- First 20,000 requests free per month

### Amazon CloudTrail (Audit logging for HIPAA compliance)

| Scenario | Events Recorded | Data Events | Monthly Cost |
|----------|----------------|-------------|-------------|
| **Startup** | 500K events | 300K | **$2.00** |
| **Growth** | 5M events | 3M | **$15.00** |
| **Scale** | 50M events | 30M | **$150.00** |

**Assumptions:**
- First trail free (management events)
- Data events: $0.10 per 100,000 events

### Amazon CloudWatch (Monitoring, logging, alarms)

| Scenario | Logs (GB) | Metrics | Alarms | Monthly Cost |
|----------|-----------|---------|--------|-------------|
| **Startup** | 10 GB | 50 custom | 10 | **$12.00** |
| **Growth** | 100 GB | 200 custom | 25 | **$82.00** |
| **Scale** | 1,000 GB | 1,000 custom | 100 | **$740.00** |

**Assumptions:**
- Logs ingestion: $0.50/GB
- Storage: $0.03/GB-month
- Custom metrics: $0.30 per metric
- Alarms: $0.10 per alarm

### AWS IAM (Free)

**Cost: $0.00**

**Security Layer Subtotal:**
- **Startup: $33.25/month**
- **Growth: $220.50/month**
- **Scale: $1,596.00/month**

---

## 🌐 Accessibility Layer

### Amazon Translate (Multi-language support)

| Scenario | Characters/Month | Monthly Cost |
|----------|-----------------|-------------|
| **Startup** | 5M characters | **$75.00** |
| **Growth** | 50M characters | **$750.00** |
| **Scale** | 500M characters | **$7,500.00** |

**Assumptions:**
- $15.00 per million characters
- Average 1,000 characters per page/content view
- 50% of users use translation features
- Average 3-5 translated pages per session

### Amazon Polly (Text-to-speech for accessibility)

| Scenario | Characters/Month | Monthly Cost |
|----------|-----------------|-------------|
| **Startup** | 2M characters | **$8.00** |
| **Growth** | 20M characters | **$80.00** |
| **Scale** | 200M characters | **$800.00** |

**Assumptions:**
- Neural voices: $16.00 per 1M characters
- Standard voices: $4.00 per 1M characters
- Mixed usage (50% neural, 50% standard)
- 20% of users use text-to-speech
- Average 500 characters per audio snippet

**Accessibility Layer Subtotal:**
- **Startup: $83.00/month**
- **Growth: $830.00/month**
- **Scale: $8,300.00/month**

---

## 📋 Total Monthly Cost Summary

| Service Category | Startup | Growth | Scale |
|-----------------|---------|--------|-------|
| **AI Layer** | $85.50 | $482.50 | $2,405.00 |
| **Application Layer** | $49.50 | $300.00 | $2,760.00 |
| **Data Layer** | $40.00 | $280.00 | $2,025.00 |
| **Security Layer** | $33.25 | $220.50 | $1,596.00 |
| **Accessibility Layer** | $83.00 | $830.00 | $8,300.00 |
| **TOTAL** | **$291.25** | **$2,113.00** | **$17,086.00** |

### Cost per Active User

- **Startup (3K users):** $0.097/user/month (~**$0.10/user**)
- **Growth (25K users):** $0.085/user/month (~**$0.09/user**)
- **Scale (150K users):** $0.114/user/month (~**$0.11/user**)

---

## 🎯 Cost Optimization Strategies

### Immediate Savings (10-30% reduction)

1. **Reserved Capacity** (DynamoDB, Lambda)
   - Save 30-50% with 1-year reserved capacity commitments
   - **Estimated savings: $50-150/month in growth phase**

2. **S3 Intelligent-Tiering**
   - Auto-move infrequently accessed data to cheaper tiers
   - **Estimated savings: $5-50/month**

3. **CloudFront CDN** (not included above)
   - Reduce Amplify data transfer costs by 40-60%
   - Add $20-100/month but save $50-300/month
   - **Net savings: $30-200/month**

4. **Lambda SnapStart & Provisioned Concurrency**
   - Reduce cold starts and optimize compute time
   - **Estimated savings: $20-100/month**

### Medium-term Optimizations (20-40% reduction)

5. **DynamoDB Reserved Capacity**
   - Switch to provisioned capacity with auto-scaling
   - **Estimated savings: $100-500/month at scale**

6. **S3 Lifecycle Policies**
   - Archive old data to Glacier
   - **Estimated savings: $10-100/month**

7. **Compress API Responses**
   - Reduce data transfer costs by 60-70%
   - **Estimated savings: $20-200/month**

8. **Batch AI Requests**
   - Group multiple AI operations where possible
   - **Estimated savings: $50-300/month**

### Advanced Optimizations (30-50% reduction)

9. **Multi-Region Cost Arbitrage**
   - Use cheaper regions where latency permits
   - **Estimated savings: 5-10% overall**

10. **Spot Instances for SageMaker Training**
    - Save 70-90% on model training costs
    - **Estimated savings: $100-300/month**

11. **Custom Domain & Direct API Gateway Integration**
    - Reduce Lambda invocations with direct integrations
    - **Estimated savings: $30-150/month**

12. **Caching Strategy** (ElastiCache - optional, not included)
    - Add Redis/Memcached layer
    - Cost: $15-200/month, saves: $50-500/month
    - **Net savings: $35-300/month**

---

## 💡 Alternative Cost Models

### Budget-Conscious Approach (Reduce Accessibility Costs)

**Challenge:** Translate/Polly are 28-49% of total costs

**Solution Options:**
1. **Lazy Translation:** Translate only on-demand, cache translations
   - Reduce translation costs by 60-80%
   - **Savings: $50-6,000/month**

2. **Client-Side Translation:** Use browser APIs where possible
   - Free for basic languages
   - **Savings: $20-2,000/month**

3. **Polly Usage Optimization:** Pre-generate common audio snippets
   - Reduce real-time synthesis by 70%
   - **Savings: $5-560/month**

**Adjusted Totals with Optimized Accessibility:**
- **Startup:** ~$225/month (23% savings)
- **Growth:** ~$1,400/month (34% savings)
- **Scale:** ~$10,000/month (41% savings)

---

## 📊 Annual Cost Projections

### First Year (Startup → Growth Trajectory)

| Quarter | Avg Monthly Users | Avg Monthly Cost | Quarterly Total |
|---------|------------------|------------------|-----------------|
| Q1 | 2,000 | $250 | **$750** |
| Q2 | 5,000 | $500 | **$1,500** |
| Q3 | 12,000 | $1,200 | **$3,600** |
| Q4 | 20,000 | $1,800 | **$5,400** |
| **Year 1 Total** | | | **$11,250** |

### Second Year (Growth → Scale Trajectory)

| Quarter | Avg Monthly Users | Avg Monthly Cost | Quarterly Total |
|---------|------------------|------------------|-----------------|
| Q1 | 35,000 | $2,500 | **$7,500** |
| Q2 | 60,000 | $5,000 | **$15,000** |
| Q3 | 100,000 | $10,000 | **$30,000** |
| Q4 | 140,000 | $16,000 | **$48,000** |
| **Year 2 Total** | | | **$100,500** |

---

## 🏥 HIPAA Compliance Additional Costs

For healthcare applications handling PHI (Protected Health Information):

### AWS HIPAA BAA (Business Associate Agreement)
- **Cost: Free** (included with Enterprise Support or specific service usage)

### AWS Business Support (Recommended)
- **Cost: $100/month minimum** or 10% of monthly AWS usage (whichever is higher)
- Includes 24/7 support, faster response times

### Additional Compliance Services (Optional)

| Service | Purpose | Monthly Cost |
|---------|---------|-------------|
| AWS Artifact | Compliance reports & certifications | **Free** |
| AWS Security Hub | Centralized security findings | **$0.0010 per check** (~$5-50/month) |
| AWS Config | Configuration compliance tracking | **$2.00 per active rule** (~$20-100/month) |
| AWS Backup | Automated HIPAA-compliant backups | **$0.05/GB** (~$5-250/month) |

**Estimated HIPAA Compliance Addition:** $125-500/month depending on scale

---

## 🚨 Risk Factors & Hidden Costs

### Potential Cost Overruns

1. **AI Token Usage Spikes** (±50%)
   - User behavior may increase token usage
   - Mitigation: Implement rate limiting, prompt optimization

2. **Data Transfer Costs** (±30%)
   - Heavy image/video usage can spike costs
   - Mitigation: Image compression, lazy loading, CDN

3. **DynamoDB Hot Partitions** (±40%)
   - Inefficient data modeling increases costs
   - Mitigation: Proper partition key design, caching

4. **API Gateway Request Surge** (±60%)
   - DDoS or bot traffic
   - Mitigation: WAF, rate limiting, API keys

5. **Development/Testing Costs** (often forgotten)
   - Separate dev/staging environments
   - **Additional: $50-300/month**

---

## ✅ Recommendations

### Phase 1: MVP Launch (Month 1-3)
**Budget:** $300-500/month
- Start with Startup tier configuration
- Implement basic AI features
- Skip SageMaker initially (use Bedrock only)
- Use standard Polly voices (not neural)
- Implement aggressive caching

### Phase 2: Product-Market Fit (Month 4-12)
**Budget:** $500-2,000/month
- Scale to Growth tier
- Add SageMaker for custom risk models
- Implement cost monitoring and alerts
- Deploy CloudFront CDN
- Add reserved capacity where beneficial

### Phase 3: Scale (Year 2+)
**Budget:** $2,000-20,000/month
- Full scale architecture
- Enterprise support for HIPAA
- Multi-region deployment
- Advanced ML models
- Dedicated cost optimization team/tools

### Critical Success Factors

1. ✅ **Implement Cost Monitoring from Day 1**
   - CloudWatch billing alarms
   - AWS Cost Explorer
   - Tag all resources

2. ✅ **Design for Cost Efficiency**
   - Pagination for large data sets
   - Efficient database queries
   - Optimize image sizes
   - Token usage limits per user

3. ✅ **Plan for Growth**
   - Monitor per-user costs
   - Set budget alerts at 80% thresholds
   - Regular cost reviews (weekly initially)

---

## 📞 Next Steps

1. **Create AWS Account** with Business Support ($100/month)
2. **Set Up Cost Budgets & Alerts** (20% buffer recommended)
3. **Deploy MVP in Single Region** (us-east-1 typically cheapest)
4. **Implement Comprehensive Tagging Strategy**
5. **Review Costs Weekly** for first 3 months
6. **Optimize Based on Actual Usage Patterns**

---

**Document Version:** 1.0  
**Last Updated:** February 15, 2026  
**Analysis Based On:** AWS Pricing as of Feb 2026, PreConceive feature set

**Disclaimer:** Costs are estimates based on typical usage patterns. Actual costs may vary by ±30-50% based on user behavior, regional pricing, and implementation efficiency. Always implement cost monitoring and set budget alerts.
