---
layout: post
title: "💰 Serverless on a Budget: Netlify as a Free Alternative to AWS and Azure"
categories: [DevOps, Web Development, Tutorial]
excerpt: "Discover how to deploy Python serverless functions on Netlify's generous free tier instead of paying for AWS Lambda or Azure Functions. Perfect for hobby projects and MVPs!"
---

# Serverless on a Budget: Why I Chose Netlify over AWS and Azure

As a developer working on side projects, I was looking for a cost-effective way to deploy serverless functions without worrying about unexpected cloud bills. After experimenting with AWS Lambda and Azure Functions, I discovered Netlify's serverless platform. Here's why it became my go-to solution for hobby projects.

## The Cost Challenge

Traditional cloud providers can be expensive:
- AWS Lambda: Charges for compute time and requests
- Azure Functions: Complex pricing tiers
- Both require additional services (API Gateway, monitoring) that add up

## Enter Netlify

Netlify offers:
- 125K function invocations/month (free tier)
- No credit card required
- Built-in CI/CD
- Automatic HTTPS
- Easy environment variable management

## Quick Start: Python Hello World on Netlify

Let's create a simple Python function that returns a greeting.

### 1. Project Setup

Create a new directory structure:
```bash
netlify-python/
├── netlify/
│   └── functions/
│       └── hello.py
├── netlify.toml
└── .gitignore  # For Python and Netlify specific files
```

Add a `.gitignore` file to exclude unnecessary files:
```gitignore
# Python
__pycache__/
*.py[cod]
venv/
.env

# Netlify
.netlify/
.netlify.toml.backup

# Node (for Netlify CLI)
node_modules/

# IDE and OS
.vscode/
.DS_Store
```

### 2. Create the Python Function

In `netlify/functions/hello.py`:
```python
from http.server import BaseHTTPRequestHandler
from datetime import datetime

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        message = {
            "message": "Hello from Netlify Functions!",
            "timestamp": datetime.now().isoformat()
        }
        
        self.wfile.write(json.dumps(message).encode())
        return
```

### 3. Configure Netlify

Create `netlify.toml`:
```toml
[build]
  functions = "netlify/functions"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### 4. Deploy to Netlify

1. Install Netlify CLI:
   ```bash
   npm install netlify-cli -g
   ```

2. Login and deploy:
   ```bash
   netlify login
   netlify deploy --prod
   ```

## Testing Your Function

Once deployed, your function will be available at:
```
https://your-site-name.netlify.app/.netlify/functions/hello
```

## Cost Comparison

For a simple API with 100K requests/month:

| Provider | Cost/Month |
|----------|------------|
| AWS      | ~$5-10     |
| Azure    | ~$5-15     |
| Netlify  | $0         |

## Why This Matters

1. **No Surprise Bills**: Fixed, generous free tier
2. **Simple Deployment**: Push to git, auto-deploys
3. **Complete Solution**: Includes SSL, CDN, CI/CD
4. **Perfect for Learning**: No risk of accidental charges

## When to Use This Approach

✅ Perfect for:
- Personal projects
- MVPs
- Learning serverless
- Small to medium APIs

⚠️ Consider paid services when:
- Needing more than 125K invocations/month
- Requiring complex cloud services
- Building enterprise applications

## Tips and Best Practices

1. **Monitor Usage**:
   - Keep track of function invocations
   - Set up notifications when approaching limits

2. **Optimize Functions**:
   - Keep dependencies minimal
   - Use caching when possible
   - Implement proper error handling

3. **Version Control**:
   - Use Git for deployment
   - Maintain separate dev/prod branches

## Conclusion

Netlify's free tier is a game-changer for developers who want to experiment with serverless without the stress of cloud costs. While it may not replace AWS or Azure for enterprise needs, it's perfect for personal projects and learning.

Got questions about migrating your serverless functions to Netlify? Feel free to reach out in the comments!

## Resources

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Python on Netlify Guide](https://docs.netlify.com/functions/build-with-python/)
- [Netlify Pricing](https://www.netlify.com/pricing/)
