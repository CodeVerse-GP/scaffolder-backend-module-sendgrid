import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { Config } from '@backstage/config';
import sgMail from '@sendgrid/mail';
import { examples } from './sendgrid.examples';

/**
 * Creates a `sendgrid:email:send` Scaffolder action.
 * 
 * @public
 */
export function sendEmailAction(options: {
  config: Config;
}) {
  const { config } = options;

  return createTemplateAction<{
    to: string;
    from?: string;
    subject?: string;
    body?: string;
  }>({
    id: 'sendgrid:email:send',
    description: 'Send an email using SendGrid',
    examples,
    schema: {
      input: {
        type: 'object',
        required: ['to'],
        properties: {
          to: {
            title: 'Recipient email address',
            description: 'The email address of the recipient',
            type: 'string',
          },
          from: {
            title: 'Sender email address',
            description: 'The email address of the sender',
            type: 'string',
          },
          subject: {
            title: 'Email subject',
            description: 'The subject of the email',
            type: 'string',
          },
          body: {
            title: 'Email body',
            description: 'The body of the email',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      const { to, from: inputFrom, subject: inputSubject, body: inputBody } = ctx.input;

      const sendgridApiKey = config.getOptionalString('sendgrid.apiKey');
      const defaultFrom = config.getOptionalString('sendgrid.defaults.from');
      const defaultSubject = config.getOptionalString('sendgrid.defaults.subject');
      const defaultBody = config.getOptionalString('sendgrid.defaults.body');

      if (!sendgridApiKey) {
        throw new Error('SendGrid API key is not configured');
      }

      const from = inputFrom || defaultFrom;
      const subject = inputSubject || defaultSubject;
      const body = inputBody || defaultBody;

      if (!from || !subject || !body) {
        throw new Error('Missing required email fields: from, subject, or body');
      }

      sgMail.setApiKey(sendgridApiKey);
      
      ctx.logger.info(`Sending email to ${to} from ${from} with subject "${subject}"`);
      
      const msg = {
        to,
        from,
        subject,
        html: body,
      };

      try {
        await sgMail.send(msg);
        ctx.logger.info(`Email sent to ${to}`);
      } catch (error: any) {
        ctx.logger.error(`Failed to send email: ${error.message}`);
        throw new Error(`SendGrid email send failed: ${error.message}`);
      }
    },
  });
}
