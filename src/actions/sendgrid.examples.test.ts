import { examples } from './sendgrid.examples';
import yaml from 'yaml';

describe('sendgrid.examples', () => {
  it('should define valid examples', () => {
    expect(examples).toHaveLength(1);

    const example = examples[0];
    expect(example.description).toBe('Send a test email');

    const parsedExample = yaml.parse(example.example);
    expect(parsedExample).toHaveProperty('steps');
    expect(parsedExample.steps).toHaveLength(1);

    const step = parsedExample.steps[0];
    expect(step.id).toBe('endgrid:email:send');
    expect(step.action).toBe('sendgrid:email:send');
    expect(step.name).toBe('Send email');
    expect(step.input).toEqual({
      to: 'recipient@example.com',
      from: 'noreply@yourcompany.com',
      subject: '🚀 Test email from Backstage',
      body: '<p>This is a test email sent from Backstage using SendGrid.</p>',
    });
  });
});
