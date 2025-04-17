# scaffolder-backend-module-sendgrid

Welcome to the `sendgrid:email:send` action for the `scaffolder-backend`.

### Getting started

You need to configure the action in your backend.

## Installation

1. Install the plugin
```bash
#From your Backstage root directory
yarn --cwd packages/backend add @codeverse-gp/scaffolder-backend-module-sendgrid
```

2. Ensure sendgrid module is added to your backend.

```typescript
// In packages/backend/src/index.ts
const backend = createBackend();
// ...
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@codeverse-gp/scaffolder-backend-module-sendgrid'));
```

3. Add values to you app-config.yaml or you can pass (from, subject, body) via inputs in template form
```yaml
sendgrid:
  apiKey: API_KEY
  defaults:
    from: noreply@example.com
    subject: Default Subject
    body: "<p>This is the default email body.</p>"
```

4. Use the action in template

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: sendgrid-email-test
  title: Test SendGrid Email Action
  description: Template to test the custom sendgrid email scaffolder action
spec:
  owner: abc
  type: service

  parameters:
    - title: Basic Info
      required:
        - name
        - to
      properties:
        name:
          title: Your Name
          type: string
          description: This will be included in the email.
        to:
          title: Email To
          type: string
          description: Recipient email address
        from:
          title: Email From
          type: string
          description: Sender email address (must be a verified sender in SendGrid)
          default: "noreply@yourcompany.com"
        subject:
          title: Subject
          type: string
          default: "🎉 Hello from Backstage!"
        body:
          title: Email Body
          type: string
          default: "<p>This is a test email sent from Backstage using SendGrid.</p>"

  steps:
    - id: send-email
      name: Send Email
      action: sendgrid:send:email
      input:
        to: ${{ parameters.to }}
        from: ${{ parameters.from }}
        subject: ${{ parameters.subject }}
        body: |
          <h2>Hello ${{ parameters.name }}!</h2>
          ${{ parameters.body }}

  output:
    text:
      - title: ✅ Email Action Triggered
        content: |
          An email was sent to **${{ parameters.to }}** with the subject: _${{ parameters.subject }}_.
```

5. You can also visit the `/create/actions` route in your Backstage application to find out more about the paramters this action accepts when it's installed to configure how you like.
