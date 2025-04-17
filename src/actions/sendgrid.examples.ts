import { TemplateExample } from "@backstage/plugin-scaffolder-node";
import yaml from "yaml";

export const examples: TemplateExample[] = [
  {
    description: "Send a test email",
    example: yaml.stringify({
      steps: [
        {
          id: "endgrid:email:send",
          action: "sendgrid:email:send",
          name: "Send email",
          input: {
            to: 'recipient@example.com',
            from: 'noreply@yourcompany.com',
            subject: '🚀 Test email from Backstage',
            body: '<p>This is a test email sent from Backstage using SendGrid.</p>',
          },
        },
      ],
    }),
  },
];
