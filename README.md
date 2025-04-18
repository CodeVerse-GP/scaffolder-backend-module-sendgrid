# scaffolder-backend-module-sendgrid

Welcome to the `sendgrid:email:send` action for the `scaffolder-backend`.

### Getting started

You need to configure the action in your backend.

## Installation

1. Install the plugin
```bash
# From your Backstage root directory
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

---

## Using the Action in Templates

### **Option 1: Pass All Inputs via Template YAML**

Add values to your `app-config.yaml`.

```yaml
sendgrid:
  apiKey: API_KEY
```
In this approach, you pass all the required inputs (`to`, `from`, `subject`, `body`) directly in the template YAML file. This does not rely on any default values in the `app-config.yaml`.

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: sendgrid-email-test
  title: Test SendGrid Email Action
  description: Template to test the custom SendGrid email scaffolder action
spec:
  owner: abc
  type: service

  parameters:
    - title: Basic Info
      required:
        - name
        - to
        - from
        - subject
        - body
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
      action: sendgrid:email:send
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

---

### **Option 2: Use Defaults from `app-config.yaml`**

Add values to your `app-config.yaml`.

```yaml
sendgrid:
  apiKey: API_KEY
  defaults:
    from: noreply@example.com
    subject: Default Subject
    body: "<p>This is the default email body.</p>"
```

In this approach, you configure the default values (`from`, `subject`, `body`) in the `app-config.yaml` file and only pass the `to` parameter in the template YAML file.

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: sendgrid-email-test
  title: Test SendGrid Email Action
  description: Template to test the custom SendGrid email scaffolder action
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

  steps:
    - id: send-email
      name: Send Email
      action: sendgrid:email:send
      input:
        to: ${{ parameters.to }}

  output:
    text:
      - title: ✅ Email Action Triggered
        content: |
          An email was sent to **${{ parameters.to }}** with the default subject and body.
```

---

### Summary

- **Option 1**: Use when you want to pass all inputs (`to`, `from`, `subject`, `body`) dynamically in the template YAML file.
- **Option 2**: Use when you want to rely on default values (`from`, `subject`, `body`) configured in `app-config.yaml` and only pass the `to` parameter in the template YAML file.

You can also visit the `/create/actions` route in your Backstage application to find out more about the parameters this action accepts and configure it as needed.


